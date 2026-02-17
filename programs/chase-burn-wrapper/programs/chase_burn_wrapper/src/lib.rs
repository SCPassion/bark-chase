use anchor_lang::prelude::*;
use anchor_spl::token_interface::{
    burn_checked, BurnChecked, Mint, TokenAccount, TokenInterface,
};

declare_id!("7VVgbnE7HvncrfrnCg5jUxWNiVuSqspdX2SdUhGySUaA");

const CHASE_MINT: Pubkey = pubkey!("GPK71dya1H975s3U4gYaJjrRCp3BGyAD8fmZCtSmBCcz");
const CHASE_DECIMALS: u8 = 9;
const CHASE_UI_AMOUNT_TO_BURN: u64 = 1;

#[program]
pub mod chase_burn_wrapper {
    use super::*;

    pub fn burn_one_chase(ctx: Context<BurnOneChase>) -> Result<()> {
        require_keys_eq!(ctx.accounts.mint.key(), CHASE_MINT, ErrorCode::InvalidMint);
        require_keys_eq!(
            ctx.accounts.user_token_account.owner,
            ctx.accounts.wallet_owner.key(),
            ErrorCode::InvalidTokenOwner
        );

        // Burn exactly 1 whole token (1 * 10^9 base units for $CHASE).
        let amount = CHASE_UI_AMOUNT_TO_BURN
            .checked_mul(10u64.pow(CHASE_DECIMALS as u32))
            .ok_or(error!(ErrorCode::AmountOverflow))?;

        let cpi_accounts = BurnChecked {
            mint: ctx.accounts.mint.to_account_info(),
            from: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.session_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        burn_checked(cpi_ctx, amount, CHASE_DECIMALS)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct BurnOneChase<'info> {
    #[account(mut)]
    pub session_authority: Signer<'info>,

    /// CHECK: This is the wallet owner of `user_token_account`.
    pub wallet_owner: UncheckedAccount<'info>,

    #[account(
        mut,
        token::mint = mint,
        token::token_program = token_program,
    )]
    pub user_token_account: InterfaceAccount<'info, TokenAccount>,

    pub mint: InterfaceAccount<'info, Mint>,
    pub token_program: Interface<'info, TokenInterface>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Provided mint does not match the configured $CHASE mint.")]
    InvalidMint,
    #[msg("Token account owner does not match the provided wallet owner.")]
    InvalidTokenOwner,
    #[msg("Overflow computing burn amount.")]
    AmountOverflow,
}
