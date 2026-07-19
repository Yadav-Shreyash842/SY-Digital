import PageHero from '../../components/layout/PageHero'
import SectionContainer from '../../components/ui/SectionContainer'
import Accordion from '../../components/ui/Accordion'
import CTA from '../../components/home/CTA'
import { faqItems } from '../../constants/content'

export default function FAQPage() {
  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about working with SY Digital."
        breadcrumbs={[{ label: 'FAQ' }]}
      />
      <SectionContainer>
        <div className="mx-auto max-w-3xl">
          <Accordion items={faqItems} />
        </div>
      </SectionContainer>
      <CTA />
    </>
  )
}
