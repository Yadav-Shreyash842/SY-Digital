import { useEffect, useState } from 'react'
import { Shield, Crown, Users, Eye, Settings, Database, FileText, BarChart3, Lock, UserCheck } from 'lucide-react'
import roleService from '../../services/role.service'
import toast from 'react-hot-toast'

const roleConfig = {
  admin: {
    color: 'from-primary/20 to-primary/10',
    border: 'border-primary/30',
    accent: 'text-primary',
    icon: Crown,
  },
  manager: {
    color: 'from-primary/20 to-accent-blue/20',
    border: 'border-primary/30',
    accent: 'text-primary',
    icon: Shield,
  },
  client: {
    color: 'from-success/20 to-success/10',
    border: 'border-success/30',
    accent: 'text-success',
    icon: UserCheck,
  },
}

const permissionIcon = (label) => {
  const text = label.toLowerCase()
  if (text.includes('setting') || text.includes('config')) return Settings
  if (text.includes('user')) return Users
  if (text.includes('role')) return Shield
  if (text.includes('data')) return Database
  if (text.includes('content')) return FileText
  if (text.includes('analytics') || text.includes('report')) return BarChart3
  if (text.includes('security') || text.includes('audit')) return Lock
  if (text.includes('approve') || text.includes('reject') || text.includes('request')) return UserCheck
  if (text.includes('client')) return Users
  if (text.includes('view') || text.includes('monitor')) return Eye
  return Shield
}

const defaultRoles = [
  {
    key: 'admin',
    name: 'Admin',
    description: 'Full system access with complete control over all modules, users, and configurations.',
    permissions: ['Manage System Settings', 'Create & Manage All Users', 'Assign & Modify Roles', 'Access All Data', 'Manage All Content', 'View All Analytics & Reports', 'Security & Audit Logs', 'Approve or Reject Requests'],
    userCount: 0,
  },
  {
    key: 'manager',
    name: 'Manager',
    description: 'Manages day-to-day operations, client projects, and team workflows within assigned areas.',
    permissions: ['Manage Assigned Clients', 'Create & Edit Content', 'View Team Reports', 'Monitor Project Progress', 'Access Assigned Data'],
    userCount: 0,
  },
  {
    key: 'client',
    name: 'Client',
    description: 'Limited access to view own data, projects, and submit service requests.',
    permissions: ['View Own Projects & Data', 'View Own Analytics', 'Submit Support Requests'],
    userCount: 0,
  },
]

export default function AdminRolesPage() {
  const [roles, setRoles] = useState(defaultRoles)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await roleService.getAll()
        if (Array.isArray(data) && data.length > 0) {
          setRoles(data)
        }
      } catch {
        toast.error('Failed to load roles')
      } finally {
        setLoading(false)
      }
    }

    fetchRoles()
  }, [])

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

      {loading ? (
        <div className="rounded-card border border-border bg-card-bg p-12 text-center shadow-sm">
          <p className="text-sm font-medium text-text-secondary">Loading roles...</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {roles.map((role) => {
            const config = roleConfig[role.key] || roleConfig.admin
            const Icon = config.icon
            return (
              <div
                key={role.key || role.name}
                className={`relative overflow-hidden rounded-card border ${config.border} bg-gradient-to-br ${config.color} backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:shadow-black/20`}
              >
                <div className="p-4 sm:p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-btn ${config.border} border bg-card-bg`}>
                      <Icon className={`h-5 w-5 ${config.accent}`} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">{role.name}</h2>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.accent} bg-card-bg`}>
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
                      <span className="font-semibold text-white">{role.userCount ?? 0}</span> users assigned
                    </span>
                  </div>

                  <div className="border-t border-border pt-4">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Permissions
                    </h3>
                    <ul className="space-y-2">
                      {role.permissions.map((perm) => {
                        const PermIcon = permissionIcon(perm)
                        return (
                          <li key={perm} className="flex items-center gap-2.5">
                            <PermIcon className="h-3.5 w-3.5 shrink-0 text-text-muted" />
                            <span className="text-sm text-text-secondary">{perm}</span>
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
      )}

      <div className="rounded-card border border-border bg-card-bg p-4">
        <p className="text-sm text-text-secondary">
          <span className="font-medium text-white">Note:</span> These roles are defined at the system level and cannot be modified. Contact the development team to adjust role permissions or create new roles.
        </p>
      </div>
    </div>
  )
}
