import type { Metadata } from 'next'
import { Jost } from 'next/font/google'
import './globals.css'
import ThemeApplier from '@/components/ThemeApplier'

const jost = Jost({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-jost',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'A minimal habit tracker with streaks and achievements',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jost.variable} suppressHydrationWarning>
      <head>
        {/* Anti-FOUC: ставим тему до первого рендера */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var raw = localStorage.getItem('habit-tracker:ui')
                var theme = 'light'
                if (raw) {
                  var parsed = JSON.parse(raw)
                  if (parsed.state && parsed.state.theme) {
                    theme = parsed.state.theme
                  }
                }
                document.documentElement.setAttribute('data-theme', theme)
              } catch (e) {
                document.documentElement.setAttribute('data-theme', 'light')
              }
            `,
          }}
        />
      </head>
      <body>
        <ThemeApplier />
        {children}
      </body>
    </html>
  )
}