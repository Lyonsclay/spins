// https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams
//
;

// https://github.com/GoogleChromeLabs/comlink
// https://github.com/vercel/next.js/tree/canary/examples/with-web-worker
// https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent
addEventListener('message',  (event) => {
  const url = "http://s7.viastreaming.net:8310/;?_=0.494499115526442"


  res = fetch(url)
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
              controller.enqueue(value);
              return pump();
            });
          }
        }
      })
    })
        .then(stream => new Response(stream))
        .then(response => response.blob())
        .then(blob => URL.createObjectURL(blob))
        .then(postMessage)
      // .catch(err => console.error(err))


  // postMessage(res)
})
