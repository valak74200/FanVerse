import { useState, useEffect } from 'react'
import { ApiService } from '../services/api'

export function useApi<T>(endpoint: string, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await ApiService.get<T>(endpoint)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, dependencies)

  return { data, loading, error, refetch: fetchData }
}

// Hook spécialisé pour les paris blockchain
export function useBlockchainBets() {
  return useApi('/api/blockchain/bets')
}

// Hook spécialisé pour les NFTs utilisateur
export function useUserNFTs(address: string) {
  return useApi(`/api/blockchain/nfts?address=${address}`, [address])
}