import React, {useRef, useState, useEffect} from 'react'
import { IconUpload } from './icons'

export default function UploadZone({file, setFile, uploadError, setUploadError}){
  const ref = useRef()
  const [dragActive, setDragActive] = useState(false)
  const [fileSize, setFileSize] = useState(0)

  // Update file size whenever file changes
  useEffect(() => {
    if (file) {
      setFileSize(file.size)
    } else {
      setFileSize(0)
    }
  }, [file])

  function onPick(e){
    const f = e.target.files[0]
    handleFile(f)
  }

  function handleFile(f){
    // reset previous error
    setUploadError && setUploadError('')
    if(!f) return
    const name = (f.name || '').toLowerCase()
    if(!name.endsWith('.vcf')){
      setFile(null)
      setUploadError && setUploadError('Invalid file format. Please upload a .vcf (Variant Call Format) file.')
      return
    }
    if(f.size > 5*1024*1024){
      setFile(null)
      setUploadError && setUploadError('File size exceeds the 5MB limit. Please upload a smaller VCF file.')
      return
    }
    setFile(f)
  }

  function onDrop(e){
    e.preventDefault()
    setDragActive(false)
    handleFile(e.dataTransfer.files[0])
  }

  function onDragOver(e){ e.preventDefault(); setDragActive(true) }
  function onDragLeave(e){ e.preventDefault(); setDragActive(false) }

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-300">Upload Genomic VCF</label>
      <div onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave} className={`border-2 border-dashed rounded-lg p-8 mt-3 transition-all duration-200 ${dragActive ? 'border-cyan-400 bg-blue-950' : 'border-slate-600 bg-slate-900 hover:border-cyan-400'}`} role="region" aria-label="VCF upload">
        <div className="flex items-center justify-center flex-col">
          <div className="mb-3 text-slate-500" style={{transform: dragActive? 'scale(1.05)':'scale(1)', transition:'transform 180ms'}}><IconUpload /></div>
          <div className="text-base font-semibold text-slate-200">Upload Genomic VCF</div>
          <div className="text-sm text-slate-400 mt-2">.vcf only · Max 5MB</div>

          <div className="mt-4">
            <label className="px-4 py-2 bg-cyan-600 text-white rounded-lg cursor-pointer hover:bg-cyan-700 transition-colors duration-200 font-medium text-sm">Choose file
              <input className="sr-only" ref={ref} onChange={onPick} type="file" accept=".vcf" />
            </label>
          </div>

          {file && !uploadError && (
            <div className="mt-4 w-full max-w-xs">
              <div className="flex items-center gap-3 p-3 bg-green-950 rounded-lg border border-green-700 mb-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#00ff00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="text-sm font-medium text-green-400">VCF verified</div>
                  <div className="text-xs text-slate-400">{file.name}</div>
                </div>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                <div className="flex justify-between items-center">
                  <div className="text-xs font-semibold text-slate-400">File Size</div>
                  <div className="text-xs font-bold text-cyan-400">
                    {(fileSize / 1024).toFixed(0)} KB ({(fileSize / (1024 * 1024)).toFixed(2)} MB) / 5 MB
                  </div>
                </div>
              </div>
            </div>
          )}

          {uploadError && <div className="mt-3 text-sm text-red-400 flex items-center gap-2 p-3 bg-red-950 rounded-lg border border-red-700"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 9v4" stroke="#ff3333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 17h.01" stroke="#ff3333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg><span>{uploadError}</span></div>}
        </div>
      </div>
    </div>
  )
}
