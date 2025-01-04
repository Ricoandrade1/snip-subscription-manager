import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

// Simulated banner data - replace these URLs with your actual Canva exported images
const banners = [
  {
    id: 1,
    title: "Banner 1",
    imageUrl: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Banner 2",
    imageUrl: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Banner 3",
    imageUrl: "/placeholder.svg",
  },
];

export default function Story() {
  const [selectedBanner, setSelectedBanner] = useState<number | null>(null);
  const { toast } = useToast();

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
          <Tabs defaultValue="available" className="w-full">
            <TabsList>
              <TabsTrigger value="available">Banners Disponíveis</TabsTrigger>
              <TabsTrigger value="selected">Banner Selecionado</TabsTrigger>
            </TabsList>
            
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