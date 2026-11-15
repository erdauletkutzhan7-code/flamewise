import { useState } from 'react'
import PageWrapper from '../components/PageWrapper'
import { Bot, Send, Sparkles, BookOpen, Info } from 'lucide-react'
import { CURATED_ASSISTANT_RESPONSES } from '../data/nasaFacts'

interface Message {
  role: 'assistant' | 'user'
  title?: string
  content: string
  source?: string
  sourceUrl?: string
  relevanceTag?: string
  isFallback?: boolean
}

const SUGGESTED_PROMPTS = [
  'Why does flame shape change in microgravity?',
  'What affects flame spread in spacecraft?',
  'How does pressure affect combustion?',
  'What did NASA discover regarding spacecraft smoke?',
  'What was the breakthrough of the Saffire series?',
  'What are cool flames discovered in FLEX?',
  'How does the Live Flame Lab calculate scale parameters?'
]

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      title: 'NASA Combustion Research Assistant',
      content: 'Welcome to the NASA Research Assistant. My answers are curated strictly from documented NASA microgravity combustion research (PSI Repository, NTRS, Glenn Research Center). Select a question below or submit an inquiry.',
      source: 'NASA Physical Sciences Informatics',
      sourceUrl: 'https://psi.nasa.gov',
      relevanceTag: 'Verified Knowledge Base'
    }
  ])
  const [input, setInput] = useState('')

  const handleSend = (queryText?: string) => {
    const q = (queryText || input).trim()
    if (!q) return
    setInput('')

    const queryLower = q.toLowerCase()

    // Find match in curated knowledge base
    const matched = CURATED_ASSISTANT_RESPONSES.find(item =>
      item.keys.some(k => queryLower.includes(k))
    )

    if (matched) {
      setMessages(prev => [
        ...prev,
        { role: 'user', content: q },
        {
          role: 'assistant',
          title: matched.title,
          content: matched.text,
          source: matched.source,
          sourceUrl: matched.url,
          relevanceTag: matched.relevanceTag
        }
      ])
    } else {
      // Deterministic, transparent fallback
      setMessages(prev => [
        ...prev,
        { role: 'user', content: q },
        {
          role: 'assistant',
          title: 'Query Beyond Curated NASA Dataset',
          content: 'This educational assistant is strictly source-bounded to prevent scientific inaccuracies or hallucinated measurements. Your query is outside the indexed combustion studies (BASS, Saffire, FLEX, SAME, ACME, SPICE, FM2). Please consult the full NASA PSI database directly.',
          source: 'NASA Physical Sciences Informatics Repository',
          sourceUrl: 'https://psi.nasa.gov/physci/repo/search?q=combustion',
          relevanceTag: 'Official NASA Search',
          isFallback: true
        }
      ])
    }
  }

  return (
    <PageWrapper className="max-w-5xl mx-auto px-4 py-8">
      {/* Header & Transparency Notice */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-flame-500/10 border border-flame-500/20 flex items-center justify-center text-flame-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">NASA Combustion Research Assistant</h1>
            <p className="text-xs font-mono text-gray-400 mt-0.5">SOURCE-BOUNDED CURATED RESPONSES · ZERO UNVERIFIED HALLUCINATIONS</p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex items-start gap-3">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-300 leading-relaxed">
            <strong>Architecture Notice:</strong> Responses are curated directly from peer-reviewed NASA microgravity papers 
            and technical reports. To maintain scientific integrity and prevent hallucination, answers are restricted to verified 
            investigation domains.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Chat Stream (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col h-[600px] glass-card bg-slate-900/60 border border-white/10 overflow-hidden">
          {/* Messages scroll area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 ${
                  m.role === 'user'
                    ? 'bg-flame-500/20 border border-flame-500/40 text-white'
                    : m.isFallback
                    ? 'bg-amber-950/20 border border-amber-500/30 text-gray-200'
                    : 'bg-white/[0.04] border border-white/10 text-gray-200'
                }`}>
                  {m.title && (
                    <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/5">
                      <span className="font-serif font-bold text-white text-sm">{m.title}</span>
                      {m.relevanceTag && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-cyan-400 border border-white/10">
                          {m.relevanceTag}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">{m.content}</p>

                  {m.source && (
                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-gray-400">Source: {m.source}</span>
                      {m.sourceUrl && (
                        <a
                          href={m.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
                        >
                          View Source ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input & Form */}
          <div className="p-4 border-t border-white/10 bg-black/40">
            <form onSubmit={(e) => { e.preventDefault(); handleSend() }} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about microgravity flame shape, smoke, Saffire, FLEX, BASS..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-flame-500"
              />
              <button type="submit" className="btn-primary !py-2 !px-4">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Curated Prompt Directory (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card p-4 border border-white/10 bg-slate-900/60">
            <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Curated Inquiry Topics
            </h2>
            <div className="space-y-2">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-cyan-500/30 text-xs text-gray-300 hover:text-white transition-all flex items-start gap-2"
                >
                  <span className="text-cyan-400 font-mono text-[10px] mt-0.5">0{i+1}.</span>
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-4 border border-white/10 text-xs space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-flame-400" /> Sourced Scientific Scope
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Covers BASS (solid flame spread), Saffire (spacecraft scale), FLEX (droplet & cool flames), 
              SAME (smoke particles), ACME (gas diffusion & soot), and FM2 (lunar combustion).
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
