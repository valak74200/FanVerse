import { useState, useEffect } from 'react'
import { ethers, BrowserProvider } from 'ethers'
import { ApiService } from '../services/api'

declare global {
  interface Window {
    ethereum?: any
  }
}

export function useBlockchain() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask not detected')
    }

    try {
      // Switch to Chiliz testnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x15b32' }]
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x15b32',
            chainName: 'Chiliz Spicy Testnet',
            nativeCurrency: { name: 'Chiliz', symbol: 'CHZ', decimals: 18 },
            rpcUrls: ['https://spicy-rpc.chiliz.com/'],
            blockExplorerUrls: ['https://testnet.chiliscan.com/']
          }]
        })
      }
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const web3Provider = new BrowserProvider(window.ethereum)
    const web3Signer = await web3Provider.getSigner()

    setProvider(web3Provider)
    setSigner(web3Signer)
    setAccount(accounts[0])
    setConnected(true)

    return { provider: web3Provider, signer: web3Signer, account: accounts[0] }
  }

  const disconnectWallet = () => {
    setProvider(null)
    setSigner(null)
    setAccount(null)
    setConnected(false)
  }

  // Fonctions blockchain intégrées avec l'API
  const placeBet = async (description: string, amount: number) => {
    if (!account) throw new Error('Wallet not connected')
    
    return ApiService.placeBet(description, amount, account)
  }

  const getUserNFTs = async () => {
    if (!account) throw new Error('Wallet not connected')
    
    return ApiService.getUserNFTs(account)
  }

  useEffect(() => {
    // Auto-connect si déjà connecté
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            connectWallet()
          }
        })
    }
  }, [])

  return {
    provider,
    signer,
    account,
    connected,
    connectWallet,
    disconnectWallet,
    placeBet,
    getUserNFTs
  }
}