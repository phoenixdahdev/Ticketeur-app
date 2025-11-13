'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@useticketeur/ui/components/card'
import gsap from 'gsap'
import Image from 'next/image'
import { cn } from '@useticketeur/ui/lib/utils'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@useticketeur/ui/components/button'

interface CardData {
  id: number
  title: string
  description: string
  image: string
  label?: string
}

const cardsData: CardData[] = [
  {
    id: 2,
    title: 'Buy Tickets with Ease',
    description:
      'Forget the stress of complicated bookings—get your tickets securely and instantly from anywhere, at any time. Ticketeur makes your ticket-buying experience smooth and worry-free.',
    image: 'https://plus.unsplash.com/premium_photo-1718674394245-9f270c5fd2b3',
    label: 'New',
  },
  {
    id: 3,
    title: 'Organize Events Seamlessly',
    description:
      'Whether you’re planning a small gathering or a major event, Ticketeur helps you set everything up effortlessly. Manage your event details, attendees, and ticket sales smoothly—all in one place',
    image:
      'https://plus.unsplash.com/premium_photo-1723471212652-06d5aea09548?auto=format&fit=crop&w=800',
    label: 'Popular',
  },
  {
    id: 4,
    title: 'Explore Local Events',
    description:
      "Never miss out on what's happening near you. Ticketeur shows you the most exciting local events, curated specifically based on your interests, location, and preferences.",
    image:
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800',
    label: 'Trending',
  },
  {
    id: 5,
    title: 'Personalized Recommendations',
    description:
      "We understand everyone’s tastes are unique. That’s why Ticketeur recommends events tailored specifically for you, ensuring you always find something you'll love.",
    image:
      'https://images.unsplash.com/photo-1603811601606-1252ac37d097?auto=format&fit=crop&w=800',
    label: 'Popular',
  },
  {
    id: 6,
    title: 'Secure Payments & Easy Check-ins',
    description:
      'Your security and convenience matter. Ticketeur provides safe and trusted payment options, and helps you easily check into events without any hassle.',
    image:
      'https://images.unsplash.com/photo-1628527304948-06157ee3c8a6?auto=format&fit=crop&w=800',
    label: 'Premium',
  },
]

