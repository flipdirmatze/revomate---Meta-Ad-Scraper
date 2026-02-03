import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import Layout from './components/Layout'
import SetupHint from './components/SetupHint'
import SearchForm from './components/SearchForm'
import AdResults from './components/AdResults'
import AnalysisModal from './components/AnalysisModal'

function App() {
  const [isReady, setIsReady] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [configStatus, setConfigStatus] = useState({ apify: false, gemini: false })
  const [ads, setAds] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAd, setSelectedAd] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Check if backend is ready (secrets configured)
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health')
        const data = await response.json()

        setConfigStatus(data.configured || { apify: false, gemini: false })
        setIsReady(data.ready === true)
      } catch (error) {
        console.error('Health check failed:', error)
        setIsReady(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkHealth()
  }, [])

  const handleSearch = async (searchParams) => {
    setIsLoading(true)
    setAds([])

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams),
      })

      const data = await response.json()

      if (data.success) {
        setAds(data.ads)
        toast.success(`${data.ads.length} Ads gefunden!`)
      } else {
        throw new Error(data.error || 'Scraping fehlgeschlagen')
      }
    } catch (error) {
      console.error('Search error:', error)
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyze = async (ad) => {
    setSelectedAd(ad)
    setIsAnalyzing(true)
    setAnalysisResult(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl: ad.videoUrl,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setAnalysisResult(data.analysis)
      } else {
        throw new Error(data.error || 'Analyse fehlgeschlagen')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      setAnalysisResult({ error: error.message })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleCloseModal = () => {
    setSelectedAd(null)
    setAnalysisResult(null)
  }

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Wird geladen...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0F172A',
            color: '#fff',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Layout>
        {!isReady ? (
          <SetupHint configStatus={configStatus} />
        ) : (
          <div className="space-y-8">
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
            <AdResults
              ads={ads}
              isLoading={isLoading}
              onAnalyze={handleAnalyze}
            />
          </div>
        )}
      </Layout>

      {selectedAd && (
        <AnalysisModal
          ad={selectedAd}
          analysis={analysisResult}
          isAnalyzing={isAnalyzing}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}

export default App
