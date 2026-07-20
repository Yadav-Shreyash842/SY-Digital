import { useState, useEffect } from 'react'
import PageHero from '../../components/layout/PageHero'
import SectionContainer from '../../components/ui/SectionContainer'
import ReviewCard from '../../components/cards/ReviewCard'
import Skeleton from '../../components/ui/Skeleton'
import CTA from '../../components/home/CTA'
import { reviewService } from '../../services/review.service'

export default function TestimonialsPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await reviewService.featured()
        setReviews(res?.data || [])
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load testimonials.')
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  return (
    <>
      <PageHero
        title="Client Testimonials"
        subtitle="Hear from the brands that trust SY Digital to deliver exceptional results."
        breadcrumbs={[{ label: 'Testimonials' }]}
      />
      <SectionContainer>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[24px] border border-white/8 bg-card-bg p-8">
                <Skeleton className="mb-4 h-8 w-8" />
                <Skeleton className="mb-4 h-4 w-full" />
                <Skeleton className="mb-4 h-4 w-full" />
                <Skeleton className="mb-6 h-4 w-2/3" />
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-4" />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div>
                    <Skeleton className="mb-1 h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-text-secondary">{error}</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-text-secondary">No testimonials available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((t, i) => (
              <ReviewCard
                key={t._id || t.clientName}
                name={t.clientName}
                role={t.company}
                content={t.review}
                rating={t.rating}
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
