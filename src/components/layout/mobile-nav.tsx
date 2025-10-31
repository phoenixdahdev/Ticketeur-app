'use client'
import * as React from 'react'
import Link from 'next/link'
import { Code2, LogOut, Sparkle } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useLockBody } from '../../hook/utils/use-lock-body'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { useRouter } from 'next/navigation'
import { toast } from '../ui/sonner'
import { returnError } from '../../lib/utils'
import { navLinks } from './sidebar'

interface MobileNavProps {
  toggle?: () => void
}

const navItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
    },
  }),
}

export function MobileNav({ toggle }: MobileNavProps) {
  useLockBody()
  const path = usePathname()
  const router = useRouter()

  const logout = async () => {
    try {
      router.push('/')
    } catch (error) {
      const message = returnError(error)
      toast.error(message)
    }
  }

  return (
    <div
      className={cn(
        'animate-in slide-in-from-bottom-80 fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md md:hidden'
      )}
    >
      <div className="text-popover-foreground bg-background border-nav relative z-20 grid gap-6 rounded-md border p-4">
        <Link href="/dashboard/home" className="flex items-center space-x-2">
          <div className="bg-background rounded-lg p-2">
            <Code2 className="h-6 w-6" />
          </div>
          <span className="text-app-prompt-sent bg-clip-text text-xl font-bold">
            Tiqueteur
          </span>
        </Link>
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {navLinks.map((item, index) => {
            return (
              item.href && (
                <motion.div
                  key={index}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  variants={navItemVariants}
                >
                  <Link
                    // @ts-expect-error next line
                    href={item.href}
                    onClick={() => toggle && toggle()}
                  >
                    <span
                      className={cn(
                        'group text-dashboardLink hover:bg-dashboardLink-activeBg hover:text-dashboardLink-active flex items-center rounded-sm px-3 py-2 text-sm font-normal',
                        path.includes(item.href)
                          ? 'bg-dashboardLink-activeBg text-dashboardLink-active'
                          : 'transparent'
                        // item.disabled && 'cursor-not-allowed opacity-80'
                      )}
                    >
                      <Sparkle className="mr-2 h-4 w-4" />
                      <span>{item.name}</span>
                    </span>
                  </Link>
                </motion.div>
              )
            )
          })}

          <AlertDialog>
            <AlertDialogTrigger>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  {
                    // delay: dashboardConfig.sidebarMain.length * 0.1 + 0.1,
                  }
                }
                className={cn(
                  'group hover:bg-dashboardLink-activeBg hover:text-dashboardLink-active flex items-center rounded-sm px-3 py-2 text-sm font-normal text-[#C20701]'
                )}
              >
                <Sparkle className="mr-2 h-4 w-4" />
                <span>logout</span>
              </motion.span>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  we would love to see you stay.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={logout}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </nav>
      </div>
    </div>
  )
}
