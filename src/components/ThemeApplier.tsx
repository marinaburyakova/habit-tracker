'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { useUIStore } from '@/stores/ui'

const emptySubscribe = () => () => {}

export default function ThemeApplier() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
  const theme = useUIStore((s) => s.theme)

  // Гидратация стора после монтирования
  useEffect(() => {
    useUIStore.persist.rehydrate()
  }, [])

  // Синхронизация theme → data-theme на <html>
  useEffect(() => {
    if (!mounted) return
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme, mounted])

  return null
}