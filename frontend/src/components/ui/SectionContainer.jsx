export default function SectionContainer({ children, className = '', id }) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-[120px] ${className}`}
    >
      <div className="mx-auto max-w-[1200px]">{children}</div>
    </section>
  )
}
