import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { getErrorMessage } from '../utils/error'

export function useApi<T>(path: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get<T>(path)
      setData(response.data)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchData()
  }, [path])

  return { data, loading, error, refetch: fetchData }
}
