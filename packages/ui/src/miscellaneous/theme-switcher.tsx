"use client"

import { useTheme } from "next-themes"
import { LightbulbIcon, MoonIcon } from "lucide-react"
import { useEffect, useState, useRef, useEffectEvent } from "react"
import { Button } from "../components/button"
import { cn } from "../lib/utils"
import { inDevEnvironment } from "../providers/default-provider"

const ThemeSwitcher = () => {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  })

  const hasMoved = useRef(false)
  const mouseDownTime = useRef(0)

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const [position, setPosition] = useState(() => {
    if (typeof window !== "undefined") {
      const btnPos = localStorage.getItem("themePosition")
      if (btnPos) {
        return JSON.parse(btnPos)
      }
    }
    return {
      x: 64,
      y: 20,
    }
  })

  const [dragOffset, setDragOffset] = useState({
    x: 0,
    y: 0,
  })
  const [isDragging, setIsDragging] = useState(false)

  const onDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
    hasMoved.current = false
    mouseDownTime.current = Date.now()
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const onDragEnd = useEffectEvent(() => {
    const dragDuration = Date.now() - mouseDownTime.current
    setIsDragging(false)

    const isClick = !hasMoved.current && dragDuration < 200

    if (isClick) {
      const newTheme = resolvedTheme === "light" ? "dark" : "light"
      setTheme(newTheme)
    }
  })

  const onMouseMove = useEffectEvent((e: MouseEvent) => {
    hasMoved.current = true

    const viewPortX = e.clientX - dragOffset.x
    const viewPortY = e.clientY - dragOffset.y
    const windowWidth = dimensions.width - 54
    const windowHeight = dimensions.height - 54
    if (
      viewPortX <= 0 ||
      viewPortY <= 0 ||
      viewPortX >= windowWidth ||
      viewPortY >= windowHeight
    )
      return
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    })
  })

  useEffect(() => {
    if (!isDragging) return
    localStorage.setItem("themePosition", JSON.stringify(position))
  }, [position, isDragging])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove)
      window.addEventListener("mouseup", onDragEnd)
    } else {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onDragEnd)
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onDragEnd)
    }
  }, [isDragging])

  const isDark = resolvedTheme === "dark"

  if (!mounted || !inDevEnvironment) return null

  return (
    <div
      onMouseDown={onDragStart}
      style={{
        transform: `translateX(${position.x}px) translateY(${position.y}px)`,
        cursor: isDragging ? "grabbing" : "grab",
        left: 0,
        top: 0,
      }}
      className={cn(
        "fixed z-999 flex translate-x-0 flex-col items-start rounded-full",
        !isDark ? "text-gray-200" : "text-black"
      )}
    >
      <Button
        variant={"ghost"}
        size={"icon-lg"}
        className={cn(
          "rounded-full p-2 transition-all",
          isDragging
            ? "pointer-events-none opacity-50 shadow-[0_0_30px_10px_rgba(0,0,0,0.3)] duration-300 dark:opacity-60 dark:shadow-[0_0_30px_10px_rgba(255,255,255,0.5)]"
            : "pointer-events-auto opacity-100 duration-1000",
          isDark ? "bg-gray-200" : "bg-black"
        )}
      >
        {isDark ? (
          <LightbulbIcon className="size-10" />
        ) : (
          <MoonIcon className="size-10" />
        )}
      </Button>
    </div>
  )
}

export default ThemeSwitcher
