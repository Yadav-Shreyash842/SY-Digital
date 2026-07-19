import { cn } from '../../utils/cn'

export default function Timeline({ items = [], theme = 'dark', className = '' }) {
  return (
    <div className={cn('space-y-0', className)}>
      {items.map((item, i) => (
        <div key={item.title || i} className="relative flex gap-4 pb-8 last:pb-0">
          {i < items.length - 1 && (
            <div className={cn('absolute left-[19px] top-10 h-[calc(100%-24px)] w-px', theme === 'dark' ? 'bg-white/10' : 'bg-gray-200')} />
          )}
          <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-purple/20">
            {item.icon ? (
              <item.icon strokeWidth={1.75} className="h-5 w-5 text-primary-purple" />
            ) : (
              <span className="text-xs font-bold text-primary-purple">{i + 1}</span>
            )}
          </div>
          <div className="pt-1">
            <p className={cn('text-xs font-medium', theme === 'dark' ? 'text-text-muted' : 'text-gray-500')}>{item.date}</p>
            <h4 className={cn('mt-1 font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-900')}>{item.title}</h4>
            {item.description && (
              <p className={cn('mt-1 text-sm leading-[160%]', theme === 'dark' ? 'text-text-secondary' : 'text-gray-600')}>
                {item.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
