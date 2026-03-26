import { motion } from 'framer-motion'

function Particles() {
  const dots = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 8 + 6,
    opacity: Math.random() * 0.5 + 0.1,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map(d => (
        <div
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            backgroundColor: `rgba(233, 69, 96, ${d.opacity})`,
            animation: `float ${d.duration}s ease-in-out ${d.delay}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0); }
          100% { transform: translate(${Math.random() > 0.5 ? '' : '-'}30px, ${Math.random() > 0.5 ? '' : '-'}40px); }
        }
      `}</style>
    </div>
  )
}

export default function Hero() {
  return (
    <div id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-dark via-dark2 to-dark3">
      <Particles />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-dark/40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fafafa] to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center" style={{ padding: '0 2rem', maxWidth: '700px' }}>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-5xl sm:text-6xl md:text-8xl font-bold text-white tracking-tight mb-6"
        >
          Scholar<span className="text-accent">Bite</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-10 leading-relaxed"
        >
          Your AI-powered daily arXiv research companion. Fresh papers, summarized and ranked, delivered every morning.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <a
            href="https://github.com/oroikono/ScholarBite"
            className="px-8 py-4 rounded-xl bg-accent text-white font-semibold text-lg hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(233,69,96,0.4)] transition-all duration-200 no-underline"
          >
            Get Started
          </a>
          <a
            href="#demo"
            className="px-8 py-4 rounded-xl bg-white/10 text-white border border-white/20 font-semibold text-lg hover:-translate-y-0.5 hover:bg-white/15 transition-all duration-200 no-underline"
          >
            Try Live Demo
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-accent rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  )
}
