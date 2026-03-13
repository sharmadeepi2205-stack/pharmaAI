import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Copy,
  Download,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Microscope,
  Pill,
  FileJson,
  Activity,
  Clock,
  Shield,
} from 'lucide-react'

function ConfidenceGauge({ value = 0, id, size = 60 }) {
  const pct = Math.max(0, Math.min(100, value || 0))
  const radius = (size / 2) - 6
  const circumference = 2 * Math.PI * radius
  const [offset, setOffset] = useState(circumference)

  useEffect(() => {
    const to = circumference - (pct / 100) * circumference
    const t = setTimeout(() => setOffset(to), 100)
    return () => clearTimeout(t)
  }, [pct, circumference])

  // Color based on percentage
  const getColor = () => {
    if (pct >= 80) return '#10b981'
    if (pct >= 60) return '#f59e0b'
    if (pct >= 40) return '#f97316'
    return '#dc2626'
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
      <defs>
        <linearGradient id={id} x1="0%" x2="100%">
          <stop offset="0%" stopColor={getColor()} opacity="0.8" />
          <stop offset="100%" stopColor={getColor()} />
        </linearGradient>
      </defs>

      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#475569"
        strokeWidth="4"
      />

      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1000ms cubic-bezier(.2,.9,.3,1)' }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />

      <text
        x={size / 2}
        y={(size / 2) + 2}
        fontSize="16"
        fontWeight="bold"
        fill={getColor()}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {Math.round(pct)}%
      </text>
    </svg>
  )
}

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
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
    >
      <Icon size={14} />
      {risk_label}
    </span>
  )
}

