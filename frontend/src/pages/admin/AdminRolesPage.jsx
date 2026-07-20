import { Shield, Crown, Users, Eye, Settings, Database, FileText, BarChart3, Lock, UserCheck } from 'lucide-react'

const roles = [
  {
    name: 'Admin',
    badge: 'admin',
    color: 'from-primary/20 to-primary/10',
    border: 'border-primary/30',
    accent: 'text-primary',
    icon: Crown,
    description: 'Full system access with complete control over all modules, users, and configurations.',
    userCount: '5',
    permissions: [
      { icon: Settings, label: 'Manage System Settings' },
      { icon: Users, label: 'Create & Manage All Users' },
      { icon: Shield, label: 'Assign & Modify Roles' },
      { icon: Database, label: 'Access All Data' },
      { icon: FileText, label: 'Manage All Content' },
      { icon: BarChart3, label: 'View All Analytics & Reports' },
      { icon: Lock, label: 'Security & Audit Logs' },
      { icon: UserCheck, label: 'Approve or Reject Requests' },
    ],
  },
  {
    name: 'Manager',
    badge: 'manager',
    color: 'from-primary/20 to-accent-blue/20',
    border: 'border-primary/30',
    accent: 'text-primary',
    icon: Shield,
    description: 'Manages day-to-day operations, client projects, and team workflows within assigned areas.',
    userCount: '12',
    permissions: [
      { icon: Users, label: 'Manage Assigned Clients' },
      { icon: FileText, label: 'Create & Edit Content' },
      { icon: BarChart3, label: 'View Team Reports' },
      { icon: Eye, label: 'Monitor Project Progress' },
      { icon: Database, label: 'Access Assigned Data' },
    ],
  },
  {
    name: 'Client',
    badge: 'client',
    color: 'from-success/20 to-success/10',
    border: 'border-success/30',
    accent: 'text-success',
    icon: UserCheck,
    description: 'Limited access to view own data, projects, and submit service requests.',
    userCount: '142',
    permissions: [
      { icon: Eye, label: 'View Own Projects & Data' },
      { icon: BarChart3, label: 'View Own Analytics' },
      { icon: FileText, label: 'Submit Support Requests' },
    ],
  },
]

export default function AdminRolesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl text-white">Roles & Permissions</h1>
          <p className="mt-1 text-sm text-text-muted">
            System-defined roles and their access levels
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-card border border-border bg-card-bg px-4 py-2">
          <Shield className="h-4 w-4 text-text-muted" />
          <span className="text-sm text-text-secondary">{roles.length} System Roles</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {roles.map((role) => {
          const Icon = role.icon
          return (
            <div
              key={role.name}
              className={`relative overflow-hidden rounded-card border ${role.border} bg-gradient-to-br ${role.color} backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:shadow-black/20`}
            >
              <div className="p-4 sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-btn ${role.border} border bg-card-bg`}>
                    <Icon className={`h-5 w-5 ${role.accent}`} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{role.name}</h2>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${role.accent} bg-card-bg`}>
                      System Role
                    </span>
                  </div>
                </div>

                <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                  {role.description}
                </p>

                <div className="mb-5 flex items-center gap-2">
                  <Users className="h-4 w-4 text-text-muted" />
                  <span className="text-sm text-text-secondary">
                    <span className="font-semibold text-white">{role.userCount}</span> users assigned
                  </span>
                </div>

                <div className="border-t border-border pt-4">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Permissions
                  </h3>
                  <ul className="space-y-2">
                    {role.permissions.map((perm) => {
                      const PermIcon = perm.icon
                      return (
                        <li key={perm.label} className="flex items-center gap-2.5">
                          <PermIcon className="h-3.5 w-3.5 shrink-0 text-text-muted" />
                          <span className="text-sm text-text-secondary">{perm.label}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-card border border-border bg-card-bg p-4">
        <p className="text-sm text-text-secondary">
          <span className="font-medium text-white">Note:</span> These roles are defined at the system level and cannot be modified. Contact the development team to adjust role permissions or create new roles.
        </p>
      </div>
    </div>
  )
}