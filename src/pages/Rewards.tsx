import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, Award, History, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function Rewards() {
    const { toast } = useToast();
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    // Mock data - in a real app, this would come from the backend
    const userPoints = 1250;
    const coupons = [
        { code: "APTFIRST", value: 500, desc: "Flat ₹500 off on your first trip", minSpend: 2000, expiry: "2025-12-31" },
        { code: "APTSAVE200", value: 200, desc: "Save ₹200 on Standard routes", minSpend: 1000, expiry: "2025-06-30" },
        { code: "APTLUX500", value: 500, desc: "Get ₹500 off on Luxury travel", minSpend: 3000, expiry: "2025-08-15" },
        { code: "APTFAST300", value: 300, desc: "Speed up your savings! ₹300 off", minSpend: 1500, expiry: "2025-07-20" },
    ];

    const history = [
        { id: 1, action: "Trip Completed (Bagya Nagar -> Sriharipuram)", points: "+150", date: "2024-11-20" },
        { id: 2, action: "Referral Bonus", points: "+500", date: "2024-11-15" },
        { id: 3, action: "Coupon Redeemed (APTFIRST)", points: "-0", date: "2024-11-10" },
        { id: 4, action: "Trip Completed (New Delhi -> Mumbai)", points: "+600", date: "2024-10-05" },
    ];

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        toast({
            title: "Coupon Copied!",
            description: `${code} has been copied to your clipboard.`,
        });
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Gift className="w-8 h-8 text-primary" />
                        Rewards & Coupons
                    </h1>
                    <p className="text-muted-foreground mt-1">Earn points on every trip and redeem exclusive coupons.</p>
                </div>
                <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-background p-3 rounded-full shadow-sm">
                            <Award className="w-8 h-8 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Your Balance</p>
                            <p className="text-2xl font-bold text-primary">{userPoints} Points</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="coupons" className="w-full">
                <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-8">
                    <TabsTrigger value="coupons">Active Coupons</TabsTrigger>
                    <TabsTrigger value="history">Points History</TabsTrigger>
                </TabsList>

                <TabsContent value="coupons" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {coupons.map((coupon, index) => (
                            <Card key={index} className="overflow-hidden border-dashed border-2 hover:border-primary/50 transition-colors">
                                <div className="absolute top-0 right-0 p-2">
                                    <Badge variant="secondary" className="text-xs">Expires {coupon.expiry}</Badge>
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xl flex justify-between items-center">
                                        {coupon.code}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => copyToClipboard(coupon.code)}
                                            className="h-8 w-8"
                                        >
                                            {copiedCode === coupon.code ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                        </Button>
                                    </CardTitle>
                                    <CardDescription>{coupon.desc}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="text-2xl font-bold text-green-600">₹{coupon.value} OFF</div>
                                        <div className="text-xs text-muted-foreground">Min. spend ₹{coupon.minSpend}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="w-5 h-5" />
                                Transaction History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {history.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg transition-colors border-b last:border-0">
                                        <div>
                                            <p className="font-medium">{item.action}</p>
                                            <p className="text-xs text-muted-foreground">{item.date}</p>
                                        </div>
                                        <Badge variant={item.points.startsWith('+') ? "default" : "secondary"} className={item.points.startsWith('+') ? "bg-green-100 text-green-700 hover:bg-green-200" : ""}>
                                            {item.points}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
