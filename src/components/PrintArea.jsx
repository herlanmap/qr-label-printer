import React from 'react'
import LabelCard from './LabelCard'

export default function PrintArea({ job }) {
  return (
    <div id="print-area">
      {job && (
        <div style={{ padding: `${job.margin}mm`, background: 'white' }}>
          <div style={
            job.isGrid
              ? { display: 'grid', gridTemplateColumns: `repeat(${job.cols}, 76.2mm)`, gap: '0' }
              : { display: 'flex', flexDirection: 'column', gap: '0' }
          }>
            {job.barcodes.map((id, idx) => (
              <LabelCard
                key={`${id}-${idx}`}
                namaPerusahaan={job.settings.namaPerusahaan}
                kodePHL={job.settings.kodePHL}
                idBarcode={id}
                showPHL={job.settings.showPHL !== false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
