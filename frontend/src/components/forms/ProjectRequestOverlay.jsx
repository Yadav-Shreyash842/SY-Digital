import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { X, Rocket, Lock, Briefcase, Check, ArrowRight } from 'lucide-react'
import { cn } from '../../utils/cn'
import { projectRequestService } from '../../services/projectRequest.service'
import Spinner from '../ui/Spinner'

const projectTypeOptions = [
  { value: 'Website', label: 'Website' },
  { value: 'Web Application', label: 'Web Application' },
  { value: 'Mobile App', label: 'Mobile App' },
  { value: 'UI/UX Design', label: 'UI/UX Design' },
  { value: 'Branding', label: 'Branding' },
  { value: 'Digital Marketing', label: 'Digital Marketing' },
  { value: 'SEO', label: 'SEO' },
  { value: 'Custom Software', label: 'Custom Software' },
]

const budgetOptions = [
  { value: 'Less than $5,000', label: 'Less than $5,000' },
  { value: '$5,000 - $10,000', label: '$5,000 - $10,000' },
  { value: '$10,000 - $25,000', label: '$10,000 - $25,000' },
  { value: '$25,000+', label: '$25,000+' },
]

const timelineOptions = [
  { value: 'Urgent (< 2 weeks)', label: 'Urgent (< 2 weeks)' },
  { value: '1 Month', label: '1 Month' },
  { value: '2-3 Months', label: '2-3 Months' },
  { value: 'Flexible', label: 'Flexible' },
]

const features = [
  {
    icon: Rocket,
    title: 'Fast Response',
    desc: 'Response within 24 hours guaranteed',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Lock,
    title: 'Secure & Confidential',
    desc: 'Your information and ideas are completely safe',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Briefcase,
    title: 'Professional Consultation',
    desc: 'Talk directly with our digital solution experts',
    color: 'bg-primary/10 text-primary',
  },
]

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const contentVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
}

const featureVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.3 + i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
}

const checkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } },
}

function FormSelect({ label, required, error, options, placeholder, ...props }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-secondary">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <div className="relative">
        <select
          className={cn(
            'h-14 w-full appearance-none rounded-input border px-4 pr-10 text-sm transition-all duration-300 focus:outline-none focus:ring-2',
            'border-border bg-white/5 text-white focus:border-primary focus:ring-primary/20',
            error && 'border-danger focus:border-danger focus:ring-danger/20',
          )}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}

function FormInput({ label, required, error, ...props }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-secondary">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        className={cn(
          'h-14 w-full rounded-input border px-4 text-sm transition-all duration-300 focus:outline-none focus:ring-2',
          'border-border bg-white/5 text-white placeholder:text-text-placeholder focus:border-primary focus:ring-primary/20',
          error && 'border-danger focus:border-danger focus:ring-danger/20',
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}

