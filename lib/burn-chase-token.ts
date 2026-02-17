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
const DEFAULT_FOGO_RPC = "https://mainnet.fogo.io";

async function resolveBurnSourceAccount(
  walletOwner: PublicKey,
  tokenProgram: PublicKey,
): Promise<PublicKey> {
  const ata = getAssociatedTokenAddressSync(
    CHASE_MINT_PUBLIC_KEY,
    walletOwner,
    false,
    tokenProgram,
  );
  const connection = new Connection(
    process.env.NEXT_PUBLIC_FOGO_RPC_URL ?? DEFAULT_FOGO_RPC,
    "confirmed",
  );

  const ataInfo = await connection.getAccountInfo(ata, "confirmed");
  if (ataInfo) return ata;

  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    walletOwner,
    { mint: CHASE_MINT_PUBLIC_KEY },
    "confirmed",
  );

  const first = tokenAccounts.value[0]?.pubkey;
  return first ?? ata;
}

/**
 * Sends the wrapper burn instruction through Fogo Sessions.
 * Returns true only when the transaction is confirmed successful.
 */
export async function burnOneChaseToken(
  sessionState: SessionState,
): Promise<boolean> {
  if (!isEstablished(sessionState)) return false;

  if (!BURN_WRAPPER_PROGRAM_ID) {
    console.warn(
      "Burn wrapper program ID missing. Set NEXT_PUBLIC_BURN_WRAPPER_PROGRAM_ID.",
    );
    return false;
  }

  try {
    const walletOwner = sessionState.walletPublicKey;
    const sessionAuthority = sessionState.sessionPublicKey;
    const tokenProgram = new PublicKey(TOKEN_PROGRAM_ID);
    const burnWrapperProgram = new PublicKey(BURN_WRAPPER_PROGRAM_ID);
    const userTokenAccount = await resolveBurnSourceAccount(
      walletOwner,
      tokenProgram,
    );

    const instruction = new TransactionInstruction({
      programId: burnWrapperProgram,
      keys: [
        { pubkey: sessionAuthority, isSigner: true, isWritable: true },
        { pubkey: walletOwner, isSigner: false, isWritable: false },
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
      return true;
    }

    console.warn("Burn transaction failed:", {
      signature: result.signature,
      error: result.error,
      serializedError: JSON.stringify(result.error),
    });
    return false;
  } catch (error) {
    console.warn("Burn transaction threw error:", error);
    return false;
  }
}
