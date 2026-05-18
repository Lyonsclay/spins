import '../styles/globals.css'

export const metadata = {
  title: 'Now Spinning',
  description: 'A better way to spin.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
