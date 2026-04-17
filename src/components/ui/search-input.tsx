/**
 * search-input.tsx
 * Reusable search/filter text input with clear button.
 * One concern: controlled text input with optional icon and clear affordance.
 */

'use client';

import { useRef } from 'react';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Auto-focus on mount */
  autoFocus?: boolean;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  className = '',
  autoFocus = false,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Search icon */}
      <svg
        className="absolute left-2.5 w-3.5 h-3.5 text-slate-500 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.75 6.75a7.5 7.5 0 0 0 10.9 10.9z"
        />
      </svg>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="
          w-full pl-8 pr-7 py-1.5 rounded-md
          bg-slate-800 border border-slate-700
          text-xs text-slate-200 placeholder-slate-500
          focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/40
          transition-colors
        "
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
          className="absolute right-2 text-slate-500 hover:text-slate-300 transition-colors leading-none"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
