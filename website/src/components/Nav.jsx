import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { href: '#features', label: 'Features' },
  { href: '#pipeline', label: 'Pipeline' },
  { href: '#demo', label: 'Live Demo' },
  { href: '#providers', label: 'LLMs' },
  { href: '#privacy', label: 'Privacy' },
]

export default function Nav({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -80 }}
          animate={{ y: 0 }}
          exit={{ y: -80 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-dark/85 border-b border-white/8"
        >
          <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '0 2rem', height: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a href="#hero" className="font-serif text-xl font-bold text-white no-underline">
              Scholar<span className="text-accent">Bite</span>
            </a>
            <div className="hidden md:flex gap-6">
              {links.map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors no-underline"
                >
                  {l.label}
                </a>
              ))}
            </div>
            <div className="flex md:hidden gap-3">
              {links.slice(0, 3).map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-xs text-gray-400 hover:text-white transition-colors no-underline"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
