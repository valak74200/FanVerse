import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num)
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`
}

export function formatCurrency(amount: number, currency = "CHZ"): string {
  return `${amount.toLocaleString('en-US')} ${currency}`
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}