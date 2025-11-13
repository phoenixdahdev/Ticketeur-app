'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'

const images = [
  'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800',
  'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=800',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800',
  'https://images.unsplash.com/photo-1731475760849-459c36ed6bca?auto=format&fit=crop&w=800',
  'https://plus.unsplash.com/premium_photo-1661306543132-93937b4c242e?auto=format&fit=crop&w=800',
  'https://images.unsplash.com/photo-1642784353782-91bfdd65920c?auto=format&fit=crop&w=800',
  'https://images.unsplash.com/photo-1574153288178-4596750d7efa?auto=format&fit=crop&w=800',
]

const bottomImages = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=800',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800',
  'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=800',
]

const CarouselSection = () => {
  const topCarouselRef = useRef<HTMLDivElement>(null)
  const bottomCarouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const topCarousel = topCarouselRef.current
    const bottomCarousel = bottomCarouselRef.current

    if (!topCarousel || !bottomCarousel) return

    let scrollAmount = 0
    let isScrolling = true

    const scroll = () => {
      if (!isScrolling) return

      scrollAmount += 0.5
      if (topCarousel) {
        topCarousel.scrollLeft = scrollAmount % (topCarousel.scrollWidth / 2)
      }

      if (bottomCarousel) {
        bottomCarousel.scrollLeft =
          bottomCarousel.scrollWidth / 2 -
          (scrollAmount % (bottomCarousel.scrollWidth / 2))
      }

      requestAnimationFrame(scroll)
    }

    scroll()

    const handlePause = () => {
      isScrolling = false
    }

    const handleResume = () => {
      isScrolling = true
      scroll()
    }

    topCarousel.addEventListener('mouseenter', handlePause)
    topCarousel.addEventListener('mouseleave', handleResume)
    bottomCarousel.addEventListener('mouseenter', handlePause)
    bottomCarousel.addEventListener('mouseleave', handleResume)

    return () => {
      topCarousel.removeEventListener('mouseenter', handlePause)
      topCarousel.removeEventListener('mouseleave', handleResume)
      bottomCarousel.removeEventListener('mouseenter', handlePause)
      bottomCarousel.removeEventListener('mouseleave', handleResume)
      isScrolling = false
    }
  }, [])

  return (
    <section className="carousel-section relative w-full overflow-hidden py-6">
      <div
        ref={topCarouselRef}
        className="carousel-scroll mb-4 flex gap-4 overflow-x-hidden pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex min-w-max gap-4">
          {images.map((img, i) => (
            <div
              key={`top-${i}`}
              className="h-64 w-80 shrink-0 overflow-hidden rounded-xl lg:h-85 lg:w-104"
            >
              <Image
                height={100}
                width={100}
                unoptimized
                src={img}
                alt={`Event ${i}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="flex min-w-max gap-4">
          {images.map((img, i) => (
            <div
              key={`top-dup-${i}`}
              className="h-64 w-80 shrink-0 overflow-hidden rounded-xl lg:h-85 lg:w-104"
            >
              <Image
                height={100}
                width={100}
                unoptimized
                src={img}
                alt={`Event ${i}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div
        ref={bottomCarouselRef}
        className="carousel-scroll flex gap-4 overflow-x-hidden pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex min-w-max gap-4">
          {bottomImages.map((img, i) => (
            <div
              key={`bottom-${i}`}
              className="h-64 w-80 shrink-0 overflow-hidden rounded-xl lg:h-85 lg:w-104"
            >
              <Image
                height={100}
                width={100}
                src={img}
                unoptimized
                alt={`Event ${i}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="flex min-w-max gap-4">
          {bottomImages.map((img, i) => (
            <div
              key={`bottom-dup-${i}`}
              className="h-64 w-80 shrink-0 overflow-hidden rounded-xl lg:h-85 lg:w-104"
            >
              <Image
                height={100}
                width={100}
                unoptimized
                src={img}
                alt={`Event ${i}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CarouselSection
