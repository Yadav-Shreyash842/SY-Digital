import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Settings,
  ShieldCheck,
  Bell,
  Loader2,
  Save,
} from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import useAuth from '../../hooks/useAuth'
import authService from '../../services/auth.service'
import toast from 'react-hot-toast'

function ProfilePanel() {
  const { user, setUser } = useAuth()
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await authService.updateProfile({ firstName, lastName, phone })
      if (updated) {
        setUser(updated)
        toast.success('Profile updated successfully')
      }
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="glass-card rounded-4xl border border-white/10 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.24)]"
      >
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3 text-slate-300">
              <User strokeWidth={1.75} className="h-5 w-5 text-primary" />
              <span className="text-sm uppercase tracking-[0.18em] text-slate-400">Account type</span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-white capitalize">{user?.role || 'Client'}</p>
          </div>
          <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3 text-slate-300">
              <ShieldCheck strokeWidth={1.75} className="h-5 w-5 text-accent-blue" />
              <span className="text-sm uppercase tracking-[0.18em] text-slate-400">Email verified</span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-white">{user?.isVerified ? 'Yes' : 'No'}</p>
          </div>
          <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3 text-slate-300">
              <Bell strokeWidth={1.75} className="h-5 w-5 text-warning" />
              <span className="text-sm uppercase tracking-[0.18em] text-slate-400">Member since</span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-white">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                : '—'}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05, ease: 'easeInOut' }}
        onSubmit={handleSave}
        className="glass-card rounded-4xl border border-white/10 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.24)]"
      >
        <h3 className="text-xl font-semibold text-white">Profile details</h3>
        <p className="mt-2 text-sm text-slate-400">Update your personal information.</p>

        <div className="mt-8 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-300">First name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-2 w-full rounded-btn border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Last name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-2 w-full rounded-btn border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="mt-2 w-full rounded-btn border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="mt-2 w-full rounded-btn border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-text-muted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save strokeWidth={1.75} className="h-4 w-4" />}
            Save changes
          </button>
        </div>
      </motion.form>
    </div>
  )
}

function SettingsPanel() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [meetingReminders, setMeetingReminders] = useState(true)
  const [paymentAlerts, setPaymentAlerts] = useState(true)

  const handleSave = () => {
    toast.success('Settings saved')
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="glass-card rounded-4xl border border-white/10 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.24)]"
      >
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3 text-slate-300">
              <Settings strokeWidth={1.75} className="h-5 w-5 text-primary" />
              <span className="text-sm uppercase tracking-[0.18em] text-slate-400">Preferences</span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-white">3 areas</p>
          </div>
          <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3 text-slate-300">
              <ShieldCheck strokeWidth={1.75} className="h-5 w-5 text-accent-blue" />
              <span className="text-sm uppercase tracking-[0.18em] text-slate-400">Security</span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-white">Active</p>
          </div>
          <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3 text-slate-300">
              <Bell strokeWidth={1.75} className="h-5 w-5 text-warning" />
              <span className="text-sm uppercase tracking-[0.18em] text-slate-400">Notifications</span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-white">On</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05, ease: 'easeInOut' }}
        className="glass-card rounded-4xl border border-white/10 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.24)]"
      >
        <h3 className="text-xl font-semibold text-white">Notification preferences</h3>
        <p className="mt-2 text-sm text-slate-400">Choose how you want to receive updates.</p>

        <div className="mt-8 space-y-5">
          {[
            { label: 'Email notifications', desc: 'Receive updates and alerts via email', value: emailNotifications, onChange: setEmailNotifications },
            { label: 'Meeting reminders', desc: 'Get notified before upcoming meetings', value: meetingReminders, onChange: setMeetingReminders },
            { label: 'Payment alerts', desc: 'Receive notifications for pending payments', value: paymentAlerts, onChange: setPaymentAlerts },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-[24px] border border-white/10 bg-white/5 p-5">
              <div>
                <p className="font-semibold text-white">{item.label}</p>
                <p className="mt-1 text-sm text-slate-400">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => item.onChange(!item.value)}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors ${
                  item.value ? 'bg-primary' : 'bg-white/10'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform mt-1 ${
                    item.value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <Save strokeWidth={1.75} className="h-4 w-4" />
            Save preferences
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function ClientFeaturePage({ title, subtitle = 'This section is coming soon.', variant }) {
  return (
    <div className="space-y-8">
      <PageHeader title={title} description={subtitle} theme="dark" />
      {variant === 'profile' ? <ProfilePanel /> : variant === 'settings' ? <SettingsPanel /> : (
        <div className="glass-card rounded-4xl border border-white/10 p-12 text-center shadow-[0_30px_80px_rgba(0,0,0,0.24)]">
          <p className="text-slate-400">This section is coming soon.</p>
        </div>
      )}
    </div>
  )
}
