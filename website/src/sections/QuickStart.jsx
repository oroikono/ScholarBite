import { motion } from 'framer-motion'
import Section, { SectionTitle } from '../components/Section'

const lines = [
  { type: 'comment', text: '# Install' },
  { type: 'cmd', text: 'pip install nanobot-ai' },
  { type: 'blank' },
  { type: 'comment', text: '# Clone & configure' },
  { type: 'cmd', text: 'git clone https://github.com/oroikono/ScholarBite.git' },
  { type: 'cmd', text: 'cd ScholarBite' },
  { type: 'cmd', text: 'cp config/config.example.json ~/.nanobot/config.json' },
  { type: 'cmd', text: 'cp .env.example .env' },
  { type: 'blank' },
  { type: 'comment', text: '# Add your API key and research interests, then:' },
  { type: 'cmd', text: 'docker compose up -d' },
]

export default function QuickStart() {
  return (
    <Section id="quickstart" dark>
      <SectionTitle sub="Clone, configure, launch.">Up and running in 5 minutes</SectionTitle>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-dark rounded-2xl p-7 max-w-2xl mx-auto font-mono text-sm leading-7 shadow-2xl shadow-dark/50 overflow-x-auto"
      >
        {lines.map((l, i) => {
          if (l.type === 'blank') return <div key={i} className="h-4" />
          if (l.type === 'comment') return <div key={i} className="text-gray-500">{l.text}</div>
          return <div key={i} className="text-green-400">{l.text}</div>
        })}
      </motion.div>
    </Section>
  )
}
