"use client";
import { useState } from "react";
import { extractConflictPoints } from "@/ai/flows/extract-conflict-points";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";

export default function Home() {
  const [ideasA, setIdeasA] = useState([""]); // Initialize as array with one empty string
  const [ideasB, setIdeasB] = useState([""]); // Initialize as array with one empty string
  const [conflictPoints, setConflictPoints] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<Record<string, string>>({});

  const handleExtractConflicts = async () => {
    setLoading(true);
    try {
      const result = await extractConflictPoints({ ideasA, ideasB });
      setConflictPoints(result.conflictPoints);
      setContext({}); // Clear previous context
    } catch (error) {
      console.error("Error extracting conflict points:", error);
      // Handle error appropriately (e.g., display an error message)
    } finally {
      setLoading(false);
    }
  };

  const handleContextChange = (point: string, newContext: string) => {
    setContext(prevContext => ({ ...prevContext, [point]: newContext }));
  };

  const addIdeasAInput = () => {
    setIdeasA([...ideasA, ""]);
  };

  const addIdeasBInput = () => {
    setIdeasB([...ideasB, ""]);
  };

  const updateIdeasA = (index: number, value: string) => {
    const newIdeasA = [...ideasA];
    newIdeasA[index] = value;
    setIdeasA(newIdeasA);
  };

    const updateIdeasB = (index: number, value: string) => {
    const newIdeasB = [...ideasB];
    newIdeasB[index] = value;
    setIdeasB(newIdeasB);
  };

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Dialectic Duel</CardTitle>
          <CardDescription>
            Enter two sets of ideas to identify conflict points.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label>Ideas A</Label>
            {ideasA.map((idea, index) => (
              <div key={index} className="grid gap-2 mb-2">
                <Textarea
                  placeholder={`Enter idea A ${index + 1}`}
                  value={idea}
                  onChange={(e) => updateIdeasA(index, e.target.value)}
                />
              </div>
            ))}
            <Button type="button" variant="secondary" size="sm" onClick={addIdeasAInput}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Idea A
            </Button>
          </div>

          <div>
            <Label>Ideas B</Label>
            {ideasB.map((idea, index) => (
              <div key={index} className="grid gap-2 mb-2">
                <Textarea
                  placeholder={`Enter idea B ${index + 1}`}
                  value={idea}
                  onChange={(e) => updateIdeasB(index, e.target.value)}
                />
              </div>
            ))}
            <Button type="button" variant="secondary" size="sm" onClick={addIdeasBInput}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Idea B
            </Button>
          </div>

          <Button onClick={handleExtractConflicts} disabled={loading}>
            {loading ? "Extracting..." : "Extract Conflict Points"}
          </Button>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardHeader>
            <CardTitle>Extracting Conflict Points</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-3/4 h-4" />
            <Skeleton className="w-1/2 h-4" />
          </CardContent>
        </Card>
      )}

      {conflictPoints.length > 0 && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>Identified Conflict Points</CardTitle>
            <CardDescription>Add context to each point for better analysis.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {conflictPoints.map((point, index) => (
              <div key={index} className="grid gap-2">
                <Label htmlFor={`context-${index}`}>{`Conflict Point ${index + 1}`}</Label>
                <p>{point}</p>
                <Label htmlFor={`context-${index}`}>Context</Label>
                <Input
                  type="text"
                  id={`context-${index}`}
                  placeholder="Add contextual information"
                  value={context[point] || ""}
                  onChange={(e) => handleContextChange(point, e.target.value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