const ParallaxCards = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  // Initialize GSAP
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger)

    // Clean up any existing ScrollTriggers
    ScrollTrigger.getAll().forEach((t) => t.kill())

    // Create a timeline
    // const tl = gsap.timeline()

    // Set up scroll sections
    const sections = sectionRefs.current.filter(Boolean)

    // Create scroll triggers for each section
    sections.forEach((section, i) => {
      if (!section) return

      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveIndex(i),
        onEnterBack: () => setActiveIndex(i),
        // markers: true, // Enable markers for debugging
        id: `section-${i}`,
      })
    })

    // Fallback: Use direct scroll listener if ScrollTrigger fails
    const handleScroll = () => {
      if (ScrollTrigger.getAll().length === 0) {
        const scrollPosition = window.scrollY
        const windowHeight = window.innerHeight
        const totalHeight = document.body.scrollHeight - windowHeight
        const scrollPercentage = scrollPosition / totalHeight
        const newIndex = Math.min(
          Math.floor(scrollPercentage * cardsData.length),
          cardsData.length - 1
        )
        setActiveIndex(newIndex)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative bg-gray-50 pb-20 lg:pb-0">
      {/* Cards display section */}
      <div className="sticky top-0 flex min-h-screen items-center justify-center overflow-hidden py-12">
        <div className="relative container mx-auto px-4 md:px-6">
          <div className="relative z-10 grid lg:grid-cols-2 lg:gap-10">
            {/* Text content */}
            <div className="relative h-[300px] md:h-[400px]">
              {/* {cardsData.map((item, index) => (
                <div
                  key={`text-${item.id}`}
                  className={cn(
                    "absolute top-0 left-0 w-full transition-all duration-500",
                    activeIndex === index
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8 pointer-events-none"
                  )}
                >
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 font-[family-name:var(--font-trap)]">
                    {item.title}
                  </h1>
                  <p className="text-base lg:text-lg text-black font-[family-name:var(--font-transforma-sans)]">
                    {item.description}
                  </p>
                </div>
              ))} */}

              <div
                key={`text-`}
                className={cn(
                  'absolute top-0 left-0 w-full transition-all duration-500',
                  // activeIndex === index
                  'translate-y-0 opacity-100'
                )}
              >
                <h1 className="mb-6 font-[family-name:var(--font-trap)] text-4xl font-bold tracking-tighter md:text-5xl">
                  Your Ultimate Event Companion
                </h1>
                <p className="font-[family-name:var(--font-transforma-sans)] text-base text-black lg:text-lg">
                  Ticketeur streamlines the entire event experience—from
                  effortlessly buying tickets and smoothly organizing events, to
                  discovering exciting local happenings.
                </p>

                <Button
                  disabled
                  className="mt-5 rounded-4xl bg-[#1A0D42] p-2 font-[family-name:var(--font-transforma-sans)] text-xs font-bold text-white hover:animate-pulse disabled:opacity-100 lg:p-5"
                >
                  Coming Soon
                </Button>
              </div>
            </div>

            {/* Stacked cards */}
            <div className="relative h-[400px] md:h-[500px]">
              {cardsData.map((item, index) => {
                // Calculate stacking effect based on position relative to active card
                // const isActive = index === activeIndex
                const isBehindActive = index > activeIndex
                const isBeforeActive = index < activeIndex

                // Calculate transform values
                const yOffset = isBehindActive
                  ? (index - activeIndex) * 7
                  : isBeforeActive
                    ? -100
                    : 0
                const xOffset = isBehindActive ? (index - activeIndex) * 2 : 0
                const rotation = isBehindActive
                  ? (index - activeIndex) * 3
                  : isBeforeActive
                    ? -8
                    : 0
                const scale = isBehindActive
                  ? Math.max(0.95 - (index - activeIndex) * 0.05, 0.8)
                  : isBeforeActive
                    ? 0.95
                    : 1
                const opacity = isBehindActive
                  ? Math.max(0.8 - (index - activeIndex) * 0.2, 0)
                  : isBeforeActive
                    ? 0
                    : 1

                return (
                  <div
                    key={`card-${item.id}`}
                    className="absolute top-0 left-0 w-full transform-gpu transition-all duration-500"
                    style={{
                      zIndex: cardsData.length - Math.abs(index - activeIndex),
                      opacity,
                      transform: `translateY(${yOffset}%) translateX(${xOffset}%) rotate(${rotation}deg) scale(${scale})`,
                      transformOrigin: 'center bottom',
                    }}
                  >
                    <Card className="h-full overflow-hidden pt-0 shadow-xl">
                      <div className="relative">
                        <Image
                          height={100}
                          width={100}
                          unoptimized
                          src={item.image || '/placeholder.svg'}
                          alt={item.title}
                          className="aspect-video w-full object-cover"
                        />
                      </div>
                      <CardHeader className="p-0"></CardHeader>
                      <CardContent className="p-6 pt-0">
                        <span className="text-secondary inline w-auto rounded-sm bg-[#fee6fe] px-3 py-1.5 font-[family-name:var(--font-trap)] text-sm font-medium capitalize">
                          {item.label}
                        </span>
                        <CardTitle className="mt-5 font-[family-name:var(--font-trap)] text-lg font-bold lg:text-3xl">
                          {item.title}
                        </CardTitle>
                        <p className="mt-3 font-[family-name:var(--font-transforma-sans)] text-sm text-black">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll sections */}
      <div className="relative z-0">
        {cardsData.map((item, index) => (
          <div
            key={`section-${item.id}`}
            /* eslint-disable @typescript-eslint/no-explicit-any */
            ref={(el) => (sectionRefs.current[index] = el) as any}
            className="min-h-[50vh]" // Each section is half viewport height
            id={`section-${index}`}
          />
        ))}
      </div>
    </div>
  )
}

export default ParallaxCards
