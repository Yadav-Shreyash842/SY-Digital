import { Link } from 'react-router-dom'
import { Share2, Globe, Link2, Mail, MapPin, Phone } from 'lucide-react'
import Logo from '../ui/Logo'

const footerLinks = {
  company: [
    { label: 'About Us', href: '#statistics' },
    { label: 'Services', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Careers', href: '#' },
  ],
  services: [
    { label: 'Web Development', href: '#' },
    { label: 'UI/UX Design', href: '#' },
    { label: 'Brand Strategy', href: '#' },
    { label: 'Digital Marketing', href: '#' },
  ],
  resources: [
    { label: 'Blog', href: '#' },
    { label: 'Case Studies', href: '#' },
    { label: 'Documentation', href: '#' },
    { label: 'Support', href: '#' },
  ],
}

const socialLinks = [
  { icon: Share2, href: '#', label: 'Social' },
  { icon: Globe, href: '#', label: 'Website' },
  { icon: Link2, href: '#', label: 'Links' },
  { icon: Mail, href: '#', label: 'Email' },
]

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-white/[0.05] bg-white/[0.01] backdrop-blur-xl">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-6 bg-white/[0.01] rounded-[24px] p-6">
              <Logo />
              <p className="max-w-xs text-base leading-[160%] text-text-secondary">
                Premium digital agency crafting exceptional experiences for ambitious brands worldwide.
              </p>
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent-purple/20 to-accent-orange/20 text-text-secondary transition-all duration-300 hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] hover:text-white hover:scale-110"
                  >
                    <Icon strokeWidth={1.75} className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-white/[0.01] rounded-[24px] p-6">
              <h4 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white">Company</h4>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-text-secondary transition-colors duration-300 hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/[0.01] rounded-[24px] p-6">
              <h4 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white">Services</h4>
              <ul className="space-y-4">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-text-secondary transition-colors duration-300 hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/[0.01] rounded-[24px] p-6">
              <h4 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-text-secondary">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent-purple/20 to-accent-orange/20 shrink-0">
                    <Mail strokeWidth={1.75} className="h-3.5 w-3.5 text-accent-purple" />
                  </div>
                  <span>hello@sydigital.com</span>
                </li>
                <li className="flex items-start gap-3 text-text-secondary">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent-purple/20 to-accent-orange/20 shrink-0">
                    <Phone strokeWidth={1.75} className="h-3.5 w-3.5 text-accent-purple" />
                  </div>
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start gap-3 text-text-secondary">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent-purple/20 to-accent-orange/20 shrink-0">
                    <MapPin strokeWidth={1.75} className="h-3.5 w-3.5 text-accent-purple" />
                  </div>
                  <span>San Francisco, CA 94102</span>
                </li>
              </ul>
              <div className="mt-6 space-y-2">
                <Link to="/admin" className="block text-sm text-text-muted transition-colors duration-300 hover:text-accent-purple">
                  Admin Dashboard →
                </Link>
                <Link to="/client" className="block text-sm text-text-muted transition-colors duration-300 hover:text-accent-purple">
                  Client Dashboard →
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.05] pt-8 sm:flex-row">
            <p className="text-sm text-text-muted">
              © {new Date().getFullYear()} SY Digital. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-text-muted">
              <a href="#" className="transition-colors duration-300 hover:text-white">Privacy Policy</a>
              <a href="#" className="transition-colors duration-300 hover:text-white">Terms of Service</a>
              <a href="#" className="transition-colors duration-300 hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
