
"use client"

import { useState, useCallback } from "react"

export interface FilePreview {
    file: File | null
    preview: string | null
    error: string | null
}

export function useFilePreview() {
    const [filePreview, setFilePreview] = useState<FilePreview>({
        file: null,
        preview: null,
        error: null,
    })

    const handleFileSelect = useCallback((file: File | null) => {
        if (!file) {
            setFilePreview({ file: null, preview: null, error: null })
            return
        }

        if (file.type.startsWith("image/")) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setFilePreview({
                    file,
                    preview: e.target?.result as string,
                    error: null,
                })
            }
            reader.onerror = () => {
                setFilePreview({
                    file: null,
                    preview: null,
                    error: "Failed to read file",
                })
            }
            reader.readAsDataURL(file)
        } else if (file.type === "application/pdf") {
            setFilePreview({
                file,
                preview: "pdf",
                error: null,
            })
        } else {
            setFilePreview({
                file: null,
                preview: null,
                error: "Unsupported file type",
            })
        }
    }, [])

    return { filePreview, handleFileSelect }
}