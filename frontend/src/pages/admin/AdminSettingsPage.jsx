import { useState } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import Input from '../../components/ui/Input'
import Switch from '../../components/ui/Switch'
import Button from '../../components/ui/Button'
import Tabs from '../../components/ui/Tabs'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [tab, setTab] = useState('general')
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [emails, setEmails] = useState(true)

  const handleSave = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    toast.success('Settings saved')
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Configure platform settings and preferences" />
      <Tabs
        tabs={[
          { id: 'general', label: 'General' },
          { id: 'notifications', label: 'Notifications' },
          { id: 'security', label: 'Security' },
        ]}
        activeTab={tab}
        onChange={setTab}
        theme="light"
      />
      <div className="max-w-xl space-y-5 rounded-[20px] border border-gray-200 bg-white p-6 shadow-sm">
        {tab === 'general' && (
          <>
            <Input label="Agency Name" defaultValue="SY Digital" theme="light" />
            <Input label="Support Email" defaultValue="hello@sydigital.com" theme="light" />
            <Input label="Website URL" defaultValue="https://sydigital.com" theme="light" />
          </>
        )}
        {tab === 'notifications' && (
          <>
            <Switch label="Push Notifications" checked={notifications} onChange={setNotifications} theme="light" />
            <Switch label="Email Notifications" checked={emails} onChange={setEmails} theme="light" />
          </>
        )}
        {tab === 'security' && (
          <>
            <Input label="Session Timeout (minutes)" type="number" defaultValue="30" theme="light" />
            <Switch label="Two-Factor Authentication" checked={false} onChange={() => {}} theme="light" />
          </>
        )}
        <Button variant="light" loading={loading} onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  )
}
