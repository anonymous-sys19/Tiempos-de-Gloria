import type { BibleVersion } from '../types';

interface Props {
  version: BibleVersion;
  onVersionChange: (version: BibleVersion) => void;
}

const versions: { value: BibleVersion; label: string }[] = [
  { value: 'rvr1960', label: 'Reina Valera 1960 (RVR-1960)' },
  { value: 'ntv', label: 'Nueva Traducción Viviente (NTV)' },
  // { value: 'nvi', label: 'Nueva Versión Internacional (NVI)' },
];

export function VersionSelector({ version, onVersionChange }: Props) {
  return (
    <select
      value={version}
      onChange={(e) => onVersionChange(e.target.value as BibleVersion)}
      className="bg-transparent text-slate-900 w-auto p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      {versions.map((v) => (
        <option key={v.value} value={v.value}>
          {v.label}
        </option>
      ))}
    </select>
  );
}