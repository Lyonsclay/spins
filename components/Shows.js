import React, { useEffect } from 'react'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())
const Heart = () => (
  <div className="text-red-lighter">
    <svg className="w-6 h-6"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20">
      <path d="M10 3.22l-.61-.6a5.5 5.5 0 0 0-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 0 0-7.78-7.77l-.61.61z" />
    </svg>
  </div>
)

const Shows = () => {

  const { shows, error } = useSWR('/api/shows', fetcher)

  useEffect(() => {
    console.log({ shows })
    console.log({ error })
  }, [shows])
  if (error) return <div>failed to load</div>
  if (!shows) return <div>Loading...</div>

  return (
    <div className="shadow-lg rounded-lg" >
      <div className="grid grid-cols-2 place-content-evenly border-solid border-2 border-sky-100">
        <ul>
          {shows?.map(d => (<li><span>{d.Title}</span><span>{d.Text}</span></li>))}
        </ul>
      </div>
    </div>
  )
}

export default Shows