export default function ProjectRequestOverlay({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset, watch, formState } = useForm({ mode: 'onChange' })

  const descriptionValue = watch('description', '')
  const termsValue = watch('terms', false)

  const isFormValid = formState.isValid && termsValue

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose?.()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await projectRequestService.createPublic({
        name: data.fullName,
        email: data.email,
        phone: data.phone || '',
        company: data.company || '',
        projectType: data.projectType,
        budget: data.budget,
        timeline: data.timeline,
        description: data.description,
      })
      setSubmitted(true)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to submit request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    reset()
    setSubmitted(false)
  }

  const handleClose = () => {
    setSubmitted(false)
    reset()
    onClose?.()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Background glows */}
          <div className="pointer-events-none absolute -left-[10%] -top-[10%] h-[50vw] w-[50vw] rounded-full bg-primary/10 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-[10%] -right-[10%] h-[50vw] w-[50vw] rounded-full bg-accent-blue/8 blur-[120px]" />

          {/* Top bar */}
          <div className="relative z-10 flex w-full items-center justify-between px-4 py-4 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-border bg-card-bg text-sm font-extrabold text-primary shadow-lg">
                SY
              </div>
              <span className="text-lg font-bold tracking-tight">SY Digital</span>
            </div>
            <button
              onClick={handleClose}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card-bg text-text-muted transition-all duration-200 hover:border-white/20 hover:text-white"
              aria-label="Close"
            >
              <X strokeWidth={1.75} className="h-5 w-5" />
            </button>
          </div>

          {/* Main content */}
          <motion.div
            className="relative z-10 flex-1 overflow-y-auto px-4 pb-8 sm:px-8 sm:pb-12"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="mx-auto grid max-w-[1320px] items-start gap-8 lg:grid-cols-[35%_65%] lg:gap-12">
              {/* Left column - Info */}
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary shadow-[0_0_10px_theme(--color-primary)]" />
                  <span className="text-sm font-semibold text-primary">Accepting New Projects</span>
                </div>

                {/* Heading */}
                <h1 className="text-[32px] font-extrabold leading-[1.15] tracking-tight sm:text-[40px] lg:text-[44px]">
                  Start Your Project
                </h1>
                <p className="max-w-md text-base leading-relaxed text-text-muted">
                  Tell us about your project. We'll review your requirements and contact you within 24 hours.
                </p>

                {/* Feature cards */}
                <div className="space-y-4">
                  {features.map((feature, i) => (
                    <motion.div
                      key={feature.title}
                      custom={i}
                      variants={featureVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex items-start gap-4 rounded-[18px] border border-border bg-card-bg/75 p-5 backdrop-blur-xl transition-colors duration-200 hover:border-white/15"
                    >
                      <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', feature.color)}>
                        <feature.icon strokeWidth={1.75} className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{feature.title}</h3>
                        <p className="mt-0.5 text-xs text-text-muted">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right column - Form */}
              <div className="rounded-modal border border-border bg-card-bg/75 p-6 shadow-xl backdrop-blur-xl sm:p-8 lg:p-10">
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -10 }}
                      onSubmit={handleSubmit(onSubmit)}
                      noValidate
                    >
                      <div className="space-y-5">
                        {/* Row: Full Name + Email */}
                        <div className="grid gap-5 sm:grid-cols-2">
                          <FormInput
                            label="Full Name"
                            placeholder="John Doe"
                            required
                            error={errors.fullName?.message}
                            {...register('fullName', { required: 'Full name is required' })}
                          />
                          <FormInput
                            label="Email"
                            type="email"
                            placeholder="john@example.com"
                            required
                            error={errors.email?.message}
                            {...register('email', {
                              required: 'Email is required',
                              pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Please enter a valid email',
                              },
                            })}
                          />
                        </div>

                        {/* Row: Phone + Company */}
                        <div className="grid gap-5 sm:grid-cols-2">
                          <FormInput
                            label="Phone Number"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            {...register('phone')}
                          />
                          <FormInput
                            label="Company Name"
                            placeholder="Acme Inc."
                            {...register('company')}
                          />
                        </div>

                        {/* Row: Project Type + Budget */}
                        <div className="grid gap-5 sm:grid-cols-2">
                          <FormSelect
                            label="Project Type"
                            required
                            placeholder="Select project type"
                            options={projectTypeOptions}
                            error={errors.projectType?.message}
                            {...register('projectType', { required: 'Please select a project type' })}
                          />
                          <FormSelect
                            label="Budget"
                            required
                            placeholder="Select budget range"
                            options={budgetOptions}
                            error={errors.budget?.message}
                            {...register('budget', { required: 'Please select a budget range' })}
                          />
                        </div>

                        {/* Timeline */}
                        <FormSelect
                          label="Timeline"
                          required
                          placeholder="Select estimated timeline"
                          options={timelineOptions}
                          error={errors.timeline?.message}
                          {...register('timeline', { required: 'Please select a timeline' })}
                        />

                        {/* Description */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-text-secondary">
                            Project Description <span className="text-primary">*</span>
                          </label>
                          <textarea
                            rows={4}
                            maxLength={500}
                            placeholder="Briefly describe your project goals, scope, and key features..."
                            className={cn(
                              'w-full resize-none rounded-input border px-4 py-3 text-sm transition-all duration-300 focus:outline-none focus:ring-2',
                              'border-border bg-white/5 text-white placeholder:text-text-placeholder focus:border-primary focus:ring-primary/20',
                              errors.description && 'border-danger focus:border-danger focus:ring-danger/20',
                            )}
                            {...register('description', { required: 'Description is required' })}
                          />
                          <div className="flex items-center justify-between">
                            {errors.description ? (
                              <p className="text-xs text-danger">{errors.description.message}</p>
                            ) : (
                              <span />
                            )}
                            <span className="text-xs text-text-muted">{(descriptionValue || '').length}/500</span>
                          </div>
                        </div>

                        {/* Terms checkbox */}
                        <div className="space-y-2">
                          <label className="flex cursor-pointer items-start gap-3">
                            <input
                              type="checkbox"
                              className="mt-0.5 h-5 w-5 rounded-md border-white/20 bg-white/5 text-primary focus:ring-2 focus:ring-primary/30 focus:ring-offset-0"
                              {...register('terms', { required: 'You must accept the terms to proceed' })}
                            />
                            <span className="text-sm text-text-muted">
                              I agree to the <span className="font-medium text-white underline">Privacy Policy</span> and{' '}
                              <span className="font-medium text-white underline">Terms of Service</span>.
                            </span>
                          </label>
                          {errors.terms && <p className="text-xs text-danger">{errors.terms.message}</p>}
                        </div>

                        {/* Submit button */}
                        <div className="pt-2 sm:pt-4">
                          <button
                            type="submit"
                            disabled={loading || !isFormValid}
                            className={cn(
                              'flex h-14 w-full items-center justify-center gap-2.5 rounded-btn text-base font-bold text-white transition-all duration-300',
                              'bg-primary shadow-[0_8px_24px_rgba(239,68,68,0.3)] hover:bg-primary-hover',
                              (loading || !isFormValid) && 'pointer-events-none opacity-60',
                            )}
                          >
                            {loading ? (
                              <>
                                <Spinner size="sm" />
                                <span>Submitting...</span>
                              </>
                            ) : (
                              <>
                                <span>Send Project Request</span>
                                <ArrowRight strokeWidth={2} className="h-5 w-5" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col items-center py-12 text-center"
                    >
                      <motion.div
                        variants={checkVariants}
                        initial="hidden"
                        animate="visible"
                        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-primary/10"
                      >
                        <Check strokeWidth={3} className="h-10 w-10 text-primary" />
                      </motion.div>

                      <h2 className="mb-3 text-2xl font-extrabold sm:text-3xl">Project Request Submitted!</h2>
                      <p className="mb-8 max-w-sm text-sm leading-relaxed text-text-muted">
                        Thank you for reaching out. Our team will review your requirements and get back to you within 24 hours.
                      </p>

                      <div className="flex w-full max-w-xs flex-col gap-3">
                        <button
                          onClick={handleReset}
                          className="flex h-13 w-full items-center justify-center rounded-btn bg-primary text-base font-bold text-white shadow-[0_4px_20px_rgba(239,68,68,0.3)] transition-all duration-300 hover:bg-primary-hover"
                        >
                          Submit Another Request
                        </button>
                        <button
                          onClick={handleClose}
                          className="flex h-13 w-full items-center justify-center rounded-btn border border-border bg-white/[0.03] text-base font-semibold text-white transition-all duration-300 hover:bg-white/[0.06]"
                        >
                          Back to Home
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
