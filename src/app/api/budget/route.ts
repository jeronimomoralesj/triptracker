// src/app/api/budget/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import path from 'path'

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), 'credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})

// define a proper row type instead of `any[][]`
type SheetRow = (string | number | null)[]

function normalize(
  rows: SheetRow[],
  hasLink = false,
  dateIdentifier: string | null = null
) {
  return rows
    .filter(r => r[0] != null && r[1] != null)
    .map<{
      name: string
      price: number
      date?: string
      link?: string
    }>(r => {
      let name = String(r[0]).trim()
      let date = dateIdentifier

      // strip any in-cell date tags
      if (name.includes('Junio 1')) {
        date = 'Junio 1'
        name = name.replace('Junio 1', '').trim()
      } else if (name.includes('Junio 2')) {
        date = 'Junio 2'
        name = name.replace('Junio 2', '').trim()
      } else if (name.includes('Junio 3')) {
        date = 'Junio 3'
        name = name.replace('Junio 3', '').trim()
      }

      return {
        name,
        price: Number(r[1]) || 0,
        ...(date ? { date } : {}),
        ...(hasLink && r[2] != null ? { link: String(r[2]) } : {})
      }
    })
}

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type') // desayuno | cena | extras or null
  const client = await auth.getClient()
  const sheets = google.sheets({ version: 'v4', auth: client })
  const id = '1XtWUj8TaDLItraVPvCGk2tB2QSLxyy_NWe2XMJS5oCk'

  // 1) Totals
  if (!type) {
    const resp = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: id,
      ranges: ['Sheet1!D20', 'Sheet1!G12', 'Sheet1!J24'],
    })
    const [d20, g12, j24] = resp.data.valueRanges!
    return NextResponse.json({
      breakfast: Number(d20.values?.[0]?.[0]) || 0,
      lunch: Number(g12.values?.[0]?.[0]) || 0,
      extras: Number(j24.values?.[0]?.[0]) || 0,
    })
  }

  // 2) Desayunos — only "detalles" section, C27:D30 plus links in E
  if (type === 'desayuno') {
    const detail = (
      await sheets.spreadsheets.values.get({
        spreadsheetId: id,
        range: 'Sheet1!C27:E30',
      })
    ).data.values as SheetRow[]

    return NextResponse.json({
      items: normalize(detail, true, 'Detalles'),
    })
  }

  // 3) Cena — only "detalles" section, H27:I31 plus links in J
  if (type === 'cena') {
    const detail = (
      await sheets.spreadsheets.values.get({
        spreadsheetId: id,
        range: 'Sheet1!H27:J31',
      })
    ).data.values as SheetRow[]

    return NextResponse.json({
      items: normalize(detail, true, 'Detalles'),
    })
  }

  // 4) Complementario (extras): I7:K15
  if (type === 'extras') {
    const all = (
      await sheets.spreadsheets.values.get({
        spreadsheetId: id,
        range: 'Sheet1!I7:K15',
      })
    ).data.values as SheetRow[]

    return NextResponse.json({
      items: normalize(all, true, 'Snacks'),
    })
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}
