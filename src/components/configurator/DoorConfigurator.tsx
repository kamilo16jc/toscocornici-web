'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { DoorModel, DoorConfiguration, WoodType, Finish, OpeningType, PanelType } from '@/types/door'
import { DOOR_MODELS, WOOD_LABELS, FINISH_LABELS, OPENING_LABELS, PANEL_LABELS } from '@/data/models'
import OrderForm from './OrderForm'
import SuccessScreen from './SuccessScreen'
import { assetPath } from '@/lib/asset-path'

// Canvas cargado solo en cliente (usa window)
const DoorCanvas = dynamic(() => import('./DoorCanvas'), { ssr: false })

type Step = 'model' | 'measures' | 'options' | 'summary' | 'contact' | 'success'

const DEFAULT_CONFIG: Omit<DoorConfiguration, 'model'> = {
  width: 880,
  height: 2100,
  thickness: 45,
  wood: 'TOULIPIER',
  finish: 'GREZZO',
  opening: 'SX',
  panel: 'LISCIO',
  hasTopLight: false,
  notes: '',
}

interface Props {
  locale?: 'it' | 'en'
}

export default function DoorConfigurator({ locale = 'it' }: Props) {
  const [selectedModel, setSelectedModel] = useState<DoorModel>(DOOR_MODELS[0])
  const [config, setConfig] = useState<DoorConfiguration>({
    model: DOOR_MODELS[0],
    ...DEFAULT_CONFIG,
  })
  const [step, setStep] = useState<Step>('model')
  const [orderId, setOrderId] = useState('')
  const [orderNumber, setOrderNumber] = useState('')

  const t = (it: string, en: string) => locale === 'it' ? it : en

  const updateConfig = useCallback(<K extends keyof DoorConfiguration>(
    key: K, value: DoorConfiguration[K]
  ) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }, [])

  const selectModel = (model: DoorModel) => {
    setSelectedModel(model)
    setConfig(prev => ({
      ...prev,
      model,
      opening: model.availableOpenings[0],
      panel: model.availablePanels[0],
      wood: model.availableWoods[0],
      finish: model.availableFinishes[0],
      width: Math.round((model.minWidth + model.maxWidth) / 2),
      height: Math.round((model.minHeight + model.maxHeight) / 2),
    }))
  }

  const handleOrderSuccess = (id: string, num: string) => {
    setOrderId(id)
    setOrderNumber(num)
    setStep('success')
  }

  const handleNewOrder = () => {
    setSelectedModel(DOOR_MODELS[0])
    setConfig({ model: DOOR_MODELS[0], ...DEFAULT_CONFIG })
    setOrderId('')
    setOrderNumber('')
    setStep('model')
  }

  const configSteps = [
    { id: 'model',    label: t('1. Modello', '1. Model') },
    { id: 'measures', label: t('2. Misure', '2. Dimensions') },
    { id: 'options',  label: t('3. Opzioni', '3. Options') },
    { id: 'summary',  label: t('4. Riepilogo', '4. Summary') },
    { id: 'contact',  label: t('5. Dati cliente', '5. Your details') },
  ]

  const showCanvas = step !== 'success'
  const showStepIndicator = step !== 'success'

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-800 tracking-tight">
              TOSCOCORNICI
            </h1>
            <p className="text-sm text-stone-500">
              {t('Configuratore Porte', 'Door Configurator')}
            </p>
          </div>
          <div className="text-sm text-stone-400">
            {t('Torrita di Siena · dal 1998', 'Torrita di Siena · since 1998')}
          </div>
        </div>
      </header>

      {/* Step indicator */}
      {showStepIndicator && (
        <div className="bg-white border-b border-stone-100 px-6 py-3">
          <div className="max-w-7xl mx-auto flex gap-6 overflow-x-auto">
            {configSteps.map(s => (
              <button
                key={s.id}
                onClick={() => {
                  if (['model', 'measures', 'options', 'summary'].includes(s.id)) {
                    setStep(s.id as Step)
                  }
                }}
                className={`text-sm font-medium transition-colors pb-1 border-b-2 whitespace-nowrap ${
                  step === s.id
                    ? 'border-amber-600 text-amber-700'
                    : s.id === 'contact'
                    ? 'border-transparent text-stone-400 cursor-default'
                    : 'border-transparent text-stone-400 hover:text-stone-600'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Left column — steps */}
        <div className="flex-1 min-w-0">

          {/* SUCCESS */}
          {step === 'success' && (
            <SuccessScreen
              orderId={orderId}
              orderNumber={orderNumber}
              locale={locale}
              onNewOrder={handleNewOrder}
            />
          )}

          {/* STEP 1: Model selection */}
          {step === 'model' && (
            <div>
              <h2 className="text-xl font-semibold text-stone-700 mb-4">
                {t('Scegli il modello', 'Choose the model')}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {DOOR_MODELS.map(model => (
                  <button
                    key={model.id}
                    onClick={() => selectModel(model)}
                    className={`rounded-xl border-2 p-3 text-left transition-all hover:shadow-md ${
                      selectedModel.id === model.id
                        ? 'border-amber-500 bg-amber-50 shadow-md'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="aspect-[3/4] bg-stone-100 rounded-lg mb-2 flex items-center justify-center overflow-hidden relative">
                      <img
                        src={assetPath(model.image)}
                        alt={model.name}
                        className="object-contain h-full w-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                      <span className="text-stone-300 text-xs absolute">{model.code}</span>
                    </div>
                    <p className="font-semibold text-stone-800 text-sm">{model.name}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{model.code}</p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {locale === 'it' ? model.nameIt.split('—')[1]?.trim() : model.nameEn.split('—')[1]?.trim()}
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      {model.panelCount === 1 ? t('1 anta', '1 leaf') : t('2 ante', '2 leaves')}
                    </p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep('measures')}
                className="mt-6 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                {t('Continua →', 'Continue →')}
              </button>
            </div>
          )}

          {/* STEP 2: Dimensions */}
          {step === 'measures' && (
            <div>
              <h2 className="text-xl font-semibold text-stone-700 mb-4">
                {t('Inserisci le misure', 'Enter dimensions')}
              </h2>
              <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-6">

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    {t('Larghezza (mm)', 'Width (mm)')}
                    <span className="text-stone-400 font-normal ml-2">
                      min {selectedModel.minWidth} — max {selectedModel.maxWidth}
                    </span>
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={selectedModel.minWidth}
                      max={selectedModel.maxWidth}
                      value={config.width}
                      onChange={e => updateConfig('width', Number(e.target.value))}
                      className="flex-1 accent-amber-600"
                    />
                    <input
                      type="number"
                      min={selectedModel.minWidth}
                      max={selectedModel.maxWidth}
                      value={config.width}
                      onChange={e => {
                        const v = Number(e.target.value)
                        if (v >= selectedModel.minWidth && v <= selectedModel.maxWidth)
                          updateConfig('width', v)
                      }}
                      className="w-24 border border-stone-300 rounded-lg px-3 py-2 text-center font-mono text-sm"
                    />
                    <span className="text-stone-500 text-sm">mm</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    {t('Altezza (mm)', 'Height (mm)')}
                    <span className="text-stone-400 font-normal ml-2">
                      min {selectedModel.minHeight} — max {selectedModel.maxHeight}
                    </span>
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={selectedModel.minHeight}
                      max={selectedModel.maxHeight}
                      value={config.height}
                      onChange={e => updateConfig('height', Number(e.target.value))}
                      className="flex-1 accent-amber-600"
                    />
                    <input
                      type="number"
                      min={selectedModel.minHeight}
                      max={selectedModel.maxHeight}
                      value={config.height}
                      onChange={e => {
                        const v = Number(e.target.value)
                        if (v >= selectedModel.minHeight && v <= selectedModel.maxHeight)
                          updateConfig('height', v)
                      }}
                      className="w-24 border border-stone-300 rounded-lg px-3 py-2 text-center font-mono text-sm"
                    />
                    <span className="text-stone-500 text-sm">mm</span>
                  </div>
                </div>

                {selectedModel.hasTopLight && (
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.hasTopLight}
                        onChange={e => updateConfig('hasTopLight', e.target.checked)}
                        className="w-4 h-4 accent-amber-600"
                      />
                      <span className="text-sm font-medium text-stone-700">
                        {t('Con sopraluce', 'With top light')}
                      </span>
                    </label>
                    {config.hasTopLight && (
                      <div className="mt-3 ml-7">
                        <label className="text-xs text-stone-500 mb-1 block">
                          {t('Altezza sopraluce (mm)', 'Top light height (mm)')}
                        </label>
                        <input
                          type="number"
                          min={200} max={600}
                          value={config.topLightHeight || 300}
                          onChange={e => updateConfig('topLightHeight', Number(e.target.value))}
                          className="w-24 border border-stone-300 rounded-lg px-3 py-2 text-center font-mono text-sm"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep('model')}
                  className="px-6 py-3 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors">
                  {t('← Indietro', '← Back')}
                </button>
                <button onClick={() => setStep('options')}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                  {t('Continua →', 'Continue →')}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Options */}
          {step === 'options' && (
            <div>
              <h2 className="text-xl font-semibold text-stone-700 mb-4">
                {t('Personalizza', 'Customize')}
              </h2>
              <div className="space-y-6">

                <OptionGroup label={t('Legno', 'Wood')}>
                  {selectedModel.availableWoods.map(w => (
                    <OptionButton
                      key={w}
                      active={config.wood === w}
                      onClick={() => updateConfig('wood', w as WoodType)}
                      label={WOOD_LABELS[w]?.[locale] || w}
                    />
                  ))}
                </OptionGroup>

                <OptionGroup label={t('Finitura', 'Finish')}>
                  {selectedModel.availableFinishes.map(f => (
                    <OptionButton
                      key={f}
                      active={config.finish === f}
                      onClick={() => updateConfig('finish', f as Finish)}
                      label={FINISH_LABELS[f]?.[locale] || f}
                    />
                  ))}
                </OptionGroup>

                <OptionGroup label={t('Apertura', 'Opening')}>
                  {selectedModel.availableOpenings.map(o => (
                    <OptionButton
                      key={o}
                      active={config.opening === o}
                      onClick={() => updateConfig('opening', o as OpeningType)}
                      label={OPENING_LABELS[o]?.[locale] || o}
                    />
                  ))}
                </OptionGroup>

                <OptionGroup label={t('Pannello', 'Panel')}>
                  {selectedModel.availablePanels.map(p => (
                    <OptionButton
                      key={p}
                      active={config.panel === p}
                      onClick={() => updateConfig('panel', p as PanelType)}
                      label={PANEL_LABELS[p]?.[locale] || p}
                    />
                  ))}
                </OptionGroup>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    {t('Note aggiuntive', 'Additional notes')}
                  </label>
                  <textarea
                    value={config.notes || ''}
                    onChange={e => updateConfig('notes', e.target.value)}
                    rows={3}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder={t('Specifiche particolari...', 'Special requirements...')}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep('measures')}
                  className="px-6 py-3 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors">
                  {t('← Indietro', '← Back')}
                </button>
                <button onClick={() => setStep('summary')}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                  {t('Riepilogo →', 'Summary →')}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Summary */}
          {step === 'summary' && (
            <div>
              <h2 className="text-xl font-semibold text-stone-700 mb-4">
                {t('Riepilogo ordine', 'Order summary')}
              </h2>
              <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
                <SummaryRow label={t('Modello', 'Model')} value={`${config.model.name} (${config.model.code})`} />
                <SummaryRow label={t('Larghezza', 'Width')} value={`${config.width} mm`} />
                <SummaryRow label={t('Altezza', 'Height')} value={`${config.height} mm`} />
                <SummaryRow label={t('Legno', 'Wood')} value={WOOD_LABELS[config.wood]?.[locale] || config.wood} />
                <SummaryRow label={t('Finitura', 'Finish')} value={FINISH_LABELS[config.finish]?.[locale] || config.finish} />
                <SummaryRow label={t('Apertura', 'Opening')} value={OPENING_LABELS[config.opening]?.[locale] || config.opening} />
                <SummaryRow label={t('Pannello', 'Panel')} value={PANEL_LABELS[config.panel]?.[locale] || config.panel} />
                {config.hasTopLight && (
                  <SummaryRow label={t('Sopraluce', 'Top light')} value={`${config.topLightHeight || 300} mm`} />
                )}
                {config.notes && (
                  <SummaryRow label={t('Note', 'Notes')} value={config.notes} />
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep('options')}
                  className="px-6 py-3 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors">
                  {t('← Modifica', '← Edit')}
                </button>
                <button
                  onClick={() => setStep('contact')}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex-1">
                  {t('Procedi con i dati cliente →', 'Enter your details →')}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Contact form */}
          {step === 'contact' && (
            <OrderForm
              config={config}
              locale={locale}
              onBack={() => setStep('summary')}
              onSuccess={handleOrderSuccess}
            />
          )}

        </div>

        {/* Right column — 2D preview (hidden on success) */}
        {showCanvas && (
          <div className="w-80 shrink-0">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl border border-stone-200 p-4">
                <h3 className="text-sm font-medium text-stone-500 mb-3 text-center">
                  {t('Anteprima', 'Preview')} — {config.model.name}
                </h3>
                <DoorCanvas config={config} width={300} height={460} />
                <div className="mt-3 text-center text-xs text-stone-400">
                  {config.width} × {config.height} mm
                </div>
              </div>

              {/* Model photo */}
              {config.model.image && step !== 'model' && (
                <div className="mt-4 bg-white rounded-xl border border-stone-200 p-4">
                  <h3 className="text-sm font-medium text-stone-500 mb-3 text-center">
                    {t('Foto catalogo', 'Catalog photo')}
                  </h3>
                  <img
                    src={assetPath(config.model.image)}
                    alt={config.model.name}
                    className="w-full rounded-lg object-contain max-h-48"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function OptionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4">
      <p className="text-sm font-medium text-stone-700 mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function OptionButton({ label, active, onClick }: {
  label: string; active: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
        active
          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
          : 'bg-white text-stone-600 border-stone-300 hover:border-amber-400 hover:text-amber-700'
      }`}
    >
      {label}
    </button>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between px-4 py-3 text-sm">
      <span className="text-stone-500">{label}</span>
      <span className="font-medium text-stone-800 text-right max-w-[60%]">{value}</span>
    </div>
  )
}
