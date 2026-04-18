import type { IconSvgElement } from '@hugeicons/react'

export type EventFeature = {
  icon: IconSvgElement
  label: string
}

export type EventDetailData = {
  id: string
  title: string
  status: string
  date: string
  time?: string
  location: string
  imageUrl: string
  description: string[]
  features: EventFeature[]
  price: string
  buyHref?: string
}
