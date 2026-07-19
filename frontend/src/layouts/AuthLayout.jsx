import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Logo from '../components/ui/Logo'

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen">
      <div className="hidden w-1/2 hero-gradient lg:block">
        <div className="flex h-full flex-col justify-between p-12">
          <Logo />
          <div>
            <h2 className="text-3xl font-bold leading-tight">
              Build Digital Excellence<br />
              <span className="text-primary-purple">With SY Digital</span>
            </h2>
            <p className="mt-4 max-w-md text-text-secondary">
              Premium digital agency platform for brands that demand excellence.
            </p>
          </div>
          <p className="text-sm text-text-muted">© {new Date().getFullYear()} SY Digital</p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-primary-bg px-4 py-12 lg:w-1/2">
        <div className="mb-8 lg:hidden">
          <Link to="/"><Logo /></Link>
        </div>
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
