import { NextRequest, NextResponse } from 'next/server'
import { load } from 'cheerio'

// force Node.js runtime (so cheerio works)
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  
  // Add console log for debugging
  console.log('Walmart API called with URL:', url)
  
  if (!url || !/^https?:\/\/(www\.)?walmart\.com\/.+$/.test(url)) {
    console.error('Invalid Walmart URL:', url)
    return NextResponse.json({ error: 'Invalid or missing Walmart URL' }, { status: 400 })
  }

  try {
    // always fetch fresh & spoof a real UA
    console.log('Attempting to fetch from Walmart...')
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
      console.error(`Walmart fetch failed with status: ${res.status} ${res.statusText}`)
      return NextResponse.json(
        { error: `Fetch failed: ${res.status} ${res.statusText}` },
        { status: res.status }
      )
    }

    const html = await res.text()
    console.log('Fetched HTML length:', html.length)
    
    if (html.length < 1000) {
      console.warn('Very short HTML response, might be blocked. First 200 chars:', html.substring(0, 200))
    }
    
    const $ = load(html)

    // 1) title
    const title = 
      $('meta[property="og:title"]').attr('content')?.trim() ||
      $('title').text().trim()
    
    // 2) image: OG first
    let imageUrl = $('meta[property="og:image"]').attr('content') || ''
    
    // 3) if OG was missing, look for JSON-LD <script>
    if (!imageUrl) {
      console.log('No OG image found, looking for JSON-LD data...')
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const data = JSON.parse($(el).html() || '{}')
          // some pages wrap it in an array
          const product = Array.isArray(data) ? data.find(d => d['@type']==='Product') : data
          if (product?.image) {
            imageUrl = Array.isArray(product.image)
              ? product.image[0]
              : product.image
            console.log('Found image in JSON-LD:', imageUrl.substring(0, 100))
          }
        } catch (err) { 
          console.error('Error parsing JSON-LD:', err) 
        }
      })
    }
    
    // 4) final fallback: any <img> with "hero" class or first <img>
    if (!imageUrl) {
      console.log('No JSON-LD image, trying hero image or first image...')
      imageUrl = 
        $('img.prod-hero-image-image').attr('src') ||
        $('img').first().attr('src') ||
        ''
      
      if (imageUrl) {
        console.log('Found fallback image:', imageUrl.substring(0, 100))
      } else {
        console.error('No image found in the HTML')
      }
    }
    
    // price + currency
    const price = $('meta[property="product:price:amount"]').attr('content')?.trim() || ''
    const currency = $('meta[property="product:price:currency"]').attr('content')?.trim() || 'USD'
    
    console.log('Extracted product data:', { 
      title: title?.substring(0, 50), 
      imageUrl: imageUrl?.substring(0, 50), 
      price, 
      currency 
    })

    return NextResponse.json({ title, imageUrl, price, currency, url })
  } catch (err) {
    console.error('Walmart scrape error:', err)
    return NextResponse.json(
      { error: 'Internal error scraping Walmart' },
      { status: 500 }
    )
  }
}