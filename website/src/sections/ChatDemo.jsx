import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Section, { SectionTitle } from '../components/Section'

const messages = [
  { role: 'user', text: 'Tell me more about paper #3' },
  { role: 'bot', text: 'That paper proposes a new RAG pipeline that reduces hallucination by 40% using retrieval verification chains. The key insight is...' },
  { role: 'user', text: 'Does it have code?' },
  { role: 'bot', text: 'Yes \u2014 PyTorch implementation at github.com/author/rag-verify. Uses HuggingFace Transformers, tested on NQ and TriviaQA.' },
  { role: 'user', text: "How does it compare to yesterday's CRAG paper?" },
  { role: 'bot', text: "Both tackle RAG hallucination but from different angles. Yesterday's CRAG paper uses corrective retrieval post-hoc, while this one embeds verification into the generation loop..." },
]

function TypingLine({ role, text, onDone }) {
  const [displayed, setDisplayed] = useState('')
  const speed = role === 'user' ? 30 : 15

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
        onDone?.()
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed, onDone])

  return (
    <div className="mb-2 min-h-[1.6em]">
      <span className={role === 'user' ? 'text-green-400' : 'text-gray-400'}>
        {role === 'user' ? 'You: ' : 'ScholarBite: '}
      </span>
      <span className={role === 'bot' ? 'text-gray-300' : ''}>
        {displayed}
      </span>
      {displayed.length < text.length && (
        <span className="inline-block w-0.5 h-4 bg-accent-light ml-0.5 align-text-bottom animate-pulse" />
      )}
    </div>
  )
}

export default function ChatDemo() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, amount: 0.4 })
  const [visibleCount, setVisibleCount] = useState(0)
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (inView) {
      setVisibleCount(0)
      setKey(k => k + 1)
    }
  }, [inView])

  function handleDone() {
    const next = visibleCount + 1
    if (next < messages.length) {
      setTimeout(() => setVisibleCount(next), next > 0 && messages[next - 1].role === 'bot' ? 600 : 300)
    } else {
      setTimeout(() => {
        setVisibleCount(0)
        setKey(k => k + 1)
      }, 4000)
    }
  }

  return (
    <Section id="chat" dark>
      <SectionTitle sub="Not just notifications. A research companion.">Talk to your papers</SectionTitle>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-dark rounded-2xl p-8 max-w-2xl mx-auto w-full font-mono text-sm leading-7 shadow-2xl shadow-dark/50"
      >
        {messages.slice(0, visibleCount + 1).map((msg, i) => (
          <TypingLine
            key={`${key}-${i}`}
            role={msg.role}
            text={msg.text}
            onDone={i === visibleCount ? handleDone : undefined}
          />
        ))}
        {visibleCount === 0 && key > 0 && (
          <TypingLine key={`${key}-0`} role={messages[0].role} text={messages[0].text} onDone={handleDone} />
        )}
      </motion.div>
    </Section>
  )
}
