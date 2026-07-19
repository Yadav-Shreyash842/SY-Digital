import { useParams } from 'react-router-dom'
import PageHero from '../../components/layout/PageHero'
import SectionContainer from '../../components/ui/SectionContainer'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import LazyImage from '../../components/ui/LazyImage'
import CTA from '../../components/home/CTA'
import NotFoundPage from './NotFoundPage'
import { projects } from '../../constants/content'

export default function ProjectDetailsPage() {
  const { slug } = useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <NotFoundPage />

  return (
    <>
      <PageHero
        title={project.title}
        subtitle={project.description}
        breadcrumbs={[{ label: 'Portfolio', href: '/portfolio' }, { label: project.title }]}
      />
      <SectionContainer>
        <LazyImage gradient={project.gradient} alt={project.title} aspectRatio="21/9" className="mb-12" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-2xl font-bold">Project Overview</h2>
            <p className="text-base leading-[160%] text-text-secondary">{project.description}</p>
          </div>
          <div className="rounded-[24px] border border-white/8 bg-card-bg p-6 space-y-4">
            <div><p className="text-sm text-text-muted">Client</p><p className="font-semibold">{project.client}</p></div>
            <div><p className="text-sm text-text-muted">Category</p><Badge variant="purple">{project.category}</Badge></div>
            <div><p className="text-sm text-text-muted">Year</p><p className="font-semibold">{project.year}</p></div>
            <Button variant="primary" className="w-full" as="a" href="/contact">Start Similar Project</Button>
          </div>
        </div>
      </SectionContainer>
      <CTA />
    </>
  )
}
