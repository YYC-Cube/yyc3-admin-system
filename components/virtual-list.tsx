'use client'

import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import styles from './virtual-list.module.css'

interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  overscan?: number
}

// 虚拟滚动列表组件 - 优化长列表性能
export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const itemsContainerRef = useRef<HTMLDivElement>(null)

  const totalHeight = items.length * itemHeight
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = items.slice(startIndex, endIndex + 1)
  const offsetY = startIndex * itemHeight

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.height = `${containerHeight}px`
    }
  }, [containerHeight])

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.height = `${totalHeight}px`
    }
  }, [totalHeight])

  useEffect(() => {
    if (itemsContainerRef.current) {
      itemsContainerRef.current.style.setProperty('--offset-y', `${offsetY}px`)
      itemsContainerRef.current.style.setProperty('--item-height', `${itemHeight}px`)
    }
  }, [offsetY, itemHeight])

  return (
    <div ref={containerRef} onScroll={handleScroll} className={styles.container}>
      <div ref={wrapperRef} className={styles.wrapper}>
        <div ref={itemsContainerRef} className={styles.itemsContainer}>
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} className={styles.itemWrapper}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
