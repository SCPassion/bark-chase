import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Let Chase Dog Bark | Click to Burn $CHASE",
  description:
    "Click Chase to burn 1 $CHASE per tap. Popcat-style deflationary game on Fogo. Connect wallet and play.",
};

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
