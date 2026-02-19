function clamp01(n){
  const v = Number(n)
  if(!isFinite(v)) return 0
  return Math.max(0, Math.min(1, v))
}

function pick(...vals){
  for(const v of vals){
    if(v!==undefined && v!==null) return v
  }
  return undefined
}

function normalizeRiskLabel(rawLabel){
  if(!rawLabel) return 'Safe'
  const s = String(rawLabel).toLowerCase()
  if(s.includes('safe')) return 'Safe'
  if(s.includes('adjust') || s.includes('dose') || s.includes('dosage')) return 'Adjust Dosage'
  if(s.includes('toxic') || s.includes('critical') || s.includes('fatal')) return 'Toxic'
  if(s.includes('ineffect') || s.includes('ineffic') || s.includes('fail') || s.includes('ineffective')) return 'Ineffective'
  return 'Safe'
}

function normalizeVariant(v){
  if(!v) return null
  if(typeof v === 'string') return { rsid: v, gene: undefined, info: undefined }
  // common shapes
  const rsid = v.rsid || v.id || v.name || (v.variant && v.variant.rsid) || undefined
  const gene = v.gene || v.g || v.symbol || (v.pharmacogene) || undefined
  const info = v.info || v.notes || v.annotation || undefined
  return { rsid, gene, info }
}

export default function normalizeResult(raw){
  if(!raw) return null

  // Handle array of results (multiple drugs)
  if(Array.isArray(raw.results) && raw.results.length > 1){
    return raw.results.map(r => normalizeResultItem(r))
  }

  // Handle single result
  const source = (Array.isArray(raw.results) && raw.results.length > 0) ? raw.results[0] : raw
  return normalizeResultItem(source)
}

function normalizeResultItem(source){
  if(!source) return null

  // ensure we never mutate raw; read from source
  const drug = pick(source.drug, source.drug_name, source.input && source.input.drug, 'Unknown Drug')
  const patient_id = pick(source.patient_id, source.sample_id, source.metadata && source.metadata.patient_id, 'Anonymous')

  const risk_label_raw = pick(
    source.risk_assessment && source.risk_assessment.risk_label,
    source.risk && source.risk.label,
    source.classification,
    source.risk_label
  )
  const risk_label = normalizeRiskLabel(risk_label_raw)

  const severity = pick(
    source.risk_assessment && source.risk_assessment.severity,
    source.risk && source.risk.severity,
    'Moderate'
  )

  const confidence_score = clamp01(pick(
    source.risk_assessment && source.risk_assessment.confidence_score,
    source.confidence,
    source.score,
    0
  ))

  const primary_gene = pick(
    source.pharmacogenomic_profile && source.pharmacogenomic_profile.primary_gene,
    source.gene,
    (Array.isArray(source.genes) && source.genes[0]),
    '—'
  )

  const diplotype = pick(
    source.pharmacogenomic_profile && source.pharmacogenomic_profile.diplotype,
    source.genotype,
    'N/A'
  )

  const phenotype = pick(
    source.pharmacogenomic_profile && source.pharmacogenomic_profile.phenotype,
    source.metabolizer_status,
    'N/A'
  )

  const variantsSource = pick(source.variants, source.detected_variants, source.pharmacogenomic_profile && source.pharmacogenomic_profile.variants, [])
  const detected_variants = Array.isArray(variantsSource) ? variantsSource.map(normalizeVariant).filter(Boolean) : []

  const clinicRecRaw = pick(source.clinical_recommendation, source.recommendation, source.action)
  let clinical_recommendation = ''
  if(!clinicRecRaw) clinical_recommendation = ''
  else if(typeof clinicRecRaw === 'string') clinical_recommendation = clinicRecRaw
  else if(typeof clinicRecRaw === 'object') clinical_recommendation = clinicRecRaw.action || clinicRecRaw.recommendation || JSON.stringify(clinicRecRaw)
  else clinical_recommendation = String(clinicRecRaw)

  const llm_summary = pick(
    source.llm_generated_explanation && source.llm_generated_explanation.summary,
    source.explanation,
    source.reasoning,
    ''
  )

  // construct normalized object (ui-safe)
  const normalized = {
    // preserve top-level identifiers
    drug,
    patient_id,
    timestamp: source.timestamp || source.generated_at || source.time || undefined,

    risk_assessment: {
      risk_label,
      severity,
      confidence_score,
      // preserve any original dosage_guideline if present
      dosage_guideline: source.risk_assessment && source.risk_assessment.dosage_guideline || source.dosage_guideline || undefined
    },

    pharmacogenomic_profile: {
      primary_gene,
      diplotype,
      phenotype,
      detected_variants
    },

    clinical_recommendation,

    llm_generated_explanation: { summary: llm_summary },

    // attach a shallow copy of some raw fields for reference (do not mutate raw)
    _meta: {
      original_keys: Object.keys(source || {}),
      source_is_array: false
    }
  }

  return normalized
}
