// src/app/api/walmart/route.ts
import { NextRequest, NextResponse } from 'next/server'
import cheerio from 'cheerio'

// Run this API route in Node.js (not the Edge runtime)
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  
  if (!url || !url.includes('walmart.com')) {
    return NextResponse.json(
      { error: 'Invalid or missing Walmart URL' },
      { status: 400 }
    )
  }

  try {
    // Fetch the Walmart product page
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Pull out the OpenGraph tags (fallback to <title> if missing)
    const title    = $('meta[property="og:title"]').attr('content') 
                     || $('title').text().trim()
    const imageUrl = $('meta[property="og:image"]').attr('content') || ''
    const price    = $('meta[property="product:price:amount"]').attr('content') || ''
    const currency = $('meta[property="product:price:currency"]').attr('content') || 'USD'

    return NextResponse.json({ title, imageUrl, price, currency, url })
  } catch (err) {
    console.error('Error scraping Walmart product:', err)
    return NextResponse.json(
      { error: 'Failed to scrape product information' },
      { status: 500 }
    )
  }
}
