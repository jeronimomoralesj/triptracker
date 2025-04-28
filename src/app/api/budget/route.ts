// src/app/api/budget/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import path from 'path'

// pick up the path to your ignored JSON key
const keyFile =
  process.env.GOOGLE_APPLICATION_CREDENTIALS
  ?? path.join(process.cwd(), 'credentials.json')

const auth = new google.auth.GoogleAuth({
  keyFile,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})

type SheetRow = (string|number|null)[]

function normalize(
  rows: SheetRow[],
  hasLink = false,
  dateIdentifier: string|null = null
) {
  return rows
    .filter(r => r[0] != null && r[1] != null)
    .map<{name:string;price:number;date?:string;link?:string}>(r => {
      let name = String(r[0]).trim()
      let date = dateIdentifier

      ;['Junio 1','Junio 2','Junio 3'].forEach(tag => {
        if (name.includes(tag)) {
          date = tag
          name = name.replace(tag, '').trim()
        }
      })

      return {
        name,
        price: Number(r[1])||0,
        ...(date ? { date } : {}),
        ...(hasLink && r[2]!=null ? { link: String(r[2]) } : {})
      }
    })
}

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type')  // desayuno|cena|extras|null
  const client = await auth.getClient()
  const sheets = google.sheets({ version: 'v4', auth: client })
  const id = '1XtWUj8TaDLItraVPvCGk2tB2QSLxyy_NWe2XMJS5oCk'

  if (!type) {
    // Totals
    const { data } = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: id,
      ranges: ['Sheet1!D20','Sheet1!G12','Sheet1!J24'],
    })
    const [d20,g12,j24] = data.valueRanges!
    return NextResponse.json({
      breakfast: Number(d20.values?.[0]?.[0])||0,
      lunch:     Number(g12.values?.[0]?.[0])||0,
      extras:    Number(j24.values?.[0]?.[0])||0,
    })
  }

  // detalles only
  if (type === 'desayuno' || type === 'cena') {
    const range = type === 'desayuno'
      ? 'Sheet1!C27:E30'
      : 'Sheet1!H27:J31'
    const rows = (await sheets.spreadsheets.values.get({
      spreadsheetId: id, range
    })).data.values as SheetRow[]
    return NextResponse.json({
      items: normalize(rows, true, 'Detalles')
    })
  }

  if (type === 'extras') {
    const rows = (await sheets.spreadsheets.values.get({
      spreadsheetId: id, range: 'Sheet1!I7:K15'
    })).data.values as SheetRow[]
    return NextResponse.json({
      items: normalize(rows, true, 'Snacks')
    })
  }

  return NextResponse.json({ error:'Invalid type' }, { status:400 })
}
