// const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

// module.exports = {
//   async rewrites(phase) {
//     if (phase === PHASE_DEVELOPMENT_SERVER) {
//       console.log({ phase })
//       return {
//         beforeFiles: [
//           {
//             source: '/api/spinning',
//             destination: 'https://api-spinning.herokuapp.com/',
//           },
//         ]
//       }
//     } else {
//       return {
//         beforeFiles: [
//           {
//             source: '/api/spinning',
//             destination: 'http://s7.viastreaming.net:8310/;?=0.494499115526442',
//           },
//         ]
//       }
//     }
//   },
// }
module.exports = {
  distDir: "build",
  async rewrites() {
    return [
      {
        source: "/api/radio",
        destination: "http://s7.viastreaming.net:8310/;?=0.494499115526442",
      },
    ];
  },
};
