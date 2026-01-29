"use client"

import Image from "next/image"

interface DogImageProps {
  isMouthOpen: boolean
}

const DOG_CLOSED = "/Dog.jpg"
const DOG_OPEN = "/mouthDog.jpg"

export function DogImage({ isMouthOpen }: DogImageProps) {
  return (
    <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px]">
      <Image
        src={isMouthOpen ? DOG_OPEN : DOG_CLOSED}
        alt={isMouthOpen ? "Chase Dog barking" : "Chase Dog"}
        fill
        sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 400px"
        priority
        className="pointer-events-none object-contain"
        draggable={false}
      />
    </div>
  )
}
