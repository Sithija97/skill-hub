import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/shared/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SITE_CONFIG } from '@/config/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: 'SkillHub',
  description: 'GitHub for skills — create, version, and share AI skills',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" className="h-full" suppressHydrationWarning>
        <body className="min-h-full flex flex-col" suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
