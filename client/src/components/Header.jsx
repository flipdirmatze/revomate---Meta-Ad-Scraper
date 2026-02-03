import { Zap } from 'lucide-react'

function Header() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-card flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl text-slate-900 tracking-tight">
                revomate
              </h1>
              <p className="text-xs text-slate-500">Meta Ad Scraper</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
