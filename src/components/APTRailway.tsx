import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap } from "lucide-react";
import { APP_SHORT_NAME } from "@/constants/branding";

export const APTRailway = () => {
  return (
    <section id="about" className="py-16 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="max-w-5xl mx-auto">
        <Card className="border-2 border-primary/20 shadow-[var(--shadow-glow)] animate-scale-in">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="default" className="text-sm px-3 py-1">
                Premium Feature
              </Badge>
            </div>
            <CardTitle className="text-3xl md:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {APP_SHORT_NAME} Rail Intelligence Suite
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our advanced railway optimization algorithm outperforms existing platforms by 
              generating confirmed and cost-effective ticket combinations when direct tickets are unavailable.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3 p-4 bg-card rounded-lg border border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2 text-foreground">
                      Type-1 Availability Engine
                    </h4>
                    <p className="text-muted-foreground">
                      Extended boarding and destination stations for optimal routes with 
                      guaranteed seat availability
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-4 bg-card rounded-lg border border-secondary/20">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Zap className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2 text-foreground">
                      Premium Tatkal Support
                    </h4>
                    <p className="text-muted-foreground">
                      Strategic booking assistance for competitive tatkal tickets with 
                      real-time availability tracking
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
