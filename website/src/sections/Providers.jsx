import { motion } from 'framer-motion'
import Section, { SectionTitle } from '../components/Section'
import GlassCard from '../components/GlassCard'

const providers = [
  { name: 'Ollama', cost: 'Free', desc: 'Run locally. Full privacy. Llama, DeepSeek, Mistral, Qwen.' },
  { name: 'OpenRouter', cost: '~$0.01/day', desc: 'Access Sonnet, GPT-4, Gemini, and more with one key.' },
  { name: 'Anthropic', cost: '~$0.05/day', desc: 'Anthropic API directly. Great for nuanced research analysis.' },
  { name: 'OpenAI', cost: '~$0.03/day', desc: 'GPT-4o. Fast and cost-effective summaries.' },
]

export default function Providers() {
  return (
    <Section id="providers">
      <SectionTitle sub="Cloud APIs or local models. Your choice.">Works with any LLM</SectionTitle>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {providers.map((p, i) => (
          <GlassCard key={p.name} delay={i * 0.08} className="text-center">
            <h3 className="font-bold text-dark text-lg mb-1">{p.name}</h3>
            <motion.div
              whileHover={{ scale: 1.15 }}
              className="text-accent text-xl font-bold mb-2"
            >
              {p.cost}
            </motion.div>
            <p className="text-gray-500 text-sm">{p.desc}</p>
          </GlassCard>
        ))}
      </div>
    </Section>
  )
}
