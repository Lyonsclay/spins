function getTimeRange() {
  const now = new Date()
  const start = new Date(now)
  start.setDate(now.getDate() - 7)

  const to = (d) => d.toISOString().slice(0, 19)
  return { start: to(start), end: to(now) }
}

export async function GET() {
  try {
    const baseUrl = process.env.SPINS_URL
    if (!baseUrl) {
      return Response.json({ error: 'SPINS_URL is not set' }, { status: 500 })
    }

    const { start, end } = getTimeRange()
    const url = `${baseUrl}calendar-feed?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`

    const response = await fetch(url, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return Response.json(
        { error: `Failed to fetch calendar: ${response.status}` },
        { status: 502 }
      )
    }

    const shows = await response.json()
    shows.sort((a, b) => String(b.start).localeCompare(String(a.start)))

    return Response.json(shows)
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch calendar', detail: String(error) },
      { status: 500 }
    )
  }
}
