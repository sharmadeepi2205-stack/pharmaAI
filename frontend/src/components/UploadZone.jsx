import React, { useRef, useState, useEffect } from 'react'
import { Upload, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react'

export default function UploadZone({ file, setFile, uploadError, setUploadError }) {
  const ref = useRef()
  const [dragActive, setDragActive] = useState(false)
  const [fileSize, setFileSize] = useState(0)

  useEffect(() => {
    if (file) {
      setFileSize(file.size)
    } else {
      setFileSize(0)
    }
  }, [file])

  function onPick(e) {
    const f = e.target.files[0]
    handleFile(f)
  }

  function handleFile(f) {
    setUploadError && setUploadError('')
    if (!f) return

    const name = (f.name || '').toLowerCase()
    if (!name.endsWith('.vcf')) {
      setFile(null)
      setUploadError && setUploadError('Invalid file format. Please upload a .vcf (Variant Call Format) file.')
      return
    }

    if (f.size > 5 * 1024 * 1024) {
      setFile(null)
      setUploadError && setUploadError('File size exceeds the 5MB limit. Please upload a smaller VCF file.')
      return
    }

    setFile(f)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragActive(false)
    handleFile(e.dataTransfer.files[0])
  }

  function onDragOver(e) {
    e.preventDefault()
    setDragActive(true)
  }

  function onDragLeave(e) {
    e.preventDefault()
    setDragActive(false)
  }

  const fileSizePercent = fileSize > 0 ? (fileSize / (5 * 1024 * 1024)) * 100 : 0

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 rounded-lg border border-cyan-500/30">
          <FileText size={20} className="text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-cyan-400">Upload Genomic Data</h3>
          <p className="text-sm text-slate-400">VCF file for pharmacogenomic analysis</p>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 transition-all duration-200 cursor-pointer backdrop-blur ${
          dragActive
            ? 'border-cyan-500 bg-cyan-600/10 scale-105'
            : 'border-slate-700 bg-slate-800/50 hover:border-cyan-500 hover:bg-cyan-600/5'
        }`}
        role="region"
        aria-label="VCF upload area"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div
            className={`p-4 rounded-full mb-3 transition-all duration-200 ${
              dragActive ? 'bg-cyan-600/30 scale-110' : 'bg-cyan-600/20'
            }`}
          >
            <Upload
              size={32}
              className={`transition-colors duration-200 ${
                dragActive ? 'text-cyan-400' : 'text-slate-400'
              }`}
            />
          </div>

          <h4 className="text-base font-semibold text-cyan-300 mb-1">Upload VCF File</h4>
          <p className="text-sm text-slate-400 mb-4">
            Drag and drop your file here or click to browse
          </p>

          <div className="text-xs text-slate-500 mb-4">
            <span className="font-medium text-cyan-400">.vcf</span> only • Max <span className="font-medium text-cyan-400">5MB</span>
          </div>

          <label className="inline-flex items-center gap-2 px-4 py-2.5 btn btn-primary">
            <Upload size={18} />
            <span>Choose File</span>
            <input className="sr-only" ref={ref} onChange={onPick} type="file" accept=".vcf" />
          </label>
        </div>
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="mt-4 flex items-start gap-3 p-4 bg-red-950/30 border border-red-600/50 rounded-lg">
          <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-400">Upload Error</p>
            <p className="text-sm text-red-300 opacity-90">{uploadError}</p>
          </div>
        </div>
      )}

      {/* File Info */}
      {file && !uploadError && (
        <div className="mt-4 space-y-3">
          {/* Success Message */}
          <div className="flex items-start gap-3 p-4 bg-green-950/30 border border-green-600/50 rounded-lg">
            <div className="flex-shrink-0">
              <CheckCircle2 size={20} className="text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-green-400">VCF File Verified</p>
              <p className="text-sm text-slate-400 truncate mt-1">{file.name}</p>
            </div>
            <button
              onClick={() => setFile(null)}
              className="flex-shrink-0 text-green-400 hover:text-green-300 transition-colors duration-200"
              aria-label="Remove file"
            >
              <X size={18} />
            </button>
          </div>

          {/* File Size Info */}
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-400">FILE SIZE</span>
              <span className="text-xs font-bold text-cyan-400">
                {(fileSize / 1024).toFixed(0)} KB / 5 MB
              </span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full transition-all duration-300 shadow-lg shadow-cyan-400/50"
                style={{ width: `${Math.min(fileSizePercent, 100)}%` }}
                role="progressbar"
                aria-valuenow={fileSizePercent}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>

          {/* File Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <p className="text-xs text-slate-400 mb-1">File Type</p>
              <p className="text-sm font-semibold text-cyan-300">VCF Format</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <p className="text-xs text-slate-400 mb-1">File Size</p>
              <p className="text-sm font-semibold text-cyan-300">
                {(fileSize / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