// Pharmacogenomic gene mapping for common drugs
const DRUG_GENE_MAPPING = {
  Citalopram: 'CYP2C19',
  Citopram: 'CYP2C19',
  Escitalopram: 'CYP2C19',
  Sertraline: 'CYP2C19, CYP2D6',
  Fluoxetine: 'CYP2D6, CYP2C19',
  Paroxetine: 'CYP2D6',
  Venlafaxine: 'CYP2D6',
  Duloxetine: 'CYP1A2, CYP2D6',
  Imipramine: 'CYP2D6',
  Amitriptyline: 'CYP2D6',
  Nortriptyline: 'CYP2D6',
  Doxepin: 'CYP2D6',
  Aripiprazole: 'CYP3A4, CYP2D6',
  Haloperidol: 'CYP2D6',
  Risperidone: 'CYP2D6',
  Quetiapine: 'CYP3A4',
  Olanzapine: 'CYP1A2',
  Clozapine: 'CYP1A2, CYP2D6',
  Metoprolol: 'CYP2D6',
  Propranolol: 'CYP2D6',
  Timolol: 'CYP2D6',
  Atenolol: 'Not metabolized',
  Carvedilol: 'CYP2D6',
  Lisinopril: 'Not metabolized',
  Enalapril: 'Not metabolized',
  Valsartan: 'CYP3A4',
  Losartan: 'CYP2C9',
  Amlodipine: 'CYP3A4',
  Diltiazem: 'CYP3A4',
  Verapamil: 'CYP3A4',
  Simvastatin: 'CYP3A4',
  Atorvastatin: 'CYP3A4',
  Pravastatin: 'Not metabolized',
  Warfarin: 'CYP2C9, VKORC1',
  Clopidogrel: 'CYP2C19',
  Prasugrel: 'CYP3A4, CYP2B6',
  Ticagrelor: 'CYP3A4',
  Dabigatran: 'Not CYP metabolized',
  Rivaroxaban: 'CYP3A4, CYP2J2',
  Apixaban: 'CYP3A4, CYP2J2',
  Edoxaban: 'CYP3A4, CYP2J2',
  Phenytoin: 'CYP2C9',
  Carbamazepine: 'CYP3A4, CYP2C9',
  Lamotrigine: 'UGT1A4',
  Levetiracetam: 'Not metabolized',
  Oxcarbazepine: 'CYP2C19',
  Topiramate: 'Not metabolized',
  'Valproic Acid': 'CYP2C9',
  Phenobarbital: 'CYP2C19',
  Theophylline: 'CYP1A2, CYP3A4',
  Albuterol: 'Not CYP metabolized',
  Montelukast: 'CYP3A4, CYP2C9',
  Ibuprofen: 'CYP2C9',
  Naproxen: 'CYP2C9',
  Celecoxib: 'CYP2C9, CYP3A4',
  Meloxicam: 'CYP2C9',
  Indomethacin: 'CYP2C9',
  Diclofenac: 'CYP2C9',
  Codeine: 'CYP2D6',
  Tramadol: 'CYP2D6, CYP3A4',
  Morphine: 'UGT2B7',
  Oxycodone: 'CYP3A4, CYP2D6',
  Hydrocodone: 'CYP2D6',
  Methadone: 'CYP3A4, CYP2D6',
  Omeprazole: 'CYP2C19',
  Lansoprazole: 'CYP3A4, CYP2C19',
  Pantoprazole: 'CYP2C19',
  Esomeprazole: 'CYP2C19',
  Rabeprazole: 'CYP3A4, CYP2C19',
  Cimetidine: 'CYP2D6, CYP3A4, CYP2C9',
  Ranitidine: 'Not CYP metabolized',
  Famotidine: 'Not CYP metabolized',
  Ondansetron: 'CYP3A4, CYP2D6',
  Metoclopramide: 'CYP2D6',
  Tamoxifen: 'CYP2D6, CYP3A4',
  Estradiol: 'CYP2D6, CYP2C9',
  Levothyroxine: 'Not metabolized',
  Finasteride: 'CYP3A4',
  Mercaptopurine: 'TPMT',
  Azathioprine: 'TPMT',
  '5-Fluorouracil': 'DPYD',
  Irinotecan: 'UGT1A1',
  Topotecan: 'CYP3A4',
  Docetaxel: 'CYP3A4',
  Paclitaxel: 'CYP2C8, CYP3A4',
  Tamsulosin: 'CYP3A4',
  Doxorubicin: 'CYP3A4',
  Cyclophosphamide: 'CYP2B6, CYP3A4',
  Abacavir: 'HLA-B*5701',
  Efavirenz: 'CYP2B6, CYP3A4',
  Lopinavir: 'CYP3A4',
  Ritonavir: 'CYP3A4',
  Atazanavir: 'CYP3A4',
  Zidovudine: 'UGT2B7',
  Tacrolimus: 'CYP3A4',
  Cyclosporine: 'CYP3A4',
  Mycophenolate: 'TPMT',
  Erythromycin: 'CYP3A4',
  Clarithromycin: 'CYP3A4',
  Azithromycin: 'CYP3A4',
  Fluoroquinolones: 'Not CYP metabolized',
  Rifampin: 'CYP3A4 inducer',
  Metformin: 'Not metabolized',
  Glibenclamide: 'CYP2C9',
  Glipizide: 'CYP2C9',
  Glyburide: 'CYP2C9',
  Repaglinide: 'CYP2C8, CYP3A4',
  Rosiglitazone: 'CYP2C8',
  Pioglitazone: 'CYP2C8, CYP3A4',
  Propylthiouracil: 'Not metabolized',
  Methimazole: 'Not metabolized',
  Isotretinoin: 'CYP2C8, CYP3A4',
  Acitretin: 'Not metabolized',
  Tolterodine: 'CYP2D6, CYP3A4',
  Oxybutynin: 'CYP3A4',
  Solifenacin: 'CYP3A4',
  Alfuzosin: 'CYP3A4',
  Doxazosin: 'CYP3A4',
  Alprazolam: 'CYP3A4',
  Diazepam: 'CYP2C19, CYP3A4',
  Lorazepam: 'Not CYP metabolized',
  Temazepam: 'Not CYP metabolized',
  Zolpidem: 'CYP3A4, CYP2C9',
  Buspirone: 'CYP3A4',
  Sumatriptan: 'MAO-A',
  Naratriptan: 'CYP3A4',
  Rizatriptan: 'MAO-A',
  Almotriptan: 'Not CYP metabolized',
  Frovatriptan: 'Not CYP metabolized',
  Zolmitriptan: 'MAO-A',
  Default: 'CYP450',
}

