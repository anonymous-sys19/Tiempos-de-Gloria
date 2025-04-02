import { useState } from "react";
import { Header } from "./Header";
import { SearchBar } from "./SearchBar";
import { SermonList } from "./SermonList";
import { SermonOutline } from "./SermonOutline";
import { LoadingSpinner } from "./Loading";
import { ErrorDisplay } from "./ErrorDisplay";
import { useSermones } from "@/data/hooks/use-sermones";
import { Layout } from "@/components/Loyout/Loyout";
export default function SermonesBiblicos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSermon, setSelectedSermon] = useState<string | null>(null);
  const { sermones, loading, error } = useSermones();

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  const filteredSermons = sermones.filter((sermon) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      sermon.tema.toLowerCase().includes(searchLower) ||
      sermon.pasaje.toLowerCase().includes(searchLower) ||
      sermon.hashtags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  const currentSermon =
    sermones.find((s) => s.id === selectedSermon) || sermones[0];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto p-6">
          <Header />
          <SearchBar value={searchTerm} onChange={setSearchTerm} />

          {loading ? (
            <LoadingSpinner />
          ) : (
            <SermonList
              sermones={filteredSermons}
              onViewOutline={setSelectedSermon}
            />
          )}

          {currentSermon && (
            <SermonOutline
              sermon={currentSermon}
              isOpen={selectedSermon !== null}
              onOpenChange={(open) => !open && setSelectedSermon(null)}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
