import Hero from '../components/home/Hero'
import TrustedCompanies from '../components/home/TrustedCompanies'
import Services from '../components/home/Services'
import Portfolio from '../components/home/Portfolio'
import Statistics from '../components/home/Statistics'
import Testimonials from '../components/home/Testimonials'
import Pricing from '../components/home/Pricing'
import CTA from '../components/home/CTA'
import ProjectRequestOverlay from '../components/forms/ProjectRequestOverlay'
import { useDisclosure } from '../hooks/useDisclosure'

export default function HomePage() {
  const { isOpen, open, close } = useDisclosure()

  return (
    <>
      <Hero onOpenProjectForm={open} />
      <TrustedCompanies />
      <Services />
      <Portfolio />
      <Statistics />
      <Testimonials />
      <Pricing />
      <CTA />
      <ProjectRequestOverlay isOpen={isOpen} onClose={close} />
    </>
  )
}
