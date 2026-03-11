'use client'

import { useEffect, useRef } from 'react'
import { DoorConfiguration } from '@/types/door'

interface DoorCanvasProps {
  config: DoorConfiguration
  width?: number
  height?: number
}

// Colores de madera
const WOOD_COLORS: Record<string, string> = {
  TOULIPIER: '#D4A96A',
  PINO:      '#E8C98A',
  ROVERE:    '#8B6914',
  CASTAGNO:  '#6B3A2A',
  FRASSINO:  '#C8B89A',
  CILIEGIO:  '#8B3A3A',
  NOCINO:    '#4A2810',
}

const FINISH_OVERLAY: Record<string, string> = {
  GREZZO:     'rgba(0,0,0,0)',
  VERNICIATA: 'rgba(200,180,140,0.3)',
  LACCATA:    'rgba(255,255,255,0.6)',
  RAL_9010:   'rgba(255,253,248,0.85)',
  RAL_9016:   'rgba(246,247,241,0.85)',
}

export default function DoorCanvas({ config, width = 400, height = 600 }: DoorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Limpiar
    ctx.clearRect(0, 0, width, height)

    const woodColor = WOOD_COLORS[config.wood] || '#D4A96A'
    const finishOverlay = FINISH_OVERLAY[config.finish] || 'rgba(0,0,0,0)'

    // Proporciones reales de la puerta escaladas al canvas
    const doorW = config.width
    const doorH = config.height
    const ratio = Math.min((width - 60) / doorW, (height - 80) / doorH)

    const dw = doorW * ratio   // ancho en px
    const dh = doorH * ratio   // alto en px
    const dx = (width - dw) / 2
    const dy = (height - dh) / 2

    // Marco (telaio) — grosor proporcional
    const frameSize = 40 * ratio
    const isRAL = config.finish === 'RAL_9010' || config.finish === 'RAL_9016'
    const frameColor = isRAL ? '#f5f5f0' : woodColor

    drawFrame(ctx, dx, dy, dw, dh, frameSize, frameColor, woodColor)

    // Hojas (ante)
    const panels = config.model.panelCount
    const leafW = (dw - frameSize * 2) / panels
    const leafH = dh - frameSize * 2

    for (let i = 0; i < panels; i++) {
      const lx = dx + frameSize + i * leafW
      const ly = dy + frameSize
      drawLeaf(ctx, lx, ly, leafW, leafH, config, woodColor, finishOverlay, i)
    }

    // Sopraluce (si tiene)
    if (config.hasTopLight && config.topLightHeight) {
      drawTopLight(ctx, dx, dy - config.topLightHeight * ratio,
        dw, config.topLightHeight * ratio, frameSize, woodColor)
    }

    // Medidas
    drawMeasures(ctx, dx, dy, dw, dh, config.width, config.height, width, height)

  }, [config, width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-lg shadow-inner bg-gray-50"
      style={{ maxWidth: '100%' }}
    />
  )
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  frameSize: number, frameColor: string, woodColor: string
) {
  // Sombra del marco
  ctx.shadowColor = 'rgba(0,0,0,0.3)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetX = 3
  ctx.shadowOffsetY = 3

  ctx.fillStyle = frameColor
  ctx.fillRect(x, y, w, h)

  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0

  // Veta de madera en el marco
  if (frameColor !== '#f5f5f0') {
    drawWoodGrain(ctx, x, y, w, h, woodColor, 'vertical')
  }

  // Borde interior del marco
  ctx.strokeStyle = 'rgba(0,0,0,0.2)'
  ctx.lineWidth = 1
  ctx.strokeRect(x + frameSize, y + frameSize,
    w - frameSize * 2, h - frameSize * 2)

  // Highlight borde exterior
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'
  ctx.lineWidth = 1.5
  ctx.strokeRect(x + 1, y + 1, w - 2, h - 2)

  ctx.strokeStyle = 'rgba(0,0,0,0.4)'
  ctx.lineWidth = 1
  ctx.strokeRect(x, y, w, h)
}

