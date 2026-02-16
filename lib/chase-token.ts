import { PublicKey } from "@solana/web3.js";

export const CHASE_MINT = "GPK71dya1H975s3U4gYaJjrRCp3BGyAD8fmZCtSmBCcz";
export const CHASE_DECIMALS = 9;
export const TOKEN_PROGRAM_ID_DEFAULT =
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

export const TOKEN_PROGRAM_ID =
  process.env.NEXT_PUBLIC_TOKEN_PROGRAM_ID ?? TOKEN_PROGRAM_ID_DEFAULT;

export const CHASE_MINT_PUBLIC_KEY = new PublicKey(CHASE_MINT);

export const BURN_WRAPPER_PROGRAM_ID =
  process.env.NEXT_PUBLIC_BURN_WRAPPER_PROGRAM_ID ?? "";
