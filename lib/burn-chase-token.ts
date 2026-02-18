import {
  isEstablished,
  type SessionState,
  TransactionResultType,
} from "@fogo/sessions-sdk-react";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import {
  BURN_WRAPPER_PROGRAM_ID,
  CHASE_MINT_PUBLIC_KEY,
  TOKEN_PROGRAM_ID,
} from "@/lib/chase-token";

// Anchor discriminator for `global:burn_one_chase`.
const BURN_ONE_CHASE_DISCRIMINATOR = Buffer.from("d51275cd2ab49e13", "hex");
const PROGRAM_SIGNER_SEED = "fogo_session_program_signer";
const DEFAULT_FOGO_RPC = "https://mainnet.fogo.io";
const COMMITMENT: "confirmed" = "confirmed";
const connection = new Connection(
  process.env.NEXT_PUBLIC_FOGO_RPC_URL ?? DEFAULT_FOGO_RPC,
  COMMITMENT,
);
const burnSourceAccountCache = new Map<string, PublicKey>();
const tokenProgramPublicKey = new PublicKey(TOKEN_PROGRAM_ID);
const burnWrapperProgramPublicKey = BURN_WRAPPER_PROGRAM_ID
  ? new PublicKey(BURN_WRAPPER_PROGRAM_ID)
  : null;
const burnProgramSignerPda = burnWrapperProgramPublicKey
  ? PublicKey.findProgramAddressSync(
      [Buffer.from(PROGRAM_SIGNER_SEED)],
      burnWrapperProgramPublicKey,
    )[0]
  : null;

export interface BurnOneChaseResult {
  success: boolean;
  signature?: string;
}

function getBurnSourceCacheKey(walletOwner: PublicKey, tokenProgram: PublicKey) {
  return `${walletOwner.toBase58()}:${tokenProgram.toBase58()}`;
}

async function resolveBurnSourceAccount(
  walletOwner: PublicKey,
  tokenProgram: PublicKey,
): Promise<PublicKey> {
  const cacheKey = getBurnSourceCacheKey(walletOwner, tokenProgram);
  const cached = burnSourceAccountCache.get(cacheKey);
  if (cached) return cached;

  const ata = getAssociatedTokenAddressSync(
    CHASE_MINT_PUBLIC_KEY,
    walletOwner,
    false,
    tokenProgram,
  );

  const ataInfo = await connection.getAccountInfo(ata, COMMITMENT);
  if (ataInfo) {
    burnSourceAccountCache.set(cacheKey, ata);
    return ata;
  }

  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    walletOwner,
    { programId: tokenProgram },
    COMMITMENT,
  );

  const first = tokenAccounts.value.find((entry) => {
    const parsed = entry.account.data.parsed;
    if (!parsed || parsed.type !== "account") return false;
    return parsed.info?.mint === CHASE_MINT_PUBLIC_KEY.toBase58();
  })?.pubkey;
  const resolved = first ?? ata;
  burnSourceAccountCache.set(cacheKey, resolved);
  return resolved;
}

/**
 * Sends the wrapper burn instruction through Fogo Sessions.
 * Returns true only when the transaction is confirmed successful.
 */
export async function burnOneChaseToken(
  sessionState: SessionState,
): Promise<BurnOneChaseResult> {
  if (!isEstablished(sessionState)) return { success: false };

  if (!BURN_WRAPPER_PROGRAM_ID) {
    console.warn(
      "Burn wrapper program ID missing. Set NEXT_PUBLIC_BURN_WRAPPER_PROGRAM_ID.",
    );
    return { success: false };
  }

  try {
    const walletOwner = sessionState.walletPublicKey;
    const sessionAuthority = sessionState.sessionPublicKey;
    const tokenProgram = tokenProgramPublicKey;
    const burnWrapperProgram = burnWrapperProgramPublicKey;
    const programSignerPda = burnProgramSignerPda;
    if (!burnWrapperProgram || !programSignerPda) {
      console.warn(
        "Burn wrapper program ID missing or invalid. Set NEXT_PUBLIC_BURN_WRAPPER_PROGRAM_ID.",
      );
      return { success: false };
    }
    const userTokenAccount = await resolveBurnSourceAccount(
      walletOwner,
      tokenProgram,
    );

    const instruction = new TransactionInstruction({
      programId: burnWrapperProgram,
      keys: [
        { pubkey: sessionAuthority, isSigner: true, isWritable: false },
        { pubkey: programSignerPda, isSigner: false, isWritable: false },
        { pubkey: userTokenAccount, isSigner: false, isWritable: true },
        { pubkey: CHASE_MINT_PUBLIC_KEY, isSigner: false, isWritable: true },
        { pubkey: tokenProgram, isSigner: false, isWritable: false },
      ],
      data: BURN_ONE_CHASE_DISCRIMINATOR,
    });

    const result = await sessionState.sendTransaction([instruction], {
      variation: "BurnOneChase",
    });

    if (result.type === TransactionResultType.Success) {
      const confirmation = await connection.confirmTransaction(
        result.signature,
        COMMITMENT,
      );
      if (confirmation.value.err != null) {
        console.warn(
          "Burn signature failed at confirmed commitment:",
          JSON.stringify(
            {
              signature: result.signature,
              confirmationError: confirmation.value.err,
            },
            null,
            2,
          ),
        );
        return { success: false };
      }
      return {
        success: true,
        signature: result.signature,
      };
    }

    burnSourceAccountCache.delete(getBurnSourceCacheKey(walletOwner, tokenProgram));
    console.warn(
      "Burn transaction failed JSON:",
      JSON.stringify(
        {
          signature: result.signature,
          error: result.error,
          serializedError: JSON.stringify(result.error),
        },
        null,
        2,
      ),
    );
    return { success: false };
  } catch (error) {
    if (isEstablished(sessionState)) {
      burnSourceAccountCache.delete(
        getBurnSourceCacheKey(
          sessionState.walletPublicKey,
          tokenProgramPublicKey,
        ),
      );
    }
    console.warn(
      "Burn transaction threw error JSON:",
      JSON.stringify(error, null, 2),
    );
    return { success: false };
  }
}

export async function waitForBurnFinalized(signature: string): Promise<boolean> {
  try {
    const confirmation = await connection.confirmTransaction(
      signature,
      "finalized",
    );
    return confirmation.value.err == null;
  } catch (error) {
    console.warn(
      "waitForBurnFinalized failed:",
      JSON.stringify(
        {
          signature,
          error,
        },
        null,
        2,
      ),
    );
    return false;
  }
}

export async function waitForBurnConfirmed(signature: string): Promise<boolean> {
  try {
    const confirmation = await connection.confirmTransaction(
      signature,
      "confirmed",
    );
    return confirmation.value.err == null;
  } catch (error) {
    console.warn(
      "waitForBurnConfirmed failed:",
      JSON.stringify(
        {
          signature,
          error,
        },
        null,
        2,
      ),
    );
    return false;
  }
}

/**
 * Warm token account resolution cache to reduce first-click latency.
 */
export async function prewarmBurnContext(
  sessionState: SessionState,
): Promise<void> {
  if (!isEstablished(sessionState)) return;
  await resolveBurnSourceAccount(
    sessionState.walletPublicKey,
    tokenProgramPublicKey,
  );
}
