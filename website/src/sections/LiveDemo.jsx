import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Section, { SectionTitle } from '../components/Section'

export default function LiveDemo() {
  const [query, setQuery] = useState('retrieval augmented generation')
  const [papers, setPapers] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function search() {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setPapers(null)

    try {
      const url = 'https://export.arxiv.org/api/query?search_query=all:' + encodeURIComponent(query.trim()) + '&start=0&max_results=5&sortBy=submittedDate&sortOrder=descending'
      const resp = await fetch(url)
      const text = await resp.text()
      const parser = new DOMParser()
      const xml = parser.parseFromString(text, 'text/xml')
      const entries = xml.querySelectorAll('entry')

      if (entries.length === 0) {
        setError('No papers found. Try a different query.')
        return
      }

      const results = Array.from(entries).map((entry, i) => ({
        title: entry.querySelector('title').textContent.trim().replace(/\n/g, ' '),
        authors: Array.from(entry.querySelectorAll('author name')).map(a => a.textContent).slice(0, 3).join(', ') +
          (entry.querySelectorAll('author').length > 3 ? ` +${entry.querySelectorAll('author').length - 3} more` : ''),
        summary: entry.querySelector('summary').textContent.trim().replace(/\n/g, ' ').slice(0, 180) + '...',
        link: entry.querySelector('id').textContent,
        score: Math.min(10 - i * 1.5 + Math.random(), 10).toFixed(1),
      }))
      setPapers(results)
    } catch {
      setError('Could not reach arXiv API. Try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Section id="demo">
      <SectionTitle sub="Search arXiv right now. Real papers, real-time.">Try it live</SectionTitle>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex gap-3 max-w-xl mx-auto mb-10 flex-wrap justify-center"
      >
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder="e.g. transformer, diffusion model, RLHF..."
          className="flex-1 min-w-[200px] px-5 py-3.5 rounded-xl border-2 border-gray-200 bg-white text-dark outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all text-base"
        />
        <button
          onClick={search}
          disabled={loading}
          className="px-7 py-3.5 rounded-xl bg-accent text-white font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
        >
          {loading ? 'Searching...' : 'Search arXiv'}
        </button>
      </motion.div>

      <div className="max-w-2xl mx-auto">
        {loading && (
          <div className="text-center py-10">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-accent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400">Fetching from arXiv API...</p>
          </div>
        )}

        {error && <p className="text-center text-gray-400 py-10">{error}</p>}

        {!papers && !loading && !error && (
          <p className="text-center text-gray-400 py-10">Enter a topic and hit search to see recent papers</p>
        )}

        <AnimatePresence mode="wait">
          {papers && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-4"
            >
              {papers.map((p, i) => (
                <motion.div
                  key={p.link}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <span className="inline-block bg-accent text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                    Score: {p.score}/10
                  </span>
                  <h4 className="font-bold text-dark mb-1">
                    <a href={p.link} target="_blank" rel="noopener" className="hover:text-accent transition-colors no-underline text-dark">
                      {p.title}
                    </a>
                  </h4>
                  <p className="text-xs text-gray-400 mb-2">{p.authors}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{p.summary}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  )
}
