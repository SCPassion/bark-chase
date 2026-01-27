import { ChaseDog } from "@/components/chase-dog"

function Header() {
  return (
    <div className="text-center px-4 mb-4 sm:mb-6 md:mb-8">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-chase-text tracking-tight uppercase">
        Chase Dog
      </h1>
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
