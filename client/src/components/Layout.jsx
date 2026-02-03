import Header from './Header'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-slate-500 text-sm">
            Made with precision by{' '}
            <span className="font-heading font-bold text-slate-900">revomate</span>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
