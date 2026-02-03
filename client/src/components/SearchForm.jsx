import { useState } from 'react'
import { Search, Loader2, Filter, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

function SearchForm({ onSearch, isLoading }) {
  const [searchUrl, setSearchUrl] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    maxResults: 50,
    country: 'ALL',
    activeStatus: 'ALL',
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!searchUrl.trim()) {
      toast.error('Bitte eine Meta Ad Library URL eingeben')
      return
    }

    // Validate URL format
    if (!searchUrl.includes('facebook.com/ads/library')) {
      toast.error('Bitte eine gültige Meta Ad Library URL eingeben')
      return
    }

    onSearch({
      searchUrl: searchUrl.trim(),
      ...filters,
    })
  }

  return (
    <div className="bg-white rounded-lg-card shadow-card p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-bold text-slate-900 mb-1">
          Meta Ads durchsuchen
        </h2>
        <p className="text-slate-600">
          Gib eine Meta Ad Library URL ein, um Werbeanzeigen zu scrapen.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="url"
            value={searchUrl}
            onChange={(e) => setSearchUrl(e.target.value)}
            placeholder="https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=DE&q=..."
            className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-btn text-slate-900 placeholder:text-slate-400"
            disabled={isLoading}
          />
        </div>

        {/* Filter Toggle */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filter</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Max. Ergebnisse
              </label>
              <select
                value={filters.maxResults}
                onChange={(e) => setFilters(prev => ({ ...prev, maxResults: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 bg-white"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Land
              </label>
              <select
                value={filters.country}
                onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 bg-white"
              >
                <option value="ALL">Alle Länder</option>
                <option value="DE">Deutschland</option>
                <option value="AT">Österreich</option>
                <option value="CH">Schweiz</option>
                <option value="US">USA</option>
                <option value="GB">UK</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                value={filters.activeStatus}
                onChange={(e) => setFilters(prev => ({ ...prev, activeStatus: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-900 bg-white"
              >
                <option value="ALL">Alle</option>
                <option value="ACTIVE">Nur aktive</option>
                <option value="INACTIVE">Nur inaktive</option>
              </select>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto btn-revomate flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Suche läuft...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Ads suchen</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default SearchForm
