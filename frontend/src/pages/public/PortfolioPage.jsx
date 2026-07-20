import { useState, useEffect } from 'react'
import PageHero from '../../components/layout/PageHero'
import SectionContainer from '../../components/ui/SectionContainer'
import ProjectCard from '../../components/cards/ProjectCard'
import Skeleton from '../../components/ui/Skeleton'
import CTA from '../../components/home/CTA'
import { projectService } from '../../services/project.service'

const defaultGradients = [
  'from-primary/80 to-primary/80',
  'from-accent-blue/80 to-accent-cyan/80',
  'from-primary/80 to-primary/80',
  'from-accent-cyan/80 to-accent-blue/80',
  'from-primary/80 to-primary/80',
  'from-primary/80 to-primary/80',
]

export default function PortfolioPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await projectService.list({ status: 'published' })
        setProjects(res?.data?.projects || [])
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load projects.')
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  return (
    <>
      <PageHero
        title="Our Portfolio"
        subtitle="A curated selection of our finest work across industries and disciplines."
        breadcrumbs={[{ label: 'Portfolio' }]}
      />
      <SectionContainer>
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-[24px] border border-white/8">
                <Skeleton className="aspect-[4/3] rounded-none" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-text-secondary">{error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-text-secondary">No projects available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <ProjectCard
                key={p.slug}
                title={p.title}
                category={p.category}
                slug={p.slug}
                gradient={p.gradient || defaultGradients[i % defaultGradients.length]}
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
