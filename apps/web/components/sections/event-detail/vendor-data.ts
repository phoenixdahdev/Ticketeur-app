export type ParticipatingVendor = {
  id: string
  name: string
  category: string
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
}

export const PARTICIPATING_VENDORS: ParticipatingVendor[] = [
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
  },
  {
    id: 'liquid-dreams',
    name: 'Liquid Dreams',
    category: 'Drinks',
    shortDescription:
      'Experience our signature "Neon Mule" and other molecular mixology delights.',
    fullDescription: [
      'Liquid Dreams has a cult following among event organisers thanks to their theatrical cocktail program and hand-crafted syrups. Every pour tells a story — from smoked old-fashioneds to fluorescent molecular mules.',
      'The team travels with custom bar builds for each venue, so your guests always get the same show-stopping experience. Perfect for festivals, gallery openings, and private VIP lounges.',
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
    category: 'Fashion',
    shortDescription:
      'Exclusive LED-integrated apparel and limited edition artist collaborations.',
    fullDescription: [
      'Glow Threads blends fashion, technology and performance with a runway-ready line of LED-integrated apparel. Every piece is hand-assembled and ships with the event.',
      'Past collaborations include collections for Afrobeats artists and major music festivals in Lagos and Cape Town.',
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
      'Their on-site installations are fully moveable, making them ideal for pop-up activations.',
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
]
