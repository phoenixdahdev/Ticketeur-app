import type { ReactNode } from 'react'
import { ReactLenis } from 'lenis/react'

export function LayoutProvider({ children }: { children: ReactNode }) {
  return <ReactLenis root>{children}</ReactLenis>
}
