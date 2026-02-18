use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::{invoke, invoke_signed};
use anchor_lang::solana_program::program_error::ProgramError;
use anchor_spl::associated_token::get_associated_token_address;
use anchor_spl::token::{Mint, Token, TokenAccount};
use fogo_sessions_sdk::session::{is_session, Session};
use fogo_sessions_sdk::token::instruction::burn_checked;
use fogo_sessions_sdk::token::PROGRAM_SIGNER_SEED;

declare_id!("7VVgbnE7HvncrfrnCg5jUxWNiVuSqspdX2SdUhGySUaA");

const CHASE_MINT: Pubkey = pubkey!("GPK71dya1H975s3U4gYaJjrRCp3BGyAD8fmZCtSmBCcz");
const CHASE_DECIMALS: u8 = 9;
const CHASE_BASE_UNITS_TO_BURN: u64 = 1_000_000_000;

#[program]
pub mod chase_burn_wrapper {
    use super::*;

    pub fn burn_one_chase(ctx: Context<BurnOneChase>) -> Result<()> {
        let user =
            Session::extract_user_from_signer_or_session(
                &ctx.accounts.signer_or_session.to_account_info(),
                &crate::ID,
            )
            .map_err(ProgramError::from)?;

        require_keys_eq!(ctx.accounts.mint.key(), CHASE_MINT, ErrorCode::InvalidMint);
        require_keys_eq!(
            get_associated_token_address(&user, &ctx.accounts.mint.key()),
            ctx.accounts.user_token_account.key(),
            ErrorCode::InvalidTokenOwner
        );

        let instruction = burn_checked(
            &ctx.accounts.token_program.key(),
            &ctx.accounts.user_token_account.key(),
            &ctx.accounts.mint.key(),
            &ctx.accounts.signer_or_session.key(),
            ctx.accounts
                .program_signer
                .as_ref()
                .map(|program_signer| program_signer.key())
                .as_ref(),
            CHASE_BASE_UNITS_TO_BURN,
            CHASE_DECIMALS,
        )?;

        let is_session = is_session(&ctx.accounts.signer_or_session.to_account_info());

        match (is_session, ctx.accounts.program_signer.as_ref()) {
            (_, Some(_)) => {
                invoke_signed(
                    &instruction,
                    &ctx.accounts.to_account_infos(),
                    &[&[
                        PROGRAM_SIGNER_SEED,
                        &[ctx
                            .bumps
                            .program_signer
                            .expect("program_signer bump should exist when account is provided")],
                    ]],
                )?;
            }
            (false, None) => {
                invoke(&instruction, &ctx.accounts.to_account_infos())?;
            }
            (true, None) => {
                return Err(ProgramError::NotEnoughAccountKeys.into());
            }
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct BurnOneChase<'info> {
    /// This is either the user or a session representing the user.
    pub signer_or_session: Signer<'info>,
    /// If within a session, this PDA signs in-session token burns for Tokenkeg.
    /// CHECK: this is just a PDA signer for token program CPI.
    #[account(seeds = [PROGRAM_SIGNER_SEED], bump)]
    pub program_signer: Option<AccountInfo<'info>>,

    #[account(
        mut,
        token::mint = mint,
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Provided mint does not match the configured $CHASE mint.")]
    InvalidMint,
    #[msg("Token account owner does not match the provided wallet owner.")]
    InvalidTokenOwner,
}
