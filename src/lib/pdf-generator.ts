import { Order } from '@/types/door'

const WOOD_IT: Record<string, string> = {
  TOULIPIER: 'Toulipier (Liriodendro)',
  PINO:      'Pino',
  ROVERE:    'Rovere (Quercia)',
  CASTAGNO:  'Castagno',
  FRASSINO:  'Frassino',
  CILIEGIO:  'Ciliegio',
  NOCINO:    'Nocino (Noce)',
}

const FINISH_IT: Record<string, string> = {
  GREZZO:     'Grezzo (naturale)',
  VERNICIATA: 'Verniciata',
  LACCATA:    'Laccata',
  RAL_9010:   'Laccata RAL 9010 (Bianco puro)',
  RAL_9016:   'Laccata RAL 9016 (Bianco traffico)',
}

const OPENING_IT: Record<string, string> = {
  SX:         'Apertura sinistra',
  DX:         'Apertura destra',
  SX_2A:      '2 ante — sinistra',
  DX_2A:      '2 ante — destra',
  SCRIGNO:    'Scorrevole in parete (scrigno)',
  SCORREVOLE: 'Scorrevole su binario',
}

const PANEL_IT: Record<string, string> = {
  LISCIO:  'Liscio',
  BUGNA_1: '1 Bugna',
  BUGNA_3: '3 Bugne',
  VETRO:   'Con vetro',
  TABLÒ:   'Tablò',
}

