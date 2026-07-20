import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageHero from '../../components/layout/PageHero'
import SectionContainer from '../../components/ui/SectionContainer'
import Badge from '../../components/ui/Badge'
import LazyImage from '../../components/ui/LazyImage'
import Skeleton from '../../components/ui/Skeleton'
import NotFoundPage from './NotFoundPage'
import { blogService } from '../../services/blog.service'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function BlogDetailsPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await blogService.get(slug)
        setPost(res?.data || null)
      } catch (err) {
        if (err?.response?.status === 404) {
          setPost(null)
        } else {
          setError(err?.response?.data?.message || 'Failed to load blog post.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchBlog()
  }, [slug])

  if (loading) {
    return (
      <>
        <PageHero
          title="Loading..."
          subtitle=""
          breadcrumbs={[{ label: 'Blog', href: '/blog' }, { label: '...' }]}
        />
        <SectionContainer className="pt-0">
          <Skeleton className="mb-8 aspect-video w-full rounded-2xl" />
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex items-center gap-4">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="mb-4 h-4 w-full" />
            <Skeleton className="mb-4 h-4 w-full" />
            <Skeleton className="mb-4 h-4 w-3/4" />
          </div>
        </SectionContainer>
      </>
    )
  }

  if (error) {
    return (
      <>
        <PageHero
          title="Error"
          subtitle=""
          breadcrumbs={[{ label: 'Blog', href: '/blog' }]}
        />
        <SectionContainer>
          <p className="py-12 text-center text-text-secondary">{error}</p>
        </SectionContainer>
      </>
    )
  }

  if (!post) return <NotFoundPage />

  return (
    <>
      <PageHero
        title={post.title}
        subtitle={post.shortDescription}
        breadcrumbs={[{ label: 'Blog', href: '/blog' }, { label: post.title }]}
      />
      <SectionContainer className="pt-0">
        {post.featuredImage?.url ? (
          <img src={post.featuredImage.url} alt={post.title} className="mb-8 w-full rounded-2xl object-cover" style={{ aspectRatio: '21/9' }} />
        ) : (
          <LazyImage gradient="from-primary/80 to-primary/80" alt={post.title} aspectRatio="21/9" className="mb-8" />
        )}
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center gap-4">
            <Badge variant="purple">{post.category}</Badge>
            <span className="text-sm text-text-muted">{formatDate(post.publishedAt)}</span>
          </div>
          {post.content ? (
            <div className="prose prose-invert max-w-none space-y-6 text-base leading-[160%] text-text-secondary [&>*]:mb-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_li]:ml-6 [&_li]:list-disc [&_p]:mb-6 [&_ul]:space-y-2">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          ) : (
            <div className="prose prose-invert max-w-none space-y-6 text-base leading-[160%] text-text-secondary">
              <p>{post.shortDescription}</p>
            </div>
          )}
          <div className="mt-12 border-t border-white/8 pt-8">
            <Link to="/blog" className="text-sm font-semibold text-primary hover:text-primary">
              ← Back to all articles
            </Link>
          </div>
        </div>
      </SectionContainer>
    </>
  )
}
