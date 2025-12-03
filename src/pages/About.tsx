import { Header } from "@/components/Header";
import { Info, Zap, Globe, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        About APT Planner
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Intelligent multi-modal trip planning for India's vast transportation network
                    </p>
                </div>

                {/* Mission Section */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-primary" />
                            Our Mission
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>
                            APT (AI Planned Trips) Planner is designed to make travel across India easier,
                            more sustainable, and more accessible. We help travelers find the best routes across
                            multiple modes of transportation including trains, buses, flights, and shared taxis.
                        </p>
                        <p>
                            Our platform optimizes for cost, time, and environmental impact, helping you make
                            informed decisions about your journey while reducing your carbon footprint.
                        </p>
                    </CardContent>
                </Card>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-accent" />
                                Smart Route Planning
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Our intelligent algorithm analyzes thousands of route combinations to find
                                the optimal path between any two locations in India, considering multiple
                                transport modes.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5 text-secondary" />
                                Multi-Modal Integration
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Seamlessly combines trains, buses, flights, and shared transportation to
                                create comprehensive journey plans that save time and money.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="w-5 h-5 text-info" />
                                Secure Booking & Rewards
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Book your entire journey in one go with our secure payment gateway.
                                Earn points on every trip and redeem them for exclusive coupons and discounts.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Heart className="w-5 h-5 text-destructive" />
                                Eco-Friendly Travel
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Make environmentally conscious choices with carbon footprint estimates
                                for each route, promoting sustainable travel across India.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Technology Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Technology Stack</CardTitle>
                        <CardDescription>
                            Built with modern web technologies for performance and reliability
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>• <strong>Frontend:</strong> React, TypeScript, TailwindCSS, Shadcn UI</li>
                            <li>• <strong>Backend:</strong> Node.js, Express, SQLite</li>
                            <li>• <strong>Authentication:</strong> Passport.js with Google OAuth</li>
                            <li>• <strong>State Management:</strong> React Query, Context API</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Footer Note */}
                <div className="text-center mt-12 text-muted-foreground">
                    <p className="text-sm">
                        APT Planner is committed to making public transportation more accessible and
                        sustainable for everyone in India.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
