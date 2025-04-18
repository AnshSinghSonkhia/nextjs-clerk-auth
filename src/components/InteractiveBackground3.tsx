'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const BLOB_SIZE = 650
const DIRECTION_VECTORS = [
  { dx: 1, dy: 1 },
  { dx: -1, dy: 1 },
  { dx: 1, dy: -1 },
]
const SPEED = 1.5
const COLORS = [
  '#7f00ff', '#a855f7', '#9333ea', '#6b21a8',
  '#9b4d96', '#c084fc', '#5b21b6', '#6d28d9',
  '#3b82f6', '#60a5fa', '#8b5cf6', '#ec4899',
]

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)]

type BlobState = {
  id: string
  x: number
  y: number
  dx: number
  dy: number
  speed: number
  fromColor: string
  toColor: string
}

export default function InteractiveBackground3() {
  const [blobs, setBlobs] = useState<BlobState[]>([])
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0)
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0)
  const followX = useSpring(mouseX, { damping: 20, stiffness: 150 })
  const followY = useSpring(mouseY, { damping: 20, stiffness: 150 })
  const animationRef = useRef<number | null>(null)

  // ✅ Delay blob init until after mount (so window.innerWidth is valid)
  useEffect(() => {
    const createDirectionalBlob = (index: number): BlobState => {
      const startX = index === 1 ? window.innerWidth - BLOB_SIZE : 0
      const startY = index === 2 ? window.innerHeight - BLOB_SIZE : 0
      const { dx, dy } = DIRECTION_VECTORS[index]
      return {
        id: crypto.randomUUID(),
        x: startX,
        y: startY,
        dx,
        dy,
        speed: SPEED,
        fromColor: getRandomColor(),
        toColor: getRandomColor(),
      }
    }
    setBlobs(Array.from({ length: 3 }, (_, i) => createDirectionalBlob(i)))
  }, [])

  useEffect(() => {
    const updateBlobs = () => {
      setBlobs((prev) =>
        prev.map((blob) => {
          const x = blob.x + blob.dx * blob.speed
          const y = blob.y + blob.dy * blob.speed
          if (x <= 0 || x >= window.innerWidth - BLOB_SIZE) blob.dx *= -1
          if (y <= 0 || y >= window.innerHeight - BLOB_SIZE) blob.dy *= -1
          return {
            ...blob,
            x: Math.max(0, Math.min(window.innerWidth - BLOB_SIZE, x)),
            y: Math.max(0, Math.min(window.innerHeight - BLOB_SIZE, y)),
          }
        })
      )
      animationRef.current = requestAnimationFrame(updateBlobs)
    }
    if (blobs.length > 0) {
      animationRef.current = requestAnimationFrame(updateBlobs)
    }
    return () => cancelAnimationFrame(animationRef.current!)
  }, [blobs.length])

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  useEffect(() => {
    const colorInterval = setInterval(() => {
      setBlobs((prev) =>
        prev.map((blob) => ({
          ...blob,
          fromColor: blob.toColor,
          toColor: getRandomColor(),
        }))
      )
    }, 4000)
    return () => clearInterval(colorInterval)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* Mouse-following blob */}
      <motion.div
        className="absolute rounded-full blur-3xl opacity-40 shadow-2xl"
        style={{
          width: BLOB_SIZE,
          height: BLOB_SIZE,
          background: 'radial-gradient(circle at center, #a855f7, #6b21a8)',
          translateX: followX,
          translateY: followY,
          boxShadow: `0 0 120px 60px ${blobs.fromColor}`,
        }}
      />

      {/* 3 directional blobs */}
      {blobs.map((blob) => (
        <motion.div
          key={blob.id}
          className="absolute rounded-full blur-3xl opacity-30 shadow-2xl"
          animate={{
            background: [
              `radial-gradient(circle at center, ${blob.fromColor}, #6b21a8)`,
              `radial-gradient(circle at center, ${blob.toColor}, #6b21a8)`,
            ],
          }}
          transition={{ duration: 4, ease: 'easeInOut' }}
          style={{
            width: BLOB_SIZE,
            height: BLOB_SIZE,
            left: blob.x,
            top: blob.y,
            boxShadow: `0 0 120px 60px ${blobs.fromColor}`,
          }}
        />
      ))}
    </div>
  )
}
