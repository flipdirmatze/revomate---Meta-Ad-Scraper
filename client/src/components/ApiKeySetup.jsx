import { useState } from 'react'
import { Key, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

function ApiKeySetup({ onComplete }) {
  const [keys, setKeys] = useState({
    apify: '',
    gemini: '',
  })
  const [validation, setValidation] = useState({
    apify: null,
    gemini: null,
  })
  const [isValidating, setIsValidating] = useState({
    apify: false,
    gemini: false,
  })

  const validateApifyKey = async (token) => {
    if (!token) return false
    setIsValidating(prev => ({ ...prev, apify: true }))

    try {
      const response = await fetch(`https://api.apify.com/v2/users/me?token=${token}`)
      const isValid = response.ok
      setValidation(prev => ({ ...prev, apify: isValid }))
      return isValid
    } catch {
      setValidation(prev => ({ ...prev, apify: false }))
      return false
    } finally {
      setIsValidating(prev => ({ ...prev, apify: false }))
    }
  }

  const validateGeminiKey = async (key) => {
    if (!key) return false
    setIsValidating(prev => ({ ...prev, gemini: true }))

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
      )
      const isValid = response.ok
      setValidation(prev => ({ ...prev, gemini: isValid }))
      return isValid
    } catch {
      setValidation(prev => ({ ...prev, gemini: false }))
      return false
    } finally {
      setIsValidating(prev => ({ ...prev, gemini: false }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!keys.apify || !keys.gemini) {
      toast.error('Bitte beide API Keys eingeben')
      return
    }

    const [apifyValid, geminiValid] = await Promise.all([
      validateApifyKey(keys.apify),
      validateGeminiKey(keys.gemini),
    ])

    if (apifyValid && geminiValid) {
      toast.success('API Keys erfolgreich validiert!')
      onComplete(keys)
    } else {
      if (!apifyValid) toast.error('Apify Token ungültig')
      if (!geminiValid) toast.error('Gemini API Key ungültig')
    }
  }

  const getInputStatus = (field) => {
    if (isValidating[field]) {
      return <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
    }
    if (validation[field] === true) {
      return <CheckCircle2 className="w-5 h-5 text-accent-emerald" />
    }
    if (validation[field] === false) {
      return <AlertCircle className="w-5 h-5 text-red-500" />
    }
    return null
  }

  return (
    <div className="max-w-lg mx-auto mt-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
          <Key className="w-8 h-8 text-slate-900" />
        </div>
        <h2 className="font-heading text-3xl font-bold text-slate-900 mb-2">
          API Keys einrichten
        </h2>
        <p className="text-slate-600">
          Gib deine API Keys ein, um den Meta Ad Scraper zu nutzen.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg-card shadow-card p-8 space-y-6">
        {/* Apify Token */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Apify API Token
          </label>
          <div className="relative">
            <input
              type="password"
              value={keys.apify}
              onChange={(e) => {
                setKeys(prev => ({ ...prev, apify: e.target.value }))
                setValidation(prev => ({ ...prev, apify: null }))
              }}
              onBlur={() => validateApifyKey(keys.apify)}
              placeholder="apify_api_xxxxxx"
              className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {getInputStatus('apify')}
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Hol dir deinen Token auf{' '}
            <a
              href="https://console.apify.com/account/integrations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue hover:underline"
            >
              apify.com
            </a>
          </p>
        </div>

        {/* Gemini Key */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Gemini API Key
          </label>
          <div className="relative">
            <input
              type="password"
              value={keys.gemini}
              onChange={(e) => {
                setKeys(prev => ({ ...prev, gemini: e.target.value }))
                setValidation(prev => ({ ...prev, gemini: null }))
              }}
              onBlur={() => validateGeminiKey(keys.gemini)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {getInputStatus('gemini')}
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Erstelle einen Key auf{' '}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue hover:underline"
            >
              Google AI Studio
            </a>
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!keys.apify || !keys.gemini}
          className="w-full btn-revomate flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Weiter</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        Deine API Keys werden nur lokal in deinem Browser gespeichert.
      </p>
    </div>
  )
}

export default ApiKeySetup
