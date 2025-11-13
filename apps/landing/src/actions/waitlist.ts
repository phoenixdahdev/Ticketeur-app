'use server'

import { z } from 'zod'
import connectDB from '@/lib/mongodb'
import { tasks } from '@trigger.dev/sdk'
import WaitList, { waitListSchema } from '@/model'

export type ActionResponse<T = unknown> = {
  success: boolean
  message: string
  data?: T
}

export async function addToWaitlist(email: string): Promise<ActionResponse> {
  try {
    const validatedData = waitListSchema.parse({ email })
    await connectDB()
    const existingEntry = await WaitList.findOne({ email: validatedData.email })
    if (existingEntry) {
      return {
        success: false,
        message: 'This email is already on the waitlist',
      }
    }
    const waitlistEntry = await WaitList.create({
      email: validatedData.email,
    })
    await tasks.trigger('send-waitlist-email', {
      email: waitlistEntry.email,
      name: (() => {
        const local = waitlistEntry.email?.split('@')[0] ?? ''
        return local ? local.charAt(0).toUpperCase() + local.slice(1) : ''
      })(),
    })

    return {
      success: true,
      message: 'Successfully added to waitlist!',
      data: {
        email: waitlistEntry.email,
        created_at: waitlistEntry.created_at,
      },
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Invalid email address',
      }
    }
    return {
      success: false,
      message: 'Failed to add to waitlist. Please try again.',
    }
  }
}
