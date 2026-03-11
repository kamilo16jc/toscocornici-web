'use client'

interface Props {
  orderId: string
  orderNumber: string
  locale?: 'it' | 'en'
  onNewOrder: () => void
}

export default function SuccessScreen({ orderId, orderNumber, locale = 'it', onNewOrder }: Props) {
  const t = (it: string, en: string) => locale === 'it' ? it : en

  return (
    <div className="text-center py-10">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-stone-800 mb-2">
        {t('Ordine inviato con successo!', 'Order submitted successfully!')}
      </h2>
      <p className="text-stone-500 mb-1">
        {t('Numero ordine:', 'Order number:')}{' '}
        <span className="font-bold text-stone-700">{orderNumber}</span>
      </p>
      <p className="text-stone-400 text-sm mb-8">
        {t(
          'TOSCOCORNICI ti contatterà a breve per confermare i dettagli e i tempi di consegna.',
          'TOSCOCORNICI will contact you shortly to confirm details and delivery times.'
        )}
      </p>

      {orderId !== 'demo' ? (
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <a
            href={`/api/pdf2?orderId=${orderId}&type=client`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('Riepilogo ordine (PDF)', 'Order summary (PDF)')}
          </a>
          <a
            href={`/api/pdf2?orderId=${orderId}&type=factory`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-stone-700 hover:bg-stone-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('Scheda tecnica fabbrica (PDF)', 'Factory technical sheet (PDF)')}
          </a>
        </div>
      ) : (
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg px-5 py-3 text-sm text-amber-700 max-w-sm mx-auto">
          {t(
            'Versione demo — nella versione live potrai scaricare il PDF del tuo ordine.',
            'Demo version — in the live version you will be able to download your order PDF.'
          )}
        </div>
      )}

      <div className="border-t border-stone-200 pt-6">
        <button
          onClick={onNewOrder}
          className="text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors"
        >
          + {t("Configura un'altra porta", 'Configure another door')}
        </button>
      </div>
    </div>
  )
}
