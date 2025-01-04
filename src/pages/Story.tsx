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
];

const banners = [
  {
    id: 1,
    title: "Banner 1",
    imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  },
  {
    id: 2,
    title: "Banner 2",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  },
  {
    id: 3,
    title: "Banner 3",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
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

  const handleBannerSelect = (bannerId: number) => {
    setSelectedBanner(bannerId);
    toast({
      title: "Banner selecionado",
      description: `Banner ${bannerId} foi selecionado com sucesso.`,
    });
  };

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
              <TabsTrigger value="available">Banners Disponíveis</TabsTrigger>
              <TabsTrigger value="selected">Banner Selecionado</TabsTrigger>
            </TabsList>
            
            <TabsContent value="story" className="mt-4">
              <div className="relative w-full max-w-[400px] mx-auto aspect-[9/16] bg-black rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <p className="text-white text-center font-montserrat text-2xl font-bold leading-relaxed">
                    {quote}
                  </p>
                </div>
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
            
            <TabsContent value="available" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {banners.map((banner) => (
                  <div 
                    key={banner.id} 
                    className="relative group cursor-pointer border rounded-lg overflow-hidden"
                  >
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button 
                        onClick={() => handleBannerSelect(banner.id)}
                        variant="secondary"
                      >
                        Selecionar Banner
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="selected" className="mt-4">
              {selectedBanner ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Banner Selecionado</h3>
                  <img
                    src={banners.find(b => b.id === selectedBanner)?.imageUrl}
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
