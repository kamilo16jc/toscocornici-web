'use client'

import { useState } from 'react'
import { DoorConfiguration, Order } from '@/types/door'

export interface CustomerData {
  name: string
  email: string
  phone: string
  company: string
  address: string
}

interface Props {
  config: DoorConfiguration
  locale?: 'it' | 'en'
  onBack: () => void
  onSuccess: (order: Order) => void
}

export default function OrderForm({ config, locale = 'it', onBack, onSuccess }: Props) {
  const [customer, setCustomer] = useState<CustomerData>({
    name: '', email: '', phone: '', company: '', address: '',
  })
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const t = (it: string, en: string) => locale === 'it' ? it : en

  const set = (field: keyof CustomerData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setCustomer(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customer.name.trim() || !customer.email.trim()) {
      setError(t('Nome e email sono obbligatori.', 'Name and email are required.'))
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, customer, notes }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || t('Errore del server', 'Server error'))
      onSuccess(data.order)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('Errore sconosciuto', 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-stone-700 mb-2">
        {t('Completa il tuo ordine', 'Complete your order')}
      </h2>
      <p className="text-sm text-stone-500 mb-6">
        {t(
          'Inserisci i tuoi dati per ricevere la conferma e i documenti del tuo ordine.',
          'Enter your details to receive the order confirmation and documents.'
        )}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                {t('Nome e Cognome', 'Full Name')}{' '}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customer.name}
                onChange={set('name')}
                required
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder={t('Mario Rossi', 'John Smith')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                {t('Azienda / Negozio', 'Company / Store')}
              </label>
              <input
                type="text"
                value={customer.company}
                onChange={set('company')}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder={t('Falegnameria Rossi', 'Rossi Woodworks')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                {t('Email', 'Email')}{' '}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={customer.email}
                onChange={set('email')}
                required
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="mario@esempio.it"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                {t('Telefono', 'Phone')}
              </label>
              <input
                type="tel"
                value={customer.phone}
                onChange={set('phone')}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="+39 0577 ..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              {t('Indirizzo di consegna', 'Delivery address')}
            </label>
            <input
              type="text"
              value={customer.address}
              onChange={set('address')}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder={t('Via Roma 1, Siena (SI)', '1 Main St, City')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              {t('Note aggiuntive', 'Additional notes')}
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder={t(
                'Specifiche particolari, termini di consegna...',
                'Special requirements, delivery terms...'
              )}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="px-6 py-3 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors disabled:opacity-50"
          >
            {t('← Modifica', '← Edit')}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            {loading
              ? t('Invio in corso...', 'Sending...')
              : `✓ ${t('Invia ordine', 'Submit order')}`}
          </button>
        </div>
      </form>
    </div>
  )
}
