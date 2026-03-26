import Section, { SectionTitle } from '../components/Section'
import GlassCard from '../components/GlassCard'

const items = [
  { title: 'Local memory', desc: 'Conversation history and preferences are stored in local files on your machine. Nothing is uploaded to external servers by ScholarBite.' },
  { title: 'Slack Socket Mode', desc: 'Outbound WebSocket connection only. No public URL exposed. Works behind firewalls. Minimal permissions: chat:write, channels:read.' },
  { title: 'Full local option', desc: "Use Ollama for LLM processing. The only external call is to arXiv's public API. Paper analysis never leaves your machine." },
]

export default function Privacy() {
  return (
    <Section id="privacy">
      <SectionTitle sub="Your research stays yours.">Privacy & Security</SectionTitle>
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <GlassCard key={item.title} delay={i * 0.1}>
            <h3 className="font-bold text-dark text-lg mb-2">{item.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
          </GlassCard>
        ))}
      </div>
    </Section>
  )
}
