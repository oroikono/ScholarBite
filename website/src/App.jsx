import { useState, useEffect } from 'react'
import Nav from './components/Nav'
import Hero from './sections/Hero'
import Stats from './sections/Stats'
import Features from './sections/Features'
import Pipeline from './sections/Pipeline'
import LiveDemo from './sections/LiveDemo'
import ChatDemo from './sections/ChatDemo'
import Providers from './sections/Providers'
import QuickStart from './sections/QuickStart'
import Privacy from './sections/Privacy'
import CTA from './sections/CTA'
import Footer from './sections/Footer'

export default function App() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <Nav visible={scrolled} />
      <Hero />
      <Stats />
      <Features />
      <Pipeline />
      <LiveDemo />
      <ChatDemo />
      <Providers />
      <QuickStart />
      <Privacy />
      <CTA />
      <Footer />
    </>
  )
}
