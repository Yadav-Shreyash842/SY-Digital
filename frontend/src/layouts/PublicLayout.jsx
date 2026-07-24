import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ProjectRequestOverlay from '../components/forms/ProjectRequestOverlay'
import BackToTop from '../components/ui/BackToTop'
import AiChatWidget from '../components/ui/AiChatWidget'
import { ProjectFormProvider } from '../context/ProjectFormContext'
import { useDisclosure } from '../hooks/useDisclosure'

export default function PublicLayout() {
  const { isOpen, open, close } = useDisclosure()

  return (
    <ProjectFormProvider value={open}>
      <div className="min-h-screen bg-primary-bg">
        <Navbar onOpenProjectForm={open} />
        <main>
          <Outlet />
        </main>
        <Footer />
      <AiChatWidget />
      <BackToTop />
      <ProjectRequestOverlay isOpen={isOpen} onClose={close} />
    </div>
    </ProjectFormProvider>
  )
}
