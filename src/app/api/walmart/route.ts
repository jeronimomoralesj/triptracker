import { NextRequest, NextResponse } from 'next/server'
import { load } from 'cheerio'

// Force this route to run under Node.js (so cheerio works)
// and to always be dynamic (no caching)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  console.log('Walmart API called with URL:', url)

  if (!url || !/^https?:\/\/(www\.)?walmart\.com\/.+$/.test(url)) {
    console.error('Invalid Walmart URL:', url)
    return NextResponse.json(
      { error: 'Invalid or missing Walmart URL' },
      { status: 400 }
    )
  }

  try {
    console.log('Attempting to fetch from Walmart…')
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
          'AppleWebKit/537.36 (KHTML, like Gecko) ' +
          'Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.walmart.com/'
      }
    })

    if (!res.ok) {
      console.error(`Walmart fetch failed: ${res.status} ${res.statusText}`)
      return NextResponse.json(
        { error: `Fetch failed: ${res.status}` },
        { status: res.status }
      )
    }

    const html = await res.text()
    console.log('Fetched HTML length:', html.length)
    if (html.length < 2000) {
      console.warn('Very short HTML, might be bot block:', html.slice(0, 200))
    }

    const $ = load(html)

    // 1) title
    const title =
      $('meta[property="og:title"]').attr('content')?.trim() ||
      $('title').text().trim()

    // 2) try OG image
    let imageUrl = $('meta[property="og:image"]').attr('content') || ''

    // 3) fallback to JSON-LD
    if (!imageUrl) {
      console.log('No OG image; scanning JSON-LD…')
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const data = JSON.parse($(el).html() || '{}')
          const prod = Array.isArray(data)
            ? data.find((d) => d['@type'] === 'Product')
            : data
          if (prod?.image) {
            imageUrl = Array.isArray(prod.image) ? prod.image[0] : prod.image
            console.log('Found JSON-LD image:', imageUrl.slice(0, 100))
          }
        } catch{
          // ignore parse errors
        }
      })
    }

    // 4) final fallback to hero image or first <img>
    if (!imageUrl) {
      console.log('No JSON-LD image; trying fallback <img>…')
      imageUrl =
        $('img.prod-hero-image-image').attr('src') ||
        $('img').first().attr('src') ||
        ''
      if (imageUrl) {
        console.log('Found fallback image:', imageUrl.slice(0, 100))
      } else {
        console.error('No image found in HTML')
      }
    }

    // price + currency
    const price =
      $('meta[property="product:price:amount"]').attr('content')?.trim() || ''
    const currency =
      $('meta[property="product:price:currency"]').attr('content')?.trim() ||
      'USD'

    console.log(
      'Extracted product data:',
      { title: title.slice(0, 50), imageUrl: imageUrl.slice(0, 50), price, currency }
    )

    return NextResponse.json({ title, imageUrl, price, currency, url })
  } catch (err) {
    console.error('Walmart scrape error:', err)
    return NextResponse.json(
      { error: 'Internal error scraping Walmart' },
      { status: 500 }
    )
  }
}
