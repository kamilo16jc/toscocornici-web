// Required for next static export (API routes are excluded from the output)
export const dynamic = 'force-static'

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Order } from '@/types/door'
import { generatePdf, clientHtml, factoryHtml } from '@/lib/pdf-generator'

const ORDERS_DIR = path.join(process.cwd(), 'data', 'orders')

export async function GET(req: NextRequest) {
  try {
    const orderId = req.nextUrl.searchParams.get('orderId')
    const type = req.nextUrl.searchParams.get('type') || 'client'

    if (!orderId) {
      return NextResponse.json({ error: 'orderId richiesto.' }, { status: 400 })
    }

    const orderPath = path.join(ORDERS_DIR, `${orderId}.json`)
    if (!fs.existsSync(orderPath)) {
      return NextResponse.json({ error: 'Ordine non trovato.' }, { status: 404 })
    }

    const order: Order = JSON.parse(fs.readFileSync(orderPath, 'utf-8'))
    const html = type === 'factory' ? factoryHtml(order) : clientHtml(order)
    const pdf = await generatePdf(html)

    const filename = type === 'factory'
      ? `TOSCOCORNICI-Tecnico-${order.orderNumber}.pdf`
      : `TOSCOCORNICI-Ordine-${order.orderNumber}.pdf`

    return new NextResponse(pdf as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Errore sconosciuto'
    console.error('[GET /api/pdf2]', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
