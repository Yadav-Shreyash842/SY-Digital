import PageHero from '../../components/layout/PageHero'
import SectionContainer from '../../components/ui/SectionContainer'
import BlogCard from '../../components/cards/BlogCard'
import Pagination from '../../components/ui/Pagination'
import { blogPosts } from '../../constants/content'

export default function BlogListingPage() {
  return (
    <>
      <PageHero
        title="Blog & Insights"
        subtitle="Thoughts on design, development, and digital strategy from our team."
        breadcrumbs={[{ label: 'Blog' }]}
      />
      <SectionContainer>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {blogPosts.map((post, i) => (
            <BlogCard key={post.slug} {...post} imageGradient={post.gradient} index={i} />
          ))}
        </div>
        <div className="mt-12">
          <Pagination currentPage={1} totalPages={3} theme="dark" />
        </div>
      </SectionContainer>
    </>
  )
}
