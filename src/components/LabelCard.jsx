import React from 'react'
import { QRCodeSVG } from 'qrcode.react'

const BASE = import.meta.env.BASE_URL
const SERIF = "'Times New Roman', Times, serif"

export default function LabelCard({ namaPerusahaan, kodePHL, idBarcode, showPHL = true }) {
  // PHL: full 76.2mm label with SVLK + PHL rows
  // Non-PHL: same content positions, label height shrinks to just below barcode text
  const labelH    = showPHL ? '76.2mm' : '60mm'
  const svlkTop   = '54mm'

  return (
    <div
      className="label-card"
      style={{
        position: 'relative',
        width: '76.2mm',
        height: labelH,
        backgroundColor: '#fff',
        fontFamily: SERIF,
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Single outer border */}
      <Box top="3mm" left="3mm" right="3mm" bottom="3mm" border="0.4mm solid #000" />

      {/* Kemenhut logo */}
      <Abs top="4.5mm" left="4.5mm">
        <img
          src={`${BASE}logo-kemenhut.jpg`}
          alt="Kemenhut"
          loading="eager"
          style={{ width: '15mm', height: '15mm', objectFit: 'contain', display: 'block' }}
        />
      </Abs>

      {/* KEMENTERIAN KEHUTANAN / REPUBLIK INDONESIA */}
      <Abs top="4.5mm" left="21mm" style={{
        width: '50mm', height: '15mm',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      }}>
        <p style={{ margin: 0, fontSize: '9pt', fontWeight: 'bold', lineHeight: 1.3, textAlign: 'center' }}>
          KEMENTERIAN KEHUTANAN
        </p>
        <p style={{ margin: 0, fontSize: '9pt', fontWeight: 'bold', lineHeight: 1.3, textAlign: 'center' }}>
          REPUBLIK INDONESIA
        </p>
      </Abs>

      {/* Company name */}
      <Abs top="20mm" left="3mm" style={{ width: '70.2mm', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '8.5pt', fontWeight: 'bold', textAlign: 'center' }}>
          {namaPerusahaan || 'NAMA PERUSAHAAN'}
        </p>
      </Abs>

      {/* Left QR */}
      <Abs top={showPHL ? '25mm' : '28mm'} left="6mm" style={{ width: '21mm', height: '21mm' }}>
        <QRCodeSVG value={idBarcode || ' '} level="M" includeMargin={false}
          bgColor="#ffffff" fgColor="#000000"
          style={{ width: '100%', height: '100%', display: 'block' }} />
      </Abs>

      {/* Center QR */}
      <Abs top={showPHL ? '27.5mm' : '30.5mm'} left="30mm" style={{ width: '16mm', height: '16mm' }}>
        <QRCodeSVG value={idBarcode || ' '} level="M" includeMargin={false}
          bgColor="#ffffff" fgColor="#000000"
          style={{ width: '100%', height: '100%', display: 'block' }} />
      </Abs>

      {/* Right QR */}
      <Abs top={showPHL ? '25mm' : '28mm'} left="49mm" style={{ width: '21mm', height: '21mm' }}>
        <QRCodeSVG value={idBarcode || ' '} level="M" includeMargin={false}
          bgColor="#ffffff" fgColor="#000000"
          style={{ width: '100%', height: '100%', display: 'block' }} />
      </Abs>

      {/* Barcode text */}
      <Abs top={showPHL ? '49mm' : '52mm'} left="3mm" style={{ width: '70.2mm', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '8pt', fontFamily: SERIF, textAlign: 'center' }}>
          {idBarcode}
        </p>
      </Abs>

      {/* SVLK logo — only when PHL */}
      {showPHL && (
        <Abs top={svlkTop} left="25.1mm">
          <img
            src={`${BASE}svlk-indonesia.jpg`}
            alt="SVLK Indonesia"
            loading="eager"
            style={{ width: '26mm', height: '15mm', objectFit: 'contain', display: 'block' }}
          />
        </Abs>
      )}

      {/* PHL code — only when showPHL */}
      {showPHL && (
        <Abs top="69.5mm" left="3mm" style={{ width: '70.2mm', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '6pt', textAlign: 'center' }}>
            {kodePHL || '—'}
          </p>
        </Abs>
      )}
    </div>
  )
}

function Abs({ top, left, right, bottom, style, children }) {
  return (
    <div style={{ position: 'absolute', top, left, right, bottom, ...style }}>
      {children}
    </div>
  )
}

function Box({ top, left, right, bottom, border }) {
  return (
    <div style={{ position: 'absolute', top, left, right, bottom, border, pointerEvents: 'none' }} />
  )
}
