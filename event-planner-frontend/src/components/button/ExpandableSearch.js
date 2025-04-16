'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export default function ExpandableSearch({ onSearch }) {
  const [isHovering, setIsHovering] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const shouldExpand = isHovering || isOpen

  return (
    <div
      className={cn(
        'relative flex items-center transition-all duration-500',
        shouldExpand ? 'gap-2' : 'gap-0'
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        if (!isOpen) setIsHovering(false)
      }}
    >
      {/* Search icon */}
      <div
        className={cn(
          'transition-all duration-500 ease-in-out overflow-hidden',
          shouldExpand ? 'max-w-0 opacity-0 scale-95' : 'max-w-[40px] opacity-100 scale-100'
        )}
      >
        <Button
          size="icon"
          variant="outline"
          onClick={() => setIsHovering(true)}
          className="transition-none"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div
        className={cn(
          'transition-all duration-500 ease-in-out',
          shouldExpand ? 'max-w-[220px] opacity-100 scale-100' : 'max-w-0 opacity-0 scale-95'
        )}
      >
        <Input
          type="text"
          value={searchValue}
          placeholder="Search..."
          className="h-9 w-[200px]"
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            setIsOpen(false)
            setIsHovering(false)
          }}
          onChange={(e) => {
            setSearchValue(e.target.value)
            onSearch?.(e.target.value)
          }}
        />
      </div>
    </div>
  )
}
