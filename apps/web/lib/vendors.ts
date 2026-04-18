export type VendorCategory =
  | 'Food'
  | 'Drinks'
  | 'Merch'
  | 'Art'
  | 'Audio/Visual'
  | 'Security'
  | 'Lighting'
  | 'Entertainment'
  | 'Stage Design'

export type VendorRecord = {
  id: string
  name: string
  category: VendorCategory
  shortDescription: string
  fullDescription: string[]
  imageUrl: string
  location: string
  partnerSince: number
  hostedEvents: number
  expertise: string
  focus: string
  experience: string
  certified?: boolean
  premium?: boolean
  participatingEvents?: {
    id: string
    tag: string
    date: string
    title: string
    description: string
    location: string
    attendees: string
    imageUrl: string
  }[]
}

export const VENDORS: VendorRecord[] = [
  {
    id: 'neon-bites',
    name: 'Neon Bites',
    category: 'Food',
    shortDescription:
      'Serving award-winning wagyu sliders and truffle fries throughout the event.',
    fullDescription: [
      'Neon Bites has been a pioneer in curating world-class experiences for over a decade. We specialize in designing high-impact tech conferences, immersive music festivals, and cutting-edge digital art galleries. Our team is dedicated to connecting global audiences through shared passions and exceptional production values.',
      'With a portfolio spanning three continents, we have established a reputation for excellence in technical execution and creative storytelling. Every event managed by Global Events Corp is crafted with a focus on community building and sustainable event practices.',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    location: 'San Francisco, CA',
    partnerSince: 2018,
    hostedEvents: 24,
    expertise: 'Food',
    focus: 'No Focus',
    experience: '12+ Years',
    certified: true,
    premium: true,
    participatingEvents: [
      {
        id: 'silicon-valley-tech-summit',
        tag: 'Tech',
        date: 'Oct 12-14, 2026',
        title: 'Silicon Valley Tech Summit',
        description:
          'The annual gathering of tech innovators and future-shapers.',
        location: 'Convention Center',
        attendees: '5,000+ Attendees',
        imageUrl:
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'horizon-beats-outdoor-fest',
        tag: 'Music',
        date: 'Nov 05, 2026',
        title: 'Horizon Beats Outdoor Fest',
        description:
          'Electronic music and immersive art under the desert stars.',
        location: 'Joshua Tree Park',
        attendees: '2,500+ Attendees',
        imageUrl:
          'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=600&q=80',
      },
      {
        id: 'future-of-design-workshop',
        tag: 'Workshop',
        date: 'Dec 01, 2026',
        title: 'Future of Design Workshop',
        description:
          'Collaborative sessions on AI and Product Design evolution.',
        location: 'Creative Hub SF',
        attendees: '200 Participants',
        imageUrl:
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=600&q=80',
      },
    ],
  },
  {
    id: 'liquid-dreams',
    name: 'Liquid Dreams',
    category: 'Drinks',
    shortDescription:
      'Experience our signature "Neon Mule" and other molecular mixology delights.',
    fullDescription: [
      'Liquid Dreams has a cult following among event organisers thanks to their theatrical cocktail program and hand-crafted syrups. Every pour tells a story — from smoked old-fashioneds to fluorescent molecular mules.',
      'The team travels with custom bar builds for each venue, so your guests always get the same show-stopping experience.',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    location: 'Lagos, NG',
    partnerSince: 2020,
    hostedEvents: 18,
    expertise: 'Drinks',
    focus: 'Cocktails',
    experience: '8+ Years',
    certified: true,
  },
  {
    id: 'glow-threads',
    name: 'Glow Threads',
    category: 'Merch',
    shortDescription:
      'Exclusive LED-integrated apparel and limited edition artist collaborations.',
    fullDescription: [
      'Glow Threads blends fashion, technology and performance with a runway-ready line of LED-integrated apparel. Every piece is hand-assembled and ships with the event.',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    location: 'Abuja, NG',
    partnerSince: 2021,
    hostedEvents: 12,
    expertise: 'Apparel',
    focus: 'Wearable tech',
    experience: '5+ Years',
  },
  {
    id: 'prism-arts',
    name: 'Prism Arts',
    category: 'Art',
    shortDescription:
      'Browse and purchase unique digital collectibles and interactive physical pieces.',
    fullDescription: [
      'Prism Arts curates works by rising digital artists and pairs them with interactive physical pieces for a hybrid gallery experience.',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&q=80',
    location: 'Accra, GH',
    partnerSince: 2022,
    hostedEvents: 9,
    expertise: 'Art',
    focus: 'Digital collectibles',
    experience: '4+ Years',
    certified: true,
  },
  {
    id: 'soundwave-pro',
    name: 'Soundwave Pro',
    category: 'Audio/Visual',
    shortDescription:
      'Touring-grade line arrays, LED walls and spatial audio for stadium-scale events.',
    fullDescription: [
      'Soundwave Pro is the preferred AV partner for multi-stage festivals and corporate activations across three continents.',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80',
    location: 'Berlin, DE',
    partnerSince: 2019,
    hostedEvents: 31,
    expertise: 'Audio/Visual',
    focus: 'Touring systems',
    experience: '10+ Years',
    certified: true,
  },
  {
    id: 'sentry-guard',
    name: 'Sentry Guard',
    category: 'Security',
    shortDescription:
      'Licensed event security and crowd control teams with medical first-responder training.',
    fullDescription: [
      'Sentry Guard provides white-glove security with discretion — trusted by celebrity tours and VIP hospitality lounges.',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
    location: 'Nairobi, KE',
    partnerSince: 2020,
    hostedEvents: 42,
    expertise: 'Security',
    focus: 'VIP + Crowd',
    experience: '9+ Years',
    certified: true,
  },
  {
    id: 'aura-lighting',
    name: 'Aura Lighting',
    category: 'Lighting',
    shortDescription:
      'Programmable kinetic lighting and intelligent fixtures for immersive stage experiences.',
    fullDescription: [
      'Aura Lighting designs show-control timelines that sync to live music with sub-frame accuracy.',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?auto=format&fit=crop&w=800&q=80',
    location: 'Cape Town, ZA',
    partnerSince: 2021,
    hostedEvents: 20,
    expertise: 'Lighting',
    focus: 'Kinetic systems',
    experience: '6+ Years',
  },
  {
    id: 'orbit-entertainment',
    name: 'Orbit Entertainment',
    category: 'Entertainment',
    shortDescription:
      'Talent booking and artist liaison for DJs, live performers and hybrid shows.',
    fullDescription: [
      'Orbit Entertainment connects organisers with genre-defining artists and manages the entire artist experience end-to-end.',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=800&q=80',
    location: 'Lagos, NG',
    partnerSince: 2017,
    hostedEvents: 55,
    expertise: 'Entertainment',
    focus: 'Artist booking',
    experience: '15+ Years',
    certified: true,
    premium: true,
  },
]
