<<<<<<< HEAD
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
=======
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Habit Tracker — Marina Dev',
  description: 'Personal habit tracker with streaks and analytics.',
  icons: {
    icon: "/favicon.svg",
  },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

>>>>>>> bd87b9c1badc72757f5b2135981fde4c88ba3a43
