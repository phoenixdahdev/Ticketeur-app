import React from 'react'

const HomePage = () => {
  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          <h1 className="font-trap text-5xl font-bold text-black lg:text-7xl">
            Welcome to Ticketeur
          </h1>
          <p className="max-w-2xl font-sans text-lg text-gray-600 lg:text-xl">
            Your premium ticketing solution for unforgettable events
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
