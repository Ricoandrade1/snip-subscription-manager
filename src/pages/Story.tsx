import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Share2 } from "lucide-react";
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
  const [quote, setQuote] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + 
                (today.getMonth() + 1) * 100 + 
                today.getDate();
    
    const index = seed % motivationalQuotes.length;
    setQuote(motivationalQuotes[index]);
  }, []);

  const handleShare = async (imageUrl?: string) => {
    try {
      // Create a canvas to combine the background and text
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size to match Instagram story dimensions (9:16)
      canvas.width = 1080;
      canvas.height = 1920;

      if (ctx) {
        if (imageUrl) {
          // For image backgrounds
          const img = new Image();
          img.crossOrigin = "anonymous";
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = imageUrl;
          });
          
          // Draw image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // Add semi-transparent overlay
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          // For black background
          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Add text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 60px Montserrat';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Word wrap the text
        const words = quote.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const width = ctx.measureText(currentLine + " " + word).width;
          if (width < canvas.width - 100) {
            currentLine += " " + word;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        lines.push(currentLine);

        // Draw the wrapped text
        const lineHeight = 80;
        const totalHeight = lines.length * lineHeight;
        const startY = (canvas.height - totalHeight) / 2;

        lines.forEach((line, i) => {
          ctx.fillText(line, canvas.width / 2, startY + (i * lineHeight));
        });

        // Convert canvas to blob
        const blob = await new Promise<Blob>((resolve) => 
          canvas.toBlob((blob) => resolve(blob!), 'image/png')
        );

        // Share the image
        if (navigator.share) {
          await navigator.share({
            files: [new File([blob], 'story.png', { type: 'image/png' })],
            title: 'Compartilhar Story',
            text: quote
          });
          
          toast({
            title: "Story compartilhado!",
            description: "O story foi compartilhado com sucesso.",
          });
        } else {
          // Fallback for browsers that don't support native sharing
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'story.png';
          a.click();
          URL.revokeObjectURL(url);
          
          toast({
            title: "Story baixado!",
            description: "O story foi baixado para seu dispositivo.",
          });
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Erro ao compartilhar",
        description: "Não foi possível compartilhar o story.",
        variant: "destructive",
      });
    }
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
            </TabsList>
            
            <TabsContent value="story" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Black background story */}
                <div className="relative w-full aspect-[9/16] bg-black rounded-lg overflow-hidden group">
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <p className="text-white text-center font-montserrat text-2xl font-bold leading-relaxed">
                      {quote}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleShare()}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Image background stories */}
                {storyBackgrounds.map((bg) => (
                  <div key={bg.id} className="relative w-full aspect-[9/16] rounded-lg overflow-hidden group">
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
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleShare(bg.imageUrl)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}