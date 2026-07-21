require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const Service = require("../src/models/Service");
const User = require("../src/models/User");

const services = [
  {
    title: "Web Development",
    slug: "web-development",
    shortDescription: "Scalable, performant web applications built with cutting-edge technologies and best practices.",
    description: "SY Digital delivers enterprise-grade web development tailored to your strategic vision. From complex SaaS architectures to high-converting web applications, our engineering team adheres to modern clean-code standards, rapid deployment pipelines, and bulletproof security protocols.",
    category: "Web Development",
    price: 0,
    duration: "4-12 weeks",
    technologies: ["React", "Next.js", "Node.js", "TypeScript", "MongoDB", "Tailwind CSS"],
    features: ["Custom Web Applications", "API Integration", "Performance Optimization", "Cloud Deployment", "Maintenance & Support"],
    isFeatured: true,
    status: "published",
  },
  {
    title: "UI/UX Design",
    slug: "ui-ux-design",
    shortDescription: "Beautiful, intuitive interfaces that delight users and drive conversions across every touchpoint.",
    description: "SY Digital creates user-centered design solutions that bridge the gap between business objectives and user needs. Our design team combines research-driven insights with pixel-perfect execution to deliver interfaces that are both visually stunning and effortlessly functional.",
    category: "UI/UX Design",
    price: 0,
    duration: "2-6 weeks",
    technologies: ["Figma", "Design Tokens", "Storybook", "Prototyping", "User Testing", "Design Systems"],
    features: ["User Research", "Wireframing & Prototyping", "Visual Design", "Design Systems", "Usability Testing"],
    isFeatured: true,
    status: "published",
  },
  {
    title: "Digital Marketing",
    slug: "digital-marketing",
    shortDescription: "Data-driven strategies that amplify your brand and accelerate growth across all channels.",
    description: "SY Digital combines creative strategy with data analytics to deliver marketing campaigns that generate real, measurable results. From search engine dominance to social media engagement, our team engineers growth funnels designed to maximize ROI at every touchpoint.",
    category: "Digital Marketing",
    price: 0,
    duration: "Ongoing",
    technologies: ["Google Analytics", "SEMrush", "HubSpot", "Meta Ads", "Mailchimp", "Hotjar"],
    features: ["SEO & Content Strategy", "Paid Advertising", "Social Media Management", "Analytics & Reporting", "Conversion Optimization"],
    isFeatured: true,
    status: "published",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const admin = await User.findOne({ role: "admin" }).select("_id");
    if (!admin) {
      console.error("No admin user found. Please create an admin user first.");
      process.exit(1);
    }
    console.log(`Using admin user: ${admin._id}`);

    for (const data of services) {
      const { slug, ...rest } = data;

      const result = await Service.findOneAndUpdate(
        { slug },
        { ...rest, slug, createdBy: admin._id },
        { upsert: true, returnDocument: "after", runValidators: true }
      );

      console.log(`Seeded: ${result.title} (${slug})`);
    }

    console.log("\nDone! 3 services seeded successfully.");
  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
