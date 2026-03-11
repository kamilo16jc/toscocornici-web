// Tipos principales del configurador de puertas TOSCOCORNICI

export type DoorSeries = '100' | '200' | '300' | '400' | '700' | 'BASE' | 'TLUI' | 'TLVO'

export type WoodType =
  | 'TOULIPIER'
  | 'PINO'
  | 'ROVERE'
  | 'CASTAGNO'
  | 'FRASSINO'
  | 'CILIEGIO'
  | 'NOCINO'

export type Finish =
  | 'GREZZO'           // Sin tratar
  | 'VERNICIATA'       // Pintada
  | 'LACCATA'          // Lacada
  | 'RAL_9010'         // Blanco puro
  | 'RAL_9016'         // Blanco tráfico

export type OpeningType =
  | 'SX'               // Izquierda
  | 'DX'               // Derecha
  | 'SX_2A'            // Izquierda 2 hojas
  | 'DX_2A'            // Derecha 2 hojas
  | 'SCRIGNO'          // Corrediza en pared
  | 'SCORREVOLE'       // Corrediza

export type PanelType =
  | 'LISCIO'           // Liso
  | 'BUGNA_1'          // 1 tablero
  | 'BUGNA_3'          // 3 tableros
  | 'VETRO'            // Con vidrio
  | 'TABLÒ'            // Tablò

export interface DoorModel {
  id: string
  code: string           // Ej: "100-C", "200FL", "BASESTCS"
  series: DoorSeries
  name: string
  nameIt: string
  nameEn: string
  image: string          // ruta a la imagen
  panelCount: number     // 1 o 2 hojas
  minWidth: number       // mm
  maxWidth: number       // mm
  minHeight: number      // mm
  maxHeight: number      // mm
  availableWoods: WoodType[]
  availableFinishes: Finish[]
  availableOpenings: OpeningType[]
  availablePanels: PanelType[]
  hasGlass: boolean
  hasTopLight: boolean   // sopraluce
}

export interface DoorConfiguration {
  model: DoorModel
  width: number          // mm
  height: number         // mm
  thickness: number      // mm (spessore)
  wood: WoodType
  finish: Finish
  opening: OpeningType
  panel: PanelType
  glassWidth?: number    // mm si tiene vidrio
  glassHeight?: number   // mm si tiene vidrio
  hasTopLight: boolean
  topLightHeight?: number
  color?: string         // código RAL si aplica
  notes?: string
}

export interface OrderItem {
  id: string
  position: number       // posizione (N° de puerta en el pedido)
  configuration: DoorConfiguration
  quantity: number
}

export interface Order {
  id: string
  orderNumber?: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  clientCompany?: string
  items: OrderItem[]
  status: 'draft' | 'confirmed' | 'sent'
  createdAt: Date
  notes?: string
}

// Piezas calculadas para el MDB (tabla Produz de Gestinf98)
export interface ProducedPiece {
  ordine: string         // N° orden
  posizione: number      // posición
  codPezzo: string       // código pieza (MA06, TA1, BA...)
  descPezzo: string      // descripción
  parte: string          // ANTA | TELAIO | COPRIFILO
  larghezza: number      // ancho mm
  lunghezza: number      // largo mm
  spessore: number       // grosor mm
  quantita: number       // cantidad
  um: 'PZ' | 'ML'       // unidad: piezas o metros lineales
  legno: string          // tipo madera
  finitura: string       // acabado
}
