// src/app/api/walmart/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { load } from 'cheerio'

// Force this function to run under the Node.js runtime (not the Edge)
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url || !url.includes('walmart.com')) {
    return NextResponse.json({ error: 'Invalid or missing Walmart URL' }, { status: 400 })
  }

  try {
    // server-side fetch with a realistic UA to avoid bot blocks
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `Fetch failed: ${res.status} ${res.statusText}` },
        { status: res.status }
      )
    }

    const html = await res.text()
    const $ = load(html)

    // grab the OpenGraph fields (fallback to <title>)
    const title    = $('meta[property="og:title"]').attr('content') || $('title').text().trim()
    const imageUrl = $('meta[property="og:image"]').attr('content') || ''
    const price    = $('meta[property="product:price:amount"]').attr('content') || ''
    const currency = $('meta[property="product:price:currency"]').attr('content') || 'USD'

    return NextResponse.json({ title, imageUrl, price, currency, url })
  } catch (e) {
    console.error('Walmart scrape error:', e)
    return NextResponse.json({ error: 'Internal error scraping Walmart' }, { status: 500 })
  }
}
