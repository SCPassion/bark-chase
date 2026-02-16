# Chase Burn Wrapper (Anchor)

This folder contains the on-chain wrapper program that burns exactly `1 $CHASE` per call by CPI into SPL Token (`Tokenkeg...`).

## Confirmed constants

- Mint: `GPK71dya1H975s3U4gYaJjrRCp3BGyAD8fmZCtSmBCcz`
- Token program: `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`
- Decimals: `9`

## Important placeholders to replace

1. Program ID in:
   - `programs/chase_burn_wrapper/src/lib.rs` (`declare_id!(...)`)
   - `Anchor.toml` (`[programs.mainnet].chase_burn_wrapper`)
2. Fogo RPC endpoint in:
   - `Anchor.toml` (`[provider].cluster`)

## Build and deploy (high level)

1. Install Solana + Anchor CLI.
2. Set your wallet keypair in `~/.config/solana/id.json`.
3. Fund deployer wallet on Fogo mainnet.
4. Build: `anchor build`
5. Deploy: `anchor deploy`
6. Update program ID placeholders to deployed ID and rebuild.

Use the full guide in `/docs/fogo-burn-wrapper-guide.md`.

## Mainnet flow: deploy with dev wallet, then transfer authority to Ledger

This is the recommended production flow if you want fast iteration with a hot wallet but long-term control on a hardware wallet.

### 1. Build and deploy with dev wallet

```bash
cd /Users/scp/Documents/dev/bark-chase/programs/chase-burn-wrapper
anchor build
anchor deploy \
  --provider.cluster https://mainnet.fogo.io \
  --provider.wallet ~/.config/solana/dev-wallet.json
```

### 2. Capture and verify program ID

Take `<PROGRAM_ID>` from deploy output, then check:

```bash
solana program show <PROGRAM_ID> --url https://mainnet.fogo.io
```

### 3. Transfer upgrade authority to Ledger wallet

Use your Ledger pubkey as `<LEDGER_SOLANA_PUBKEY>`:

```bash
solana program set-upgrade-authority <PROGRAM_ID> \
  --new-upgrade-authority <LEDGER_SOLANA_PUBKEY> \
  --keypair ~/.config/solana/dev-wallet.json \
  --url https://mainnet.fogo.io
```

### 4. Verify authority transfer

```bash
solana program show <PROGRAM_ID> --url https://mainnet.fogo.io
```

Expected result:

- `Upgrade Authority: <LEDGER_SOLANA_PUBKEY>`

### 5. Finalize local config

After deploy, replace placeholders with `<PROGRAM_ID>` in:

- `/Users/scp/Documents/dev/bark-chase/programs/chase-burn-wrapper/Anchor.toml`
- `/Users/scp/Documents/dev/bark-chase/programs/chase-burn-wrapper/programs/chase_burn_wrapper/src/lib.rs`

Then rebuild:

```bash
cd /Users/scp/Documents/dev/bark-chase/programs/chase-burn-wrapper
anchor build
```

### Notes

- Keep `target/deploy/chase_burn_wrapper-keypair.json` secure; it defines the deployed program address.
- After authority transfer, all future upgrades require the Ledger signer.

## Executed deployment and authority transfer (mainnet)

This is the exact flow used for this deployment.

### Program details

- Program ID: `3wEtTtvH9xU3siLYULSEsU2SqaV4fWpaKUmppVi9M7yx`
- Fogo RPC: `https://mainnet.fogo.io`
- Dev deployer wallet: `~/.config/solana/dev-wallet.json`
- Ledger authority wallet: `FQ8HMp2gFxfSHzqLeHiyCHXXPK1osdxiyyCq1hDHWiHS`

### 1. Build and deploy with dev wallet

```bash
cd /Users/scp/Documents/dev/bark-chase/programs/chase-burn-wrapper
anchor build
anchor deploy \
  --provider.cluster https://mainnet.fogo.io \
  --provider.wallet ~/.config/solana/dev-wallet.json
```

### 2. Verify deployed program

