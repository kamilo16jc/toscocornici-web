// Required for next static export (API routes are excluded from the output)
export const dynamic = 'force-static'

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Order } from '@/types/door'

const ORDERS_DIR = path.join(process.cwd(), 'data', 'orders')

function generateOrderNumber(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const rand = String(Math.floor(Math.random() * 9000) + 1000)
  return `TC-${y}${m}${d}-${rand}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { config, customer, notes } = body

    if (!config || !customer?.name || !customer?.email) {
      return NextResponse.json(
        { error: 'Dati mancanti: configurazione, nome e email sono obbligatori.' },
        { status: 400 }
      )
    }

    const orderId = crypto.randomUUID()
    const orderNumber = generateOrderNumber()

    const order: Order = {
      id: orderId,
      orderNumber,
      clientName: customer.name,
      clientEmail: customer.email,
      clientPhone: customer.phone || undefined,
      clientCompany: customer.company || undefined,
      items: [
        {
          id: `${orderId}-1`,
          position: 1,
          configuration: config,
          quantity: 1,
        },
      ],
      status: 'confirmed',
      createdAt: new Date(),
      notes: notes || config.notes || undefined,
    }

    // Save to filesystem
    if (!fs.existsSync(ORDERS_DIR)) {
      fs.mkdirSync(ORDERS_DIR, { recursive: true })
    }
    fs.writeFileSync(
      path.join(ORDERS_DIR, `${orderId}.json`),
      JSON.stringify(order, null, 2),
      'utf-8'
    )

    return NextResponse.json({ orderId, orderNumber })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Errore sconosciuto'
    console.error('[POST /api/orders]', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET() {
  try {
    if (!fs.existsSync(ORDERS_DIR)) {
      return NextResponse.json({ orders: [] })
    }
    const files = fs.readdirSync(ORDERS_DIR).filter(f => f.endsWith('.json'))
    const orders = files.map(f => {
      const content = fs.readFileSync(path.join(ORDERS_DIR, f), 'utf-8')
      const o: Order = JSON.parse(content)
      return {
        id: o.id,
        orderNumber: o.orderNumber,
        clientName: o.clientName,
        clientEmail: o.clientEmail,
        clientCompany: o.clientCompany,
        status: o.status,
        createdAt: o.createdAt,
        itemCount: o.items.length,
      }
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ orders })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Errore sconosciuto'
    console.error('[GET /api/orders]', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
