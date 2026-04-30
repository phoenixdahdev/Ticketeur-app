'use client'

import { upload } from '@vercel/blob/client'

type UploadResult = {
  url: string
  pathname: string
  contentType: string
  contentDisposition: string
  downloadUrl?: string
}

export type UploadKind =
  | 'event-banner'
  | 'vendor-logo'
  | 'vendor-banner'
  | 'vendor-showcase'

export type UploadProgress = {
  loaded: number
  total: number
  percentage: number
}

export type UploadFileOptions = {
  kind: UploadKind
  file: File
  onProgress?: (progress: UploadProgress) => void
  signal?: AbortSignal
}

export async function uploadFile({
  kind,
  file,
  onProgress,
  signal,
}: UploadFileOptions): Promise<UploadResult> {
  const result = await upload(file.name, file, {
    access: 'public',
    handleUploadUrl: '/api/upload',
    clientPayload: JSON.stringify({ kind }),
    onUploadProgress: onProgress,
    abortSignal: signal,
  })
  return result as UploadResult
}
