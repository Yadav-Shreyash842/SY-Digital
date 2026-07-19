import PageHero from '../../components/layout/PageHero'
import SectionContainer from '../../components/ui/SectionContainer'

export default function LegalPage({ title, lastUpdated = 'July 1, 2026', children }) {
  return (
    <>
      <PageHero title={title} subtitle={`Last updated: ${lastUpdated}`} breadcrumbs={[{ label: title }]} />
      <SectionContainer className="pt-0">
        <div className="mx-auto max-w-3xl space-y-6 text-base leading-[160%] text-text-secondary">
          {children}
        </div>
      </SectionContainer>
    </>
  )
}

export function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>SY Digital (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or use our services.</p>
      <h2 className="text-xl font-bold text-white">Information We Collect</h2>
      <p>We may collect personal information such as your name, email address, phone number, and company details when you contact us, create an account, or use our services.</p>
      <h2 className="text-xl font-bold text-white">How We Use Your Information</h2>
      <p>We use collected information to provide and improve our services, communicate with you, process transactions, and comply with legal obligations.</p>
      <h2 className="text-xl font-bold text-white">Data Security</h2>
      <p>We implement industry-standard security measures to protect your personal information against unauthorized access, alteration, or destruction.</p>
      <h2 className="text-xl font-bold text-white">Contact Us</h2>
      <p>If you have questions about this Privacy Policy, please contact us at hello@sydigital.com.</p>
    </LegalPage>
  )
}

export function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions">
      <p>By accessing and using SY Digital&apos;s website and services, you agree to be bound by these Terms and Conditions.</p>
      <h2 className="text-xl font-bold text-white">Services</h2>
      <p>SY Digital provides digital agency services including web development, design, and marketing. Specific deliverables and timelines are outlined in individual project agreements.</p>
      <h2 className="text-xl font-bold text-white">Intellectual Property</h2>
      <p>Upon full payment, clients receive ownership of deliverables as specified in their project agreement. SY Digital retains the right to showcase completed work in our portfolio unless otherwise agreed.</p>
      <h2 className="text-xl font-bold text-white">Limitation of Liability</h2>
      <p>SY Digital shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.</p>
      <h2 className="text-xl font-bold text-white">Governing Law</h2>
      <p>These terms are governed by the laws of the State of California, United States.</p>
    </LegalPage>
  )
}
