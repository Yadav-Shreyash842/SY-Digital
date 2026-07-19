import { useParams, Link } from 'react-router-dom'
import PageHero from '../../components/layout/PageHero'
import SectionContainer from '../../components/ui/SectionContainer'
import Badge from '../../components/ui/Badge'
import LazyImage from '../../components/ui/LazyImage'
import NotFoundPage from './NotFoundPage'
import { blogPosts } from '../../constants/content'

export default function BlogDetailsPage() {
  const { slug } = useParams()
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return <NotFoundPage />

  return (
    <>
      <PageHero
        title={post.title}
        subtitle={post.excerpt}
        breadcrumbs={[{ label: 'Blog', href: '/blog' }, { label: post.title }]}
      />
      <SectionContainer className="pt-0">
        <LazyImage gradient={post.gradient} alt={post.title} aspectRatio="21/9" className="mb-8" />
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center gap-4">
            <Badge variant="purple">{post.category}</Badge>
            <span className="text-sm text-text-muted">{post.date}</span>
          </div>
          <div className="prose prose-invert max-w-none space-y-6 text-base leading-[160%] text-text-secondary">
            <p>{post.excerpt}</p>
            <p>At SY Digital, we believe that premium digital experiences are built at the intersection of strategy, design, and engineering. This article explores the principles and practices that define world-class digital products in today&apos;s landscape.</p>
            <p>Whether you&apos;re launching a new product or scaling an existing platform, the fundamentals remain the same: understand your users deeply, design with intention, and build with excellence.</p>
            <h2 className="text-2xl font-bold text-white">Key Takeaways</h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>User-centered design drives measurable business outcomes</li>
              <li>Design systems enable consistency at scale</li>
              <li>Performance and accessibility are non-negotiable</li>
              <li>Continuous iteration beats perfect launches</li>
            </ul>
          </div>
          <div className="mt-12 border-t border-white/8 pt-8">
            <Link to="/blog" className="text-sm font-semibold text-primary-purple hover:text-secondary-purple">
              ← Back to all articles
            </Link>
          </div>
        </div>
      </SectionContainer>
    </>
  )
}
