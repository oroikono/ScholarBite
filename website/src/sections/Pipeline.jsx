import { motion } from 'framer-motion'
import Section, { SectionTitle } from '../components/Section'

const steps = [
  { num: 1, title: 'Fetch', desc: 'Query arXiv API for papers in your categories from the last 24 hours' },
  { num: 2, title: 'Score', desc: 'Rank by keyword matches, category overlap, and code availability (no LLM needed)' },
  { num: 3, title: 'Summarize', desc: 'Top 15 papers get one-line summaries via your chosen LLM' },
  { num: 4, title: 'Deliver', desc: 'Formatted digest sent to Slack or WhatsApp. Reply to chat.' },
]

export default function Pipeline() {
  return (
    <Section id="pipeline" dark>
      <SectionTitle sub="Metadata-first architecture. Fast, cheap, accurate.">How it works</SectionTitle>
      <div className="grid md:grid-cols-4 gap-8">
        {steps.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-14 h-14 rounded-full bg-accent text-white text-xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent/30"
            >
              {s.num}
            </motion.div>
            <h3 className="font-bold text-dark mb-2">{s.title}</h3>
            <p className="text-gray-500 text-sm">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
