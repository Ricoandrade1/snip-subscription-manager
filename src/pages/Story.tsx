import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Story() {
  return (
    <div className="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>Stories</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Story content will be displayed here</p>
        </CardContent>
      </Card>
    </div>
  );
}