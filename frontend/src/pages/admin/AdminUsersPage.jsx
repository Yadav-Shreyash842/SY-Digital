import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import Breadcrumb from '../../components/ui/Breadcrumb'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import useSocket from '../../hooks/useSocket'
import userService from '../../services/user.service'
import UserStatsCards from '../../components/admin/users/UserStatsCards'
import UserFilterBar from '../../components/admin/users/UserFilterBar'
import UserDataTable from '../../components/admin/users/UserDataTable'
import UserRightPanel from '../../components/admin/users/UserRightPanel'

export default function AdminUsersPage() {
  const { connect } = useSocket()

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const [selectedUser, setSelectedUser] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showView, setShowView] = useState(false)
  const [selected, setSelected] = useState(null)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'client' })
  const [formLoading, setFormLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [statsData, setStatsData] = useState({ total: 0, admins: 0, clients: 0, verified: 0 })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 10 }
      if (search) params.search = search
      if (roleFilter) params.role = roleFilter
      const res = await userService.list(params)
      const payload = res?.data
      setData(payload?.users || [])
      setTotalPages(payload?.totalPages || 1)
      setTotal(payload?.total || 0)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [page, search, roleFilter])

  const fetchStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const allRes = await userService.list({ limit: 1000 })
      const allUsers = allRes?.data?.users || []
      setStatsData({
        total: allUsers.length,
        admins: allUsers.filter((u) => u.role === 'admin').length,
        clients: allUsers.filter((u) => u.role === 'client').length,
        verified: allUsers.filter((u) => u.isVerified).length,
      })
    } catch {
      // silent
    } finally {
      setStatsLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { fetchStats() }, [fetchStats])
  useEffect(() => { setPage(1) }, [search, roleFilter])

  useEffect(() => {
    const socket = connect()
    if (!socket) return
    const handleNew = () => { fetchData(); fetchStats() }
    socket.on('newUser', handleNew)
    socket.on('userUpdated', handleNew)
    socket.on('userDeleted', handleNew)
    return () => {
      socket.off('newUser', handleNew)
      socket.off('userUpdated', handleNew)
      socket.off('userDeleted', handleNew)
    }
  }, [connect, fetchData, fetchStats])

  const roleDistribution = useMemo(() => {
    const map = {}
    data.forEach((u) => {
      const r = u.role || 'other'
      map[r] = (map[r] || 0) + 1
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [data])

  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'client' })
    setErrors({})
  }

  const validateForm = () => {
    const e = {}
    if (!formData.firstName?.trim()) e.firstName = 'First name is required'
    if (!formData.lastName?.trim()) e.lastName = 'Last name is required'
    if (!formData.email?.trim()) e.email = 'Email is required'
    if (showCreate && !formData.password?.trim()) e.password = 'Password is required'
    if (showCreate && formData.password && formData.password.length < 8) e.password = 'Minimum 8 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const openCreate = () => {
    resetForm()
    setShowCreate(true)
  }

  const openEdit = (row) => {
    setSelected(row)
    setFormData({ firstName: row.firstName, lastName: row.lastName, email: row.email, role: row.role })
    setErrors({})
    setShowEdit(true)
  }

  const openView = (row) => {
    setSelected(row)
    setShowView(true)
  }

  const openDelete = (row) => {
    setSelected(row)
  }

  const handleCreate = async () => {
    if (!validateForm()) return
    setFormLoading(true)
    try {
      await userService.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      })
      toast.success('User created successfully')
      setShowCreate(false)
      resetForm()
      fetchData()
      fetchStats()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create user')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!formData.firstName?.trim() || !formData.lastName?.trim()) {
      setErrors({ firstName: !formData.firstName?.trim() ? 'Required' : '', lastName: !formData.lastName?.trim() ? 'Required' : '' })
      return
    }
    setFormLoading(true)
    try {
      await userService.update(selected._id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
      })
      toast.success('User updated successfully')
      setShowEdit(false)
      resetForm()
      fetchData()
      fetchStats()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update user')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    setFormLoading(true)
    try {
      await userService.remove(selected._id)
      toast.success('User deleted successfully')
      setSelected(null)
      fetchData()
      fetchStats()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete user')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        <Breadcrumb
          items={[
            { label: 'Users', href: '/admin/users' },
            { label: 'Manage Users' },
          ]}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.04, ease: 'easeInOut' }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Users</h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage platform users and access
          </p>
        </div>
        <Button variant="primary" className="self-start sm:self-auto" onClick={openCreate}>
          <UserPlus strokeWidth={1.75} className="h-4 w-4" />
          Add User
        </Button>
      </motion.div>

      <UserStatsCards stats={statsData} loading={statsLoading} />

      <UserFilterBar
        search={search}
        onSearchChange={setSearch}
        role={roleFilter}
        onRoleChange={setRoleFilter}
      />

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="min-w-0">
          <UserDataTable
            data={data}
            loading={loading}
            selectedId={selectedUser?._id}
            onSelect={setSelectedUser}
            onView={openView}
            onEdit={openEdit}
            onDelete={openDelete}
            pagination={{
              page,
              totalPages,
              total,
              onPageChange: setPage,
            }}
          />
        </div>

        <div className="hidden xl:block">
          <div className="sticky top-24">
            <UserRightPanel
              user={selectedUser}
              roleDistribution={roleDistribution}
            />
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add User" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} error={errors.firstName} />
            <Input label="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} error={errors.lastName} />
          </div>
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} error={errors.email} />
          <Input label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} error={errors.password} />
          <Select label="Role" options={[{ value: 'client', label: 'Client' }, { value: 'admin', label: 'Admin' }]} value={formData.role} onChange={(v) => setFormData({ ...formData, role: v })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate} loading={formLoading}>Create User</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit User" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} error={errors.firstName} />
            <Input label="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} error={errors.lastName} />
          </div>
          <Input label="Email" type="email" value={formData.email} disabled />
          <Select label="Role" options={[{ value: 'client', label: 'Client' }, { value: 'admin', label: 'Admin' }]} value={formData.role} onChange={(v) => setFormData({ ...formData, role: v })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleEdit} loading={formLoading}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={showView} onClose={() => setShowView(false)} title="User Details" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={`${selected.firstName} ${selected.lastName}`} size="lg" />
              <div>
                <h3 className="text-lg font-semibold text-white">{selected.firstName} {selected.lastName}</h3>
                <p className="text-sm text-text-secondary">{selected.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div><span className="text-text-secondary">Role:</span> <Badge variant={selected.role === 'admin' ? 'primary' : 'blue'}>{selected.role}</Badge></div>
              <div><span className="text-text-secondary">Status:</span> <Badge variant={selected.isVerified ? 'success' : 'warning'}>{selected.isVerified ? 'Verified' : 'Unverified'}</Badge></div>
              <div><span className="text-text-secondary">Phone:</span> <span className="text-white">{selected.phone || 'N/A'}</span></div>
              <div><span className="text-text-secondary">Joined:</span> <span className="text-white">{new Date(selected.createdAt).toLocaleDateString()}</span></div>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => setShowView(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!selected && !showCreate && !showEdit && !showView} onClose={() => setSelected(null)} title="Delete User" size="md">
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Are you sure you want to delete <span className="font-semibold text-white">{selected?.firstName} {selected?.lastName}</span>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={formLoading}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
