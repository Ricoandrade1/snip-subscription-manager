import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Feed() {
  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Feed content will be displayed here</p>
        </CardContent>
      </Card>
    </div>
  );
}