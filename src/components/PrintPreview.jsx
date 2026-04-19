import React, { useState, useEffect } from 'react'
import LabelCard from './LabelCard'

const MM_PER_INCH = 25.4

const PAPER_SIZES = [
  { label: 'A4  (210 × 297 mm)',          name: 'A4',     w: 210,   h: 297   },
  { label: 'A5  (148 × 210 mm)',          name: 'A5',     w: 148,   h: 210   },
  { label: 'Letter (8.5 × 11 in)',        name: 'Letter', w: 215.9, h: 279.4 },
  { label: 'F4 / Folio (8.5 × 13 in)',   name: 'Folio',  w: 215.9, h: 330.2 },
  { label: 'Custom (inch)…',             name: 'Custom', w: 210,   h: 297   },
]

const IN = (mm) => (mm / MM_PER_INCH).toFixed(3)   // mm → inch display
const MM = (inch) => parseFloat(inch) * MM_PER_INCH  // inch → mm

export default function PrintPreview({ barcodes, settings, onClose, onBeforePrint }) {
  const [printers, setPrinters] = useState([])
  const [printer, setPrinter]   = useState('')
  const [copies, setCopies]     = useState(1)
  const [zoom, setZoom]         = useState(0.7)
  const [paperKey, setPaperKey] = useState('A4')
  const [customWin, setCustomWin] = useState('3.00')  // inches
  const [customHin, setCustomHin] = useState('3.00')  // inches
  const [margin, setMargin]     = useState(0)  // mm
  const [selected, setSelected] = useState(() => new Set(barcodes.map((_, i) => i)))
  const [printing, setPrinting] = useState(false)
  const [search, setSearch]     = useState('')

  const paper = PAPER_SIZES.find((p) => p.name === paperKey) || PAPER_SIZES[0]
  const pageW = paperKey === 'Custom' ? MM(customWin) : paper.w
  const pageH = paperKey === 'Custom' ? MM(customHin) : paper.h
  const isGrid = settings.layout === 'grid'
  const cols  = isGrid ? Math.max(1, Math.floor((pageW - margin * 2) / (76.2 + 4))) : 1

  useEffect(() => {
    window.electronAPI?.getPrinters().then((list) => {
      setPrinters(list)
      const def = list.find((p) => p.isDefault) || list[0]
      if (def) setPrinter(def.name)
    })
  }, [])

  useEffect(() => {
    setSelected(new Set(barcodes.map((_, i) => i)))
  }, [barcodes])

  const toggleOne   = (idx) => setSelected((prev) => { const s = new Set(prev); s.has(idx) ? s.delete(idx) : s.add(idx); return s })
  const selectAll   = () => setSelected(new Set(barcodes.map((_, i) => i)))
  const deselectAll = () => setSelected(new Set())

  const activeBarcodes = barcodes.filter((_, i) => selected.has(i))

  async function handlePrint() {
    if (activeBarcodes.length === 0) return
    setPrinting(true)

    // Populate the dedicated PrintArea with only selected labels + current layout
    onBeforePrint({ barcodes: activeBarcodes, settings, cols, margin, isGrid })

    // Wait for React to re-render PrintArea before printing
    await new Promise((r) => setTimeout(r, 150))

    const pageSize =
      paperKey === 'Custom'
        ? { width: Math.round(pageW * 1000), height: Math.round(pageH * 1000) }
        : paperKey
    if (window.electronAPI?.doPrint) {
      await window.electronAPI.doPrint({ deviceName: printer, copies, pageSize, silent: true })
    } else {
      window.print()
    }
    setPrinting(false)
  }

  return (
    <div className="print-hidden fixed inset-0 z-50 flex flex-col bg-slate-900">

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 px-4 py-2 bg-slate-800 border-b border-slate-700 shrink-0 flex-wrap">
        <span className="text-emerald-400 text-lg">▣</span>
        <h2 className="text-slate-100 font-bold text-sm uppercase tracking-widest">Print Preview</h2>
        <div className="flex-1" />

        {/* Printer */}
        {printers.length > 0 && (
          <Field label="Printer">
            <select value={printer} onChange={(e) => setPrinter(e.target.value)} className={sel}>
              {printers.map((p) => (
                <option key={p.name} value={p.name}>{p.displayName || p.name}</option>
              ))}
            </select>
          </Field>
        )}

        {/* Paper size */}
        <Field label="Kertas">
          <select value={paperKey} onChange={(e) => setPaperKey(e.target.value)} className={sel}>
            {PAPER_SIZES.map((p) => (
              <option key={p.name} value={p.name}>{p.label}</option>
            ))}
          </select>
        </Field>

        {/* Custom size in inches */}
        {paperKey === 'Custom' && (
          <Field label="in (L × T)">
            <div className="flex gap-1 items-center">
              <input type="number" min={1} max={20} step={0.01} value={customWin}
                onChange={(e) => setCustomWin(e.target.value)} className={`${inp} w-16`} />
              <span className="text-slate-400">×</span>
              <input type="number" min={1} max={32} step={0.01} value={customHin}
                onChange={(e) => setCustomHin(e.target.value)} className={`${inp} w-16`} />
            </div>
          </Field>
        )}

        {/* Margin */}
        <Field label="Margin (mm)">
          <input type="number" min={0} max={50} value={margin}
            onChange={(e) => setMargin(Math.max(0, parseInt(e.target.value) || 0))}
            className={`${inp} w-14 text-center`} />
        </Field>

        {/* Copies */}
        <Field label="Salinan">
          <input type="number" min={1} max={99} value={copies}
            onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
            className={`${inp} w-14 text-center`} />
        </Field>

        {/* Zoom */}
        <div className="flex items-center gap-1">
          <span className="text-slate-400 text-xs uppercase tracking-wider mr-1">Zoom</span>
          <button onClick={() => setZoom((z) => Math.max(0.25, +((z - 0.1).toFixed(2))))} className={btn}>−</button>
          <span className="text-slate-300 text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((z) => Math.min(2, +((z + 0.1).toFixed(2))))} className={btn}>+</button>
        </div>

        <div className="w-px h-6 bg-slate-600" />

        {/* Print */}
        <button onClick={handlePrint} disabled={printing || activeBarcodes.length === 0}
          className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-slate-900 font-bold text-sm px-5 py-1.5 rounded-lg uppercase tracking-widest transition-colors">
          {printing ? 'Mencetak…' : `🖨 Print (${activeBarcodes.length})`}
        </button>

        <button onClick={onClose}
          className="bg-slate-700 hover:bg-slate-600 text-slate-300 rounded px-3 py-1.5 text-sm transition-colors">
          ✕ Tutup
        </button>
      </div>

      {/* ── Body: sidebar + preview ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Barcode list sidebar ── */}
        <div className="w-72 shrink-0 bg-slate-800 border-r border-slate-700 flex flex-col">
          {/* Sidebar header */}
          <div className="px-3 py-2 border-b border-slate-700">
            <div className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-1.5">
              Pilih Label
            </div>
            <div className="flex gap-2 mb-2">
              <button onClick={selectAll}
                className="flex-1 text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-700 hover:border-emerald-500 rounded py-0.5 transition-colors">
                Semua
              </button>
              <button onClick={deselectAll}
                className="flex-1 text-xs text-slate-400 hover:text-slate-300 border border-slate-600 hover:border-slate-400 rounded py-0.5 transition-colors">
                Hapus
              </button>
            </div>
            {/* Search */}
            <input
              type="text"
              placeholder="Cari barcode…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-slate-100 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-500"
            />
            <div className="text-slate-500 text-xs mt-1.5">
              {selected.size} / {barcodes.length} dipilih
            </div>
          </div>

          {/* Barcode rows */}
          <div className="flex-1 overflow-y-auto">
            {barcodes.map((id, idx) => {
              if (search && !id.toLowerCase().includes(search.toLowerCase())) return null
              const checked = selected.has(idx)
              return (
                <div
                  key={`${id}-${idx}`}
                  onClick={() => toggleOne(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer border-b border-slate-700/50 transition-colors
                    ${checked ? 'bg-emerald-900/30 hover:bg-emerald-900/50' : 'hover:bg-slate-700/50'}`}
                >
                  <div className={`w-4 h-4 rounded shrink-0 border flex items-center justify-center transition-colors
                    ${checked ? 'bg-emerald-500 border-emerald-400' : 'bg-slate-700 border-slate-500'}`}>
                    {checked && (
                      <svg width="10" height="10" viewBox="0 0 10 10">
                        <polyline points="2,5 4.5,7.5 8,3" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-slate-200 font-mono">{id}</div>
                    <div className="text-slate-500 text-xs">#{idx + 1}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Preview area ── */}
        <div className="flex-1 overflow-auto bg-slate-600 p-8">
          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.15s ease' }}>
            <div style={{
              width: `${pageW}mm`,
              minHeight: `${pageH}mm`,
              background: 'white',
              padding: `${margin}mm`,
              margin: '0 auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}>
              <div style={
                isGrid
                  ? { display: 'grid', gridTemplateColumns: `repeat(${cols}, 76.2mm)`, gap: '4mm' }
                  : { display: 'flex', flexDirection: 'column', gap: '4mm' }
              }>
                {barcodes.map((id, idx) => (
                  <div
                    key={`${id}-${idx}`}
                    onClick={() => toggleOne(idx)}
                    style={{
                      position: 'relative',
                      cursor: 'pointer',
                      opacity: selected.has(idx) ? 1 : 0.3,
                      outline: selected.has(idx) ? '2px solid #10b981' : '2px dashed #64748b',
                      outlineOffset: '1px',
                      borderRadius: '1px',
                      transition: 'opacity 0.15s, outline 0.15s',
                    }}
                  >
                    <LabelCard
                      namaPerusahaan={settings.namaPerusahaan}
                      kodePHL={settings.kodePHL}
                      idBarcode={id}
                      showPHL={settings.showPHL !== false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-5 py-1.5 bg-slate-800 border-t border-slate-700 text-slate-500 text-xs flex gap-4">
        <span>{pageW.toFixed(1)} × {pageH.toFixed(1)} mm</span>
        {paperKey === 'Custom' && (
          <span>({parseFloat(customWin).toFixed(2)} × {parseFloat(customHin).toFixed(2)} in)</span>
        )}
        <span>Margin {margin} mm</span>
        <span>{cols} kolom per baris</span>
        <span>{activeBarcodes.length} label akan dicetak</span>
      </div>
    </div>
  )
}

// ── Style helpers ─────────────────────────────────────────────────────────────

const sel = 'bg-slate-700 border border-slate-600 text-slate-100 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500'
const inp = 'bg-slate-700 border border-slate-600 text-slate-100 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500'
const btn = 'bg-slate-700 hover:bg-slate-600 text-slate-100 rounded w-6 h-6 text-sm font-bold'

function Field({ label, children }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">{label}</span>
      {children}
    </div>
  )
}
