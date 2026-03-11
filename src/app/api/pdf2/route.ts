import { NextRequest, NextResponse } from 'next/server'
import { Order } from '@/types/door'
import { generatePdf, clientHtml, factoryHtml } from '@/lib/pdf-generator'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { order, type = 'client' }: { order: Order; type?: string } = body

    if (!order) {
      return NextResponse.json({ error: 'Dati ordine mancanti.' }, { status: 400 })
    }

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
    console.error('[POST /api/pdf2]', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
