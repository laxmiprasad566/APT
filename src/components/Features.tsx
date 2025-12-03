import { Train, Target, Smartphone, Map } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Train,
    title: "Multi-Modal Planning",
    description: "Seamlessly combines railways, buses, metro, air travel, and water transport",
    accent: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: Target,
    title: "Smart Optimization",
    description: "Advanced algorithms consider cost, time, and comfort based on your preferences",
    accent: "from-secondary/20 to-secondary/5",
    iconColor: "text-secondary",
  },
  {
    icon: Smartphone,
    title: "Occasion-Based Planning",
    description: "Tailored recommendations based on your travel purpose and timing needs",
    accent: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
  },
  {
    icon: Map,
    title: "Complete Coverage",
    description: "From remote villages to mega cities - covering all locations",
    accent: "from-info/20 to-info/5",
    iconColor: "text-info",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          Why Choose APT?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:-translate-y-1 border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6 text-center">
                  <div className={`mx-auto w-14 h-14 rounded-full bg-gradient-to-br ${feature.accent} flex items-center justify-center mb-4`}>
                    <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
