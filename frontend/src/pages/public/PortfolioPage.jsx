import PageHero from '../../components/layout/PageHero'
import SectionContainer from '../../components/ui/SectionContainer'
import ProjectCard from '../../components/cards/ProjectCard'
import CTA from '../../components/home/CTA'
import { projects } from '../../constants/content'

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        title="Our Portfolio"
        subtitle="A curated selection of our finest work across industries and disciplines."
        breadcrumbs={[{ label: 'Portfolio' }]}
      />
      <SectionContainer>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} {...p} index={i} />
          ))}
        </div>
      </SectionContainer>
      <CTA />
    </>
  )
}
