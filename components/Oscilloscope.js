'use client'

import React, { useRef, useState, useEffect } from 'react'


// const getAnalyser = () => {
//   var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

//   // ...

//   var analyser = audioCtx.createAnalyser();
//   analyser.fftSize = 2048;

//   var bufferLength = analyser.frequencyBinCount;
//   var dataArray = new Uint8Array(bufferLength);
//   analyser.getByteTimeDomainData(dataArray);
//   return dataArray

// }
const Oscilliscope = ({ analyser, ...props }) => {

  // const { draw, ...rest } = props
  const canvasRef = useRef(null)
  const [dataArray, setDataArray] = useState()

  useEffect(() => {
    if (!analyser?.frequencyBinCount) return
    const bufferLength = analyser.frequencyBinCount
    const ary = new Uint8Array(bufferLength)
    setDataArray(ary)
  }, [analyser])
  useEffect(() => {
    if (!dataArray || !analyser?.getByteFrequencyData) return

    const canvas = canvasRef.current
    if (!canvas) return

    const canvasCtx = canvas.getContext('2d')
    if (!canvasCtx) return

    canvasCtx.setTransform(1, 0, 0, 1, 0, 0)

    let animationFrameId

    const draw = () => {
      const bufferLength = analyser.frequencyBinCount

      canvasCtx.fillStyle = '#161c22'
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height)
      canvasCtx.lineWidth = 2
      canvasCtx.strokeStyle = 'rgb(180, 200, 50)'
      canvasCtx.beginPath()

      const sliceWidth = canvas.width * 1.5 / bufferLength + 1
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 118.0
        const y = -0.72 * (v * canvas.height) / Math.log2(6.5 / v) + canvas.height
        if (dataArray[i] !== 0) {
          canvasCtx.lineTo(x, y)
        }
        x += sliceWidth
      }

      canvasCtx.stroke()
      analyser.getByteFrequencyData(dataArray)
      animationFrameId = window.requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [analyser, dataArray])


  return <canvas className="h-32" ref={canvasRef} {...props} />
}

export default Oscilliscope