function getPrimaryGeneForDrug(drugName) {
  if (!drugName) return 'N/A'

  const cleanedName = drugName.trim()

  if (DRUG_GENE_MAPPING[cleanedName]) {
    return DRUG_GENE_MAPPING[cleanedName]
  }

  const lowerDrug = cleanedName.toLowerCase()
  for (const [drug, gene] of Object.entries(DRUG_GENE_MAPPING)) {
    if (drug.toLowerCase() === lowerDrug) {
      return gene
    }
  }

  for (const [drug, gene] of Object.entries(DRUG_GENE_MAPPING)) {
    const drugLower = drug.toLowerCase()
    const searchLower = lowerDrug

    if (drugLower.includes(searchLower) || searchLower.includes(drugLower)) {
      return gene
    }
  }

  if (lowerDrug.includes('pam') || lowerDrug.includes('lam') || lowerDrug.includes('zolam')) {
    return 'CYP3A4'
  }
  if (lowerDrug.includes('prazol') || lowerDrug.includes('zole')) {
    return 'CYP2C19'
  }
  if (lowerDrug.includes('statin')) {
    return 'CYP3A4'
  }
  if (lowerDrug.includes('olol')) {
    return 'CYP2D6'
  }
  if (lowerDrug.includes('pine')) {
    return 'CYP3A4'
  }

  return 'CYP450 (Common pathway)'
}

