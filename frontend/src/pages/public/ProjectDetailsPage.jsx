import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PageHero from '../../components/layout/PageHero'
import SectionContainer from '../../components/ui/SectionContainer'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import LazyImage from '../../components/ui/LazyImage'
import Skeleton from '../../components/ui/Skeleton'
import CTA from '../../components/home/CTA'
import NotFoundPage from './NotFoundPage'
import { projectService } from '../../services/project.service'

function formatYear(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).getFullYear().toString()
}

export default function ProjectDetailsPage() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await projectService.getBySlug(slug)
        setProject(res?.data || null)
      } catch (err) {
        if (err?.response?.status === 404) {
          setProject(null)
        } else {
          setError(err?.response?.data?.message || 'Failed to load project details.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [slug])

  if (loading) {
    return (
      <>
        <PageHero
          title="Loading..."
          subtitle=""
          breadcrumbs={[{ label: 'Portfolio', href: '/portfolio' }, { label: '...' }]}
        />
        <SectionContainer>
          <Skeleton className="mb-12 aspect-video w-full rounded-2xl" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Skeleton className="mb-4 h-6 w-48" />
              <Skeleton className="mb-4 h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="rounded-[24px] border border-white/8 bg-card-bg p-6 space-y-4">
              <div><Skeleton className="mb-1 h-4 w-16" /><Skeleton className="h-5 w-32" /></div>
              <div><Skeleton className="mb-1 h-4 w-16" /><Skeleton className="h-6 w-24 rounded-full" /></div>
              <div><Skeleton className="mb-1 h-4 w-16" /><Skeleton className="h-5 w-16" /></div>
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
        <PageHero title="Error" subtitle="" breadcrumbs={[{ label: 'Portfolio', href: '/portfolio' }]} />
        <SectionContainer>
          <p className="py-12 text-center text-text-secondary">{error}</p>
        </SectionContainer>
      </>
    )
  }

  if (!project) return <NotFoundPage />

  return (
    <>
      <PageHero
        title={project.title}
        subtitle={project.shortDescription}
        breadcrumbs={[{ label: 'Portfolio', href: '/portfolio' }, { label: project.title }]}
      />
      <SectionContainer>
        {project.images?.[0]?.url ? (
          <img src={project.images[0].url} alt={project.title} className="mb-12 w-full rounded-2xl object-cover" style={{ aspectRatio: '21/9' }} />
        ) : (
          <LazyImage gradient="from-primary/80 to-primary/80" alt={project.title} aspectRatio="21/9" className="mb-12" />
        )}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-2xl font-bold">Project Overview</h2>
            <p className="text-base leading-[160%] text-text-secondary">{project.description}</p>
          </div>
          <div className="rounded-[24px] border border-white/8 bg-card-bg p-6 space-y-4">
            <div><p className="text-sm text-text-muted">Client</p><p className="font-semibold">{project.clientName || 'Confidential'}</p></div>
            <div><p className="text-sm text-text-muted">Category</p><Badge variant="purple">{project.category}</Badge></div>
            <div><p className="text-sm text-text-muted">Year</p><p className="font-semibold">{formatYear(project.completionDate)}</p></div>
            <Button variant="primary" className="w-full" as="a" href="/contact">Start Similar Project</Button>
          </div>
        </div>
      </SectionContainer>
      <CTA />
    </>
  )
}
