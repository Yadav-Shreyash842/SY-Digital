import { Code2, Palette, Megaphone, Zap, Building2, Wrench, Lightbulb, Rocket, Shield, Layers, PenTool, Monitor, Smartphone, Globe, BarChart3, Target, Mail, TrendingUp, Search, Share2, Megaphone as Ads, Users, FileText } from 'lucide-react'

const serviceDetails = {
  'web-development': {
    heroTitle: 'Custom Web Development Services',
    heroDescription: 'We engineer scalable, performant, and secure web applications built with cutting-edge technologies to drive business growth.',
    overview: 'SY Digital delivers enterprise-grade web development tailored to your strategic vision. From complex SaaS architectures to high-converting web applications, our engineering team adheres to modern clean-code standards, rapid deployment pipelines, and bulletproof security protocols.',
    offerings: [
      { icon: Zap, title: 'Custom Solutions', description: 'Bespoke web applications built ground-up to solve your specific operational challenges.' },
      { icon: Building2, title: 'Enterprise Development', description: 'Scalable microservice architectures built for high concurrency and zero downtime.' },
      { icon: Wrench, title: 'Maintenance & Support', description: '24/7 proactive monitoring, security updates, and automated system optimizations.' },
      { icon: Lightbulb, title: 'Technical Consultation', description: 'Architecture reviews, code audits, and strategic digital transformation roadmaps.' },
      { icon: Rocket, title: 'Performance Optimization', description: 'Sub-second load times, core web vitals overhaul, and server-side optimization.' },
      { icon: Shield, title: 'API & Systems Integration', description: 'Seamless third-party API integrations, payment gateways, and custom webhooks.' },
    ],
    techStack: ['React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'Tailwind CSS'],
    process: [
      { number: '01', title: 'Discovery', description: 'In-depth requirements gathering, user persona profiling, and technical scoping.' },
      { number: '02', title: 'Planning', description: 'System architecture design, sprint mapping, and wireframe blueprinting.' },
      { number: '03', title: 'Design', description: 'UI/UX prototyping, design token creation, and interactive user testing.' },
      { number: '04', title: 'Development', description: 'Clean frontend & backend coding following agile sprint methodologies.' },
      { number: '05', title: 'Testing', description: 'Automated end-to-end testing, security penetration, and load testing.' },
      { number: '06', title: 'Deployment', description: 'CI/CD pipeline rollout, domain DNS setup, and post-launch monitoring.' },
    ],
    testimonials: [
      { quote: 'SY Digital transformed our legacy monolith into an ultra-fast Next.js platform. Our conversions increased by 42% in the first quarter.', client: 'Alex Mercer', role: 'CTO, Veloce Global' },
      { quote: 'The engineering quality and attention to performance were world-class. They delivered two weeks ahead of schedule.', client: 'Sarah Jenkins', role: 'Product Lead, Nexus Tech' },
    ],
    faqs: [
      { question: 'How long does a typical web project take?', answer: 'Most custom web development projects take between 4 to 12 weeks depending on the complexity of features and scope.' },
      { question: 'Do you offer post-launch support?', answer: 'Yes, we provide dedicated maintenance and support SLA packages including security updates, backups, and feature enhancements.' },
      { question: 'Can you integrate with our existing backend APIs?', answer: 'Absolutely. We specialize in connecting modern frontend interfaces with complex legacy REST, GraphQL, and microservice backends.' },
    ],
  },

  'ui-ux-design': {
    heroTitle: 'Premium UI/UX Design Services',
    heroDescription: 'We craft beautiful, intuitive digital experiences that delight users, drive engagement, and convert visitors into loyal customers.',
    overview: 'SY Digital creates user-centered design solutions that bridge the gap between business objectives and user needs. Our design team combines research-driven insights with pixel-perfect execution to deliver interfaces that are both visually stunning and effortlessly functional.',
    offerings: [
      { icon: PenTool, title: 'UI Design', description: 'Pixel-perfect interface design with consistent design systems and component libraries.' },
      { icon: Users, title: 'UX Research', description: 'User interviews, usability testing, journey mapping, and data-driven persona development.' },
      { icon: Layers, title: 'Design Systems', description: 'Scalable token-based design systems with Figma components and documentation.' },
      { icon: Monitor, title: 'Web Application Design', description: 'Complex dashboard and SaaS interface design optimized for productivity.' },
      { icon: Smartphone, title: 'Mobile App Design', description: 'Native iOS and Android design patterns with platform-specific guidelines.' },
      { icon: Lightbulb, title: 'Prototyping & Testing', description: 'Interactive prototypes, A/B testing frameworks, and iterative refinement cycles.' },
    ],
    techStack: ['Figma', 'Design Tokens', 'Storybook', 'Prototyping', 'User Testing', 'Design Systems'],
    process: [
      { number: '01', title: 'Research', description: 'User interviews, competitor analysis, and stakeholder alignment workshops.' },
      { number: '02', title: 'Strategy', description: 'Information architecture, user flow mapping, and content strategy definition.' },
      { number: '03', title: 'Wireframing', description: 'Low-fidelity wireframes, layout exploration, and interactive blueprinting.' },
      { number: '04', title: 'Visual Design', description: 'High-fidelity mockups, design token creation, and brand integration.' },
      { number: '05', title: 'Prototyping', description: 'Interactive Figma prototypes with micro-animations and transition flows.' },
      { number: '06', title: 'Handoff', description: 'Developer-ready specs, component documentation, and design QA support.' },
    ],
    testimonials: [
      { quote: 'The redesign increased our user engagement by 65% and reduced onboarding time by half. SY Digital truly understands user psychology.', client: 'Marcus Chen', role: 'VP Product, FlowState' },
      { quote: 'Their design system saved our team months of work. Every component is meticulously crafted and perfectly documented.', client: 'Emma Rodriguez', role: 'Design Director, Lumina' },
    ],
    faqs: [
      { question: 'How long does a design project take?', answer: 'A typical UI/UX project ranges from 2 to 8 weeks depending on scope, from a single landing page to a full product redesign.' },
      { question: 'Do you provide developer handoff?', answer: 'Yes, we deliver complete design specifications, Figma dev mode assets, and component documentation for seamless implementation.' },
      { question: 'Can you work with our existing brand?', answer: 'Absolutely. We adapt to your existing brand guidelines or help evolve them as part of the design process.' },
    ],
  },

  'digital-marketing': {
    heroTitle: 'Data-Driven Digital Marketing',
    heroDescription: 'We build measurable growth engines through strategic SEO, targeted campaigns, and conversion-optimized marketing funnels.',
    overview: 'SY Digital combines creative strategy with data analytics to deliver marketing campaigns that generate real, measurable results. From search engine dominance to social media engagement, our team engineers growth funnels designed to maximize ROI at every touchpoint.',
    offerings: [
      { icon: Search, title: 'Search Engine Optimization', description: 'Technical SEO audits, keyword strategy, link building, and content optimization.' },
      { icon: Target, title: 'PPC & Paid Campaigns', description: 'Google Ads, Meta Ads, and LinkedIn campaigns with real-time bid optimization.' },
      { icon: Share2, title: 'Social Media Marketing', description: 'Content strategy, community management, and platform-specific growth tactics.' },
      { icon: FileText, title: 'Content Marketing', description: 'Blog strategy, long-form content, case studies, and thought leadership articles.' },
      { icon: BarChart3, title: 'Analytics & Reporting', description: 'Custom dashboards, attribution modeling, and actionable performance insights.' },
      { icon: Mail, title: 'Email & Automation', description: 'Drip campaigns, behavioral triggers, and personalized nurture sequences.' },
    ],
    techStack: ['Google Analytics', 'SEMrush', 'HubSpot', 'Meta Ads', 'Mailchimp', 'Hotjar'],
    process: [
      { number: '01', title: 'Audit', description: 'Comprehensive marketing audit covering SEO, paid channels, and conversion funnels.' },
      { number: '02', title: 'Strategy', description: 'Data-driven marketing plan with KPI targets, audience segmentation, and channel selection.' },
      { number: '03', title: 'Content', description: 'Content calendar creation, asset development, and brand voice calibration.' },
      { number: '04', title: 'Launch', description: 'Campaign deployment, A/B test initialization, and tracking pixel setup.' },
      { number: '05', title: 'Optimize', description: 'Real-time performance monitoring, bid adjustments, and creative iteration.' },
      { number: '06', title: 'Scale', description: 'Winning pattern amplification, budget reallocation, and growth phase expansion.' },
    ],
    testimonials: [
      { quote: 'Our organic traffic increased by 180% in six months. SY Digital turned our blog into our primary revenue channel.', client: 'David Park', role: 'Marketing Director, TechVault' },
      { quote: 'The ROI on our paid campaigns doubled within the first quarter. Their data-driven approach is unmatched.', client: 'Lisa Thompson', role: 'CEO, GrowthLab' },
    ],
    faqs: [
      { question: 'How soon can we see results?', answer: 'Paid campaigns can show results within the first week. SEO and content marketing typically show significant traction within 3 to 6 months.' },
      { question: 'Do you handle both strategy and execution?', answer: 'Yes, we provide end-to-end marketing from strategy development through execution, optimization, and reporting.' },
      { question: 'What industries do you specialize in?', answer: 'We have deep experience across SaaS, fintech, e-commerce, healthcare, and professional services industries.' },
    ],
  },
}

export default serviceDetails
