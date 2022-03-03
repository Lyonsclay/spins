import React, {
  useEffect,
  useState
} from 'react'
import { PlayIcon, PauseIcon } from '@heroicons/react/solid'
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
const Play = () => (
  <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
    <path d="M4,0 L20,10 L4,20 L4,0" />
  </svg>
)
const Pause = () => (
  <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
    <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
  </svg>
)

const PlayPause = ({ audio }) => {
  const [play, setPlay] = useState(false)
  const togglePlay = () => {
    play ? audio.pause() : audio.play()
    setPlay(!play)
  }
  return (
    <button onClick={togglePlay}>
      {audio && (play ?
        <PauseIcon className="fill-red-500 w-20 h-20" />
        : <PlayIcon className="fill-red-500  w-20 h-20" />)}
    </button>
  )

}


const Player = () => {

  const { data, error } = useSWR('/api/spins', fetcher)
  const url = "http://s7.viastreaming.net:8310/;?_=0.494499115526442"
  const [audio, setAudio] = useState()


  useEffect(() => {
    const audio = new Audio(url);
    // const stream = audio.captureStream()
    // audio.captureStream()
    setAudio(audio)
  }, [audio?.play])

  const defaultImage = "https://spinitron.com/static/pictures/placeholders/loudspeaker.svg"

  if (!(typeof audio?.play === 'function')) return <div>Loading Audio...</div>
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
  const volume = (e) => {
    if (audio?.volume) {
      audio.volume = e.target.value / 100
    }
    // setAudio(audio)
    console.log({ volume: e.target.value })

  }
  return (
    <div className="shadow-lg rounded-lg" >

      <div className="grid grid-cols-2 place-content-evenly border-solid border-2 border-sky-100">
        <img className="max-w-sm rounded hidden md:block" src={data?.imageUrl} alt="Album Pic">
        </img>

        <div className="grid grid-cols-1 place-content-evently m-4">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <h3 className="text-2xl text-grey-darkest font-medium">{data?.song}</h3>
              <div className="text-red-500">
                <Heart />
              </div>
            </div >
            <div className="max-w-md">
              <p className="indent-1.5 text-sm text-grey mt-1">{data?.artist}</p>
            </div>
            <div className="max-w-md">
              <p className="indent-1.5 text-sm text-grey mt-1">{data?.label}</p>
            </div>
            <div className="max-w-md">
              {data?.composer && <p className="indent-1.5 text-sm text-grey mt-1">{data?.composer}</p>}
            </div>
          </div>
          <div className="place-self-center mt-8">
            <PlayPause audio={audio} />
          </div>
          <div className="content-bottom relative pt-1">
            <input
              className="form-range accent-red-400 appearance-none w-full h-1 p-0  focus:outline-none focus:ring-0 focus:shadow-none shadow-slate-50 bg-gray-500 rounded-full"
              onChange={volume}
              id="vol-control" type="range" min="0" max="100" step="1">
            </input>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Player
