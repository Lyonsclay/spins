

import { useEffect, useRef, useCallback } from 'react'

export default function Index() {
  const workerRef = useRef()
  const audioRef = useRef()
  useEffect(() => {
    workerRef.current = new Worker(new URL('../components/worker.js', import.meta.url))
    workerRef.current.onmessage = (evt) => {
    console.log(`WebWorker Response => ${evt.data}`)
    console.log({ dataType: typeof evt.data })
    var blobURL = window.URL.createObjectURL(evt.data);
    audioRef.current.blobURL = blobURL
    audioRef.current.play()
    }
    return () => {
      workerRef.current.terminate()
    }
  }, [])

  const handleWork = useCallback(async () => {
    workerRef.current.postMessage(100000)
  }, [])

  return (
    <div>
      <p>Do work in a WebWorker!</p>
      <button className="bg-blue-400" onClick={handleWork}>Play Audio</button>
<audio ref={audioRef}/>
    </div>
  )
}
