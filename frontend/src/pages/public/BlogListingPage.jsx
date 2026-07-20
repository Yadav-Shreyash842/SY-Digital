import { useState, useEffect } from 'react'
import PageHero from '../../components/layout/PageHero'
import SectionContainer from '../../components/ui/SectionContainer'
import BlogCard from '../../components/cards/BlogCard'
import Pagination from '../../components/ui/Pagination'
import Skeleton from '../../components/ui/Skeleton'
import { blogService } from '../../services/blog.service'

const defaultGradients = [
  'from-primary/80 to-primary/80',
  'from-accent-blue/80 to-accent-cyan/80',
  'from-primary/80 to-primary/80',
  'from-accent-cyan/80 to-accent-blue/80',
]

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function BlogListingPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await blogService.list({ status: 'published', page: currentPage, limit: 6 })
        setPosts(res?.data?.blogs || [])
        setTotalPages(res?.data?.pagination?.totalPages || 1)
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load blog posts.')
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [currentPage])

  return (
    <>
      <PageHero
        title="Blog & Insights"
        subtitle="Thoughts on design, development, and digital strategy from our team."
        breadcrumbs={[{ label: 'Blog' }]}
      />
      <SectionContainer>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-[20px] border border-white/8 bg-card-bg">
                <Skeleton className="aspect-video rounded-none" />
                <div className="p-6">
                  <Skeleton className="mb-3 h-5 w-20 rounded-full" />
                  <Skeleton className="mb-2 h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-text-secondary">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-text-secondary">No blog posts available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {posts.map((post, i) => (
                <BlogCard
                  key={post.slug}
                  title={post.title}
                  excerpt={post.shortDescription}
                  category={post.category}
                  date={formatDate(post.publishedAt)}
                  slug={post.slug}
                  imageGradient={defaultGradients[i % defaultGradients.length]}
                  index={i}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} theme="dark" />
              </div>
            )}
          </>
        )}
      </SectionContainer>
    </>
  )
}
