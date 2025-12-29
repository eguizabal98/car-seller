'use client'

import Link from 'next/link'
import { Car, Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useFeature } from '@/providers/feature-flag-provider'

export function Footer() {
  const footerEnabled = useFeature('footer')
  const buyEnabled = useFeature('buy')
  const sellEnabled = useFeature('sell')
  const financeEnabled = useFeature('finance')
  const aboutEnabled = useFeature('about')

  if (!footerEnabled) return null

  return (
    <footer className="bg-background border-t">
      <div className="container py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-6 w-6" />
              <span className="font-bold text-xl">CarSeller</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Experience the finest second-hand vehicles with our digital showroom experience. Transparency, quality, and trust.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Inventory</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {buyEnabled && (
                <>
                  <li><Link href="/buy" className="hover:text-foreground">Browse All Cars</Link></li>
                  <li><Link href="/buy?type=suv" className="hover:text-foreground">SUVs</Link></li>
                  <li><Link href="/buy?type=sedan" className="hover:text-foreground">Sedans</Link></li>
                  <li><Link href="/buy?type=electric" className="hover:text-foreground">Electric & Hybrid</Link></li>
                </>
              )}
              {sellEnabled && (
                <li><Link href="/sell" className="hover:text-foreground">Sell Your Car</Link></li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {financeEnabled && (
                <li><Link href="/finance" className="hover:text-foreground">Financing</Link></li>
              )}
              <li><Link href="/trade-in" className="hover:text-foreground">Trade-In Valuation</Link></li>
              <li><Link href="/insurance" className="hover:text-foreground">Insurance</Link></li>
              <li><Link href="/service" className="hover:text-foreground">Service & Maintenance</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {aboutEnabled && (
                <li><Link href="/about" className="hover:text-foreground">About Us</Link></li>
              )}
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-foreground">Careers</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground text-center md:text-left">
          <p>© {new Date().getFullYear()} CarSeller. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/sitemap" className="hover:text-foreground">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
