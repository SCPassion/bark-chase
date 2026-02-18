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
    { programId: tokenProgram },
    "confirmed",
  );

  const first = tokenAccounts.value.find((entry) => {
    const parsed = entry.account.data.parsed;
    if (!parsed || parsed.type !== "account") return false;
    return parsed.info?.mint === CHASE_MINT_PUBLIC_KEY.toBase58();
  })?.pubkey;
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
    const [programSignerPda] = PublicKey.findProgramAddressSync(
      [Buffer.from(PROGRAM_SIGNER_SEED)],
      burnWrapperProgram,
    );
    const connection = new Connection(
      process.env.NEXT_PUBLIC_FOGO_RPC_URL ?? DEFAULT_FOGO_RPC,
      "confirmed",
    );
    const userTokenAccount = await resolveBurnSourceAccount(
      walletOwner,
      tokenProgram,
    );
    const tokenAccountInfo = await connection.getParsedAccountInfo(
      userTokenAccount,
      "confirmed",
    );
    const parsed = tokenAccountInfo.value?.data;
    if (
      !parsed ||
      !("parsed" in parsed) ||
      parsed.parsed?.type !== "account" ||
      parsed.parsed?.info?.mint !== CHASE_MINT_PUBLIC_KEY.toBase58()
    ) {
      console.warn("Invalid CHASE source token account selected.", {
        walletOwner: walletOwner.toBase58(),
        userTokenAccount: userTokenAccount.toBase58(),
        tokenProgram: tokenProgram.toBase58(),
      });
      return false;
    }

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
