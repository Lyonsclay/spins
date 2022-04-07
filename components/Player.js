import React, {
  useEffect,
  useState,
  useRef
} from 'react'
import dynamic from 'next/dynamic'
import Oscilliscope from './Oscilliscope'


import { HeartIcon, PlayIcon, PauseIcon, MusicNoteIcon } from '@heroicons/react/solid'
import { HeartIcon as ArtIcon }  from '@heroicons/react/outline'
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

const PlayPause = ({ audio, init }) => {
  const [play, setPlay] = useState("music-note")
  const togglePlay = () => {
    if (typeof audio.play !== "function") {
      setPlay(false)
      return init()
    }
    const promise = play ? audio.pause() : audio.play()
    if (promise !== undefined) {
      promise.then(_ => {
        // Autoplay started!
        console.log("Play Pause you choose!!")
      }).catch(error => {
        console.log({ error })
        // Autoplay was prevented.
        // Show a "Play" button so that user can start playback.
      });
    }
    setPlay(!play)
  }
  const start = play === "music-note"
  // const togglePlay = () => Promise.resolve(playPause).then(() => setPlay(!play))
  // if (typeof audio.play !== "function") return <span>Web audio not ready!</span>
  return (
    <button onClick={togglePlay}>
      {audio && !start && (play ?
        <PauseIcon className="fill-red-500 w-10 h-14" />
        : <PlayIcon className="text-red-500  w-10 h-14" />) ||
       <div className="gravity rounded-full w-10 h-10">
       <MusicNoteIcon className="text-[#161c22] w-8 h-8 pl-2 pt-2" /></div>}
    </button>
  )

}

const PlayerImage = ({ url }) => {
  const defaultImage = "https://spinitron.com/static/pictures/placeholders/loudspeaker.svg"
  if (!url || url == defaultImage) {
    return <MusicNoteIcon className=" gravity lg:w-[445px] lg:h-[445px]" />
  } else {
    return (
      <img className="rounded w-xl h-xl"
        src={url} alt="Album Pic">
      </img>

    )
  }
}

const Player = () => {
  const { data, error } = useSWR('/api/spins', fetcher)
  const url = process.env.NODE_ENV === "production" ? "https://api-spinning.herokuapp.com/" : "http://s7.viastreaming.net:8310/;?=0.494499115526442"
  const [audio, setAudio] = useState({})
  const sliderRef = useRef()
  const [analyser, setAnalyser] = useState([])
  const initAudio = () => {
    if (typeof audio?.play === "function") return
    const newAudio = new Audio(url)
    newAudio.crossOrigin = "anonymous"
    setAudio(newAudio)
  }
  useEffect(() => {
    (typeof audio?.addEventListener === "function") && audio?.addEventListener("canplay", function() {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const newAnalyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaElementSource(audio);
      const gainNode = audioCtx.createGain()
      source.connect(gainNode);
      gainNode.connect(newAnalyser);
      newAnalyser.connect(audioCtx.destination)
      // newAnalyser.fftSize = 2048;
      // newAnalyser.minDecibels = -90;
      // newAnalyser.maxDecibels = -10;
      // newAnalyser.smoothingTimeConstant = 0.85;
      setAnalyser(newAnalyser)
    });
  }, [audio, analyser])
  // if (error) return <div className="text-slate-100">Failed to load {JSON.stringify(error)}</div>
  // if (!data) return <div>Loading...</div>
  const volume = (e) => {
    if (audio?.volume && e.target.value > 0) {
      audio.volume = e.target.value / 100
    }
  }
  return (
    <div className="border-solid border border-slate-600  rounded shadow-lg pt-0 pr-1 max-width-8" >

      <div className="grid grid-cols-2 place-content-evenly">

        <div className="grid-cols-1 md:block">
          <PlayerImage url={data?.imageUrl} />
        </div>

        <div className="grid grid-cols-1 place-content-between m-4 ml-8 mb-8">

          <div className="flex flex-col mb-8">
            <div className="flex flex-row justify-between">
              <h3 className="mt-6 text-2xl text-gray-200 font-medium">{data?.song}</h3>
              <div className="text-red-500">
                <ArtIcon className="text-red-500  w-8 h-8" />
              </div>
            </div >
            <div className="max-w-md">
              <p className="indent-1.5 text-sm text-gray-500 mt-1">{data?.artist}</p>
            </div>
            <div className="max-w-md">
              <p className="indent-1.5 text-sm text-gray-400 mt-1">{data?.label}</p>
            </div>
            <div className="max-w-md">
              {data?.composer && <p className="indent-1.5 text-sm text-grey mt-1">{data?.composer}</p>}
            </div>
          </div>
          <div className="flex flex-col">
            {analyser?.getByteFrequencyData && audio?.play ?
              <Oscilliscope className="h-32" analyser={analyser} />
              : <div className="h-32" />
            }
          </div>
          <div className="place-self-center">
            <PlayPause audio={audio} init={initAudio} />
          </div>

          <div className="content-bottom relative">
              <input
                className="form-range accent-red-400 w-full h-1 focus:outline-none focus:ring-0 focus:shadow-none rounded-full"
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
