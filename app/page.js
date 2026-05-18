import Player from '../components/Player'
import Shows from '../components/Calendar'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-[#0d1118]">
      <main className="flex flex-col p-0 mt-8 max-w-4xl">
        <div className="bg-[#161c22]">
          <Player />
        </div>
        <br />
        <br />
        <div className="h-[50vh] overflow-auto">
          <Shows />
        </div>
      </main>
    </div>
  )
}
