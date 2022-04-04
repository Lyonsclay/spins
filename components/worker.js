// https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams
//
;

// https://github.com/GoogleChromeLabs/comlink
// https://github.com/vercel/next.js/tree/canary/examples/with-web-worker
// https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent
let chunk = []
addEventListener('message', async (event) => {
  const url = "http://s7.viastreaming.net:8310/;?_=0.494499115526442"
  return fetch(url)
    // Retrieve its body as ReadableStream
    .then(response => {
      const reader = response.body.getReader();

      return new ReadableStream({
        start(controller) {
          return pump();

          function pump() {
            return reader.read().then(({ done, value }) => {
              // When no more data needs to be consumed, close the stream
              if (done) {
                controller.close();
                return;
              }
              // Enqueue the next data chunk into our target stream
               if (chunk.length == 0) {
                 chunk = value
               }

               if (chunk.length > 0 && chunk.length < 1024) {
                 chunk.push(value)
               }


               if (chunk.length >= 1024) {
                 postMessage(chunk)
                 chunk = value
               }

              // postMessage(value)


              controller.enqueue(value);
              return pump();
            });
          }

        }

      })


    })
    .catch(error => console.log({ error }))
    // .then(stream => new Response(stream))
    // .then(response => response.blob())
    // // .then(blob => URL.createObjectURL(blob))
    // .then(blob => {
    //   postMessage(blob)
    // })
  // .catch(err => console.error(err))


  // postMessage("well if that anit something")
})

// web audio process worker
// https://hacks.mozilla.org/2020/05/high-performance-web-audio-with-audioworklet-in-firefox/
//
