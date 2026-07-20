import { useState, useEffect, useCallback } from 'react'
import { Eye, Pencil, Trash2, Shield, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminListPage from '../../components/dashboard/AdminListPage'
import Badge from '../../components/ui/Badge'
import Avatar from '../../components/ui/Avatar'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import userService from '../../services/user.service'

const roleOptions = [
  { value: '', label: 'All Roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'client', label: 'Client' },
]

const columns = [
  {
    key: 'name',
    label: 'User',
    render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar name={`${row.firstName} ${row.lastName}`} size="sm" />
        <div>
          <p className="font-medium text-white">{row.firstName} {row.lastName}</p>
          <p className="text-xs text-text-secondary">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'role',
    label: 'Role',
    render: (row) => (
      <Badge variant={row.role === 'admin' ? 'primary' : 'blue'}>
        {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
      </Badge>
    ),
  },
  {
    key: 'isVerified',
    label: 'Status',
    render: (row) => (
      <Badge variant={row.isVerified ? 'success' : 'warning'}>
        {row.isVerified ? 'Verified' : 'Unverified'}
      </Badge>
    ),
  },
  {
    key: 'createdAt',
    label: 'Joined',
    render: (row) => (
      <span className="text-sm text-text-secondary">
        {new Date(row.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
      </span>
    ),
  },
]

export default function AdminUsersPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Modal states
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showView, setShowView] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [selected, setSelected] = useState(null)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'client' })
  const [formLoading, setFormLoading] = useState(false)
  const [errors, setErrors] = useState({})

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
    } catch (err) {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [page, search, roleFilter])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    setPage(1)
  }, [search, roleFilter])

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
      setShowDelete(false)
      setSelected(null)
      fetchData()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete user')
    } finally {
      setFormLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'client' })
    setErrors({})
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
    setShowDelete(true)
  }

  const actions = [
    { icon: Eye, label: 'View', onClick: openView },
    { icon: Pencil, label: 'Edit', onClick: openEdit },
    { icon: Trash2, label: 'Delete', onClick: openDelete, variant: 'danger' },
  ]

  return (
    <>
      <AdminListPage
        title="Users"
        description="Manage platform users and access"
        actionLabel="Add User"
        onAction={openCreate}
        columns={columns}
        data={data}
        loading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        filters={
          <Select options={roleOptions} value={roleFilter} onChange={setRoleFilter} className="w-40" />
        }
        pagination={{ page, totalPages, total, onPageChange: setPage }}
        actions={actions}
      />

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add User" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-2 gap-4">
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
                <h3 className="text-lg font-semibold">{selected.firstName} {selected.lastName}</h3>
                <p className="text-sm text-text-secondary">{selected.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-text-secondary">Role:</span> <Badge variant={selected.role === 'admin' ? 'primary' : 'blue'}>{selected.role}</Badge></div>
              <div><span className="text-text-secondary">Status:</span> <Badge variant={selected.isVerified ? 'success' : 'warning'}>{selected.isVerified ? 'Verified' : 'Unverified'}</Badge></div>
              <div><span className="text-text-secondary">Phone:</span> {selected.phone || 'N/A'}</div>
              <div><span className="text-text-secondary">Joined:</span> {new Date(selected.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => setShowView(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${selected?.firstName} ${selected?.lastName}? This action cannot be undone.`}
        loading={formLoading}
        variant="danger"
      />
    </>
  )
}
