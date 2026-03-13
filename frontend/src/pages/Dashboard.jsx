import React, {useState} from 'react'
import UploadZone from '../components/UploadZone'
import DrugInput from '../components/DrugInput'
import ResultsPanel from '../components/ResultsPanel'
import normalizeResult from '../utils/normalizeResult'
import Header from '../components/Header'
import { useAnalysis } from '../context/AnalysisContext'
import api from '../services/api'

export default function Dashboard(){
  const { analysisResult, setAnalysisResult, file, setFile, drugs, setDrugs, uploadError, setUploadError, clearAll } = useAnalysis()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  // analyze enabled only if file exists, no upload error, and at least one drug
  const canAnalyze = file && !uploadError && (drugs.length>0)

  async function handleAnalyze(){
    setError('')
    setAnalysisResult(null)
    setLoading(true)
    try{
      const form = new FormData()
      form.append('vcf_file', file)
      form.append('drugs', drugs.join(','))
      // IMPORTANT: Do NOT manually set Content-Type header for FormData
      // axios will automatically set it with the correct boundary
      const resp = await api.post('/analyze', form)
      
      // Check if response has data
      if (!resp.data || typeof resp.data !== 'object') {
        throw new Error('Invalid response format from server')
      }
      
      // Check if the response indicates an error (even if HTTP 200)
      if (resp.data.success === false || resp.data.error_type) {
        throw new Error(resp.data.message || 'Server returned an error')
      }
      
      // normalize backend JSON for UI safety (do not mutate resp.data)
      const normalized = normalizeResult(resp.data)
      
      // Validate normalized result
      if (!normalized) {
        throw new Error('Failed to process analysis results')
      }
      
      setAnalysisResult({ normalized, raw: resp.data })
      setError('')
      setToast({type:'success', message:'✅ Analysis complete! Results saved to logs.'})
    }catch(e){
      console.error('Analysis error:', e)
      setAnalysisResult(null)
      setError(e.response?.data?.message || e.message || 'Unable to analyze. Please try again later.')
      setToast({type:'error', message:'❌ Analysis failed'})
    }finally{ setLoading(false); setTimeout(()=>setToast(null),3000) }
  }

  function resetAll(){ 
    clearAll()
    setError('') 
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-8">
          {/* Input Section */}
          <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg border border-cyan-600/50 p-6 shadow-lg">
            <h2 className="text-xl font-bold text-cyan-400 mb-6">Input</h2>
            <div className="space-y-6">
              <UploadZone file={file} setFile={setFile} uploadError={uploadError} setUploadError={setUploadError} />
              <DrugInput drugs={drugs} setDrugs={setDrugs} />

              <div className="pt-4 border-t border-cyan-600/50 flex gap-3">
                <button disabled={!canAnalyze || loading} onClick={handleAnalyze} className="flex-1 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:bg-slate-700 disabled:text-slate-400 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-cyan-600/30 disabled:shadow-none">
                  {loading? 'Analyzing genomic variants…' : 'Analyze'}
                </button>
                <button onClick={resetAll} className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold rounded-lg transition-colors duration-200 border border-slate-600 hover:border-slate-500">
                  Reset
                </button>
              </div>
              {error && <div className="p-3 bg-red-950 border border-red-800 text-red-300 rounded-lg text-sm">{error}</div>}
              {uploadError && <div className="p-3 bg-red-950 border border-red-800 text-red-300 rounded-lg text-sm">{uploadError}</div>}
            </div>
          </section>

          {/* Results Section */}
          <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg border border-cyan-600/50 p-6 shadow-lg">
            <h2 className="text-xl font-bold text-cyan-400 mb-4">Results</h2>
            <div className="text-sm text-slate-500 mb-4">{analysisResult?.normalized?.timestamp}</div>

            {loading ? (
              <div className="space-y-3">
                <div className="h-14 skeleton rounded"></div>
                <div className="h-6 skeleton rounded w-1/2"></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-40 skeleton rounded"></div>
                  <div className="h-40 skeleton rounded"></div>
                </div>
              </div>
            ) : error ? (
              <div className="text-slate-400 text-center py-8">Analysis failed. Please check the error message above and try again.</div>
            ) : (
              (analysisResult) ? <ResultsPanel data={analysisResult.normalized} raw={analysisResult.raw} selectedDrugs={drugs} /> : <div className="text-slate-400 text-center py-8">No results yet. Upload a VCF file and select drugs, then click Analyze.</div>
            )}
          </section>
        </div>
      </div>

      <footer className="max-w-7xl mx-auto px-6 py-6 mt-8 text-xs text-slate-500 border-t border-cyan-600/50">
        Recommendations provided by this application are based on CPIC (Clinical Pharmacogenetics Implementation Consortium) guidelines and scientific evidence. This tool is for informational purposes only and does not replace medical advice.
      </footer>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg ${toast.type==='success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          <div className="text-sm font-medium">{toast.message}</div>
        </div>
      )}
    </div>
  )
}
