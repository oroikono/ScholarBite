import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import ParticleField from '../components/ParticleField'

export default function Hero() {
  return (
    <div id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-dark via-dark2 to-dark3">
      {/* 3D particle background */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]}>
          <ambientLight intensity={0.3} />
          <ParticleField count={300} />
        </Canvas>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-dark/40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fafafa] to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-3xl mx-auto">
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
          className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
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

      {/* Scroll indicator - positioned relative to the hero container */}
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
