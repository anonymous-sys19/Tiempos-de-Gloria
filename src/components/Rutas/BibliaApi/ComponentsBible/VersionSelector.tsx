import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BIBLE_VERSIONS } from '@/types/bibleType/bible';

interface VersionSelectorProps {
  selectedVersion: string;
  onVersionChange: (version: string) => void;
}

export function VersionSelector({ selectedVersion, onVersionChange }: VersionSelectorProps) {
  return (
    <Select value={selectedVersion} onValueChange={onVersionChange}>
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder="Seleccionar versión" />
      </SelectTrigger>
      <SelectContent>
        {BIBLE_VERSIONS.map((version) => (
          <SelectItem key={version.version} value={version.version}>
            {version.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}