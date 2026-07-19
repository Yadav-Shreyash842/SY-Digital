import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Mail, Phone, MapPin } from 'lucide-react'
import PageHero from '../../components/layout/PageHero'
import SectionContainer from '../../components/ui/SectionContainer'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'
import { sendContactMessage } from '../../services/contact'

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'hello@sydigital.com' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
  { icon: MapPin, label: 'Address', value: 'San Francisco, CA 94102' },
]

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await sendContactMessage(data)
      toast.success('Message sent! We\'ll get back to you soon.')
      reset()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHero
        title="Get In Touch"
        subtitle="Ready to start your next project? We'd love to hear from you."
        breadcrumbs={[{ label: 'Contact' }]}
      />
      <SectionContainer>
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-6">
            {contactInfo.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 rounded-[24px] border border-white/8 bg-card-bg p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-purple/20">
                  <Icon strokeWidth={1.75} className="h-6 w-6 text-primary-purple" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">{label}</p>
                  <p className="font-semibold">{value}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-5 rounded-[24px] border border-white/8 bg-card-bg p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="First Name" placeholder="John" error={errors.firstName?.message} {...register('firstName', { required: 'Required' })} />
              <Input label="Last Name" placeholder="Doe" error={errors.lastName?.message} {...register('lastName', { required: 'Required' })} />
            </div>
            <Input label="Email" type="email" placeholder="you@company.com" error={errors.email?.message} {...register('email', { required: 'Required' })} />
            <Input label="Subject" placeholder="How can we help?" error={errors.subject?.message} {...register('subject', { required: 'Required' })} />
            <Select
              label="Service Interest"
              options={[
                { value: 'web', label: 'Web Development' },
                { value: 'design', label: 'UI/UX Design' },
                { value: 'marketing', label: 'Digital Marketing' },
                { value: 'other', label: 'Other' },
              ]}
              {...register('service')}
            />
            <Textarea label="Message" placeholder="Tell us about your project..." error={errors.message?.message} {...register('message', { required: 'Required' })} />
            <Button type="submit" variant="primary" className="w-full" loading={loading}>Send Message</Button>
          </form>
        </div>
      </SectionContainer>
    </>
  )
}
