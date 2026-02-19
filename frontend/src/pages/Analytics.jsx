import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import RiskConfidenceChart from '../components/visualizations/RiskConfidenceChart'
import GeneDrugImpact from '../components/visualizations/GeneDrugImpact'
import GenotypePhenotypeFlow from '../components/visualizations/GenotypePhenotypeFlow'
import VariantChips from '../components/visualizations/VariantChips'
import GeneVariantBar from '../components/visualizations/GeneVariantBar'
import SeverityScale from '../components/visualizations/SeverityScale'
import MultiDrugComparison from '../components/visualizations/MultiDrugComparison'
import ExplanationStructure from '../components/visualizations/ExplanationStructure'
import CpicTrustCard from '../components/visualizations/CpicTrustCard'

export default function Analytics() {
  const location = useLocation()
  const navigate = useNavigate()
  const [results, setResults] = useState([])

  useEffect(() => {
    // Get results from location state (passed from Dashboard via navigate)
    if (location.state?.results) {
      const data = location.state.results
      setResults(Array.isArray(data) ? data : [data])
    } else {
      // If no data, redirect back to dashboard
      navigate('/dashboard')
    }
  }, [location, navigate])

  if (!results.length) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-lg text-slate-400 mb-4">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Page Title */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Pharmacogenomic Analytics
          </h1>
          <p className="text-slate-400">
            Deep analysis of genetic relationships and clinical implications
          </p>
        </div>

        {/* Results Loop */}
        {results.map((result, idx) => (
          <div key={idx} className="mb-20">
            {/* Drug Header */}
            <div className="mb-8 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-400 rounded"></div>
                <h2 className="text-3xl font-bold text-cyan-300">{result.drug}</h2>
              </div>
              <p className="text-slate-500 ml-5">
                Patient ID: <span className="text-slate-300 font-mono">{result.patient_id}</span>
              </p>
            </div>

            {/* Grid Layout for Visualizations */}
            <div className="space-y-12">
              {/* Row 1: Risk & Severity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-950 rounded-lg p-6 border border-slate-700 animate-slide-up">
                  <RiskConfidenceChart result={result} />
                </div>
                <div className="bg-slate-950 rounded-lg p-6 border border-slate-700 animate-slide-up">
                  <SeverityScale data={result} />
                </div>
              </div>

              {/* Row 2: Gene-Drug Relationship */}
              <div className="bg-slate-950 rounded-lg p-6 border border-slate-700 animate-slide-up">
                <GeneDrugImpact data={result} />
              </div>

              {/* Row 3: Genotype Flow */}
              <div className="bg-slate-950 rounded-lg p-6 border border-slate-700 animate-slide-up">
                <GenotypePhenotypeFlow data={result} />
              </div>

              {/* Row 4: Variants */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-950 rounded-lg p-6 border border-slate-700 animate-slide-up">
                  <VariantChips data={result} />
                </div>
                <div className="bg-slate-950 rounded-lg p-6 border border-slate-700 animate-slide-up">
                  <GeneVariantBar data={result} />
                </div>
              </div>

              {/* Row 5: Explanation */}
              <div className="bg-slate-950 rounded-lg p-6 border border-slate-700 animate-slide-up">
                <ExplanationStructure data={result} />
              </div>

              {/* Row 6: CPIC Trust Card */}
              <div className="bg-slate-950 rounded-lg p-6 border border-slate-700 animate-slide-up">
                <CpicTrustCard data={result} />
              </div>
            </div>
          </div>
        ))}

        {/* Multi-Drug Comparison (if applicable) */}
        {results.length > 1 && (
          <div className="mt-20 pt-12 border-t border-slate-800">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-400 rounded"></div>
                <h2 className="text-3xl font-bold text-cyan-300">Multi-Drug Comparison</h2>
              </div>
            </div>
            <div className="bg-slate-950 rounded-lg p-6 border border-slate-700 animate-slide-up">
              <MultiDrugComparison data={results} raw={{ results }} />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
