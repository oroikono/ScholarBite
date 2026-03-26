import Section, { SectionTitle } from '../components/Section'
import GlassCard from '../components/GlassCard'
import { motion } from 'framer-motion'

const features = [
  { icon: '\u{1F4E8}', title: 'Morning Digest', desc: 'Every day, ScholarBite scans arXiv for papers matching your research interests and delivers a ranked summary to your Slack or WhatsApp.' },
  { icon: '\u{1F3AF}', title: 'Relevance Scoring', desc: 'Papers are scored 0\u201310 based on keyword matches, category overlap, and code availability. You see the most relevant work first.' },
  { icon: '\u{1F4AC}', title: 'Chat Follow-ups', desc: 'Reply to any report to dig deeper. Ask about methodology, compare papers, or find related code repos \u2014 the agent remembers context.' },
  { icon: '\u{1F4BB}', title: 'Code Discovery', desc: 'Automatically detects GitHub, GitLab, and HuggingFace links in paper metadata. Know immediately if a paper has reproducible code.' },
  { icon: '\u{1F9E0}', title: 'Learns From You', desc: 'The agent stores conversations locally and adapts over time. The more you interact, the better the recommendations.' },
  { icon: '\u{1F512}', title: 'Privacy First', desc: 'All memory stays on your machine. Use a local LLM (Ollama) for full privacy \u2014 only arXiv queries leave your network.' },
]

export default function Features() {
  return (
    <Section id="features">
      <SectionTitle sub="Stop scrolling arXiv. Start reading what matters.">What it does</SectionTitle>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <GlassCard key={f.title} delay={i * 0.08}>
            <motion.div
              className="text-3xl mb-4 inline-block"
              whileHover={{ scale: 1.3, rotate: -10 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              {f.icon}
            </motion.div>
            <h3 className="text-lg font-bold text-dark mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
          </GlassCard>
        ))}
      </div>
    </Section>
  )
}
