import PageHero from '../../components/layout/PageHero'
import SectionContainer from '../../components/ui/SectionContainer'
import FeatureCard from '../../components/cards/FeatureCard'
import StatsCard from '../../components/cards/StatsCard'
import Timeline from '../../components/ui/Timeline'
import CTA from '../../components/home/CTA'
import { Target, Users, Award, Rocket } from 'lucide-react'

const values = [
  { icon: Target, title: 'Precision', description: 'Every pixel, every line of code, crafted with intentional excellence.' },
  { icon: Users, title: 'Partnership', description: 'We embed with your team as true partners invested in your success.' },
  { icon: Award, title: 'Quality', description: 'Enterprise-grade standards applied to every project, regardless of size.' },
  { icon: Rocket, title: 'Innovation', description: 'Cutting-edge technologies and methodologies that keep you ahead.' },
]

const timeline = [
  { date: '2010', title: 'Founded', description: 'SY Digital was born with a vision to redefine digital agency standards.' },
  { date: '2015', title: 'Global Expansion', description: 'Opened offices across three continents, serving 100+ clients worldwide.' },
  { date: '2020', title: 'Platform Launch', description: 'Launched our client dashboard platform for seamless project collaboration.' },
  { date: '2026', title: 'Industry Leader', description: 'Recognized as a top digital agency with 500+ successful projects delivered.' },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About SY Digital"
        subtitle="We are a premium digital agency obsessed with craft, strategy, and measurable results."
        breadcrumbs={[{ label: 'About' }]}
      />
      <SectionContainer>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="mb-6 text-[28px] font-bold lg:text-[40px]">Our Story</h2>
            <p className="mb-4 text-base leading-[160%] text-text-secondary">
              Founded on the belief that digital experiences should feel as premium as the brands they represent, SY Digital has grown into a trusted partner for ambitious companies worldwide.
            </p>
            <p className="text-base leading-[160%] text-text-secondary">
              Our team of strategists, designers, and engineers work as one unified force — delivering work that drives real business outcomes.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StatsCard icon={Award} label="Projects" value="250+" color="from-primary-purple to-secondary-purple" theme="dark" />
            <StatsCard icon={Users} label="Team Members" value="45+" color="from-accent-blue to-accent-cyan" theme="dark" index={1} />
            <StatsCard icon={Rocket} label="Countries" value="40+" color="from-secondary-purple to-primary-purple" theme="dark" index={2} />
            <StatsCard icon={Target} label="Satisfaction" value="98%" color="from-accent-cyan to-accent-blue" theme="dark" index={3} />
          </div>
        </div>
      </SectionContainer>
      <SectionContainer className="bg-section-bg/30 pt-0">
        <h2 className="mb-12 text-center text-[28px] font-bold lg:text-[40px]">Our Values</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => <FeatureCard key={v.title} {...v} index={i} />)}
        </div>
      </SectionContainer>
      <SectionContainer className="pt-0">
        <h2 className="mb-12 text-[28px] font-bold lg:text-[40px]">Our Journey</h2>
        <Timeline items={timeline} />
      </SectionContainer>
      <CTA />
    </>
  )
}
