"use client";

import { ChaseDog } from "@/components/chase-dog";
import { HelpCircle } from "lucide-react";

function Header() {
  return (
    <div className="text-center px-4 mb-4 sm:mb-6 md:mb-8">
      <div className="flex items-center justify-center gap-2">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-chase-text tracking-tight uppercase">
          Chase Dog
        </h1>
        <div className="relative group">
          <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-chase-muted hover:text-chase-accent cursor-help transition-colors" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 sm:w-72 md:w-80 px-4 py-3 bg-gray-900 border-2 border-chase-accent rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
            <p className="text-xs sm:text-sm text-white font-medium text-left mb-2">
              💡 You need <span className="font-bold text-chase-accent">$CHASE</span> token in your Fogo wallet to make Chase smile
            </p>
            <p className="text-xs text-white font-medium text-left">
              🔥 Each click burns <span className="font-semibold text-chase-accent">1 $CHASE</span> token, making it deflationary
            </p>
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
      <p className="mt-2 sm:mt-3 md:mt-4 text-base sm:text-lg md:text-xl text-chase-muted font-medium tracking-wide">
        Click to make Chase smile!
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-chase-bg flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 pt-16 sm:pt-20 md:pt-24">
      <Header />
      <ChaseDog />
    </main>
  )
}
