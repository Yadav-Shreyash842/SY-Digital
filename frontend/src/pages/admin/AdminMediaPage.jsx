import { useState } from 'react'
import { Upload, Image, FileText, Film } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import LazyImage from '../../components/ui/LazyImage'

const mediaItems = [
  { id: 1, name: 'hero-banner.jpg', type: 'image', size: '2.4 MB', gradient: 'from-primary-purple/80 to-accent-blue/80' },
  { id: 2, name: 'brand-guidelines.pdf', type: 'document', size: '4.2 MB', gradient: 'from-accent-blue/80 to-accent-cyan/80' },
  { id: 3, name: 'project-demo.mp4', type: 'video', size: '28.6 MB', gradient: 'from-secondary-purple/80 to-primary-purple/80' },
  { id: 4, name: 'portfolio-thumb.jpg', type: 'image', size: '1.1 MB', gradient: 'from-accent-cyan/80 to-accent-blue/80' },
]

const typeIcons = { image: Image, document: FileText, video: Film }

export default function AdminMediaPage() {
  const [search, setSearch] = useState('')
  const filtered = mediaItems.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Manager"
        description="Upload and manage media assets"
        action={
          <Button variant="light" className="!h-11 !px-5 !text-sm">
            <Upload strokeWidth={1.75} className="h-4 w-4" />
            Upload Media
          </Button>
        }
      />
      <input
        type="search"
        placeholder="Search media..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-11 w-full max-w-sm rounded-xl border border-gray-200 bg-white px-4 text-sm focus:border-primary-purple focus:outline-none focus:ring-2 focus:ring-primary-purple/20"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((item) => {
          const Icon = typeIcons[item.type] || Image
          return (
            <div key={item.id} className="overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <LazyImage gradient={item.gradient} alt={item.name} aspectRatio="16/10" className="rounded-none border-0" />
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <Icon strokeWidth={1.75} className="h-4 w-4 text-gray-400" />
                  <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
                </div>
                <p className="mt-1 text-xs text-gray-500">{item.size}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
