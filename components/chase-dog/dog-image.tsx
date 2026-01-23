"use client"

import Image from "next/image"

interface DogImageProps {
  isMouthOpen: boolean
}

const DOG_CLOSED = "/Dog.jpg"
const DOG_OPEN = "/mouthDog.jpg"

export function DogImage({ isMouthOpen }: DogImageProps) {
  return (
    <Image
      src={isMouthOpen ? DOG_OPEN : DOG_CLOSED}
      alt={isMouthOpen ? "Chase Dog barking" : "Chase Dog"}
      width={400}
      height={400}
      priority
      className="pointer-events-none"
      draggable={false}
    />
  )
}
