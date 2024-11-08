'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Trash2, AlertCircle, LogOut, RefreshCw, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { submitUrls, fetchMedias } from './api/api'
import Image from 'next/image'
import { ImageLoaderProps } from 'next/image'
import { ScraperResponse } from '@/app/types/api.type'

const customLoader = ({ src }: ImageLoaderProps) => {
  return src
}

const ITEMS_PER_PAGE = 12

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [urls, setUrls] = useState([''])
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<string | null>(null)
  const [scrapedMedia, setScrapedMedia] = useState<ScraperResponse[]>([])
  const [isFetchingMedias, setIsFetchingMedias] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      router.push('/')
      fetchUserMedias()
    }
  }, [status, router])

  const fetchUserMedias = async () => {
    setIsFetchingMedias(true)
    try {
      const medias = await fetchMedias()
      setScrapedMedia(medias.data)
    } catch (error) {
      console.error('Failed to fetch medias:', error)
    } finally {
      setIsFetchingMedias(false)
    }
  }

  const addUrlField = () => {
    setUrls([...urls, ''])
    setErrors([...errors, ''])
  }

  const removeUrlField = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index)
    const newErrors = errors.filter((_, i) => i !== index)
    setUrls(newUrls)
    setErrors(newErrors)
  }

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls]
    newUrls[index] = value
    setUrls(newUrls)

    const newErrors = [...errors]
    newErrors[index] = validateUrl(value) ? '' : 'Please enter a valid URL'
    setErrors(newErrors)
  }

  const validateUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validUrls = urls.filter(validateUrl)
    if (validUrls.length === 0) {
      setSubmitResult('Please enter at least one valid URL')
      return
    }

    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const result = await submitUrls(validUrls)
      setSubmitResult(`Successfully scraped ${validUrls.length} URL(s)`)
      await fetchUserMedias()
      setUrls([''])
      setErrors([''])
    } catch (error) {
      setSubmitResult(`Failed to submit URLs: ${error}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const mediaByDomain = useMemo(() => {
    const groupedMedia: { [key: string]: ScraperResponse[] } = {}
    scrapedMedia.forEach((media) => {
      const url = new URL(media.src)
      const domain = url.hostname
      if (!groupedMedia[domain]) {
        groupedMedia[domain] = []
      }
      groupedMedia[domain].push(media)
    })
    return groupedMedia
  }, [scrapedMedia])

  const domains = useMemo(() => Object.keys(mediaByDomain), [mediaByDomain])

  const filteredMedia = useMemo(() => {
    return scrapedMedia.filter((media) => {
      if (selectedDomain && new URL(media.src).hostname !== selectedDomain) return false
      if (selectedType && media.type !== selectedType) return false
      if (searchText && !media.src.toLowerCase().includes(searchText.toLowerCase())) return false
      return true
    })
  }, [selectedDomain, selectedType, searchText, scrapedMedia])

  const paginatedMedia = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredMedia.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredMedia, currentPage])

  const totalPages = Math.ceil(filteredMedia.length / ITEMS_PER_PAGE)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (status === 'unauthenticated') {
    return <div className="min-h-screen flex items-center justify-center">Redirecting to login...</div>
  }

  if (!session) {
    router.push('/login')
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Media Scraper</h1>
          <button
            onClick={() => signOut()}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-white text-gray-900 border border-gray-900 hover:bg-gray-900 hover:text-white h-10 py-2 px-4"
          >
            <LogOut size={16} className="mr-2" />
            Sign out
          </button>
        </div>
        <h2 className="text-center font-bold mb-6 text-gray-900">Welcome, {session?.user?.username || 'User'}!</h2>
        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg border border-gray-200 px-8 pt-6 pb-8 mb-4">
          {urls.map((url, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  placeholder="Enter URL that contains images or videos"
                  required
                  aria-invalid={errors[index] ? "true" : "false"}
                  aria-describedby={`url-error-${index}`}
                  className={`flex h-10 w-full rounded-md border ${
                    errors[index] ? 'border-red-500' : 'border-gray-300'
                  } bg-transparent px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                />
                {urls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeUrlField(index)}
                    className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={`Remove URL at position ${index + 1}`}
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
              {errors[index] && (
                <div id={`url-error-${index}`} className="mt-1 text-red-500 text-xs flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  {errors[index]}
                </div>
              )}
            </div>
          ))}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={addUrlField}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-gray-900 text-gray-50 hover:bg-gray-900/90 h-10 py-2 px-4"
            >
              <PlusCircle size={16} className="mr-2" />
              Add URL
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-white text-gray-900 border border-gray-900 hover:bg-gray-900 hover:text-white h-10 py-2 px-4"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
        {submitResult && (
          <div className={`mt-4 p-4 rounded-md ${submitResult.startsWith('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {submitResult}
          </div>
        )}
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
            <h2 className="text-2xl font-bold text-gray-900">Your Scraped Media</h2>
            <div className="flex items-center space-x-2">
              <label htmlFor="domain-select" className="sr-only">Filter by domain</label>
              <select
                id="domain-select"
                value={selectedDomain || ''}
                onChange={(e) => setSelectedDomain(e.target.value || null)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                <option value="">All Domains</option>
                {domains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
              <label htmlFor="type-select" className="sr-only">Filter by type</label>
              <select
                id="type-select"
                value={selectedType || ''}
                onChange={(e) => setSelectedType(e.target.value || null)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                <option value="">All Types</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-8 pr-3 py-2 w-full rounded-md border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                />
                <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button
                onClick={fetchUserMedias}
                disabled={isFetchingMedias}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-white text-gray-900 border border-gray-900 hover:bg-gray-900 hover:text-white h-10 py-2 px-4"
              >
                <RefreshCw size={16} className={`mr-2 ${isFetchingMedias ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
          {isFetchingMedias ? (
            <div className="text-center">Loading medias...</div>
          ) : paginatedMedia.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {paginatedMedia.map((media, index) => (
                  <MediaItem key={index} media={media} index={index} />
                ))}
              </div>
              <div className="mt-4 flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md bg-gray-200 text-gray-600 disabled:opacity-50"
                  title='Previous page'
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-gray-900">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md bg-gray-200 text-gray-600 disabled:opacity-50"
                  title='Next page'
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">No media found. Try adjusting your filters or submitting some URLs!</div>
          )}
        </div>
      </div>
    </main>
  )
}

function MediaItem({ media, index }: { media: ScraperResponse; index: number }) {
  return (
    <div className="border rounded-lg  p-2">
      {media.type === 'image' ? (
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded overflow-hidden">
          <Image
            loader={customLoader}
            src={media.src}
            alt={`Scraped image ${index + 1}`}
            width={200}
            height={200}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
      ) : media.type === 'video' ? (
        <video
          src={media.src}
          controls
          className="w-full h-40 object-cover rounded"
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded">
          Unsupported media type
        </div>
      )}
      <p className="mt-2 text-sm text-gray-600 truncate">{media.src}</p>
    </div>
  )
}