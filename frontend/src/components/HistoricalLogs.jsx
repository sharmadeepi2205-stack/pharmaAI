import React, { useState, useEffect } from 'react'
import { Trash2, Download, Copy, Search, Clock, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react'
import Header from './Header'
import api from '../services/api'

function RiskBadge({ risk_label }) {
  const badgeMap = {
    Safe: { bg: 'bg-green-950/30', text: 'text-green-400', icon: CheckCircle2, border: 'border-green-600/50' },
    'Adjust Dosage': {
      bg: 'bg-yellow-950/30',
      text: 'text-yellow-400',
      icon: AlertCircle,
      border: 'border-yellow-600/50',
    },
    Ineffective: {
      bg: 'bg-orange-950/30',
      text: 'text-orange-400',
      icon: AlertCircle,
      border: 'border-orange-600/50',
    },
    Toxic: { bg: 'bg-red-950/30', text: 'text-red-400', icon: AlertCircle, border: 'border-red-600/50' },
  }

  const badge = badgeMap[risk_label] || badgeMap['Safe']
  const Icon = badge.icon

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}>
      <Icon size={14} />
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
      setLoading(true)
      const response = await api.get('/logs')

      if (response.data && response.data.success && Array.isArray(response.data.logs)) {
        setLogs(response.data.logs.reverse())
        console.log('✅ Logs fetched successfully:', response.data.logs.length, 'entries')
      } else {
        console.warn('⚠️ Unexpected logs response:', response.data)
        setLogs([])
      }
    } catch (err) {
      console.warn('⚠️ Could not fetch logs:', err?.message)
      // Gracefully handle network errors
      setLogs([])
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
    showToast('Log file downloaded')
  }

  const copyJSON = (log) => {
    const json = JSON.stringify(log, null, 2)
    navigator.clipboard.writeText(json)
    showToast('Log data copied to clipboard')
  }

  const clearLogs = async () => {
    if (!window.confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      return
    }

    try {
      const response = await api.delete('/logs')

      if (response.data && response.data.success) {
        setLogs([])
        setExpandedLog(null)
        showToast('All logs cleared successfully')
      }
    } catch (err) {
      console.error('Error clearing logs:', err)
      showToast('Failed to clear logs', 'error')
    }
  }

  const filteredLogs = logs.filter((log) => {
    const searchLower = searchFilter.toLowerCase()
    return (
      log.patient_id?.toLowerCase().includes(searchLower) ||
      log.drug?.toLowerCase().includes(searchLower) ||
      log.log_id?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 rounded-lg border border-cyan-500/30">
              <Clock size={24} className="text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-cyan-300">Analysis History</h1>
              <p className="text-slate-400 mt-1">View all analysis records from your sessions</p>
            </div>
          </div>
        </div>

        {/* Search and Action Bar */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg border border-cyan-600/50 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search by patient ID, drug, or log ID..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-700 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={fetchLogs}
              className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-lg transition-colors border border-slate-600 hover:border-slate-500 flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={clearLogs}
              disabled={logs.length === 0}
              className="px-4 py-2.5 bg-red-950/30 hover:bg-red-950/50 border border-red-600/50 text-red-400 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          </div>

          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-slate-700 flex gap-6 text-sm">
            <div>
              <span className="text-slate-400">Total Logs:</span>
              <span className="ml-2 font-bold text-cyan-300">{logs.length}</span>
            </div>
            <div>
              <span className="text-slate-400">Filtered:</span>
              <span className="ml-2 font-bold text-cyan-300">{filteredLogs.length}</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg border border-cyan-600/50 p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600/20 to-purple-600/20 border border-cyan-500/30 mb-4">
              <RefreshCw size={24} className="text-cyan-400 animate-spin" />
            </div>
            <p className="text-slate-400 font-medium">Loading logs...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredLogs.length === 0 && logs.length === 0 && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg border border-cyan-600/50 p-12 text-center">
            <Clock size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-100 text-lg font-semibold">No analysis logs found</p>
            <p className="text-slate-400 mt-2">Analysis records will appear here after you run your first analysis</p>
          </div>
        )}

        {/* No Search Results */}
        {!loading && filteredLogs.length === 0 && logs.length > 0 && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg border border-cyan-600/50 p-12 text-center">
            <Search size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-100 text-lg font-semibold">No logs match your search</p>
            <p className="text-slate-400 mt-2">Try adjusting your search filter</p>
          </div>
        )}

        {/* Logs List */}
        {!loading && filteredLogs.length > 0 && (
          <div className="space-y-4">
            {filteredLogs.map((log, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg border border-cyan-600/50 p-6 cursor-pointer transition-all hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-600/20"
                onClick={() => setExpandedLog(expandedLog === idx ? null : idx)}
              >
                {/* Log Header */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-700">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3 className="text-xl font-bold text-cyan-300">{log.drug || 'Unknown Drug'}</h3>
                      <RiskBadge risk_label={log.risk_assessment?.risk_label || 'Unknown'} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="font-medium">Patient:</span>
                        <span className="font-mono text-slate-200">{log.patient_id}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={14} />
                        <span className="text-slate-200">{new Date(log.logged_at).toLocaleString()}</span>
                      </div>
                      {log.timestamp && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <span className="font-medium">Analyzed:</span>
                          <span className="text-slate-200">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-slate-500 flex-shrink-0 text-xl">{expandedLog === idx ? '▼' : '▶'}</div>
                </div>

                {/* Expandable Details */}
                {expandedLog === idx && (
                  <div className="pt-4 space-y-4">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <p className="text-xs font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                          Confidence Score
                        </p>
                        <p className="text-2xl font-bold text-cyan-300">
                          {Math.round((log.risk_assessment?.confidence_score || 0) * 100)}%
                        </p>
                      </div>

                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <p className="text-xs font-semibold text-purple-400 mb-2 flex items-center gap-2">
                          Severity
                        </p>
                        <p className="text-lg font-bold text-slate-200 capitalize">
                          {log.risk_assessment?.severity || 'Unknown'}
                        </p>
                      </div>
                    </div>

                    {/* Pharmacogenomic Profile */}
                    {log.pharmacogenomic_profile && (
                      <div>
                        <h4 className="font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                          Pharmacogenomic Profile
                        </h4>
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 space-y-2 text-sm">
                          <p>
                            <span className="font-semibold text-slate-400">Primary Gene:</span>
                            <span className="ml-2 font-mono text-cyan-400">
                              {log.pharmacogenomic_profile?.primary_gene || 'N/A'}
                            </span>
                          </p>
                          <p>
                            <span className="font-semibold text-slate-400">Diplotype:</span>
                            <span className="ml-2 font-mono text-slate-300">
                              {log.pharmacogenomic_profile?.diplotype || 'N/A'}
                            </span>
                          </p>
                          <p>
                            <span className="font-semibold text-slate-400">Phenotype:</span>
                            <span className="ml-2 text-slate-300">
                              {log.pharmacogenomic_profile?.phenotype || 'N/A'}
                            </span>
                          </p>
                          {log.pharmacogenomic_profile?.detected_variants &&
                            log.pharmacogenomic_profile.detected_variants.length > 0 && (
                              <p>
                                <span className="font-semibold text-slate-400">Variants Detected:</span>
                                <span className="ml-2 font-bold text-green-400">
                                  {log.pharmacogenomic_profile.detected_variants.length}
                                </span>
                              </p>
                            )}
                        </div>
                      </div>
                    )}

                    {/* Clinical Recommendation */}
                    {log.clinical_recommendation && (
                      <div>
                        <h4 className="font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                          Clinical Recommendation
                        </h4>
                        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 rounded-lg p-4 border border-cyan-600/30 text-sm text-slate-200 leading-relaxed">
                          {log.clinical_recommendation}
                        </div>
                      </div>
                    )}

                    {/* Analysis Explanation */}
                    {log.llm_generated_explanation && (
                      <div>
                        <h4 className="font-semibold text-cyan-300 mb-3">Analysis Explanation</h4>
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 text-sm text-slate-300 max-h-40 overflow-y-auto">
                          {typeof log.llm_generated_explanation === 'string'
                            ? log.llm_generated_explanation
                            : log.llm_generated_explanation.summary ||
                              JSON.stringify(log.llm_generated_explanation)}
                        </div>
                      </div>
                    )}

                    {/* Raw JSON */}
                    <div>
                      <h4 className="font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                        Full Data
                      </h4>
                      <div className="bg-slate-950 rounded-lg p-4 border border-slate-700 font-mono text-xs text-slate-400 overflow-x-auto max-h-40 overflow-y-auto">
                        <pre>{JSON.stringify(log, null, 2)}</pre>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => copyJSON(log)}
                        className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-lg transition-colors border border-slate-600 flex items-center justify-center gap-2"
                      >
                        <Copy size={16} />
                        Copy JSON
                      </button>
                      <button
                        onClick={() => downloadJSON(log)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2"
                      >
                        <Download size={16} />
                        Export JSON
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg text-white text-sm font-medium shadow-lg transition-all duration-300 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}

