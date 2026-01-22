// lib/utils.ts
import { Prisma } from '@prisma/client'

// Format date to readable string (e.g. "2025-12-15T10:30:00Z" -> "Dec 15, 2025")
export function formatDate(dateString: string | null): string {
  if (!dateString) return 'TBA'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-SG', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  } catch {
    return 'TBA'
  }
}

// Format time from ISO date string (e.g. "2025-12-15T19:30:00Z" -> "7:30 PM")
export function formatTime(dateString: string | null): string {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-SG', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    })
  } catch {
    return ''
  }
}

// Sanitize HTML description to prevent XSS
export function sanitizeHTML(html: string | null): string {
  if (!html) return ''
  let sanitized = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/javascript:/gi, '')
  return sanitized
}

// Check if image URL is valid
export function isValidImageUrl(url: string | null): boolean {
  if (!url) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Generate OneMap embed URL
export function generateOneMapUrl(lat: number, lng: number): string {
  return `https://www.onemap.sg/main/v2/?lat=${lat}&lng=${lng}&zoom=17`
}

// Generate Google Maps embed URL
export function generateGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}&output=embed`
}

// Format price with Prisma Decimal handling
export function formatPrice(
  price: Prisma.Decimal | null, 
  currency: string | null, 
  isFree: boolean
): string {
  if (isFree) return 'FREE'
  if (price) {
    const priceStr = price.toString()
    return `${currency || 'SGD'} ${priceStr}`
  }
  return 'Price TBA'
}
