import React, { useRef, useState } from 'react'
import * as XLSX from 'xlsx'

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</label>
      {children}
    </div>
  )
}

const inputCls =
  'bg-slate-800 border border-slate-600 text-slate-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500'

export default function InputForm({ settings, onSettingsChange, onDataLoad, onPrint, dataCount }) {
  const fileRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  function parseFile(file) {
    if (!file) return
    const ext = file.name.split('.').pop().toLowerCase()
    const reader = new FileReader()
    reader.onload = (evt) => {
      const data = evt.target.result
      let rows = []
      if (ext === 'csv') {
        const wb = XLSX.read(data, { type: 'string' })
        rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
      } else {
        const wb = XLSX.read(data, { type: 'array' })
        rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
      }
      const barcodes = rows.map((r) => r['id_barcode']).filter(Boolean).map(String)
      onDataLoad(barcodes)
      if (fileRef.current) { fileRef.current.value = ''; fileRef.current.blur() }
    }
    ext === 'csv' ? reader.readAsText(file) : reader.readAsArrayBuffer(file)
  }

  function handleFile(e) { parseFile(e.target.files[0]) }

  function handleDragOver(e) { e.preventDefault(); setDragging(true) }
  function handleDragLeave()  { setDragging(false) }
  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    parseFile(e.dataTransfer.files[0])
  }

  return (
    <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 p-6 flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-emerald-400 text-xl">▣</span>
        <h1 className="text-slate-100 font-bold text-lg tracking-tight">QR Label Printer</h1>
      </div>

      <hr className="border-slate-700" />

      {/* Nama Perusahaan */}
      <Field label="Nama Perusahaan">
        <input className={inputCls} placeholder="PT. Contoh Timber"
          value={settings.namaPerusahaan}
          onChange={(e) => onSettingsChange('namaPerusahaan', e.target.value)} />
      </Field>

      {/* PHL toggle */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <div
          onClick={() => onSettingsChange('showPHL', !settings.showPHL)}
          className={`w-9 h-5 rounded-full relative transition-colors ${settings.showPHL ? 'bg-emerald-500' : 'bg-slate-600'}`}
        >
          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.showPHL ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          {settings.showPHL ? 'Label PHL' : 'Label Non-PHL'}
        </span>
      </label>

      {/* Kode PHL — only when showPHL */}
      {settings.showPHL && (
        <Field label="Kode PHL">
          <input className={inputCls} placeholder="PHL...."
            value={settings.kodePHL}
            onChange={(e) => onSettingsChange('kodePHL', e.target.value)} />
        </Field>
      )}

      <hr className="border-slate-700" />

      {/* File upload + drag & drop */}
      <Field label="Upload File (.xlsx / .csv)">
        <div
          className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer transition-colors
            ${dragging ? 'border-emerald-400 bg-emerald-900/20' : 'border-slate-600 hover:border-emerald-500'}`}
          onClick={() => fileRef.current.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <span className="text-3xl">{dragging ? '📂' : '📄'}</span>
          <span className="text-slate-400 text-xs text-center">
            {dragging ? 'Lepaskan file di sini' : 'Klik atau seret file ke sini'}
            <br />
            <span className="text-slate-500">
              Kolom wajib: <code className="text-emerald-400">id_barcode</code>
            </span>
          </span>
          {dataCount > 0 && (
            <span className="mt-1 text-emerald-400 font-semibold text-sm">
              {dataCount} barcode dimuat
            </span>
          )}
        </div>
        <input ref={fileRef} type="file" accept=".xlsx,.csv" className="hidden" onChange={handleFile} />
      </Field>

      <hr className="border-slate-700" />

      {/* Print button */}
      <button onClick={onPrint} disabled={dataCount === 0}
        className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-900 font-bold text-sm tracking-widest uppercase transition-colors shadow-lg shadow-emerald-900/30">
        🖨 Print Labels
      </button>

      <p className="text-center text-xs text-slate-600">
        {dataCount === 0 ? 'Upload file terlebih dahulu' : `${dataCount} label siap dicetak`}
      </p>
    </div>
  )
}
