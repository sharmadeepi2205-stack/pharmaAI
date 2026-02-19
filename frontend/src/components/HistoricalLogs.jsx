import React, { useState, useEffect } from 'react'
import Header from './Header'

function RiskBadge({ risk_label }) {
  const badges = {
    'Safe': { bg: 'bg-green-900', text: 'text-green-200' },
    'Adjust Dosage': { bg: 'bg-amber-900', text: 'text-amber-200' },
    'Ineffective': { bg: 'bg-orange-900', text: 'text-orange-200' },
    'Toxic': { bg: 'bg-red-900', text: 'text-red-200' },
  }

  const badge = badges[risk_label] || badges['Safe']

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
      {risk_label}
    </span>
  )
}

export default function HistoricalLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedLog, setExpandedLog] = useState(null)
  const [toast, setToast] = useState(null)
  const [searchFilter, setSearchFilter] = useState('')

  useEffect(() => {
    fetchLogs()
    const interval = setInterval(() => {
      fetchLogs()
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchLogs = async () => {
    try {
      setLoading(false)
      const response = await fetch('/api/logs')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success && Array.isArray(data.logs)) {
        setLogs(data.logs.reverse())
        console.log('✅ Logs fetched successfully:', data.logs.length, 'entries')
      } else {
        console.warn('⚠️ Unexpected logs response:', data)
        setLogs([])
      }
    } catch (err) {
      console.error('❌ Error fetching logs:', err)
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const downloadJSON = (log) => {
    const blob = new Blob([JSON.stringify(log, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${log.patient_id}-${log.drug}-${log.log_id}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showToast(`📥 Log file downloaded successfully`)
  }

  const copyJSON = (log) => {
    const json = JSON.stringify(log, null, 2)
    navigator.clipboard.writeText(json)
    showToast(`📋 Log data copied to clipboard`)
  }

  const clearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch('/api/logs', {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()

      if (data.success) {
        setLogs([])
        setExpandedLog(null)
        showToast('📋 All logs cleared successfully')
      }
    } catch (err) {
      console.error('Error clearing logs:', err)
      showToast('Failed to clear logs', 'error')
    }
  }

  const filteredLogs = logs.filter(log => {
    const searchLower = searchFilter.toLowerCase()
    return (
      log.patient_id?.toLowerCase().includes(searchLower) ||
      log.drug?.toLowerCase().includes(searchLower) ||
      log.log_id?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="w-full min-h-screen bg-black">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">📋 Historical Analysis Logs</h1>
          <p className="text-slate-400">View all analysis records generated till date</p>
        </div>

        <div className="bg-slate-950 rounded-lg shadow-md p-6 mb-6 border border-slate-700">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Search by Patient ID, Drug name, or Log ID..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-900 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <button
              onClick={fetchLogs}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-black font-semibold rounded-lg transition-colors"
            >
              🔄 Refresh
            </button>
            <button
              onClick={clearLogs}
              disabled={logs.length === 0}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-semibold rounded-lg transition-colors"
            >
              🗑️ Clear All
            </button>
          </div>
          <div className="mt-4 text-sm text-slate-400">
            Total Logs: <span className="font-semibold text-slate-100">{logs.length}</span> | 
            Filtered: <span className="font-semibold text-slate-100">{filteredLogs.length}</span>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
            <p className="mt-4 text-slate-300 font-medium">Loading logs...</p>
          </div>
        )}

        {!loading && filteredLogs.length === 0 && logs.length === 0 && (
          <div className="text-center py-12 bg-slate-950 rounded-lg shadow-md border border-slate-700">
            <p className="text-slate-300 text-lg">📭 No analysis logs found</p>
            <p className="text-slate-400 text-sm mt-2">Analysis records will appear here after you run your first analysis</p>
          </div>
        )}

        {!loading && filteredLogs.length === 0 && logs.length > 0 && (
          <div className="text-center py-12 bg-slate-950 rounded-lg shadow-md border border-slate-700">
            <p className="text-slate-300 text-lg">🔍 No logs match your search</p>
            <p className="text-slate-400 text-sm mt-2">Try adjusting your search filter</p>
          </div>
        )}

        {!loading && filteredLogs.length > 0 && (
          <div className="space-y-4">
            {filteredLogs.map((log, idx) => (
              <div
                key={idx}
                className="bg-slate-950 rounded-lg border border-slate-700 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  onClick={() => setExpandedLog(expandedLog === idx ? null : idx)}
                  className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-bold text-cyan-400 truncate">
                        {log.drug || 'Unknown Drug'}
                      </h3>
                      <RiskBadge risk_label={log.risk_assessment?.risk_label || 'Unknown'} />
                    </div>
                    <div className="text-sm text-slate-400 space-y-1">
                      <p>👤 Patient: <span className="font-mono font-semibold text-slate-200">{log.patient_id}</span></p>
                      <p>⏰ Logged: <span className="font-semibold text-slate-200">{new Date(log.logged_at).toLocaleString()}</span></p>
                      {log.timestamp && (
                        <p>📅 Analyzed: <span className="font-semibold text-slate-200">{new Date(log.timestamp).toLocaleString()}</span></p>
                      )}
                    </div>
                  </div>
                  <div className="text-2xl text-slate-400">
                    {expandedLog === idx ? '▼' : '▶'}
                  </div>
                </div>

                {expandedLog === idx && (
                  <div className="border-t border-slate-700 px-6 py-4 bg-slate-900">
                    <div className="mb-4 grid grid-cols-2 gap-4">
                      <div className="bg-slate-950 p-4 rounded-lg border border-cyan-700">
                        <div className="text-sm text-cyan-300 font-semibold mb-1">Confidence Score</div>
                        <div className="text-2xl font-bold text-cyan-400">
                          {Math.round((log.risk_assessment?.confidence_score || 0) * 100)}%
                        </div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-lg border border-orange-700">
                        <div className="text-sm text-orange-300 font-semibold mb-1">Severity</div>
                        <div className="text-lg font-bold capitalize text-orange-400">
                          {log.risk_assessment?.severity || 'Unknown'}
                        </div>
                      </div>
                    </div>

                    {log.pharmacogenomic_profile && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-slate-200 mb-2">Pharmacogenomic Profile</h4>
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-700 space-y-2 text-sm">
                          <p><span className="font-semibold text-slate-300">Primary Gene:</span> <span className="font-mono text-slate-200">{log.pharmacogenomic_profile?.primary_gene || 'N/A'}</span></p>
                          <p><span className="font-semibold text-slate-300">Diplotype:</span> <span className="font-mono text-slate-200">{log.pharmacogenomic_profile?.diplotype || 'N/A'}</span></p>
                          <p><span className="font-semibold text-slate-300">Phenotype:</span> <span className="font-mono text-slate-200">{log.pharmacogenomic_profile?.phenotype || 'N/A'}</span></p>
                          {log.pharmacogenomic_profile?.detected_variants && log.pharmacogenomic_profile.detected_variants.length > 0 && (
                            <p><span className="font-semibold text-slate-300">Variants Detected:</span> {log.pharmacogenomic_profile.detected_variants.length}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {log.clinical_recommendation && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-slate-200 mb-2">Clinical Recommendation</h4>
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-700 text-sm text-slate-100">
                          {log.clinical_recommendation}
                        </div>
                      </div>
                    )}

                    {log.llm_generated_explanation && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-slate-200 mb-2">Analysis Explanation</h4>
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-700 text-sm text-slate-100 max-h-40 overflow-y-auto">
                          {typeof log.llm_generated_explanation === 'string' 
                            ? log.llm_generated_explanation
                            : (log.llm_generated_explanation.summary || JSON.stringify(log.llm_generated_explanation))}
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <h4 className="font-semibold text-slate-200 mb-2">Full JSON Data</h4>
                      <div className="bg-black p-4 rounded-lg border border-slate-700 font-mono text-xs text-slate-300 overflow-x-auto max-h-40 overflow-y-auto">
                        <pre>{JSON.stringify(log, null, 2)}</pre>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => copyJSON(log)}
                        className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-black text-sm font-semibold rounded transition-colors"
                      >
                        📋 Copy JSON
                      </button>
                      <button
                        onClick={() => downloadJSON(log)}
                        className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-semibold rounded transition-colors"
                      >
                        ⬇️ Download JSON
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg text-white text-sm font-medium shadow-lg transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}
