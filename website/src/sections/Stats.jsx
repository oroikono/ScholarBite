import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: 50, suffix: '+', label: 'arXiv Categories' },
  { value: 15, suffix: '', label: 'Papers per Digest' },
  { value: 4, suffix: '', label: 'LLM Providers' },
  { value: 100, suffix: '%', label: 'Open Source' },
]

function Counter({ target, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const dur = 1800
    const start = performance.now()
    function tick(now) {
      const p = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target])

  return <span ref={ref}>{val}{suffix}</span>
}

export default function Stats() {
  return (
    <div className="bg-gradient-to-br from-dark via-dark2 to-dark3 py-14 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <div className="text-4xl md:text-5xl font-extrabold text-accent font-serif">
              <Counter target={s.value} suffix={s.suffix} />
            </div>
            <div className="text-sm text-gray-400 mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
