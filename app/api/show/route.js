import * as cheerio from 'cheerio'

function safeText(node) {
  return node?.text()?.trim() || ''
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')

    if (!path) {
      return Response.json({ error: 'Missing query param: path' }, { status: 400 })
    }

    const targetUrl = `https://spinitron.com${path}`
    const response = await fetch(targetUrl, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return Response.json(
        { error: `Failed to fetch show page: ${response.status}` },
        { status: 502 }
      )
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    const data = $('div.data').first()
    const playlist = $('div.playlist').first()

    const out = {
      title: safeText(data.find('h3.show-title a').first()),
      timeslot: safeText(data.find('p.timeslot').first()),
      category: safeText(data.find('p.show-categoty').first()),
      dj: safeText(data.find('p.dj-name a').first()),
      image: playlist.find('div.image img').first().attr('src') || '',
      description: safeText(data.find('div.description').first()),
    }

    return Response.json(out)
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch show', detail: String(error) },
      { status: 500 }
    )
  }
}
