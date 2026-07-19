import PageHero from '../../components/layout/PageHero'
import SectionContainer from '../../components/ui/SectionContainer'
import ServiceCard from '../../components/cards/ServiceCard'
import CTA from '../../components/home/CTA'
import { services } from '../../constants/content'
import { iconMap } from '../../utils/icons'

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="End-to-end digital solutions crafted with precision and delivered with excellence."
        breadcrumbs={[{ label: 'Services' }]}
      />
      <SectionContainer>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {services.map((service, i) => (
            <ServiceCard
              key={service.slug}
              icon={iconMap[service.icon]}
              title={service.title}
              description={service.description}
              tags={service.tags}
              href={`/services/${service.slug}`}
              index={i}
            />
          ))}
        </div>
      </SectionContainer>
      <CTA />
    </>
  )
}
