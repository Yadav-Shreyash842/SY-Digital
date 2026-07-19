import PageHero from '../../components/layout/PageHero'
import SectionContainer from '../../components/ui/SectionContainer'
import ReviewCard from '../../components/cards/ReviewCard'
import CTA from '../../components/home/CTA'
import { testimonials } from '../../constants/content'

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        title="Client Testimonials"
        subtitle="Hear from the brands that trust SY Digital to deliver exceptional results."
        breadcrumbs={[{ label: 'Testimonials' }]}
      />
      <SectionContainer>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => <ReviewCard key={t.name} {...t} index={i} />)}
        </div>
      </SectionContainer>
      <CTA />
    </>
  )
}
