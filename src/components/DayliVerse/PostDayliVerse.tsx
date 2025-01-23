/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, MessageCircle, Share2, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from '@/supabaseClient';
import { useAuth } from '@/hooks/userAuth';
import dayjs from 'dayjs';


type Contributor = {
  id: number;
  nameUser?: string;
  updated_at?: string;
  created_at?: string;
  avatarUrl?: string;
  description?: string;
  pasaje?: string | undefined;
  referencia?: string;
};

const BlogPage: React.FC = () => {


  const [verse, setVerse] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();

  const scriptLoadedRef = useRef(false);
  const dataSavedRef = useRef(false);
  
  useEffect(() => {
    if (!scriptLoadedRef.current) {
      // Create invisible elements for the script to populate
      const wrapper = document.createElement('div');
      wrapper.id = 'dailyVersesWrapper';
      wrapper.style.display = 'none';
      wrapper.innerHTML = '<p class="dailyVerses"></p><a></a>';
      document.body.appendChild(wrapper);
      
      const script = document.createElement('script');
      script.src = 'https://dailyverses.net/get/verse.js?language=nvi';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        const verseElement = document.querySelector('#dailyVersesWrapper .dailyVerses');
        const referenceElement = document.querySelector('#dailyVersesWrapper a');

        if (verseElement && referenceElement) {
          const verseText = verseElement.textContent?.trim() || '';
          const referenceText = referenceElement.textContent?.trim() || '';
          
          setVerse(verseText);
          setReference(referenceText);
          scriptLoadedRef.current = true;
          
          // Remove the wrapper after getting the verse
          document.body.removeChild(wrapper);
        }
      };

      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const saveVerseToSupabase = async () => {
      if (verse && reference && !dataSavedRef.current) {
        try {
          // Check if the verse already exists
          const { data: existingData, error: existingError } = await supabase
          .from('posts_biblia')
          .select('id, pasaje, referencia')
          .eq('pasaje', verse)
          .eq('referencia', reference);
          
          if (existingError) {
            throw existingError;
          }

          if (existingData && existingData.length > 0) {
            // Verse already exists, remove duplicates if any
            if (existingData.length > 1) {
              const [...remove] = existingData;
              const removeIds = remove.map(item => item.id);
              
              const { error: deleteError } = await supabase
              .from('posts_biblia')
              .delete()
              .in('id', removeIds);
              
              if (deleteError) {
                throw deleteError;
              }
            }
            console.log("Verse already exists, duplicates removed if any");
          } else {
            // Verse doesn't exist, insert it
            const { data, error } = await supabase
            .from('posts_biblia')
            .insert({
              pasaje: verse,
              referencia: reference,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();
            
            if (error) {
              throw error;
            }
            
            console.log("Verse saved successfully:", data);
          }
          
          dataSavedRef.current = true;
          await fetchContributors(); // Refresh the contributors list
        } catch (error) {
          console.error("Error in Supabase operation:", error);
        }
      }
    };
    
    saveVerseToSupabase();
  }, [verse, reference]);
  
  const fetchContributors = async () => {
    try {
      setIsLoading(true);
      console.log('Intentando obtener datos de Supabase...');

      const { data, error } = await supabase
      .from('posts_biblia')
      .select('*', { count: 'exact' }) // Usar 'exact' para obtener el número de filas
      .not('pasaje', 'is', null)  // Verifica que reference no sea nulo
      .not('referencia', 'is', null)  // Verifica que reference no sea nulo
      .order('created_at', { ascending: false })
      
      console.log('Respuesta completa:', { data, error });
      
      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setContributors(data);
        console.log('Estados actualizados con éxito');
      } else {
        console.log('No se encontraron datos');
        setError('No se encontraron datos en la base de datos');
      }
    } catch (error: any) {
      console.error('Error detallado:', error);
      setError(error.message || 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {

    fetchContributors();
  }, []);
  
  const formatExplanation = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('T:')) {
        return (
          <h1 key={index} className="text-2xl font-bold mb-4 text-gray-900">
            {line.substring(2).trim()}
          </h1>
        );
      } else if (line.startsWith('S:')) {
        return (
          <h2 key={index} className="text-xl font-semibold mb-3 mt-4 text-gray-800">
            {line.substring(2).trim()}
          </h2>
        );
      } else if (line.startsWith('P:')) {
        return (
          <p key={index} className="text-gray-600 mb-3 leading-relaxed">
            {line.substring(2).trim()}
          </p>
        );
      }
      return null;
    });
  };
  if (isLoading) {
    return (<p>Cargando...</p>)
  };
  if (error) {
    return null
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {contributors.map((item) => (
        <ContributorCard key={item.id} item={item} user={user} formatExplanation={formatExplanation} />
      ))}
    </div>
  );
}

