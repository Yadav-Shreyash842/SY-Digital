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
    <LegalPage title="Privacy Policy" lastUpdated="July 28, 2026">
      <h2 className="text-xl font-bold text-white">1. Introduction</h2>
      <p>Welcome to SY Digital (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;).</p>
      <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our website and services.</p>
      <p>By using our website, you agree to the practices described in this Privacy Policy.</p>

      <h2 className="text-xl font-bold text-white">2. Information We Collect</h2>
      <p>We may collect the following information:</p>
      <p className="font-semibold text-white">Personal Information</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Full Name</li>
        <li>Email Address</li>
        <li>Phone Number</li>
        <li>Company Name</li>
        <li>Project Requirements</li>
        <li>Billing Information</li>
        <li>Meeting Information</li>
        <li>Account Details</li>
      </ul>
      <p className="font-semibold text-white mt-4">Technical Information</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>IP Address</li>
        <li>Browser Type</li>
        <li>Device Information</li>
        <li>Operating System</li>
        <li>Pages Visited</li>
        <li>Session Duration</li>
        <li>Referral Source</li>
      </ul>
      <p className="font-semibold text-white mt-4">Project Information</p>
      <p>If you submit a project inquiry, we may collect:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Project Description</li>
        <li>Budget</li>
        <li>Timeline</li>
        <li>Files uploaded by you</li>
        <li>Messages exchanged</li>
        <li>Meeting notes</li>
      </ul>

      <h2 className="text-xl font-bold text-white">3. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Provide our services</li>
        <li>Respond to inquiries</li>
        <li>Create project proposals</li>
        <li>Schedule meetings</li>
        <li>Manage your account</li>
        <li>Improve our website</li>
        <li>Process payments</li>
        <li>Provide customer support</li>
        <li>Send important updates</li>
        <li>Prevent fraud and abuse</li>
        <li>Improve user experience</li>
      </ul>

      <h2 className="text-xl font-bold text-white">4. AI Assistant</h2>
      <p>Our website may include an AI-powered assistant to help answer questions about our services.</p>
      <p>When you interact with the AI assistant:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Your messages may be processed to generate responses.</li>
        <li>Conversations may be temporarily stored to improve the experience or troubleshoot issues.</li>
      </ul>
      <p>Please avoid sharing sensitive personal, financial, or confidential information in AI conversations.</p>

      <h2 className="text-xl font-bold text-white">5. Cookies</h2>
      <p>We may use cookies and similar technologies to:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Keep you logged in</li>
        <li>Remember preferences</li>
        <li>Improve performance</li>
        <li>Analyze website traffic</li>
        <li>Enhance user experience</li>
      </ul>
      <p>You can disable cookies through your browser settings, though some features may not function correctly.</p>

      <h2 className="text-xl font-bold text-white">6. File Uploads</h2>
      <p>If you upload documents, images, logos, or project files:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Files are used only for your project.</li>
        <li>Access is limited to authorized team members.</li>
        <li>Files are protected using secure storage.</li>
        <li>Files are not shared without your permission unless required by law.</li>
      </ul>

      <h2 className="text-xl font-bold text-white">7. Payments</h2>
      <p>If payments are made through our platform:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Payment information is processed by trusted third-party payment providers.</li>
        <li>We do not store full payment card details on our servers.</li>
      </ul>

      <h2 className="text-xl font-bold text-white">8. Communication</h2>
      <p>We may contact you regarding:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Project updates</li>
        <li>Meeting confirmations</li>
        <li>Service information</li>
        <li>Important account notifications</li>
        <li>Security alerts</li>
      </ul>
      <p>We will not send spam.</p>

      <h2 className="text-xl font-bold text-white">9. Data Security</h2>
      <p>We implement industry-standard security measures including:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>HTTPS encryption</li>
        <li>Secure authentication</li>
        <li>Password hashing</li>
        <li>JWT authentication</li>
        <li>Access control</li>
        <li>Server-side validation</li>
        <li>Security monitoring</li>
      </ul>
      <p>While we take reasonable precautions, no online service can guarantee absolute security.</p>

      <h2 className="text-xl font-bold text-white">10. Data Retention</h2>
      <p>We retain your information only for as long as necessary to:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Provide our services</li>
        <li>Meet legal obligations</li>
        <li>Resolve disputes</li>
        <li>Improve our services</li>
      </ul>
      <p>You may request deletion of your personal information where applicable.</p>

      <h2 className="text-xl font-bold text-white">11. Third-Party Services</h2>
      <p>Our website may use trusted third-party services such as:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Cloud storage providers</li>
        <li>Email services</li>
        <li>Analytics services</li>
        <li>Payment processors</li>
        <li>AI service providers</li>
        <li>Meeting or communication tools</li>
      </ul>
      <p>Each provider has its own privacy practices.</p>

      <h2 className="text-xl font-bold text-white">12. Your Rights</h2>
      <p>Depending on your location, you may have the right to:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Access your data</li>
        <li>Correct inaccurate information</li>
        <li>Request deletion</li>
        <li>Withdraw consent</li>
        <li>Request a copy of your data</li>
        <li>Object to certain processing activities</li>
      </ul>

      <h2 className="text-xl font-bold text-white">13. Children&apos;s Privacy</h2>
      <p>Our services are not intended for children under the age of 13.</p>
      <p>We do not knowingly collect personal information from children.</p>

      <h2 className="text-xl font-bold text-white">14. Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time.</p>
      <p>Changes become effective immediately after they are posted on this page.</p>
      <p>The &quot;Last Updated&quot; date will always reflect the latest version.</p>

      <h2 className="text-xl font-bold text-white">15. Contact Us</h2>
      <p>If you have any questions regarding this Privacy Policy, please contact us.</p>
      <p className="font-semibold text-white">SY Digital</p>
      <p>Email: yadavshreyash842@gmail.com</p>
      <p>Website: <a href="https://sy-digital.vercel.app" className="text-accent-purple hover:underline" target="_blank" rel="noopener noreferrer">https://sy-digital.vercel.app</a></p>
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
