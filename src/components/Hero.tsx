import { useState } from "react";
import type { OccasionType } from "@/types/index";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar, Tag } from "lucide-react";
import { LocationSelect } from "./LocationSelect";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION } from "@/constants/branding";



interface HeroProps {
  onSearch: (params: {
    origin: string;
    destination: string;
    date: string;
    occasion?: OccasionType;
  }) => void;
}

export const Hero = ({ onSearch }: HeroProps) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [occasion, setOccasion] = useState<OccasionType | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin && destination && date) {
      onSearch({ origin, destination, date, occasion: occasion || undefined });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[70vh] flex items-center justify-center px-4 py-16 overflow-hidden"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--hero-gradient-start))] via-primary to-[hsl(var(--hero-gradient-end))] opacity-95" />

      {/* Animated Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] animate-[slide_20s_linear_infinite]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {APP_NAME}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-2 drop-shadow">
            {APP_TAGLINE}
          </p>
          <p className="text-lg text-white/80 drop-shadow">
            {APP_DESCRIPTION}
          </p>
        </div>

        <Card className="shadow-[var(--shadow-elegant)] backdrop-blur-sm bg-card/95 border-0 animate-scale-in">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin" className="flex items-center gap-2 text-base">
                    <MapPin className="w-4 h-4 text-primary" />
                    From
                  </Label>
                  <LocationSelect
                    value={origin}
                    onChange={setOrigin}
                    placeholder="Select origin"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination" className="flex items-center gap-2 text-base">
                    <MapPin className="w-4 h-4 text-secondary" />
                    To
                  </Label>
                  <LocationSelect
                    value={destination}
                    onChange={setDestination}
                    placeholder="Select destination"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2 text-base">
                    <Calendar className="w-4 h-4 text-accent" />
                    Travel Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="h-11"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occasion" className="flex items-center gap-2 text-base">
                    <Tag className="w-4 h-4 text-info" />
                    Occasion (Optional)
                  </Label>
                  <Select value={occasion} onValueChange={(value) => setOccasion(value as OccasionType)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select occasion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="leisure">Leisure</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full text-lg h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg"
              >
                Launch AI Route Plan
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
