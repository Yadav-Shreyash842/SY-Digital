import { cn } from '../../utils/cn'

export default function Tabs({ tabs = [], activeTab, onChange, theme = 'dark', className = '' }) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange?.(tab.id)}
          className={cn(
            'rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300',
            activeTab === tab.id
              ? theme === 'dark'
                ? 'bg-primary text-white shadow-[0_4px_20px_rgba(239,68,68,0.3)]'
                : 'bg-primary text-white'
              : theme === 'dark'
                ? 'text-text-secondary hover:bg-white/5 hover:text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