function ContributorCard({ item, user, formatExplanation }: { item: Contributor; user: any; formatExplanation: (text: string) => React.ReactNode }) {
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [isContributing, setIsContributing] = useState(false);
  const [contributedText, setContributedText] = useState('');
  
  const handleContribute = () => {
    setIsContributing(true);
  };
  
  const handleSubmitContribution = async () => {
    if (contributedText.trim() && item.id) {
      const { error } = await supabase
      .from('idectableimages')
      .update({
        user_id: user?.id,
        email: user?.user_metadata.email,
        nameUser: user?.user_metadata.name,
        avatarUrl: user?.user_metadata.avatar_url,
        description: contributedText,
        updated_at: new Date(),
      })
        .eq('id', item.id);

      if (error) {
        console.error('Error al subir la contribución:', error);
        return;
      }
      
      
      // Update the local state
      item.description = contributedText;
      item.nameUser = user?.user_metadata.name;
      item.avatarUrl = user?.user_metadata.avatar_url;
      item.updated_at = new Date().toISOString();
      
      setIsContributing(false);
      setContributedText('');
      
      
      if (error) {
        console.error("Error:", error);
        return <p>Hubo un error al cargar los datos.</p>;
      }
      
    }
  };
  
  
  
  
  return (
    
    <>

      

      <Card className="overflow-hidden mb-4 dark:bg-slate-900 ">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarImage src="/public/logo-idec.png" alt="Bible" />
            <AvatarFallback>VD</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">IDEC Tiempos de gloria</h2>
            <p className="text-sm text-gray-500">{dayjs(item.updated_at).format('MMM D, YYYY')}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <blockquote className="border-l-4 border-indigo-500 pl-4 italic">
            <p className="mb-2 text-lg">{item.pasaje}</p>
            <footer className="text-sm text-gray-600">{item.referencia}</footer>
          </blockquote>

          <div className="space-y-4">
            {item.description && (
              <div className="flex items-center gap-3 p-3 rounded-lg dark:bg-slate-800 border">
                {item.avatarUrl && (
                  <Avatar>
                    <AvatarImage src={item.avatarUrl} alt={item.nameUser} />
                    <AvatarFallback>{item.nameUser?.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <h4 className="text-sm font-medium">{item.nameUser}</h4>
                  <p className="text-xs text-gray-500">
                    Contributed on {dayjs(item.updated_at).format('MMM D, YYYY')}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Explicacion: {item.referencia}</h3>
              {!isContributing && !item.description && (
                <Button onClick={handleContribute} variant="outline" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Contribute Explanation
                </Button>
              )}
            </div>

            <ScrollArea className="max-h-[400px] overflow-auto">
              {isContributing ? (
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-3 mb-2 text-sm text-muted-foreground">
                    <p className="font-medium mb-1">Formatting Guide:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Use T: for Title</li>
                      <li>Use S: for Subtitle</li>
                      <li>Use P: for Paragraph</li>
                    </ul>
                  </div>
                  <Textarea
                    placeholder="
                  Example:
                  T: Main Title
                  S: First Subtitle
                  P: Your paragraph text here..."
                    className="min-h-[200px] font-mono"
                    value={contributedText}
                    onChange={(e) => setContributedText(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsContributing(false);
                        setContributedText('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitContribution}
                      disabled={!contributedText.trim()}
                    >
                      Submit Explanation
                    </Button>
                  </div>
                </div>
              ) : item.description ? (
                <Collapsible open={isExplanationOpen} onOpenChange={setIsExplanationOpen}>
                  <div className="space-y-2">
                    <div className={isExplanationOpen ? 'hidden' : 'line-clamp-3'}>
                      {formatExplanation(item.description)}
                    </div>
                    <CollapsibleContent className="space-y-2">
                      {formatExplanation(item.description)}
                    </CollapsibleContent>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-indigo-600"
                      >
                        {isExplanationOpen ? (
                          <>Show Less <ChevronUp className="h-4 w-4" /></>
                        ) : (
                          <>Read More <ChevronDown className="h-4 w-4" /></>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </Collapsible>
              ) : (
                <p className="text-gray-500 italic">No explanation available yet. Be the first to contribute!</p>
              )}
            </ScrollArea>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between ">
          <Button variant="outline" size="sm" className="text-gray-600">
            <Heart className="mr-2 h-4 w-4" /> Like
          </Button>
          <Button variant="outline" size="sm" className="text-gray-600">
            <MessageCircle className="mr-2 h-4 w-4" /> Comment
          </Button>
          <Button variant="outline" size="sm" className="text-gray-600">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default BlogPage;