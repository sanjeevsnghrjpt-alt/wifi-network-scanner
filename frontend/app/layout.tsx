import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Blackbox AI - Free AI Coding Assistant & WiFi Scanner',
  description: 'A free, open-source AI coding assistant with multiple models, code execution, and WiFi network scanner',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-dark-bg text-white antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