function drawLeaf(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  config: DoorConfiguration,
  woodColor: string, finishOverlay: string,
  leafIndex: number
) {
  // Fondo hoja
  ctx.fillStyle = woodColor
  ctx.fillRect(x, y, w, h)

  // Veta de madera
  drawWoodGrain(ctx, x, y, w, h, woodColor, 'vertical')

  // Overlay del acabado
  ctx.fillStyle = finishOverlay
  ctx.fillRect(x, y, w, h)

  // Paneles / bugnas
  const panel = config.panel
  if (panel === 'BUGNA_1') {
    drawBugna(ctx, x, y, w, h, 1, woodColor)
  } else if (panel === 'BUGNA_3') {
    drawBugna(ctx, x, y, w, h, 3, woodColor)
  } else if (panel === 'VETRO') {
    drawGlass(ctx, x, y, w, h)
  } else if (panel === 'TABLÒ') {
    drawTabló(ctx, x, y, w, h, woodColor)
  }

  // Manija (serratura)
  drawHandle(ctx, x, y, w, h, config.opening, leafIndex)

  // Borde hoja
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'
  ctx.lineWidth = 1
  ctx.strokeRect(x, y, w, h)

  // Indicador de apertura (flecha)
  drawOpeningIndicator(ctx, x, y, w, h, config.opening, leafIndex)
}

function drawBugna(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  count: number, woodColor: string
) {
  const margin = Math.min(w, h) * 0.08
  const totalH = h - margin * 2
  const bugnaH = totalH / count - margin * 0.5
  const bugnaW = w - margin * 2

  for (let i = 0; i < count; i++) {
    const by = y + margin + i * (bugnaH + margin * 0.5)
    const bx = x + margin

    // Sombra bugna
    ctx.fillStyle = 'rgba(0,0,0,0.12)'
    ctx.fillRect(bx + 3, by + 3, bugnaW, bugnaH)

    // Bugna
    ctx.fillStyle = adjustColor(woodColor, -15)
    ctx.fillRect(bx, by, bugnaW, bugnaH)

    // Highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(bx, by + bugnaH)
    ctx.lineTo(bx, by)
    ctx.lineTo(bx + bugnaW, by)
    ctx.stroke()

    ctx.strokeStyle = 'rgba(0,0,0,0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(bx + bugnaW, by)
    ctx.lineTo(bx + bugnaW, by + bugnaH)
    ctx.lineTo(bx, by + bugnaH)
    ctx.stroke()
  }
}

function drawGlass(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number
) {
  const margin = Math.min(w, h) * 0.08
  const gx = x + margin
  const gy = y + margin * 2
  const gw = w - margin * 2
  const gh = h - margin * 4

  // Vidrio
  const gradient = ctx.createLinearGradient(gx, gy, gx + gw, gy + gh)
  gradient.addColorStop(0, 'rgba(180,220,255,0.6)')
  gradient.addColorStop(0.3, 'rgba(220,240,255,0.3)')
  gradient.addColorStop(1, 'rgba(150,200,240,0.5)')
  ctx.fillStyle = gradient
  ctx.fillRect(gx, gy, gw, gh)

  // Reflejo
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.beginPath()
  ctx.moveTo(gx + 5, gy + 5)
  ctx.lineTo(gx + gw * 0.4, gy + 5)
  ctx.lineTo(gx + 5, gy + gh * 0.4)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = 'rgba(100,160,220,0.6)'
  ctx.lineWidth = 1
  ctx.strokeRect(gx, gy, gw, gh)
}

