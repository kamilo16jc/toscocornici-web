import { NextRequest, NextResponse } from 'next/server'
import { Order } from '@/types/door'

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

    // Save to /tmp (writable on Vercel serverless)
    try {
      const fs = await import('fs')
      const path = await import('path')
      const dir = path.join('/tmp', 'orders')
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(path.join(dir, `${orderId}.json`), JSON.stringify(order, null, 2), 'utf-8')
    } catch {
      // Filesystem save is best-effort; order data is returned in the response
    }

    return NextResponse.json({ orderId, orderNumber, order })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Errore sconosciuto'
    console.error('[POST /api/orders]', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const fs = await import('fs')
    const path = await import('path')
    const dir = path.join('/tmp', 'orders')
    if (!fs.existsSync(dir)) return NextResponse.json({ orders: [] })

    const files = fs.readdirSync(dir).filter((f: string) => f.endsWith('.json'))
    const orders = files.map((f: string) => {
      const content = fs.readFileSync(path.join(dir, f), 'utf-8')
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
    }).sort((a: {createdAt: Date}, b: {createdAt: Date}) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json({ orders })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Errore sconosciuto'
    console.error('[GET /api/orders]', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
