import { useParams, Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import PageHero from '../../components/layout/PageHero'
import SectionContainer from '../../components/ui/SectionContainer'
import Button from '../../components/ui/Button'
import CTA from '../../components/home/CTA'
import NotFoundPage from './NotFoundPage'
import { services } from '../../constants/content'
import { iconMap } from '../../utils/icons'

export default function ServiceDetailsPage() {
  const { slug } = useParams()
  const service = services.find((s) => s.slug === slug)
  if (!service) return <NotFoundPage />

  const Icon = iconMap[service.icon]

  return (
    <>
      <PageHero
        title={service.title}
        subtitle={service.description}
        breadcrumbs={[{ label: 'Services', href: '/services' }, { label: service.title }]}
      />
      <SectionContainer>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            {Icon && (
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-purple/20">
                <Icon strokeWidth={1.75} className="h-8 w-8 text-primary-purple" />
              </div>
            )}
            <p className="mb-8 text-base leading-[160%] text-text-secondary">{service.longDescription}</p>
            <div className="mb-8 flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-text-secondary">{tag}</span>
              ))}
            </div>
            <Button variant="primary" as="a" href="/contact">Get Started</Button>
          </div>
          <div className="rounded-[24px] border border-white/8 bg-card-bg p-8">
            <h3 className="mb-6 text-xl font-bold">What&apos;s Included</h3>
            <ul className="space-y-4">
              {service.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-text-secondary">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/20">
                    <Check strokeWidth={2} className="h-3.5 w-3.5 text-success" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionContainer>
      <CTA />
    </>
  )
}