export default function ResultsPanel({ data, selectedDrugs = [] }) {
  const navigate = useNavigate()
  const [toast, setToast] = useState(null)

  let results = []
  if (Array.isArray(data)) results = data
  else if (data && typeof data === 'object') results = [data]

  const filteredResults = useMemo(() => {
    if (selectedDrugs.length === 0) return results
    const selectedDrugsUpper = selectedDrugs.map((d) => String(d).toUpperCase())
    return results.filter((r) => selectedDrugsUpper.includes(String(r.drug).toUpperCase()))
  }, [results, selectedDrugs])

  if (!filteredResults.length) return null

  const showToast = (message, type = 'success') => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const downloadJSON = (result) => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${result.patient_id}-${result.drug}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showToast(`${result.drug} analysis downloaded`)
  }

  const copyJSON = (result) => {
    const json = JSON.stringify(result, null, 2)
    navigator.clipboard.writeText(json)
    showToast(`${result.drug} data copied to clipboard`)
  }

  const downloadCombinedJSON = () => {
    const combinedData = {
      patient_id: filteredResults[0]?.patient_id || 'patient',
      analysis_date: new Date().toISOString(),
      total_drugs: filteredResults.length,
      drugs: filteredResults,
    }
    const blob = new Blob([JSON.stringify(combinedData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `combined-analysis-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showToast('Combined analysis downloaded')
  }

  const copyCombinedJSON = () => {
    const combinedData = {
      patient_id: filteredResults[0]?.patient_id || 'patient',
      analysis_date: new Date().toISOString(),
      total_drugs: filteredResults.length,
      drugs: filteredResults,
    }
    const json = JSON.stringify(combinedData, null, 2)
    navigator.clipboard.writeText(json)
    showToast('Combined analysis copied to clipboard')
  }

  return (
    <div className="w-full">
      {/* Results Header */}
      <div className="sticky top-20 z-30 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-cyan-600/50 px-4 sm:px-6 py-4 mb-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 rounded-lg border border-cyan-500/30">
                <TrendingUp size={20} className="text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyan-300">Analysis Results</h3>
                <p className="text-sm text-slate-400">{filteredResults.length} drug analysis</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={copyCombinedJSON}
                className="btn btn-secondary flex items-center gap-2"
              >
                <Copy size={18} />
                <span className="hidden sm:inline">Copy All</span>
              </button>
              <button
                onClick={downloadCombinedJSON}
                className="btn btn-primary flex items-center gap-2"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Export All</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map((r, idx) => {
            const confidence_pct = Math.round((r.risk_assessment?.confidence_score || 0) * 100)
            const severity = r.risk_assessment?.severity || 'Unknown'
            const risk_label = r.risk_assessment?.risk_label || 'Safe'
            const primary_gene = r.pharmacogenomic_profile?.primary_gene || getPrimaryGeneForDrug(r.drug) || 'N/A'
            const diplotype = r.pharmacogenomic_profile?.diplotype || 'N/A'
            const phenotype = r.pharmacogenomic_profile?.phenotype || 'N/A'
            const clinical_rec = r.clinical_recommendation || 'No recommendation available'

            return (
              <div key={idx} className="card flex flex-col h-full hover:shadow-lg">
                {/* Header */}
                <div className="pb-4 border-b border-slate-700/50">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="p-2 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 rounded-lg border border-cyan-500/30 flex-shrink-0">
                        <Pill size={18} className="text-cyan-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-cyan-300 truncate">{r.drug}</h3>
                    </div>
                    <RiskBadge risk_label={risk_label} />
                  </div>

                  <p className="text-xs text-slate-500 font-mono">Patient ID: {r.patient_id}</p>
                </div>

                {/* Content */}
                <div className="flex-1 py-4 space-y-4">
                  {/* Confidence Section */}
                  <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <div className="flex-shrink-0">
                      <ConfidenceGauge value={confidence_pct} id={`conf-${idx}`} size={56} />
                    </div>
                    <div className="text-sm space-y-2">
                      <div>
                        <span className="text-slate-400">Confidence:</span>
                        <span className="ml-2 font-semibold text-cyan-400">{confidence_pct}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Severity:</span>
                        <span className="ml-2 font-semibold text-cyan-300 capitalize">{severity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pharmacogenomic Info */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 mb-2">
                        <Microscope size={14} />
                        Primary Gene
                      </div>
                      <div className="px-3 py-2 bg-slate-800/50 rounded-lg font-mono text-sm text-cyan-400 border border-slate-700/50 break-words">
                        {primary_gene}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 mb-2">
                        <Activity size={14} />
                        Phenotype
                      </div>
                      <div className="px-3 py-2 bg-slate-800/50 rounded-lg text-sm text-purple-200 border border-slate-700/50 break-words">
                        {phenotype}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-green-300 mb-2">
                        <Shield size={14} />
                        Diplotype
                      </div>
                      <div className="px-3 py-2 bg-slate-800/50 rounded-lg font-mono text-sm text-green-200 border border-slate-700/50 break-words">
                        {diplotype}
                      </div>
                    </div>
                  </div>

                  {/* Clinical Recommendation */}
                  <div>
                    <div className="text-xs font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                      <AlertCircle size={14} />
                      Clinical Recommendation
                    </div>
                    <div className="px-3 py-2 bg-gradient-to-r from-cyan-600/10 to-purple-600/10 rounded-lg text-sm text-slate-200 border border-cyan-600/30 leading-relaxed break-words">
                      {clinical_rec}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-slate-700/50 space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyJSON(r)}
                      className="btn btn-secondary flex-1 flex items-center justify-center gap-2"
                    >
                      <Copy size={16} />
                      Copy
                    </button>
                    <button
                      onClick={() => downloadJSON(r)}
                      className="btn btn-secondary flex-1 flex items-center justify-center gap-2"
                    >
                      <Download size={16} />
                      Export
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={12} />
                    {r.timestamp ? new Date(r.timestamp).toLocaleString() : 'No date'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
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
