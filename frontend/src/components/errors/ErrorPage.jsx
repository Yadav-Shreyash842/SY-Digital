import React from 'react'

export default function ErrorPage({ title = 'Something went wrong', message }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      {message && <p className="mt-2 text-text-secondary">{message}</p>}
    </div>
  )
}