export function clientHtml(order: Order): string {
  const date = new Date(order.createdAt).toLocaleDateString('it-IT', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  const rows = order.items.map(item => {
    const c = item.configuration
    const topLight = c.hasTopLight ? `<br><small>Sopraluce: ${c.topLightHeight || 300} mm</small>` : ''
    return `
      <tr>
        <td style="text-align:center">${item.position}</td>
        <td><strong>${c.model.name}</strong><br><small style="color:#888">${c.model.code}</small></td>
        <td style="text-align:center"><strong>${c.width} × ${c.height}</strong> mm${topLight}</td>
        <td>${WOOD_IT[c.wood] || c.wood}</td>
        <td>${FINISH_IT[c.finish] || c.finish}</td>
        <td>${OPENING_IT[c.opening] || c.opening}</td>
        <td>${PANEL_IT[c.panel] || c.panel}</td>
        <td style="text-align:center">${item.quantity}</td>
      </tr>
    `
  }).join('')

  const notesSection = order.notes
    ? `<div style="margin-top:24px;background:#fef9f0;border:1px solid #e5c88a;border-radius:8px;padding:16px;">
         <strong style="font-size:12px;color:#92400e;">NOTE</strong>
         <p style="margin-top:6px;font-size:12px;color:#555;">${order.notes}</p>
       </div>`
    : ''

  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #333; padding: 40px; font-size: 13px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 3px solid #92400e; }
  .brand h1 { font-size: 26px; color: #92400e; letter-spacing: 4px; font-weight: 900; }
  .brand p { font-size: 10px; color: #aaa; margin-top: 4px; }
  .order-info { text-align: right; font-size: 11px; color: #666; }
  .order-num { font-size: 20px; font-weight: bold; color: #333; }
  .order-date { color: #888; }
  h2 { font-size: 11px; color: #92400e; margin: 24px 0 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; }
  .client-box { background: #fef9f0; border: 1px solid #e5c88a; border-radius: 8px; padding: 14px 18px; }
  .client-box .client-name { font-size: 15px; font-weight: bold; color: #333; margin-bottom: 4px; }
  .client-box p { font-size: 11px; color: #666; line-height: 1.8; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 4px; }
  thead tr { background: #92400e; color: white; }
  th { padding: 9px 10px; text-align: left; font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 8px 10px; border-bottom: 1px solid #ececec; vertical-align: top; }
  tr:nth-child(even) td { background: #fafafa; }
  .sig-row { display: flex; gap: 40px; margin-top: 50px; }
  .sig { flex: 1; border-top: 1px solid #ccc; padding-top: 6px; font-size: 10px; color: #999; }
  .footer { margin-top: 30px; padding-top: 12px; border-top: 1px solid #e5e5e5; font-size: 9px; color: #bbb; text-align: center; line-height: 1.6; }
  small { color: #888; font-size: 10px; }
</style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <h1>TOSCOCORNICI</h1>
      <p>Torrita di Siena (SI) · Lavorazione porte e finestre dal 1998</p>
    </div>
    <div class="order-info">
      <div class="order-num">N° ${order.orderNumber}</div>
      <div class="order-date">${date}</div>
    </div>
  </div>

  <h2>Dati cliente</h2>
  <div class="client-box">
    <div class="client-name">${order.clientName}${order.clientCompany ? ` — ${order.clientCompany}` : ''}</div>
    <p>
      Email: ${order.clientEmail}
      ${order.clientPhone ? ` &nbsp;·&nbsp; Tel: ${order.clientPhone}` : ''}
    </p>
  </div>

  <h2>Configurazione porte</h2>
  <table>
    <thead>
      <tr>
        <th style="text-align:center">#</th>
        <th>Modello</th>
        <th>Misure</th>
        <th>Legno</th>
        <th>Finitura</th>
        <th>Apertura</th>
        <th>Pannello</th>
        <th style="text-align:center">Qtà</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  ${notesSection}

  <div class="sig-row">
    <div class="sig">Firma cliente</div>
    <div class="sig">Firma agente / responsabile</div>
  </div>

  <div class="footer">
    TOSCOCORNICI &nbsp;·&nbsp; Via Torrita, Torrita di Siena (SI) &nbsp;·&nbsp; toscocornici.it<br>
    Documento generato automaticamente — non ha valore fiscale
  </div>
</body>
</html>`
}

export function factoryHtml(order: Order): string {
  const date = new Date(order.createdAt).toLocaleDateString('it-IT', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  const doorSections = order.items.map(item => {
    const c = item.configuration
    return `
      <div class="door-card">
        <div class="door-header">
          Pos. ${item.position} &nbsp;&mdash;&nbsp; ${c.model.name} (${c.model.code})
          &nbsp;&nbsp;|&nbsp;&nbsp; Quantità: ${item.quantity}
        </div>
        <table class="spec-table">
          <tr>
            <td class="lbl">Codice modello</td><td class="val">${c.model.code}</td>
            <td class="lbl">Serie</td><td class="val">${c.model.series}</td>
          </tr>
          <tr>
            <td class="lbl">Larghezza luce</td><td class="val hi">${c.width} mm</td>
            <td class="lbl">Altezza luce</td><td class="val hi">${c.height} mm</td>
          </tr>
          <tr>
            <td class="lbl">Spessore</td><td class="val">${c.thickness} mm</td>
            <td class="lbl">N° ante</td><td class="val">${c.model.panelCount}</td>
          </tr>
          <tr>
            <td class="lbl">Legno</td><td class="val">${c.wood}</td>
            <td class="lbl">Finitura</td><td class="val">${c.finish}</td>
          </tr>
          <tr>
            <td class="lbl">Apertura</td><td class="val">${c.opening}</td>
            <td class="lbl">Pannello</td><td class="val">${c.panel}</td>
          </tr>
          ${c.hasTopLight ? `
          <tr>
            <td class="lbl">Sopraluce</td><td class="val" colspan="3">${c.topLightHeight || 300} mm</td>
          </tr>` : ''}
          ${c.notes ? `
          <tr>
            <td class="lbl">Note porta</td><td class="val note" colspan="3">${c.notes}</td>
          </tr>` : ''}
        </table>
      </div>
    `
  }).join('')

  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #222; font-size: 12px; }
  .topbar { background: #1a1a1a; color: white; padding: 14px 30px; display: flex; justify-content: space-between; align-items: center; }
  .topbar h1 { font-size: 18px; letter-spacing: 4px; font-weight: 900; }
  .topbar .subtitle { font-size: 9px; color: #888; margin-top: 2px; }
  .topbar .ord { font-size: 22px; font-weight: bold; color: #d97706; }
  .body { padding: 24px 30px; }
  .meta { display: flex; gap: 0; margin-bottom: 22px; border: 1px solid #ddd; border-radius: 6px; overflow: hidden; }
  .meta-item { flex: 1; padding: 10px 14px; border-right: 1px solid #ddd; }
  .meta-item:last-child { border-right: none; }
  .meta-item .lbl { font-size: 9px; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .meta-item .val { font-size: 13px; font-weight: bold; color: #222; }
  .door-card { border: 2px solid #333; border-radius: 6px; margin-bottom: 18px; overflow: hidden; }
  .door-header { background: #333; color: white; padding: 8px 14px; font-weight: bold; font-size: 12px; }
  .spec-table { width: 100%; border-collapse: collapse; }
  .spec-table td { padding: 7px 14px; border-bottom: 1px solid #f0f0f0; }
  .spec-table tr:last-child td { border-bottom: none; }
  td.lbl { color: #999; font-size: 10px; width: 18%; text-transform: uppercase; letter-spacing: 0.5px; }
  td.val { font-size: 12px; font-weight: 500; width: 32%; }
  td.val.hi { font-size: 14px; font-weight: bold; color: #1a1a1a; }
  td.val.note { font-style: italic; color: #555; }
  .footer { margin-top: 20px; padding: 10px 30px; border-top: 1px solid #eee; font-size: 9px; color: #bbb; }
</style>
</head>
<body>
  <div class="topbar">
    <div>
      <h1>TOSCOCORNICI</h1>
      <div class="subtitle">SCHEDA TECNICA INTERNA — USO ESCLUSIVO PRODUZIONE</div>
    </div>
    <div class="ord">ORD. ${order.orderNumber}</div>
  </div>

  <div class="body">
    <div class="meta">
      <div class="meta-item"><div class="lbl">Data</div><div class="val">${date}</div></div>
      <div class="meta-item"><div class="lbl">Cliente</div><div class="val">${order.clientName}${order.clientCompany ? ` (${order.clientCompany})` : ''}</div></div>
      <div class="meta-item"><div class="lbl">Contatto</div><div class="val" style="font-size:11px">${order.clientEmail}${order.clientPhone ? `<br>${order.clientPhone}` : ''}</div></div>
      <div class="meta-item"><div class="lbl">N° porte</div><div class="val">${order.items.length}</div></div>
    </div>

    ${doorSections}

    ${order.notes ? `<div style="margin-top:10px;padding:12px 14px;background:#fef9f0;border-radius:6px;font-size:11px;color:#555;"><strong>NOTE GENERALI:</strong> ${order.notes}</div>` : ''}
  </div>

  <div class="footer">
    Documento interno TOSCOCORNICI · Torrita di Siena · Generato il ${date}
  </div>
</body>
</html>`
}

export async function generatePdf(html: string): Promise<Buffer> {
  const isVercel = !!process.env.VERCEL

  if (isVercel) {
    // On Vercel: use @sparticuz/chromium (lightweight Linux Chromium) + puppeteer-core
    const chromium = (await import('@sparticuz/chromium')).default
    const puppeteer = (await import('puppeteer-core')).default
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    })
    try {
      const page = await browser.newPage()
      await page.setContent(html, { waitUntil: 'domcontentloaded' })
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
      })
      return Buffer.from(pdfBuffer)
    } finally {
      await browser.close()
    }
  } else {
    // Local dev: use full puppeteer with its bundled Chrome
    const puppeteer = (await import('puppeteer')).default
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    })
    try {
      const page = await browser.newPage()
      await page.setContent(html, { waitUntil: 'domcontentloaded' })
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
      })
      return Buffer.from(pdfBuffer)
    } finally {
      await browser.close()
    }
  }
}
