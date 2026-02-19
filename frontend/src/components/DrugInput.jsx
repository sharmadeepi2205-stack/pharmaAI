import React, {useState} from 'react'

const SUPPORTED = ['CODEINE','WARFARIN','CLOPIDOGREL','SIMVASTATIN','AZATHIOPRINE','FLUOROURACIL']

export default function DrugInput({drugs, setDrugs}){
  const [text, setText] = useState('')

  function addFromText(){
    const list = text.split(',').map(s=>s.trim().toUpperCase()).filter(Boolean)
    if(list.length===0) return
    setDrugs(Array.from(new Set([...drugs, ...list])))
    setText('')
  }

  function toggleDrug(d){
    if(drugs.includes(d)) setDrugs(drugs.filter(x=>x!==d))
    else setDrugs([...drugs, d])
  }

  return (
    <div className="mt-4">
      <label className="block text-sm font-semibold text-slate-300">Drugs (select or type)</label>
      <div className="mt-3 flex flex-wrap gap-2">
        {SUPPORTED.map(d=> (
          <button
            key={d}
            onClick={()=>toggleDrug(d)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
              drugs.includes(d)
                ? 'bg-cyan-600 text-white border-cyan-600'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-cyan-400 hover:bg-slate-700'
            }`}
            aria-pressed={drugs.includes(d)}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={e=>setText(e.target.value)}
          placeholder="Type and press Add"
          className="flex-1 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        />
        <button
          onClick={addFromText}
          disabled={!text.trim()}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            !text.trim()
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-cyan-600 text-white hover:bg-cyan-700'
          }`}
        >
          Add
        </button>
      </div>

      <div className="mt-3 text-sm text-slate-400">Selected: <span className="font-semibold text-slate-200">{drugs.join(', ') || '—'}</span></div>
    </div>
  )
}
