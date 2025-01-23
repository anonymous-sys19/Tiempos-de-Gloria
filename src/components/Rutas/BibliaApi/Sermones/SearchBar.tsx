import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative mb-8">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder="Buscar sermones por tema, pasaje o etiqueta..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-12 h-12 text-lg bg-white border-2 border-blue-100 rounded-xl focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300"
      />
    </div>
  );
}