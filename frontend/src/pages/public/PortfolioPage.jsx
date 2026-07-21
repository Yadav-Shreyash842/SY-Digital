import { useState, useEffect, useMemo } from 'react'
import { Search } from 'lucide-react'
import PortfolioHero from '../../components/portfolio/PortfolioHero'
import PortfolioFilters from '../../components/portfolio/PortfolioFilters'
import PortfolioCard from '../../components/portfolio/PortfolioCard'
import Skeleton from '../../components/ui/Skeleton'
import CTA from '../../components/home/CTA'
import { projectService } from '../../services/project.service'

const ITEMS_PER_PAGE = 6

export default function PortfolioPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All Projects')
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

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

  const categories = useMemo(() => {
    const cats = new Set(projects.map((p) => p.category).filter(Boolean))
    return ['All Projects', ...Array.from(cats).sort()]
  }, [projects])

  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return projects.filter((project) => {
      const matchesCategory = activeCategory === 'All Projects' || project.category === activeCategory
      if (!matchesCategory) return false
      if (!q) return true
      return (
        project.title?.toLowerCase().includes(q) ||
        project.category?.toLowerCase().includes(q) ||
        project.clientName?.toLowerCase().includes(q) ||
        project.shortDescription?.toLowerCase().includes(q) ||
        project.technologies?.some((t) => t.toLowerCase().includes(q))
      )
    })
  }, [projects, activeCategory, searchQuery])

  const visibleProjects = filteredProjects.slice(0, visibleCount)
  const hasMore = visibleCount < filteredProjects.length

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setVisibleCount(ITEMS_PER_PAGE)
  }

  const handleSearchChange = (val) => {
    setSearchQuery(val)
    setVisibleCount(ITEMS_PER_PAGE)
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
  }

  return (
    <>
      <PortfolioHero />

      <section className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-[120px]">
        <div className="mx-auto max-w-[1200px]">
          <PortfolioFilters
            searchValue={searchQuery}
            onSearchChange={handleSearchChange}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            categories={categories}
          />

          {/* Loading */}
          {loading ? (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-[24px] border border-white/8">
                  <Skeleton className="aspect-[4/3] rounded-none" />
                  <div className="space-y-3 p-6">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="text-lg text-text-secondary">{error}</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-card-bg">
                <Search strokeWidth={1.5} className="h-8 w-8 text-text-muted" />
              </div>
              <h3 className="mb-2 text-xl font-bold">No matching projects found</h3>
              <p className="mb-6 max-w-sm text-sm text-text-muted">
                Try clearing your search query or selecting a different category filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setActiveCategory('All Projects')
                  setVisibleCount(ITEMS_PER_PAGE)
                }}
                className="rounded-full border border-primary bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(239,68,68,0.3)] transition-all duration-200 hover:bg-primary-hover"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {visibleProjects.map((project, i) => (
                  <PortfolioCard key={project.slug} project={project} index={i} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-16 flex justify-center">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    className="rounded-full border border-border bg-card-bg/75 px-9 py-4 text-sm font-bold text-white backdrop-blur-xl transition-all duration-200 hover:border-primary hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                  >
                    Load More Projects
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <CTA />
    </>
  )
}
