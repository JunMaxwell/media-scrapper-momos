'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Trash2, AlertCircle, LogOut } from 'lucide-react'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [urls, setUrls] = useState([''])
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validUrls = urls.filter(validateUrl)
    console.log('Submitted URLs:', validUrls)
    // Here you would typically send the data to your API
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (status === 'unauthenticated') {
    return <div className="min-h-screen flex items-center justify-center">Redirecting to login...</div>
  }

  if (!session) {
    router.push('/login');
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
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
        <p className="text-center mb-6">Welcome, {session?.user?.username || 'User'}!</p>
        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg border border-gray-200 px-8 pt-6 pb-8 mb-4">
          {urls.map((url, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  placeholder="Enter URL"
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
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-white text-gray-900 border border-gray-900 hover:bg-gray-900 hover:text-white h-10 py-2 px-4"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}