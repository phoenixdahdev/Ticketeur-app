"use server"

import { put } from "@vercel/blob"

export interface UploadOptions {
    folder?: string
    contentType?: string
}

export interface UploadResponse {
    success: boolean
    url?: string
    error?: string
}

/**
 * Generic reusable upload function for Vercel Blob
 * Can be used for any file type and any folder structure
 */
export async function uploadFile(file: File, filename: string, options: UploadOptions = {}): Promise<UploadResponse> {
    try {
        if (!file || file.size === 0) {
            return { success: false, error: "File is empty" }
        }

        const { folder = "uploads", contentType = file.type } = options

        const timestamp = Date.now()
        const path = folder ? `${folder}/${filename}-${timestamp}` : `${filename}-${timestamp}`
        const buffer = await file.arrayBuffer()

        const blob = await put(path, buffer, {
            access: "public",
            contentType,
        })

        return {
            success: true,
            url: blob.url,
        }
    } catch (error) {
        console.error("Upload error:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Upload failed",
        }
    }
}

/**
 * Specialized upload for business documents
 */
export async function uploadBusinessDocument(
    file: File,
    businessId: string,
    documentType: "business-doc" | "valid-id",
): Promise<UploadResponse> {
    return uploadFile(file, `${businessId}/${documentType}`, {
        folder: "business-verification",
    })
}