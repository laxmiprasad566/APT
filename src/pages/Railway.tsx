import { APTRailway } from "@/components/APTRailway";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Railway() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-8 px-4">
                <div className="mb-6">
                    <Link to="/">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Explore Indian Railways
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Discover the extensive network of Indian Railways. View routes, check seat availability, and plan your train journeys with AI-powered insights.
                        </p>
                    </div>

                    <APTRailway />
                </div>
            </div>
        </div>
    );
}
