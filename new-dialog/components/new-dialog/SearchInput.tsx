'use client'

import React from 'react'
import { SparkleIcon } from '../icons/CustomIcons'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "What do you want to do with Dovetail? Describe your goal…",
}) => {
  return (
    <div className="flex items-center gap-4 pl-8 pr-4 py-4 border-b border-[rgba(216,216,216,0.6)]">
      <SparkleIcon className="text-[#2563eb] flex-shrink-0" size={24} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-[16px] font-medium leading-6 text-[#0a0a0a] placeholder:text-[#898989] outline-none bg-transparent"
      />
    </div>
  )
}
