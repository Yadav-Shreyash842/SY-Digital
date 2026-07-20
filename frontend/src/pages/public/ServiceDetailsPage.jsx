import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import PageHero from '../../components/layout/PageHero'
import SectionContainer from '../../components/ui/SectionContainer'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import CTA from '../../components/home/CTA'
import NotFoundPage from './NotFoundPage'
import { serviceService } from '../../services/service.service'
import { iconMap } from '../../utils/icons'

const categoryIconMap = {
  'Web Development': 'Code2',
  'UI/UX Design': 'Palette',
  'Digital Marketing': 'Megaphone',
}

export default function ServiceDetailsPage() {
  const { slug } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await serviceService.get(slug)
        setService(res?.data || null)
      } catch (err) {
        if (err?.response?.status === 404) {
          setService(null)
        } else {
          setError(err?.response?.data?.message || 'Failed to load service details.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchService()
  }, [slug])

  if (loading) {
    return (
      <>
        <PageHero
          title="Loading..."
          subtitle=""
          breadcrumbs={[{ label: 'Services', href: '/services' }, { label: '...' }]}
        />
        <SectionContainer>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Skeleton className="mb-6 h-16 w-16 rounded-2xl" />
              <Skeleton className="mb-4 h-4 w-full" />
              <Skeleton className="mb-4 h-4 w-full" />
              <Skeleton className="mb-8 h-4 w-3/4" />
              <div className="mb-8 flex gap-2">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </div>
            <div className="rounded-[24px] border border-white/8 bg-card-bg p-8">
              <Skeleton className="mb-6 h-6 w-1/3" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="mb-4 flex items-center gap-3">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </SectionContainer>
        <CTA />
      </>
    )
  }

  if (error) {
    return (
      <>
        <PageHero
          title="Error"
          subtitle=""
          breadcrumbs={[{ label: 'Services', href: '/services' }]}
        />
        <SectionContainer>
          <p className="py-12 text-center text-text-secondary">{error}</p>
        </SectionContainer>
      </>
    )
  }

  if (!service) return <NotFoundPage />

  const Icon = iconMap[categoryIconMap[service.category]] || iconMap.Code2

  return (
    <>
      <PageHero
        title={service.title}
        subtitle={service.shortDescription}
        breadcrumbs={[{ label: 'Services', href: '/services' }, { label: service.title }]}
      />
      <SectionContainer>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            {Icon && (
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
                <Icon strokeWidth={1.75} className="h-8 w-8 text-primary" />
              </div>
            )}
            <p className="mb-8 text-base leading-[160%] text-text-secondary">{service.description}</p>
            <div className="mb-8 flex flex-wrap gap-2">
              {(service.technologies || []).map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-text-secondary">{tag}</span>
              ))}
            </div>
            <Button variant="primary" as="a" href="/contact">Get Started</Button>
          </div>
          <div className="rounded-[24px] border border-white/8 bg-card-bg p-8">
            <h3 className="mb-6 text-xl font-bold">What&apos;s Included</h3>
            <ul className="space-y-4">
              {(service.features || []).map((f) => (
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
