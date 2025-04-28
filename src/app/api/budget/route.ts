import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

// Parse the service-account JSON from an env var:
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON!)

// Construct your GoogleAuth with those in-memory creds:
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})

type SheetRow = (string|number|null)[]

function normalize(/* …exactly as before… */) { /* … */ }

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type')
  const client = await auth.getClient()
  const sheets = google.sheets({ version: 'v4', auth: client })
  const id = '1XtWUj8TaDLItraVPvCGk2tB2QSLxyy_NWe2XMJS5oCk'

  if (!type) {
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

  if (type === 'desayuno' || type === 'cena') {
    const range = type === 'desayuno'
      ? 'Sheet1!C27:E30'
      : 'Sheet1!H27:J31'
    const rows = (await sheets.spreadsheets.values.get({ spreadsheetId: id, range }))
      .data.values as SheetRow[]
    return NextResponse.json({ items: normalize(rows, true, 'Detalles') })
  }

  if (type === 'extras') {
    const rows = (await sheets.spreadsheets.values.get({
      spreadsheetId: id,
      range: 'Sheet1!I7:K15',
    })).data.values as SheetRow[]
    return NextResponse.json({ items: normalize(rows, true, 'Snacks') })
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}
