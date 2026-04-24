import { NextRequest, NextResponse } from 'next/server'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ results: [] })
  }

  if (!YOUTUBE_API_KEY) {
    return NextResponse.json(
      { error: 'YouTube API key não configurada' },
      { status: 500 },
    )
  }

  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/search')
    url.searchParams.set('part', 'snippet')
    url.searchParams.set('type', 'video')
    url.searchParams.set('videoCategoryId', '10') // Music
    url.searchParams.set('maxResults', '6')
    url.searchParams.set('q', q.trim())
    url.searchParams.set('key', YOUTUBE_API_KEY)

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } })

    if (!res.ok) {
      const err = await res.text()
      console.error('YouTube API error:', err)
      return NextResponse.json(
        { error: 'Erro na busca do YouTube' },
        { status: 502 },
      )
    }

    const data = await res.json()

    const results = (data.items ?? []).map((item: any) => ({
      videoId: item.id?.videoId,
      title: item.snippet?.title,
      channel: item.snippet?.channelTitle,
      thumb: item.snippet?.thumbnails?.medium?.url
        ?? item.snippet?.thumbnails?.default?.url,
    }))

    return NextResponse.json({ results })
  } catch (err) {
    console.error('YouTube search error:', err)
    return NextResponse.json(
      { error: 'Erro interno na busca' },
      { status: 500 },
    )
  }
}