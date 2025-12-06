import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Visa Congratulations Generator',
  description: 'Created by Rabin Chhatkuli',
  generator: 'Rabin Chhatkuli',
  icons: {
    icon: [
      {
        url: '/ICOON.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/ICOON.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/ICOON.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/ICOON.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
