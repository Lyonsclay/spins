import * as cheerio from 'cheerio'

function safeText(node) {
  return node?.text()?.trim() || ''
}

export async function GET() {
  try {
    const baseUrl = process.env.SPINS_URL
    if (!baseUrl) {
      return Response.json({ error: 'SPINS_URL is not set' }, { status: 500 })
    }

    const response = await fetch(baseUrl, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return Response.json(
        { error: `Failed to fetch spins page: ${response.status}` },
        { status: 502 }
      )
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    const row = $('#public-spins-0 table tr').first()
    if (!row || row.length === 0) {
      return Response.json({})
    }

    const artSrc = row.find('td.spin-art img').attr('src') || ''
    const imageUrl = artSrc.replace('170x170', '600x600')

    const infoCell = row.find('td').eq(2)
    const payload = {
      artist: safeText(infoCell.find('span.artist').first()),
      song: safeText(infoCell.find('span.song').first()),
      composer: safeText(infoCell.find('span.composer').first()),
      release: safeText(infoCell.find('span.release').first()),
      label: safeText(infoCell.find('span.label').first()),
      imageUrl,
      timestamp: new Date().toISOString(),
    }

    return Response.json(payload)
  } catch (error) {
    return Response.json(
      { error: 'Failed to parse current spin', detail: String(error) },
      { status: 500 }
    )
  }
}
