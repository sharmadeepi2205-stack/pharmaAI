import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

export default function Landing(){
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="min-h-screen pt-12">
        {/* Hero Section */}
        <section className="gradient-hero relative min-h-[70vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-500 to-teal-400 opacity-10"></div>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl"></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto px-6 py-20 w-full">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
                    PharmaGuard
                  </h1>
                  <p className="text-xl text-cyan-300 font-semibold">Personalized Drug Safety Using Genomics</p>
                </div>
                
                <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                  Upload your genomic VCF file, enter medications, and receive personalized pharmacogenomic recommendations based on CPIC standards.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <button 
                    onClick={()=>nav('/dashboard')} 
                    className="px-8 py-4 bg-cyan-600 text-black font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95 text-lg"
                  >
                    🚀 Start Analysis
                  </button>
                  <button 
                    onClick={()=>nav('/logs')} 
                    className="px-8 py-4 bg-transparent text-cyan-400 font-bold rounded-lg shadow-lg hover:bg-slate-900 hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95 text-lg border-2 border-cyan-400"
                  >
                    📋 View Logs
                  </button>
                </div>
              </div>
              
              <div className="hidden md:block space-y-4">
                <div className="bg-slate-950 rounded-2xl p-8 shadow-2xl backdrop-blur-sm border border-slate-800">
                  <h3 className="text-2xl font-bold text-cyan-400 mb-6">⚙️ How It Works</h3>
                  <ol className="space-y-4">
                    <li className="flex items-start gap-4">
                      <span className="text-3xl font-bold text-cyan-400 flex-shrink-0">1</span>
                      <div>
                        <p className="font-semibold text-slate-100">Upload VCF File</p>
                        <p className="text-sm text-slate-400">Submit your genomic data</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-3xl font-bold text-cyan-400 flex-shrink-0">2</span>
                      <div>
                        <p className="font-semibold text-slate-100">Enter Medications</p>
                        <p className="text-sm text-slate-400">List the drugs you take</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="text-3xl font-bold text-cyan-400 flex-shrink-0">3</span>
                      <div>
                        <p className="font-semibold text-slate-100">Get Recommendations</p>
                        <p className="text-sm text-slate-400">Receive personalized insights</p>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-950 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-cyan-600 p-8 hover:-translate-y-2 transition-transform">
              <div className="text-5xl mb-4">🧬</div>
              <h4 className="text-xl font-bold text-cyan-400 mb-3">Genomic Analysis</h4>
              <p className="text-slate-400 leading-relaxed">
                Advanced pharmacogenomic profiling using CPIC guidelines to identify drug-gene interactions and predict medication response.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-950 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-500 p-8 hover:-translate-y-2 transition-transform">
              <div className="text-5xl mb-4">💊</div>
              <h4 className="text-xl font-bold text-cyan-400 mb-3">Multi-Drug Support</h4>
              <p className="text-slate-400 leading-relaxed">
                Analyze multiple medications simultaneously. Supported drugs include anticoagulants, antidepressants, statins, and more.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-950 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-teal-400 p-8 hover:-translate-y-2 transition-transform">
              <div className="text-5xl mb-4">🛡️</div>
              <h4 className="text-xl font-bold text-cyan-400 mb-3">Safety First</h4>
              <p className="text-slate-400 leading-relaxed">
                Comprehensive risk assessment with confidence scoring and clinical recommendations for safer medication management.
              </p>
            </div>
          </div>
        </section>

        {/* Supported Drugs Section */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-slate-950 rounded-xl p-8 border border-slate-800 shadow-md">
            <h3 className="text-2xl font-bold text-cyan-400 mb-6">✨ Supported Drugs</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {['Codeine', 'Warfarin', 'Clopidogrel', 'Simvastatin', 'Azathioprine', '5-Fluorouracil', 'Omeprazole', 'Metoprolol', 'Sertraline'].map((drug, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span className="font-semibold text-slate-100">{drug}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-slate-900 border-l-4 border-cyan-600 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-cyan-400 mb-2">⚠️ Medical Disclaimer</h3>
            <p className="text-slate-300">
              Results and recommendations provided by this application are based on <strong>CPIC (Clinical Pharmacogenetics Implementation Consortium)</strong> guidelines and scientific evidence. They are for informational use only and do <strong>not replace professional medical advice</strong>. Always consult with a healthcare provider before making medication decisions.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-8 border-t border-slate-700">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-3">
          <p className="font-semibold text-slate-200">PharmaGuard — Personalized Pharmacogenomics</p>
          <p className="text-sm flex items-center justify-center gap-2">
            Built with <span className="text-red-500">❤️</span> · Powered by CPIC Guidelines · <span className="text-xs">© 2026</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
