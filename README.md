# Bark Chase

Popcat-style web game on Fogo where each click is intended to burn `1 $CHASE` and increment leaderboard stats.

## What it does

- Fogo wallet sign-in via `@fogo/sessions-sdk-react`
- Gameplay page where users click Chase Dog to bark
- Global and country leaderboards backed by Convex
- Mobile + desktop responsive UI

## Current burn status

The app currently contains a placeholder burn implementation in:

- `lib/burn-chase-token.ts`

Confirmed chain constants for `$CHASE` integration:

- Mint: `GPK71dya1H975s3U4gYaJjrRCp3BGyAD8fmZCtSmBCcz`
- Token Program: `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`
- Decimals: `9`

Planned production flow is to call a wrapper program (via Fogo Sessions) that CPIs into token `burn_checked`.

## Tech stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Convex (data + leaderboards)
- Fogo Sessions SDK React

## Project structure

- `app/` pages/layouts
- `components/` UI + gameplay + wallet/session integration
- `convex/` schema, mutations, queries
- `lib/` utility functions (`burn` placeholder, geo lookup, helpers)

## Requirements

- Node.js 20+
- pnpm
- Convex account/project

## Environment variables

Create `.env.local`:

```bash
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
```

Optional values you may add when wiring full burn tx flow:

```bash
NEXT_PUBLIC_CHASE_MINT=GPK71dya1H975s3U4gYaJjrRCp3BGyAD8fmZCtSmBCcz
NEXT_PUBLIC_TOKEN_PROGRAM_ID=TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
NEXT_PUBLIC_CHASE_DECIMALS=9
NEXT_PUBLIC_BURN_WRAPPER_PROGRAM_ID=replace_me
```

## Install

```bash
pnpm install
```

## Run

Frontend:

```bash
pnpm dev
```

Convex backend:

```bash
pnpm convex
```

Run both:

```bash
pnpm dev:all
```

## Gameplay data flow

1. User signs in with Fogo wallet.
2. `ConvexFogoSync` ensures a user record exists.
3. On click, `burnOneChaseToken(...)` runs.
4. If burn succeeds, app increments click counts in Convex.

## Notes

- Marketing text says burns are on-chain, but burn execution is still a placeholder until wrapper tx integration is completed.
- Audio click sound source: https://mixkit.co/free-sound-effects/click/

## SVM/Anchor development guide

If you are new to SVM development, follow:

- `/Users/scp/Documents/dev/bark-chase/docs/fogo-burn-wrapper-guide.md`
