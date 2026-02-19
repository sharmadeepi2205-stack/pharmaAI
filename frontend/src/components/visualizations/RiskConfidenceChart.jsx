import React, { useState, useEffect } from 'react'

export default function RiskConfidenceChart({ result }) {
  const [confidence, setConfidence] = useState(0)
  
  const riskLabel = result.risk_assessment?.risk_label || 'Unknown'
  const confidenceScore = result.risk_assessment?.confidence_score || 0
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setConfidence(Math.round(confidenceScore * 100))
    }, 300)
    return () => clearTimeout(timer)
  }, [confidenceScore])

  const riskColors = {
    'Safe': { gradient: 'from-green-500 to-green-600', text: 'text-green-400' },
    'Adjust Dosage': { gradient: 'from-amber-500 to-amber-600', text: 'text-amber-400' },
    'Ineffective': { gradient: 'from-orange-500 to-orange-600', text: 'text-orange-400' },
    'Toxic': { gradient: 'from-red-500 to-red-600', text: 'text-red-400' },
  }

  const colors = riskColors[riskLabel] || riskColors['Safe']

  return (
    <div>
      <h3 className="text-lg font-semibold text-sky-300 mb-6">Clinical Risk & Confidence</h3>
      
      <div className="space-y-8">
        {/* Confidence Gauge */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400">Analysis Confidence</span>
            <span className={`text-2xl font-bold ${colors.text}`}>{confidence}%</span>
          </div>
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${colors.gradient} transition-all duration-1000 ease-out`}
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Higher confidence = stronger evidence from genetic analysis
          </div>
        </div>

        {/* Risk Label */}
        <div>
          <span className="text-slate-400 block mb-2">Risk Classification</span>
          <div className={`inline-block px-6 py-3 rounded-lg font-bold text-white bg-gradient-to-r ${colors.gradient} shadow-lg`}>
            {riskLabel}
          </div>
        </div>
      </div>
    </div>
  )
}
