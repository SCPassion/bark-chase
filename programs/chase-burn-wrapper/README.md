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
