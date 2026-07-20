import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Calendar, Clock, Video, Building2 } from 'lucide-react'
import PageHero from '../../components/layout/PageHero'
import SectionContainer from '../../components/ui/SectionContainer'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'
import { meetingService } from '../../services/meeting.service'
import { serviceService } from '../../services/service.service'

const meetingTypeInfo = [
  { icon: Video, label: 'Online', value: 'online', desc: 'Video call via Google Meet or Zoom' },
  { icon: Building2, label: 'In Person', value: 'offline', desc: 'Visit our office for an in-person meeting' },
]

export default function ScheduleMeetingPage() {
  const [loading, setLoading] = useState(false)
  const [services, setServices] = useState([])
  const [meetingType, setMeetingType] = useState('online')
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({ defaultValues: { meetingType: 'online' } })

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await serviceService.list({ status: 'published' })
        const list = res?.data?.services || res?.data || []
        setServices(list)
      } catch {
        // silent
      }
    }
    fetchServices()
  }, [])

  const serviceOptions = services.map((s) => ({ value: s._id, label: s.title }))

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        meetingDate: data.meetingDate,
        meetingTime: data.meetingTime,
        meetingType,
        projectRequirements: data.projectRequirements,
        budget: data.budget ? Number(data.budget) : 0,
      }
      await meetingService.create(payload)
      toast.success('Meeting request submitted! We\'ll confirm your slot shortly.')
      reset()
      setMeetingType('online')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to schedule meeting. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      <PageHero
        title="Schedule a Meeting"
        subtitle="Book a consultation with our team. Pick a time that works for you and tell us about your project."
        breadcrumbs={[{ label: 'Schedule Meeting' }]}
      />
      <SectionContainer>
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start gap-4 rounded-[24px] border border-white/8 bg-card-bg p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20">
                <Calendar strokeWidth={1.75} className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-text-muted">How it works</p>
                <p className="font-semibold">Pick a date & time</p>
                <p className="mt-1 text-sm text-text-muted">Choose a convenient slot and tell us about your project requirements.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-[24px] border border-white/8 bg-card-bg p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-blue/20">
                <Clock strokeWidth={1.75} className="h-6 w-6 text-accent-blue" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Response time</p>
                <p className="font-semibold">Within 24 hours</p>
                <p className="mt-1 text-sm text-text-muted">We'll confirm your meeting slot and send a calendar invite.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-[24px] border border-white/8 bg-card-bg p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-cyan/20">
                <Video strokeWidth={1.75} className="h-6 w-6 text-accent-cyan" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Meeting types</p>
                <p className="font-semibold">Online or In-Person</p>
                <p className="mt-1 text-sm text-text-muted">Choose between a video call or a visit to our office.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-5 rounded-[24px] border border-white/8 bg-card-bg p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Full Name" placeholder="John Doe" error={errors.name?.message} {...register('name', { required: 'Required' })} />
              <Input label="Email" type="email" placeholder="you@company.com" error={errors.email?.message} {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} />
            </div>
            <Input label="Phone" type="tel" placeholder="+1 (555) 123-4567" error={errors.phone?.message} {...register('phone', { required: 'Required' })} />
            <Select
              label="Service"
              placeholder="Select a service"
              options={serviceOptions}
              error={errors.service?.message}
              {...register('service', { required: 'Required' })}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Preferred Date" type="date" min={today} error={errors.meetingDate?.message} {...register('meetingDate', { required: 'Required' })} />
              <Input label="Preferred Time" placeholder="e.g. 10:00 AM" error={errors.meetingTime?.message} {...register('meetingTime', { required: 'Required' })} />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Meeting Type</label>
              <div className="grid grid-cols-2 gap-3">
                {meetingTypeInfo.map(({ icon: Icon, label, value, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => { setMeetingType(value); setValue('meetingType', value) }}
                    className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                      meetingType === value
                        ? 'border-primary bg-primary/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <Icon strokeWidth={1.75} className={`mt-0.5 h-5 w-5 shrink-0 ${meetingType === value ? 'text-primary' : 'text-text-muted'}`} />
                    <div>
                      <p className="font-semibold">{label}</p>
                      <p className="text-xs text-text-muted">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              label="Project Requirements"
              placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
              rows={5}
              error={errors.projectRequirements?.message}
              {...register('projectRequirements', { required: 'Required', maxLength: { value: 5000, message: 'Max 5000 characters' } })}
            />

            <Input label="Estimated Budget (optional)" type="number" placeholder="e.g. 50000" {...register('budget')} />

            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              Schedule Meeting
            </Button>
          </form>
        </div>
      </SectionContainer>
    </>
  )
}
