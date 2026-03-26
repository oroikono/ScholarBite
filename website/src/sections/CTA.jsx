import { motion } from 'framer-motion'

export default function CTA() {
  return (
    <div className="bg-gradient-to-br from-dark via-dark2 to-dark3 py-24 px-6 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-white mb-4"
      >
        Stop missing important papers
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-gray-400 mb-8 max-w-lg mx-auto"
      >
        Set up ScholarBite once, get relevant research delivered every morning. Free and open source.
      </motion.p>
      <motion.a
        href="https://github.com/oroikono/ScholarBite"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        whileHover={{ y: -3, scale: 1.05 }}
        className="inline-block px-10 py-4 rounded-xl bg-accent text-white font-semibold text-lg shadow-lg shadow-accent/30 no-underline"
      >
        View on GitHub
      </motion.a>
    </div>
  )
}
