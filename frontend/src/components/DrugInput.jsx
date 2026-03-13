import React, { useState } from 'react'
import { Plus, X, Pill, AlertCircle } from 'lucide-react'

const SUPPORTED = ['CODEINE', 'WARFARIN', 'CLOPIDOGREL', 'SIMVASTATIN', 'AZATHIOPRINE', 'FLUOROURACIL']

export default function DrugInput({ drugs, setDrugs }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  function addFromText() {
    const list = text
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean)

    if (list.length === 0) {
      setError('Please enter at least one drug name')
      return
    }

    const invalidDrugs = list.filter((d) => !SUPPORTED.includes(d))
    if (invalidDrugs.length > 0) {
      setError(`Unknown drugs: ${invalidDrugs.join(', ')}. Please select from supported drugs.`)
      return
    }

    setDrugs(Array.from(new Set([...drugs, ...list])))
    setText('')
    setError('')
  }

  function toggleDrug(d) {
    if (drugs.includes(d)) {
      setDrugs(drugs.filter((x) => x !== d))
    } else {
      setDrugs([...drugs, d])
    }
    setError('')
  }

  function removeDrug(d) {
    setDrugs(drugs.filter((x) => x !== d))
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      addFromText()
    }
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 rounded-lg border border-purple-500/30">
          <Pill size={20} className="text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-purple-300">Drug Selection</h3>
          <p className="text-sm text-slate-400">Select or add medications for analysis</p>
        </div>
      </div>

      {/* Supported Drugs Grid */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-cyan-300 mb-3">Supported Medications</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {SUPPORTED.map((d) => (
            <button
              key={d}
              onClick={() => toggleDrug(d)}
              className={`px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 border flex items-center justify-center gap-2 ${
                drugs.includes(d)
                  ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:border-cyan-500 hover:bg-slate-700/50'
              }`}
              aria-pressed={drugs.includes(d)}
              title={`Click to ${drugs.includes(d) ? 'deselect' : 'select'} ${d}`}
            >
              <span className="hidden sm:inline">{d}</span>
              <span className="sm:hidden">{d.substring(0, 4)}</span>
              {drugs.includes(d) && <X size={14} />}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Input Section */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-cyan-300 mb-3">Add Custom Drugs</label>
        <div className="flex gap-2 mb-3">
          <input
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setError('')
            }}
            onKeyPress={handleKeyPress}
            placeholder="e.g., CODEINE, WARFARIN"
            className="flex-1 px-4 py-2.5 text-sm border border-slate-700 rounded-lg bg-slate-800/50 text-cyan-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-600/30 focus:outline-none"
            aria-label="Enter drug names"
          />
          <button
            onClick={addFromText}
            disabled={!text.trim()}
            className="btn btn-primary flex items-center gap-2"
            aria-label="Add drugs"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-950/30 border border-red-600/50 rounded-lg">
            <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}
      </div>

      {/* Selected Drugs Display */}
      {drugs.length > 0 && (
        <div className="pt-4 border-t border-slate-700">
          <label className="block text-sm font-semibold text-cyan-300 mb-3">
            Selected Medications ({drugs.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {drugs.map((d) => (
              <div
                key={d}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/50 rounded-lg"
              >
                <span className="text-sm font-medium text-cyan-300">{d}</span>
                <button
                  onClick={() => removeDrug(d)}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 p-0.5"
                  aria-label={`Remove ${d}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {drugs.length === 0 && (
        <p className="text-sm text-slate-400 italic text-center py-4">
          No drugs selected yet. Choose from supported medications or add custom drugs.
        </p>
      )}
    </div>
  )
}

