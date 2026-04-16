"use client"

import React, {
  useEffect,
  useRef,
  useMemo,
  type ComponentPropsWithoutRef,
} from "react"

import { cn } from "@/lib/utils"

interface ParticlesProps extends ComponentPropsWithoutRef<"div"> {
  className?: string
  quantity?: number
  staticity?: number
  ease?: number
  size?: number
  refresh?: boolean
  color?: string
  colors?: string[]
  vx?: number
  vy?: number
  glow?: boolean
  glowIntensity?: number
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "")

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("")
  }

  const hexInt = parseInt(hex, 16)
  const red = (hexInt >> 16) & 255
  const green = (hexInt >> 8) & 255
  const blue = hexInt & 255
  return [red, green, blue]
}

type Circle = {
  x: number
  y: number
  translateX: number
  translateY: number
  size: number
  alpha: number
  targetAlpha: number
  dx: number
  dy: number
  magnetism: number
  colorIndex: number
}

const ParticlesComponent: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 100,
  staticity = 30,
  ease = 30,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  colors = ["#f43f5e", "#f97316"],
  vx = 0,
  vy = 0,
  glow = true,
  glowIntensity = 10,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)
  const circles = useRef<Circle[]>([])
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 })
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1
  const rafID = useRef<number | null>(null)
  const resizeTimeout = useRef<NodeJS.Timeout | null>(null)

  const rgbs = useMemo(() => (colors || [color]).map(c => hexToRgb(c)), [color, colors])

  const circleParams = (): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w)
    const y = Math.floor(Math.random() * canvasSize.current.h)
    const pSize = Math.floor(Math.random() * 1.2) + size
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.15).toFixed(1))
    return {
      x,
      y,
      translateX: 0,
      translateY: 0,
      size: pSize,
      alpha: 0,
      targetAlpha,
      dx: (Math.random() - 0.5) * 0.1,
      dy: (Math.random() * -0.1),
      magnetism: 0.5 + Math.random() * 8,
      colorIndex: Math.floor(Math.random() * (colors?.length || 1)),
    }
  }

  const drawCircle = (circle: Circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha, colorIndex } = circle
      const rgb = rgbs[colorIndex] || rgbs[0]
      context.current.translate(translateX, translateY)

      if (glow) {
        context.current.globalCompositeOperation = "lighter"
        const glowRadius = size * (glowIntensity * 0.25 + 2)
        const gradient = context.current.createRadialGradient(x, y, 0, x, y, glowRadius)
        gradient.addColorStop(0, `rgba(${rgb.join(", ")}, ${alpha * 0.6})`)
        gradient.addColorStop(1, `rgba(${rgb.join(", ")}, 0)`)

        context.current.fillStyle = gradient
        context.current.beginPath()
        context.current.arc(x, y, glowRadius, 0, 2 * Math.PI)
        context.current.fill()
      }

      context.current.beginPath()
      context.current.arc(x, y, size, 0, 2 * Math.PI)
      context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`
      context.current.globalCompositeOperation = "source-over"
      context.current.fill()
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (!update) circles.current.push(circle)
    }
  }

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      canvasSize.current.w = canvasContainerRef.current.offsetWidth
      canvasSize.current.h = canvasContainerRef.current.offsetHeight
      canvasRef.current.width = canvasSize.current.w * dpr
      canvasRef.current.height = canvasSize.current.h * dpr
      canvasRef.current.style.width = `${canvasSize.current.w}px`
      canvasRef.current.style.height = `${canvasSize.current.h}px`
      context.current.scale(dpr, dpr)

      circles.current = []
      for (let i = 0; i < quantity; i++) {
        drawCircle(circleParams())
      }
    }
  }

  const animate = () => {
    if (context.current) {
      context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h)
    }

    circles.current.forEach((circle: Circle, i: number) => {
      const edge = [
        circle.x + circle.translateX - circle.size,
        canvasSize.current.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        canvasSize.current.h - circle.y - circle.translateY - circle.size,
      ]
      const closestEdge = edge.reduce((a, b) => Math.min(a, b))
      const remapClosestEdge = Math.max(0, Math.min(1, closestEdge / 20))

      if (remapClosestEdge > 1) {
        circle.alpha += 0.02
        if (circle.alpha > circle.targetAlpha) circle.alpha = circle.targetAlpha
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge
      }

      circle.x += circle.dx + vx
      circle.y += circle.dy + vy
      circle.translateX += (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) / ease
      circle.translateY += (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) / ease

      drawCircle(circle, true)

      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current.splice(i, 1)
        drawCircle(circleParams())
      }
    })
    rafID.current = window.requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d")
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        const { w, h } = canvasSize.current
        const x = event.clientX - rect.left - w / 2
        const y = event.clientY - rect.top - h / 2
        if (x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2) {
          mouse.current.x = x
          mouse.current.y = y
        }
      }
    }

    const handleResize = () => {
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current)
      resizeTimeout.current = setTimeout(resizeCanvas, 200)
    }

    resizeCanvas()
    animate()

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)

    return () => {
      if (rafID.current != null) window.cancelAnimationFrame(rafID.current)
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
    }
  }, [color, quantity, staticity, ease, size, vx, vy, colors, glow, glowIntensity])

  useEffect(() => {
    resizeCanvas()
  }, [refresh])

  return (
    <div
      className={cn("pointer-events-none", className)}
      ref={canvasContainerRef}
      aria-hidden="true"
      {...props}
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  )
}

export const Particles = React.memo(ParticlesComponent)
