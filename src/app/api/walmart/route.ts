// src/app/api/walmart/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { load } from 'cheerio'

// 1️⃣ force Node.js runtime
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url || !/^https?:\/\/(www\.)?walmart\.com\/.+$/.test(url)) {
    return NextResponse.json({ error: 'Invalid or missing Walmart URL' }, { status: 400 })
  }

  try {
    // 2️⃣ disable caching & spoof a real browser UA
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
          'AppleWebKit/537.36 (KHTML, like Gecko) ' +
          'Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    if (!res.ok) {
      return NextResponse.json(
        { error: `Fetch failed: ${res.status} ${res.statusText}` },
        { status: res.status }
      )
    }

    const html = await res.text()
    console.log('Fetched HTML length:', html.length) // check in Vercel logs
    const $ = load(html)

    // 3️⃣ pull OpenGraph or fall back to page title
    const title = 
      $('meta[property="og:title"]').attr('content')?.trim() 
      || $('title').text().trim()

    // 4️⃣ pull OG image or fall back to the "hero" product image
    let imageUrl = $('meta[property="og:image"]').attr('content') || ''
    if (!imageUrl) {
      imageUrl =
        $('img.prod-hero-image-image').attr('src') 
        || $('img').first().attr('src') 
        || ''
    }

    // price/currency OG tags
    const price    = $('meta[property="product:price:amount"]').attr('content')?.trim() || ''
    const currency = $('meta[property="product:price:currency"]').attr('content')?.trim() || 'USD'

    return NextResponse.json({ title, imageUrl, price, currency, url })
  } catch (err) {
    console.error('Walmart scrape error:', err)
    return NextResponse.json(
      { error: 'Internal error scraping Walmart' },
      { status: 500 }
    )
  }
}
