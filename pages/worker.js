import { useEffect, useRef, useCallback, useState } from 'react'

export default function Index() {
  const workerRef = useRef()
  const audioRef = useRef()
  const [context, setContext] = useState()
  const [source, setSource] = useState()
  const [worklet, setWorklet] = useState()
  const [userHasClicked, setUserHasClicked] = useState(false)

  // async function createAudioProcessor() {
  //   if (!audioContext) {
  //     try {
  //       audioContext = new (window.AudioContext || window.webkitAudioContext)();
  //       await audioContext.resume();
  //       await audioContext.audioWorklet.addModule("module-url/module.js");
  //     } catch (e) {
  //       return null;
  //     }
  //   }

  //   return new AudioWorkletNode(audioContext, "audio-worklet");
  // }

  useEffect(() => {
    const initAudio = async () => {
      let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      await audioCtx.resume()
      // await audioCtx.audioWorklet.addModule("worklet.js");
      await audioCtx.audioWorklet.addModule("shared-buffer-worklet-processor.js");
      let worklet = new AudioWorkletNode(audioCtx, "audio-worklet");
      let init = audioCtx.createBufferSource();
      // await init.connect(audioCtx.destination);
      await worklet.connect(audioCtx.destination)
      // let gainNode = audioCtx.createGain();
      // gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
      // gainNode.connect(audioCtx.destination)

      setWorklet(worklet)
      setContext(audioCtx)
      setSource(init)
    }
    userHasClicked && initAudio()
  }, [userHasClicked])

  useEffect(() => {
    workerRef.current = new Worker(new URL('../components/worker.js', import.meta.url))
    workerRef.current.onmessage = async (evt) => {
      await evt.data

      let nowBuffering0
      console.log("new message <<< ----------0000")
      // source.start();
      while (evt.data && worklet) {
        worklet.port.postMessage(evt.data)
        console.log(`WebWorker Response => ${evt.data}`)
        console.log({ dataType: typeof evt.data })
        // var blob = new Blob([evt.data], { type: 'audio/mp3' })
        // var blobURL = window.URL.createObjectURL(blob);
        // audioRef.current.src = blobURL

        // Create an empty three-second stereo buffer at the sample rate of the AudioContext
        // console.log({ dataLength: evt.data.length, duration: audioCtx.sampleRate * 3 })
        // const rate = evt.data.length /audioCtx.sampleRate
        // var myArrayBuffer = audioCtx.createBuffer(2, evt.data.length, audioCtx.sampleRate);

        // Fill the buffer with white noise;
        // just random values between -1.0 and 1.0
        // for (var channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
        // This gives us the actual ArrayBuffer that contains the data
        let srcBuffer = Int8Array.from(evt.data).buffer
        let audioBuffer = await context.decodeAudioData(srcBuffer)
        // source.buffer = buffer;
        // init.loop = true;
        // use the decoded data here
        // let nowBuffering0 = audioBuffer.getChannelData(0);

        nowBuffering0 = context.createBuffer(2, evt.data.length, context.sampleRate);
        // var blength = nowBuffering.length
        // console.log({ blength })
        for (var i = 0; i < audioBuffer.length; i++) {
          // Math.random() is in [0; 1.0]
          // audio needs to be in [-1.0; 1.0]
          if (evt.data[i] !== undefined) {
            // console.log({ evtData: evt.data[i], bufferLast: nowBuffering0[i - 1] })

            nowBuffering0[i] = (evt.data[i] - (256 / 2)) / (256 / 2);

          }
        }
        // if (nowBuffering0.length) {
        //   console.log("time to play ----->>>>")

        // source.buffer = audioBuffer
        //   source.start(0)
        // }
      }
      // event data (undefined) ** buffer last NaN
      // Get an AudioBufferSourceNode.
      // This is the AudioNode to use when we want to play an AudioBuffer
      // var source = audioCtx.createBufferSource();
      // set the buffer in the AudioBufferSourceNode
      // source.buffer = myArrayBuffer;
      // connect the AudioBufferSourceNode to the
      // destination so we can hear the sound
      // source.connect(audioCtx.destination);
      // start the source playing

      source.buffer = nowBuffering0
      source.start(0)
    }
    return () => {
      workerRef.current.terminate()
    }
  }, [source, context])

  const startAudio = useCallback(() => {
    audioRef.current.play().then(() => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }).catch(error => console.log({ error }))
  }, [])
  const handleWork = useCallback(() => {
    workerRef.current.postMessage(100000)
    setUserHasClicked(true)
    // startAudio()
  }, [])

  return (
    <div>
      <p>Do work in a WebWorker!</p>
      <button className="bg-blue-400" onClick={handleWork}>Load Audio</button>
      <button className="bg-yellow-400" onClick={() => source.start()}>Play Audio</button>
      <audio ref={audioRef} />
    </div>
  )
}
