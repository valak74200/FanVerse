// Service API pour communiquer avec le backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export class ApiService {
  private static baseUrl = API_BASE_URL

  // Méthodes génériques
  static async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    return response.json()
  }

  static async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    return response.json()
  }

  // APIs Blockchain spécifiques
  static async getBlockchainBets() {
    return this.get('/api/blockchain/bets')
  }

  static async placeBet(description: string, amount: number, userAddress: string) {
    return this.post('/api/blockchain/bets/place', {
      description,
      amount,
      userAddress
    })
  }

  static async getUserNFTs(address: string) {
    return this.get(`/api/blockchain/nfts?address=${address}`)
  }

  static async mintNFT(data: {
    to: string
    eventName: string
    eventDate: string
    eventType: string
    attendanceCount: number
    rarity: string
  }) {
    return this.post('/api/blockchain/nfts/mint', data)
  }

  static async getNetworkInfo() {
    return this.get('/api/blockchain/network')
  }

  static async getBetsStatus() {
    return this.get('/api/blockchain/bets/status')
  }

  static async getNFTSupply() {
    return this.get('/api/blockchain/nfts/supply')
  }
}