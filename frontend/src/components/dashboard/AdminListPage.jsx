import { Plus } from 'lucide-react'
import PageHeader from '../ui/PageHeader'
import Table from '../ui/Table'
import StatsCard from '../cards/StatsCard'
import Button from '../ui/Button'

export default function AdminListPage({
  title,
  description,
  actionLabel = 'Add New',
  onAction,
  stats = [],
  columns = [],
  data = [],
  searchable = true,
  searchValue,
  onSearchChange,
  pagination,
  emptyTitle,
  emptyDescription,
  filters,
  toolbar,
  tableLoading = false,
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        action={
          actionLabel && (
            <Button className="!h-11 !px-5 !text-sm" onClick={onAction}>
              <Plus strokeWidth={1.75} className="h-4 w-4" />
              {actionLabel}
            </Button>
          )
        }
      />
      {stats.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, i) => (
            <StatsCard key={stat.label} {...stat} index={i} />
          ))}
        </div>
      )}
      {filters && <div>{filters}</div>}
      {toolbar && <div>{toolbar}</div>}
      <Table
        columns={columns}
        data={data}
        theme="dark"
        searchable={searchable}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        pagination={pagination}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        loading={tableLoading}
      />
    </div>
  )
}