```bash
solana program show 3wEtTtvH9xU3siLYULSEsU2SqaV4fWpaKUmppVi9M7yx --url https://mainnet.fogo.io
```

### 3. Transfer upgrade authority to Ledger (skip new-authority signer check)

```bash
solana program set-upgrade-authority 3wEtTtvH9xU3siLYULSEsU2SqaV4fWpaKUmppVi9M7yx \
  --new-upgrade-authority FQ8HMp2gFxfSHzqLeHiyCHXXPK1osdxiyyCq1hDHWiHS \
  --skip-new-upgrade-authority-signer-check \
  --keypair ~/.config/solana/dev-wallet.json \
  --url https://mainnet.fogo.io
```

Why `--skip-new-upgrade-authority-signer-check` was required:

- By default, Solana CLI expects the new authority to also sign this transaction.
- A Ledger pubkey was provided directly (not as an online signer URI), so the command needs this flag.

### 4. Verify final authority

```bash
solana program show 3wEtTtvH9xU3siLYULSEsU2SqaV4fWpaKUmppVi9M7yx --url https://mainnet.fogo.io
```

Expected authority:

- `Authority: FQ8HMp2gFxfSHzqLeHiyCHXXPK1osdxiyyCq1hDHWiHS`

## Fogo paymaster and app integration steps

Use these steps to let the Next.js app submit funded burn transactions through Fogo Sessions.

### 1. Fetch sponsor key for production domain

Domain:

- `https://smilechase.scptech.xyz`

```bash
curl "https://fogo-mainnet.dourolabs-paymaster.xyz/api/sponsor_pubkey?domain=https://smilechase.scptech.xyz"
```

Example returned sponsor:

- `CnuMuQ3qH9YZ4rNe9bNxqVcPRnQs5Nt3aVhmYAEB8XtC`

Security note:

- Sponsor key is a public address and is safe to share.
- Never share seed phrases, private keys, Ledger recovery phrases, or keypair JSON secret contents.

### 2. Fund sponsor key (explicit dev wallet signer)

Use `-k ~/.config/solana/dev-wallet.json` so the transfer does not default to another local keypair.

```bash
solana transfer CnuMuQ3qH9YZ4rNe9bNxqVcPRnQs5Nt3aVhmYAEB8XtC 5 \
  --allow-unfunded-recipient \
  --url https://mainnet.fogo.io \
  -k ~/.config/solana/dev-wallet.json
```

Check sponsor balance:

```bash
solana balance CnuMuQ3qH9YZ4rNe9bNxqVcPRnQs5Nt3aVhmYAEB8XtC --url https://mainnet.fogo.io
```

Note:

- Solana CLI labels native units as `SOL` even on Fogo RPC; treat that as FOGO on `https://mainnet.fogo.io`.

### 3. Submit paymaster variation config to Fogo team

Send:

- `/Users/scp/Documents/dev/bark-chase/docs/paymaster-config.example.toml`

It already includes:

- domain `https://smilechase.scptech.xyz`
- variation name `BurnOneChase`
- wrapper program `3wEtTtvH9xU3siLYULSEsU2SqaV4fWpaKUmppVi9M7yx`

### 4. Configure app env

In `/Users/scp/Documents/dev/bark-chase/.env.local`:

```bash
NEXT_PUBLIC_BURN_WRAPPER_PROGRAM_ID=3wEtTtvH9xU3siLYULSEsU2SqaV4fWpaKUmppVi9M7yx
NEXT_PUBLIC_CHASE_MINT=GPK71dya1H975s3U4gYaJjrRCp3BGyAD8fmZCtSmBCcz
NEXT_PUBLIC_TOKEN_PROGRAM_ID=TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
NEXT_PUBLIC_CHASE_DECIMALS=9
```

### 5. Run and verify end-to-end

```bash
cd /Users/scp/Documents/dev/bark-chase
pnpm dev:all
```

Verify:

- wallet connects via Fogo Sessions on `https://smilechase.scptech.xyz`
- one click sends wrapper `BurnOneChase` transaction
- on success, leaderboard increments
- on failure, leaderboard does not increment
