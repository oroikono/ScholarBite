import { motion } from 'framer-motion'

export default function Section({ id, className = '', dark = false, children }) {
  return (
    <section id={id} className={`py-20 px-6 ${dark ? 'bg-[#f0f0f5]' : ''} ${className}`}>
      <div className="max-w-5xl mx-auto">
        {children}
      </div>
    </section>
  )
}

export function SectionTitle({ children, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="text-center mb-14"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-dark mb-3">{children}</h2>
      {sub && <p className="text-gray-500 text-lg max-w-2xl mx-auto">{sub}</p>}
    </motion.div>
  )
}
