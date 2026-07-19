import PageHero from '../../components/layout/PageHero'
import SectionContainer from '../../components/ui/SectionContainer'
import PricingCard from '../../components/cards/PricingCard'
import CTA from '../../components/home/CTA'
import { pricingPlans } from '../../constants/content'

export default function PricingPage() {
  return (
    <>
      <PageHero
        title="Pricing Plans"
        subtitle="Transparent pricing with no hidden fees. Choose the plan that fits your ambition."
        breadcrumbs={[{ label: 'Pricing' }]}
      />
      <SectionContainer>
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {pricingPlans.map((plan, i) => <PricingCard key={plan.name} {...plan} index={i} />)}
        </div>
      </SectionContainer>
      <CTA />
    </>
  )
}
