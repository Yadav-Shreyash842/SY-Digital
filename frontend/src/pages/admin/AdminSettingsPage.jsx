import { useContext, useEffect, useState } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import Input from '../../components/ui/Input'
import Switch from '../../components/ui/Switch'
import Button from '../../components/ui/Button'
import Tabs from '../../components/ui/Tabs'
import ThemeContext from '../../context/ThemeContext'
import settingService from '../../services/setting.service'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const { theme, toggleTheme } = useContext(ThemeContext) || {}
  const [tab, setTab] = useState('general')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [agencyName, setAgencyName] = useState('SY Digital')
  const [supportEmail, setSupportEmail] = useState('hello@sydigital.com')
  const [websiteUrl, setWebsiteUrl] = useState('https://sydigital.com')

  const [pushNotifications, setPushNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  const [sessionTimeout, setSessionTimeout] = useState('30')
  const [twoFactor, setTwoFactor] = useState(false)

  const isDark = theme === 'dark'

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true)
      try {
        const settings = await settingService.get()
        if (!settings) return
        setAgencyName(settings.agencyName ?? 'SY Digital')
        setSupportEmail(settings.supportEmail ?? 'hello@sydigital.com')
        setWebsiteUrl(settings.websiteUrl ?? 'https://sydigital.com')
        setPushNotifications(settings.pushNotifications ?? true)
        setEmailNotifications(settings.emailNotifications ?? true)
        setMarketingEmails(settings.marketingEmails ?? false)
        setSessionTimeout(String(settings.sessionTimeout ?? 30))
        setTwoFactor(settings.twoFactor ?? false)
      } catch {
        toast.error('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await settingService.update({
        agencyName,
        supportEmail,
        websiteUrl,
        pushNotifications,
        emailNotifications,
        marketingEmails,
        sessionTimeout: Number(sessionTimeout),
        twoFactor,
      })
      toast.success('Settings saved')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Configure platform settings and preferences" />
      <Tabs
        tabs={[
          { id: 'general', label: 'General' },
          { id: 'notifications', label: 'Notifications' },
          { id: 'security', label: 'Security' },
          { id: 'appearance', label: 'Appearance' },
        ]}
        activeTab={tab}
        onChange={setTab}
      />
      <div className="max-w-xl space-y-5 rounded-card border border-border bg-card-bg p-6 shadow-sm">
        {loading ? (
          <p className="py-8 text-center text-sm text-text-secondary">Loading settings...</p>
        ) : (
          <>
            {tab === 'general' && (
              <>
                <Input label="Agency Name" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} />
                <Input label="Support Email" type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
                <Input label="Website URL" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
              </>
            )}
            {tab === 'notifications' && (
              <>
                <Switch label="Push Notifications" checked={pushNotifications} onChange={setPushNotifications} />
                <Switch label="Email Notifications" checked={emailNotifications} onChange={setEmailNotifications} />
                <Switch label="Marketing Emails" checked={marketingEmails} onChange={setMarketingEmails} />
              </>
            )}
            {tab === 'security' && (
              <>
                <Input label="Session Timeout (minutes)" type="number" value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} />
                <Switch label="Two-Factor Authentication" checked={twoFactor} onChange={setTwoFactor} />
              </>
            )}
            {tab === 'appearance' && (
              <div className="space-y-4">
                <Switch label="Dark Mode" checked={isDark} onChange={toggleTheme} />
                <p className="text-xs text-text-secondary">
                  Current theme: <span className="font-medium capitalize">{isDark ? 'dark' : 'light'}</span>
                </p>
              </div>
            )}
            <Button loading={saving} onClick={handleSave}>
              Save Changes
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
