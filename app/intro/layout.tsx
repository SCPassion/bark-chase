import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What is Chase Dog? | $CHASE Burn Game",
  description:
    "$CHASE is a community-driven memecoin on Fogo. Burn 1 $CHASE per click — deflationary fun, no insiders, 100% airdropped. Trade on ValiantTrade, chart on Birdeye.",
};

export default function IntroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
