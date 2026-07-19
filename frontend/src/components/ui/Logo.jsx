import logoImage from '../../assets/Logo.png'

export default function Logo({ className = '', light = true }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={logoImage}
        alt="SY Digital logo"
        className="h-9 w-auto object-contain"
      />
      <span className="hidden text-lg font-bold tracking-tight sm:block">
        <span className={light ? 'text-white' : 'text-white'}>SY</span>{' '}
        <span className="text-accent-blue">Digital</span>
      </span>
    </div>
  )
}
