'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const NUM_BLOBS = 4
const BLOB_SIZE = 1000

type Blob = {
  id: string
  x: number
  y: number
  dx: number
  dy: number
  speed: number
}

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min

const createBlob = (width: number, height: number): Blob => ({
  id: crypto.randomUUID(),
  x: getRandom(0, width),
  y: getRandom(0, height),
  dx: getRandom(-1, 1),
  dy: getRandom(-1, 1),
  speed: getRandom(0.5, 3),
})

export default function InteractiveBackground2() {
  const [blobs, setBlobs] = useState<Blob[]>([])
  const [isClient, setIsClient] = useState(false)

  // Motion values for mouse
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const followX = useSpring(mouseX, { damping: 20, stiffness: 150 })
  const followY = useSpring(mouseY, { damping: 20, stiffness: 150 })

  const animationRef = useRef<number | undefined>(undefined)

  // Flag to detect client-side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize blobs and mouse position on client-side
  useEffect(() => {
    if (!isClient) return

    mouseX.set(window.innerWidth / 2)
    mouseY.set(window.innerHeight / 2)

    setBlobs(
      Array.from({ length: NUM_BLOBS }, () =>
        createBlob(window.innerWidth, window.innerHeight)
      )
    )

    const update = () => {
      setBlobs((prev) =>
        prev.map((b) => {
          const x = b.x + b.dx * b.speed
          const y = b.y + b.dy * b.speed

          // Bounce off edges
          if (x < 0 || x > window.innerWidth) b.dx *= -1
          if (y < 0 || y > window.innerHeight) b.dy *= -1

          return {
            ...b,
            x: Math.max(0, Math.min(window.innerWidth, x)),
            y: Math.max(0, Math.min(window.innerHeight, y)),
          }
        })
      )
      animationRef.current = requestAnimationFrame(update)
    }

    animationRef.current = requestAnimationFrame(update)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isClient, mouseX, mouseY])

  // Mouse move listener
  useEffect(() => {
    if (!isClient) return
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [isClient, mouseX, mouseY])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Mouse-following blob */}
      <motion.div
        className="absolute rounded-full blur-3xl opacity-40"
        style={{
          width: BLOB_SIZE,
          height: BLOB_SIZE,
          background: 'radial-gradient(circle at center, #7f00ff 0%, #000000 80%)',
          translateX: followX,
          translateY: followY,
        }}
      />

      {/* Floating random blobs */}
      {blobs.map((blob) => (
        <motion.div
          key={blob.id}
          className="absolute rounded-full blur-3xl opacity-30"
          style={{
            width: BLOB_SIZE,
            height: BLOB_SIZE,
            background: 'radial-gradient(circle at center, #7f00ff 0%, #000000 80%)',
            left: blob.x,
            top: blob.y,
          }}
        />
      ))}
    </div>
  )
}
