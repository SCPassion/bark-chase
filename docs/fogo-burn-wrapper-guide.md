# Fogo Burn Wrapper Guide (Step by Step)

This guide takes you from zero to a deployed wrapper program that burns `1 $CHASE` per click.

## 0. What you are building

You are building a small on-chain program (Anchor/Rust) that:

1. Accepts user signer + user token account + mint.
2. Verifies mint is `$CHASE`.
3. CPIs into SPL Token program and runs `burn_checked` for exactly 1 token (`1_000_000_000` base units).

Then your Next.js app will call this wrapper through Fogo Sessions.

## 1. Constants (already confirmed)

- `CHASE_MINT`: `GPK71dya1H975s3U4gYaJjrRCp3BGyAD8fmZCtSmBCcz`
- `TOKEN_PROGRAM_ID`: `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`
- `CHASE_DECIMALS`: `9`

## 2. Prerequisites

Install these locally:

1. Rust toolchain (`rustup`).
2. Solana CLI.
3. Anchor CLI.

Check versions:

```bash
rustc --version
solana --version
anchor --version
```

## 3. Program location

Program is already scaffolded at:

- `/Users/scp/Documents/dev/bark-chase/programs/chase-burn-wrapper`

Main code file:

- `/Users/scp/Documents/dev/bark-chase/programs/chase-burn-wrapper/programs/chase_burn_wrapper/src/lib.rs`

## 4. Configure wallet and RPC

1. Create/import deployer keypair:

```bash
solana-keygen new --outfile ~/.config/solana/id.json
```

2. Put your Fogo RPC endpoint in:

- `/Users/scp/Documents/dev/bark-chase/programs/chase-burn-wrapper/Anchor.toml`
  - replace `REPLACE_WITH_FOGO_RPC_ENDPOINT`

3. Ensure that wallet has enough balance on Fogo to pay deployment.

## 5. First build

From program folder:

```bash
cd /Users/scp/Documents/dev/bark-chase/programs/chase-burn-wrapper
anchor build
```

This generates artifacts under `target/` (IDL, binary, keypair).

## 6. Deploy to Fogo

From same folder:

```bash
anchor deploy
```

Copy the deployed program ID from output.

## 7. Lock program ID in code/config

Update both files:

1. `/Users/scp/Documents/dev/bark-chase/programs/chase-burn-wrapper/programs/chase_burn_wrapper/src/lib.rs`
   - replace `declare_id!("11111111111111111111111111111111")`
2. `/Users/scp/Documents/dev/bark-chase/programs/chase-burn-wrapper/Anchor.toml`
   - replace `[programs.mainnet].chase_burn_wrapper`

Then rebuild:

```bash
anchor build
```

## 8. Frontend wiring (after deploy)

Add to `/Users/scp/Documents/dev/bark-chase/.env.local`:

```bash
NEXT_PUBLIC_CHASE_MINT=GPK71dya1H975s3U4gYaJjrRCp3BGyAD8fmZCtSmBCcz
NEXT_PUBLIC_TOKEN_PROGRAM_ID=TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
NEXT_PUBLIC_CHASE_DECIMALS=9
NEXT_PUBLIC_BURN_WRAPPER_PROGRAM_ID=<YOUR_DEPLOYED_PROGRAM_ID>
NEXT_PUBLIC_FOGO_SESSION_DOMAIN=https://smilechase.scptech.xyz
NEXT_PUBLIC_FOGO_RPC_URL=https://mainnet.fogo.io
```

Then update app burn logic in:

- `/Users/scp/Documents/dev/bark-chase/lib/burn-chase-token.ts`

Behavior should be:

1. Build wrapper instruction.
2. Send via Fogo Sessions signer.
3. Wait for confirmation.
4. Return `true` only on confirmed success.

## 9. Verify end-to-end

Test cases:

1. Wallet with `$CHASE` balance clicks once:
   - on-chain burn succeeds
   - Convex click count increments by 1
2. Wallet without `$CHASE`:
   - burn fails cleanly
   - Convex click count does not change
3. Expired session:
   - user sees session/signing error
   - no click increment

## 10. Paymaster setup (current workflow)

Use the paymaster admin panel (not the old manual TOML submission flow):

- `https://admin.dourolabs-paymaster.xyz/`

For domain `https://smilechase.scptech.xyz`, configure variation:

- `version`: `v1`
- `name`: `BurnOneChase`
- `max_gas_spend`: `500000`
- required instruction program: your wrapper program id
- optional instruction before it: compute budget program

Optional hardening constraint:

- data constraint on wrapper instruction:
  - `start_byte = 0`
  - `EqualTo -> Bytes -> d51275cd2ab49e13` (`global:burn_one_chase` discriminator)

Important:

- if you use account include constraints, new syntax is `include = ["NonFeePayerSigner"]` (old object syntax is deprecated)
- config changes may take up to ~10 seconds to propagate
- after variation/registry updates, revoke and recreate session before retesting

## 11. Common mistakes

1. Wrong RPC endpoint in `Anchor.toml`.
2. Program ID mismatch between `declare_id!` and deployed address.
3. Forgetting decimals (`burn_checked` must use `9`).
4. Incrementing leaderboard even when transaction failed.

## 12. Next implementation task in this repo

After deployment, implement the client-side wrapper instruction call in:

- `/Users/scp/Documents/dev/bark-chase/lib/burn-chase-token.ts`

Then I can help you add robust error handling and transaction confirmation UX.
