import { useState } from 'react'
import { Download, ExternalLink, Filter } from 'lucide-react'
import { NASA_SCIENTIFIC_FACTS } from '../data/nasaFacts'

export default function ScientificDataExplorer() {
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  const [selectedEvidence] = useState<string>('all')

  const filteredFacts = NASA_SCIENTIFIC_FACTS.filter(fact => {
    if (selectedTopic !== 'all' && fact.experiment !== selectedTopic) return false
    if (selectedEvidence !== 'all' && fact.evidenceType !== selectedEvidence) return false
    return true
  })

  // CSV export handler
  const exportToCSV = () => {
    const headers = ['Experiment', 'Sub-Investigation', 'Topic', 'Value/Headline', 'Detail', 'Evidence Type', 'Limitations', 'Source Title', 'Source URL']
    const rows = filteredFacts.map(f => [
      `"${f.experiment}"`,
      `"${f.subInvestigation || 'N/A'}"`,
      `"${f.topic}"`,
      `"${f.headline}"`,
      `"${f.detail.replace(/"/g, '""')}"`,
      `"${f.evidenceType}"`,
      `"${f.limitations.replace(/"/g, '""')}"`,
      `"${f.sourceTitle}"`,
      `"${f.sourceUrl}"`
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `nasa_combustion_facts_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 glass-card bg-slate-900/60 border border-white/10">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">VERIFIED NASA ARCHIVE</span>
          <h2 className="text-xl font-serif font-bold text-white mt-0.5">Scientific Data Explorer</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Range values, test conditions, and counts sourced strictly from official NASA documentation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="btn-secondary !py-2 !px-3 text-xs flex items-center gap-2 border-cyan-500/30 hover:border-cyan-400 text-cyan-300"
          >
            <Download className="w-3.5 h-3.5" /> Export Data (CSV)
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="text-gray-400 font-mono flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filter Investigation:
        </span>
        {['all', 'ACME', 'BASS / BASS-II', 'Saffire-I', 'FLEX / FLEX-2', 'SAME / SAME-R', 'SPICE', 'FM2'].map(opt => (
          <button
            key={opt}
            onClick={() => setSelectedTopic(opt)}
            className={`px-2.5 py-1 rounded-md border font-mono transition-all ${
              selectedTopic === opt
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {opt === 'all' ? 'All' : opt}
          </button>
        ))}
      </div>

      {/* Facts Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacts.map(fact => (
          <div key={fact.id} className="glass-card p-5 flex flex-col justify-between border-t-2 border-t-cyan-500/80">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono font-bold text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  {fact.experiment}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider ${
                  fact.evidenceType === 'measured result' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' :
                  fact.evidenceType === 'test setting' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' :
                  'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                }`}>
                  {fact.evidenceType}
                </span>
              </div>

              <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wide mt-1">
                {fact.topic}
              </div>

              <div className="text-2xl font-serif font-bold text-white my-2">
                {fact.headline}
              </div>

              <p className="text-xs text-gray-300 leading-relaxed mb-3">
                {fact.detail}
              </p>

              {fact.secondaryNote && (
                <div className="text-[11px] font-mono text-cyan-300/90 bg-cyan-950/30 p-2 rounded border border-cyan-500/20 mb-3">
                  {fact.secondaryNote}
                </div>
              )}

              {/* Graphic Range Representation */}
              {fact.rangeMin !== undefined && fact.rangeMax !== undefined && (
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-[10px] font-mono text-gray-400">
                    <span>Min: {fact.rangeMin}</span>
                    <span>{fact.unitLabel}</span>
                    <span>Max: {fact.rangeMax}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 relative overflow-hidden border border-white/5">
                    <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-cyan-500 to-flame-500 opacity-70" />
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-white/5 pt-3 space-y-2 mt-auto">
              <div className="text-[10px] text-gray-500 italic leading-snug">
                <strong>Scope & Limitation:</strong> {fact.limitations}
              </div>
              <a
                href={fact.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center justify-between group pt-1"
              >
                <span className="truncate">{fact.sourceTitle}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
