import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import axios from 'axios'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function returnError(error: unknown): string {
  console.error(error)

  if (axios.isAxiosError(error))
    return error.response?.data?.message ?? 'An error occurred'

  if (error instanceof Error) return error.message

  return 'An unknown error occurred'
}



export const inDevEnvironment =
  !!process && process.env.NODE_ENV === 'development'


export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}