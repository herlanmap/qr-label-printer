import React, { useState, useCallback, useEffect } from 'react'
import InputForm from './components/InputForm'
import PrintPreview from './components/PrintPreview'
import PrintArea from './components/PrintArea'

const DEFAULT_SETTINGS = {
  namaPerusahaan: '',
  kodePHL: '',
  qrSize: 100,
  layout: 'grid',
  showPHL: true,
}

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v !== null ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [settings, setSettings] = useState(() => load('settings', DEFAULT_SETTINGS))
  const [barcodes, setBarcodes] = useState(() => load('barcodes', []))
  const [showPrintPreview, setShowPrintPreview] = useState(false)
  const [printJob, setPrintJob] = useState(null)

  useEffect(() => { localStorage.setItem('settings', JSON.stringify(settings)) }, [settings])
  useEffect(() => { localStorage.setItem('barcodes', JSON.stringify(barcodes)) }, [barcodes])

  const handleSettingsChange = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }, [])

  return (
    <>
      <div className="print-hidden min-h-screen w-screen flex items-center justify-center bg-slate-950 p-4">
        <InputForm
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onDataLoad={setBarcodes}
          onPrint={() => setShowPrintPreview(true)}
          dataCount={barcodes.length}
        />

        {showPrintPreview && (
          <PrintPreview
            barcodes={barcodes}
            settings={settings}
            onClose={() => setShowPrintPreview(false)}
            onBeforePrint={setPrintJob}
          />
        )}
      </div>
      <PrintArea job={printJob} />
    </>
  )
}
