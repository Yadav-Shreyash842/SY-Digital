import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FolderKanban, Sparkles } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'
import clientService from '../../services/client.service'

const categoryOptions = [
  { value: 'Web Development', label: 'Web Development' },
  { value: 'UI/UX Design', label: 'UI/UX Design' },
  { value: 'Mobile App', label: 'Mobile App' },
  { value: 'Digital Marketing', label: 'Digital Marketing' },
  { value: 'E-commerce', label: 'E-commerce' },
  { value: 'Other', label: 'Other' },
]

export default function RequestProjectPage() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await clientService.requestProject(data)
      toast.success('Project request submitted! Our team will review it shortly.')
      reset()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to submit request.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Request a Project"
        description="Tell us about your vision and we'll get back to you with a plan."
        theme="dark"
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <div className="glass-card rounded-[28px] border border-white/10 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-btn bg-primary/20">
                <FolderKanban strokeWidth={1.75} className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-white">How it works</p>
                <p className="mt-1 text-sm text-slate-400">Submit your project idea with as much detail as possible. Our team will review it and get back to you within 48 hours.</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-[28px] border border-white/10 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-btn bg-accent-blue/20">
                <Sparkles strokeWidth={1.75} className="h-6 w-6 text-accent-blue" />
              </div>
              <div>
                <p className="font-semibold text-white">What happens next?</p>
                <p className="mt-1 text-sm text-slate-400">Once approved, your request becomes an active project. You can track progress from your project dashboard.</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-[32px] border border-white/10 p-8 space-y-5">
          <Input
            label="Project Title"
            placeholder="e.g. E-commerce Website Redesign"
            error={errors.title?.message}
            {...register('title', { required: 'Required', maxLength: { value: 120, message: 'Max 120 characters' } })}
          />
          <Select
            label="Category"
            placeholder="Select a category"
            options={categoryOptions}
            error={errors.category?.message}
            {...register('category', { required: 'Required' })}
          />
          <Textarea
            label="Description"
            placeholder="Describe your project goals, features, target audience, and any specific requirements..."
            rows={6}
            error={errors.description?.message}
            {...register('description', { required: 'Required' })}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Estimated Budget (optional)"
              type="number"
              placeholder="e.g. 50000"
              {...register('budget')}
            />
            <Input
              label="Timeline (optional)"
              placeholder="e.g. 2 months"
              {...register('timeline')}
            />
          </div>
          <Button type="submit" variant="primary" className="w-full" loading={loading}>
            Submit Request
          </Button>
        </form>
      </div>
    </div>
  )
}
