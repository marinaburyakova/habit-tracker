'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useUIStore } from '@/stores/ui'
import styles from './Onboarding.module.css'

type Slide = {
  image: string
  title: string
  description: string
}

const SLIDES: Slide[] = [
  {
    image: '/onboarding/1.png',
    title: 'Habits tracker App',
    description: 'Collect points and achievements. Mark the completion of tasks every day.',
  },
  {
    image: '/onboarding/2.png',
    title: 'Build your streak',
    description: 'Every day you complete a habit, your streak grows. Miss a day — start over.',
  },
  {
    image: '/onboarding/3.png',
    title: 'Unlock achievements',
    description: 'Earn points, unlock badges, and watch your progress grow over time.',
  },
]

export default function Onboarding() {
  const [index, setIndex] = useState(0)
  const completeOnboarding = useUIStore((s) => s.completeOnboarding)

  const slide = SLIDES[index]
  const isLast = index === SLIDES.length - 1

  function handleNext() {
    if (isLast) {
      completeOnboarding()
    } else {
      setIndex((i) => i + 1)
    }
  }

  function handleSkip() {
    completeOnboarding()
  }

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.skip}
        onClick={handleSkip}
      >
        Skip
      </button>

      <div className={styles.imageWrap}>
        <div className={styles.glow} aria-hidden />
        <Image
          src={slide.image}
          alt=""
          width={280}
          height={280}
          className={styles.image}
          priority
        />
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>{slide.title}</h1>
        <p className={styles.description}>{slide.description}</p>
      </div>

      <div className={styles.dots} role="tablist" aria-label="Onboarding steps">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Slide ${i + 1}`}
            className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

      <button
        type="button"
        className={styles.button}
        onClick={handleNext}
      >
        {isLast ? "Let's Start!" : 'Next'}
        <span className={styles.buttonArrow} aria-hidden>
          →
        </span>
      </button>
    </div>
  )
}