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
      analyser.fftSize = 2048;
      var bufferLength = analyser.fftSize;
    // var bufferLength = analyser.frequencyBinCount;
    var ary = new Uint8Array(bufferLength);
    setDataArray(ary)
  }, [])
  useEffect(() => {
    // setDataArray(getAnalyser())

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const canvasCtx = context
    let frameCount = 0
    let animationFrameId


    const draw = () => {
      if (!dataArray) return
      var bufferLength = analyser.frequencyBinCount;
      frameCount++

      // draw(context, canvas, frameCount)
      // requestAnimationFrame(draw);
      animationFrameId = window.requestAnimationFrame(draw)

      // var dataArray = new Float32Array(bufferLength);


      // analyser.getFloatTimeDomainData(dataArray);
      analyser.getByteFrequencyData(dataArray)

      // if (!dataArray.every(x => x === 0)) console.log({ary:dataArray.slice(0,40)})




      canvasCtx.fillStyle = "#161c22";
      // canvasCtx.fillStyle = "rgb(100, 100, 200)";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "rgb(0, 200, 50)";

      canvasCtx.beginPath();
      // canvasCtx.moveTo(0, canvas.height / 2);
      // canvasCtx.lineTo(canvas.width, canvas.height / 2);

      // var bufferLength = 2048
      var sliceWidth = canvas.width * 1.0 / bufferLength;
      var x = 0;

      for (var i = 0; i < bufferLength; i++) {

        var v = dataArray[i] / 128.0;
        var y = (v * canvas.height ) + 64.0

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      // canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();

    }
    draw()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [canvasRef,dataArray])


  return <canvas className="h-48"ref={canvasRef} {...props} />
}

const App = ({ ...props }) => {
  if (typeof props.analyser.getFloatTimeDomainData !== "function") return <span>Loading Oscilliscope</span>
  return <Oscilliscope {...props} />
}

export default Oscilliscope
