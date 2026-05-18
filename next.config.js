module.exports = {
  distDir: "build",
  async rewrites() {
    return [
      {
        source: "/api/radio",
        destination: "https://patmos.cdnstream.com/proxy/artfmin1/?mp=/stream",
      },
    ]
  },
}
