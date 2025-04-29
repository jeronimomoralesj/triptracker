// src/app/api/walmart/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { load } from 'cheerio'

// force Node.js runtime (so cheerio works)
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url || !/^https?:\/\/(www\.)?walmart\.com\/.+$/.test(url)) {
    return NextResponse.json({ error: 'Invalid or missing Walmart URL' }, { status: 400 })
  }

  try {
    // always fetch fresh & spoof a real UA
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
    console.log('Fetched HTML length:', html.length)
    const $ = load(html)

    // 1) title
    const title =
      $('meta[property="og:title"]').attr('content')?.trim() ||
      $('title').text().trim()

    // 2) image: OG first
    let imageUrl = $('meta[property="og:image"]').attr('content') || ''

    // 3) if OG was missing, look for JSON-LD <script>
    if (!imageUrl) {
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const data = JSON.parse($(el).html() || '{}')
          // some pages wrap it in an array
          const product = Array.isArray(data) ? data.find(d => d['@type']==='Product') : data
          if (product?.image) {
            imageUrl = Array.isArray(product.image)
              ? product.image[0]
              : product.image
          }
        } catch { /* skip invalid JSON */ }
      })
    }

    // 4) final fallback: any <img> with “hero” class or first <img>
    if (!imageUrl) {
      imageUrl =
        $('img.prod-hero-image-image').attr('src') ||
        $('img').first().attr('src') ||
        ''
    }

    // price + currency
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
