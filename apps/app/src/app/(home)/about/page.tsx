'use client'
import React, { useState, useEffect, useRef } from 'react'
import { X, Download, Share2, ZoomIn } from 'lucide-react'

const MasonryGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [columns, setColumns] = useState(3)
  const containerRef = useRef(null)

  const images = [
    {
      id: 11,
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800',
    },
    {
      id: 12,
      url: 'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=800&h=600',
    },
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=500',
    },
    {
      id: 10,
      url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&h=1200',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=800',
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=1000',
    },

    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600',
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800',
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=1100',
    },
    {
      id: 8,
      url: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&h=500',
    },
    {
      id: 9,
      url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&h=900',
    },
  ]

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) setColumns(1)
      else if (width < 1024) setColumns(2)
      else setColumns(3)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const distributeImages = () => {
    const cols = Array.from({ length: columns }, () => [])
    images.forEach((image, index) => {
      cols[index % columns].push(image)
    })
    return cols
  }

  const columnImages = distributeImages()

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      {/* Header */}
      <div className="mx-auto mb-12 max-w-7xl text-center">
        <h1 className="mb-4 text-6xl font-bold tracking-tight text-white">
          GALLERY
        </h1>
        <p className="text-lg text-gray-300">
          Explore our collection of stunning photography from around the world
        </p>
      </div>

      <div className="mx-auto max-w-7xl" ref={containerRef}>
        <div className="flex gap-4">
          {columnImages.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-1 flex-col gap-4">
              {column.map((image) => (
                <div
                  key={image.id}
                  className="group relative transform cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.url}
                    alt={`Gallery image ${image.id}`}
                    className="h-auto w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between">
                      <span className="font-semibold text-white">
                        Image {image.id}
                      </span>
                      <ZoomIn className="text-white" size={24} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white transition-colors hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>

          <div
            className="relative max-h-[90vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.url}
              alt={`Gallery image ${selectedImage.id}`}
              className="max-h-[90vh] max-w-full rounded-lg object-contain"
            />

            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 transform gap-4 rounded-full bg-white/10 px-6 py-3 backdrop-blur-md">
              <button className="p-2 text-white transition-colors hover:text-blue-400">
                <Download size={24} />
              </button>
              <button className="p-2 text-white transition-colors hover:text-blue-400">
                <Share2 size={24} />
              </button>
              <button className="rounded-full bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600">
                Add to Edit
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
      `}</style>
    </div>
  )
}

export default MasonryGallery
