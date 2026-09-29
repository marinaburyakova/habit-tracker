// src/test/setup.ts
import '@testing-library/jest-dom/vitest'
import { beforeAll } from 'vitest'

// Мок localStorage для Zustand persist
if (typeof globalThis.localStorage === 'undefined') {
  const store: Record<string, string> = {}
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value
      },
      removeItem: (key: string) => {
        delete store[key]
      },
      clear: () => {
        for (const k in store) delete store[k]
      },
      key: (i: number) => Object.keys(store)[i] ?? null,
      get length() {
        return Object.keys(store).length
      },
    },
    writable: true,
    configurable: true,
  })
}

// jsdom не поддерживает showModal — мокаем
beforeAll(() => {
  if (typeof HTMLDialogElement !== 'undefined') {
    HTMLDialogElement.prototype.showModal = function (
      this: HTMLDialogElement
    ) {
      this.open = true
    }
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
      this.open = false
    }
  }
})