function drawTabló(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  woodColor: string
) {
  const margin = Math.min(w, h) * 0.06
  const rows = 3
  const cols = 2
  const pw = (w - margin * (cols + 1)) / cols
  const ph = (h - margin * (rows + 1)) / rows

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const px = x + margin + c * (pw + margin)
      const py = y + margin + r * (ph + margin)
      ctx.fillStyle = adjustColor(woodColor, -10)
      ctx.fillRect(px, py, pw, ph)
      ctx.strokeStyle = 'rgba(0,0,0,0.2)'
      ctx.lineWidth = 0.5
      ctx.strokeRect(px, py, pw, ph)
    }
  }
}

function drawHandle(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  opening: string, leafIndex: number
) {
  const handleY = y + h * 0.5
  const isLeft = opening.startsWith('SX') ||
    (opening.startsWith('DX') && leafIndex === 1)
  const handleX = isLeft ? x + w * 0.15 : x + w * 0.85

  // Placa
  ctx.fillStyle = '#c0c0c0'
  ctx.fillRect(handleX - 3, handleY - 18, 6, 36)

  // Manija
  ctx.beginPath()
  ctx.strokeStyle = '#888'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.moveTo(handleX, handleY - 6)
  ctx.lineTo(handleX + (isLeft ? 12 : -12), handleY - 6)
  ctx.stroke()
}

function drawOpeningIndicator(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  opening: string, leafIndex: number
) {
  if (opening === 'SCRIGNO' || opening === 'SCORREVOLE') return

  ctx.save()
  ctx.strokeStyle = 'rgba(100,150,255,0.3)'
  ctx.lineWidth = 1
  ctx.setLineDash([4, 4])

  const isLeft = opening === 'SX' || opening === 'SX_2A' ||
    (opening === 'DX_2A' && leafIndex === 1)
  const pivotX = isLeft ? x : x + w
  const pivotY = y + h

  ctx.beginPath()
  ctx.moveTo(pivotX, pivotY)
  ctx.lineTo(isLeft ? x + w : x, y + h)
  ctx.stroke()

  ctx.setLineDash([])
  ctx.restore()
}

function drawTopLight(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  frameSize: number, woodColor: string
) {
  ctx.fillStyle = woodColor
  ctx.fillRect(x, y, w, h)
  drawGlass(ctx, x + frameSize, y + frameSize * 0.5,
    w - frameSize * 2, h - frameSize)
  ctx.strokeStyle = 'rgba(0,0,0,0.3)'
  ctx.lineWidth = 1
  ctx.strokeRect(x, y, w, h)
}

function drawWoodGrain(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  baseColor: string, direction: 'vertical' | 'horizontal'
) {
  ctx.save()
  ctx.globalAlpha = 0.15
  ctx.strokeStyle = adjustColor(baseColor, -30)
  ctx.lineWidth = 1

  if (direction === 'vertical') {
    for (let i = 0; i < w; i += Math.max(4, w / 12)) {
      ctx.beginPath()
      ctx.moveTo(x + i + Math.random() * 3, y)
      ctx.lineTo(x + i + Math.random() * 3, y + h)
      ctx.stroke()
    }
  }
  ctx.restore()
}

function drawMeasures(
  ctx: CanvasRenderingContext2D,
  dx: number, dy: number, dw: number, dh: number,
  realW: number, realH: number,
  canvasW: number, canvasH: number
) {
  ctx.save()
  ctx.fillStyle = '#555'
  ctx.font = '11px Inter, sans-serif'
  ctx.textAlign = 'center'

  // Ancho (abajo)
  const arrowY = dy + dh + 18
  ctx.beginPath()
  ctx.moveTo(dx, arrowY)
  ctx.lineTo(dx + dw, arrowY)
  ctx.strokeStyle = '#888'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.fillText(`${realW} mm`, dx + dw / 2, arrowY + 14)

  // Alto (derecha)
  ctx.save()
  ctx.translate(dx + dw + 18, dy + dh / 2)
  ctx.rotate(Math.PI / 2)
  ctx.fillText(`${realH} mm`, 0, 0)
  ctx.restore()

  ctx.restore()
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount))
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount))
  return `rgb(${r},${g},${b})`
}
