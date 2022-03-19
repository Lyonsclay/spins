import React, { useEffect } from 'react'
import useSWR from 'swr'

import { ClockIcon } from '@heroicons/react/solid'
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

const dateFormat = (time) => {
  let date = new Date(time)
  let options = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric"
  }
  time = date.toLocaleTimeString("en-us", options)
  time = time.split(',').slice(0, -2).join(" ")
  // console.log({ time })
  return time
}
const startTimeFormat = (time) => {
  let date = new Date(time)
  let options = {
    weekday: "long", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
  }
  time = date.toLocaleTimeString("en-us", options)
  return time
}
const timeFormat = (time) => {
  let date = new Date(time)
  let options = {
    hour: "2-digit", minute: "2-digit"
  }
  time = date.toLocaleTimeString("en-us", options)
  return time
}
const Show = ({ title, text, start, end, url }) => {
  // const selectShow = () => fetch('/api/runup?path=' + url, {headers: {
  //   'Content-Type': 'application/json'
  // }}).then((res) => { console.log({ res }); return res.text() }).then(data => console.log({ data }))
  const selectShow = () => fetch('api/susu?path=' + url).then(data => console.log({ data }))
  // const selectShow = () => console.log({url})
  return (
    <tr className="transition duration-300 ease-in-out hover:bg-[#161c22]">
      <td className="w-2/3 flex flex-col">
        <th className="text-left ml-4">{dateFormat(start)}</th>
        <span className="text-left ml-4">{timeFormat(start)}-{timeFormat(end)}</span>
      </td>
      <td className="w-1/3 text-center"><button onClick={selectShow}>{title}</button></td>
      <td className="w-1/3 text-center">{text}</td>
    </tr>
  )
}
const Shows = () => {
  const { data: shows, error } = useSWR('/api/calendar', fetcher)

  if (error) return <div>failed to load</div>
  if (!shows) return <div>Loading...</div>

  return (
    <div className="sticky top-0 flex flex-col rounded border-slate-600">
      <table className="w-full">

        <thead className="bg-[#161c22] text-slate-400 sticky top-0 h-16">
          <tr className="w-full">
            <th className="text-center text-blue-400 pl-6"><ClockIcon className=" w-4" /></th>
            <th className="">Show</th>
            <th className="">DJ</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-500 font-light text-slate-500">
          {shows.slice(0, -1)?.map(d => (
            <Show title={d.title} text={d.text} start={d.start} end={d.end} url={d.url} />
          ))}
        </tbody>

      </table>
    </div>
  )
}

export default Shows
