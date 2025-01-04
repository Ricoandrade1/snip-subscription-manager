import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";

const motivationalQuotes = [
  "Sua determinação define seu destino.",
  "Transforme seus sonhos em realidade.",
  "Seja a melhor versão de si mesmo.",
  "O sucesso é construído diariamente.",
  "Acredite em seu potencial infinito.",
  "Sua jornada, suas conquistas.",
  "Persistência é o caminho do êxito.",
  "Foco, força e determinação.",
  "Supere seus limites.",
  "Hoje é dia de vitória.",
  "Cada passo é uma conquista.",
  "Seu potencial não tem limites.",
  "A excelência é um hábito diário.",
  "Inspire-se, supere-se, conquiste.",
  "Sua força vem de dentro.",
];

const storyBackgrounds = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
  },
];

export default function Story() {
  const [selectedBanner, setSelectedBanner] = useState<number | null>(null);
  const [quote, setQuote] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Get today's date as a seed
    const today = new Date();
    const seed = today.getFullYear() * 10000 + 
                (today.getMonth() + 1) * 100 + 
                today.getDate();
    
    // Use the seed to get a consistent quote for the day
    const index = seed % motivationalQuotes.length;
    setQuote(motivationalQuotes[index]);
  }, []);

  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>Stories</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="story" className="w-full">
            <TabsList>
              <TabsTrigger value="story">Story do Dia</TabsTrigger>
              <TabsTrigger value="selected">Banner Selecionado</TabsTrigger>
            </TabsList>
            
            <TabsContent value="story" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Black background story */}
                <div className="relative w-full aspect-[9/16] bg-black rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <p className="text-white text-center font-montserrat text-2xl font-bold leading-relaxed">
                      {quote}
                    </p>
                  </div>
                </div>

                {/* Image background stories */}
                {storyBackgrounds.map((bg) => (
                  <div key={bg.id} className="relative w-full aspect-[9/16] rounded-lg overflow-hidden">
                    <img 
                      src={bg.imageUrl} 
                      alt="Story background" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-8">
                      <p className="text-white text-center font-montserrat text-2xl font-bold leading-relaxed">
                        {quote}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <Button 
                  className="bg-barber-gold hover:bg-barber-gold/90 text-black"
                  onClick={() => {
                    toast({
                      title: "Story copiado!",
                      description: "O story foi copiado para sua área de transferência.",
                    });
                  }}
                >
                  Copiar Story
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="selected" className="mt-4">
              {selectedBanner ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Banner Selecionado</h3>
                  <img
                    src={storyBackgrounds.find(b => b.id === selectedBanner)?.imageUrl}
                    alt={`Banner ${selectedBanner}`}
                    className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                  />
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum banner selecionado
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}