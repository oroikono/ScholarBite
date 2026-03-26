import { motion } from 'framer-motion'

export default function GlassCard({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      className={`
        h-full bg-white/70 backdrop-blur-xl border border-white/30
        rounded-2xl p-7 cursor-default
        shadow-[0_4px_24px_rgba(0,0,0,0.04)]
        hover:shadow-[0_20px_60px_rgba(233,69,96,0.12)]
        hover:border-accent/30
        transition-shadow duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}
