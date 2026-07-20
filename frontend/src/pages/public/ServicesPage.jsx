import { useState, useEffect } from 'react'
import PageHero from '../../components/layout/PageHero'
import SectionContainer from '../../components/ui/SectionContainer'
import ServiceCard from '../../components/cards/ServiceCard'
import Skeleton from '../../components/ui/Skeleton'
import CTA from '../../components/home/CTA'
import { serviceService } from '../../services/service.service'
import { iconMap } from '../../utils/icons'

const categoryIconMap = {
  'Web Development': 'Code2',
  'UI/UX Design': 'Palette',
  'Digital Marketing': 'Megaphone',
}

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await serviceService.list({ status: 'published' })
        setServices(res?.data?.services || [])
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load services.')
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="End-to-end digital solutions crafted with precision and delivered with excellence."
        breadcrumbs={[{ label: 'Services' }]}
      />
      <SectionContainer>
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-[20px] border border-white/8 bg-card-bg p-8">
                <Skeleton className="mb-6 h-14 w-14 rounded-2xl" />
                <Skeleton className="mb-3 h-5 w-1/2" />
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="mb-6 h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-text-secondary">{error}</p>
          </div>
        ) : services.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-text-secondary">No services available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {services.map((service, i) => (
              <ServiceCard
                key={service.slug}
                icon={iconMap[categoryIconMap[service.category]] || iconMap.Code2}
                title={service.title}
                description={service.shortDescription}
                tags={service.technologies}
                href={`/services/${service.slug}`}
                index={i}
              />
            ))}
          </div>
        )}
      </SectionContainer>
      <CTA />
    </>
  )
}
