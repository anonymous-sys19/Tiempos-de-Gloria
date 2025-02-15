import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';

interface Props {
  placeholder: string;
  onSearch: (value: string) => void;
  onChange?: (value: string) => void;
  className?: string;
}

export function SearchInput({ placeholder, onSearch, onChange, className = '' }: Props) {
  const [value, setValue] = useState('');

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  }, [onChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 pl-10 rounded-lg border border-gray-200 
                 bg-white/50 backdrop-blur-sm
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 placeholder-gray-400 transition-all duration-200"
      />
      <Search 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        size={18} 
      />
    </form>
  );
}