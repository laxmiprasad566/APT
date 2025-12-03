import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, CreditCard, User, MapPin, Calendar, Train, Bus, Plane, Car } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function Booking() {
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // State for booking details
    const [traveler, setTraveler] = useState({
        name: "",
        email: "",
        phone: "",
        age: ""
    });

    const [payment, setPayment] = useState({
        cardNumber: "",
        expiry: "",
        cvv: "",
        upiId: ""
    });

    const routeData = location.state?.route;
    const couponData = location.state?.coupon;

    useEffect(() => {
        if (!routeData) {
            toast({
                title: "No route selected",
                description: "Please select a trip to book.",
                variant: "destructive"
            });
            navigate("/");
        }
    }, [routeData, navigate, toast]);

    if (!routeData) return null;

    const totalCost = routeData.totalCost;
    const discount = couponData ? couponData.value : 0;
    const finalCost = totalCost - discount;

    const handleNext = () => {
        if (step === 1) {
            if (!traveler.name || !traveler.email || !traveler.phone) {
                toast({ title: "Missing details", description: "Please fill in all traveler information.", variant: "destructive" });
                return;
            }
        }
        setStep(step + 1);
    };

    const handleBack = () => setStep(step - 1);

    const handlePayment = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
        setStep(4); // Success step
        toast({
            title: "Booking Confirmed!",
            description: "Your ticket has been sent to your email.",
        });
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary font-medium" : ""}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${step >= 1 ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground"}`}>1</div>
                        Details
                    </div>
                    <div className="w-12 h-[1px] bg-border" />
                    <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary font-medium" : ""}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${step >= 2 ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground"}`}>2</div>
                        Review
                    </div>
                    <div className="w-12 h-[1px] bg-border" />
                    <div className={`flex items-center gap-2 ${step >= 3 ? "text-primary font-medium" : ""}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${step >= 3 ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground"}`}>3</div>
                        Payment
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {step === 1 && "Traveler Details"}
                                {step === 2 && "Review Itinerary"}
                                {step === 3 && "Payment Method"}
                                {step === 4 && "Booking Confirmed"}
                            </CardTitle>
                            <CardDescription>
                                {step === 1 && "Enter the details of the primary traveler."}
                                {step === 2 && "Please review your trip details before proceeding."}
                                {step === 3 && "Select a secure payment method."}
                                {step === 4 && "Thank you for booking with APT Planner."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="John Doe"
                                            value={traveler.name}
                                            onChange={(e) => setTraveler({ ...traveler, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="john@example.com"
                                                value={traveler.email}
                                                onChange={(e) => setTraveler({ ...traveler, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="phone">Phone</Label>
                                            <Input
                                                id="phone"
                                                placeholder="+91 98765 43210"
                                                value={traveler.phone}
                                                onChange={(e) => setTraveler({ ...traveler, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="age">Age</Label>
                                        <Input
                                            id="age"
                                            type="number"
                                            placeholder="25"
                                            className="w-24"
                                            value={traveler.age}
                                            onChange={(e) => setTraveler({ ...traveler, age: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-lg">{routeData.segments[0].from} → {routeData.segments[routeData.segments.length - 1].to}</span>
                                            <span className="text-muted-foreground">{routeData.totalDuration} min</span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {routeData.segments.map((seg: any, i: number) => (
                                                <div key={i} className="flex items-center gap-3 text-sm p-2 bg-background rounded border">
                                                    <span className="font-medium capitalize">{seg.mode.replace(/_/g, ' ')}</span>
                                                    <span className="text-muted-foreground">({seg.duration}m)</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-medium">Traveler</h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <User className="w-4 h-4" />
                                            {traveler.name} ({traveler.email})
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <Tabs defaultValue="card" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="card">Card</TabsTrigger>
                                        <TabsTrigger value="upi">UPI</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="card" className="space-y-4 mt-4">
                                        <div className="grid gap-2">
                                            <Label>Card Number</Label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input className="pl-9" placeholder="0000 0000 0000 0000" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label>Expiry</Label>
                                                <Input placeholder="MM/YY" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>CVV</Label>
                                                <Input type="password" placeholder="123" />
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="upi" className="space-y-4 mt-4">
                                        <div className="grid gap-2">
                                            <Label>UPI ID</Label>
                                            <Input placeholder="username@upi" />
                                        </div>
                                        <div className="text-sm text-muted-foreground text-center py-4">
                                            A payment request will be sent to your UPI app.
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            )}

                            {step === 4 && (
                                <div className="text-center py-8 space-y-4">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Booking Successful!</h3>
                                        <p className="text-muted-foreground">Your ticket ID is <span className="font-mono text-primary">APT-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span></p>
                                    </div>
                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                        A confirmation email has been sent to {traveler.email}.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            {step < 4 && (
                                <>
                                    <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                                        Back
                                    </Button>
                                    {step === 3 ? (
                                        <Button onClick={handlePayment} disabled={loading} className="bg-green-600 hover:bg-green-700">
                                            {loading ? "Processing..." : `Pay ${formatCurrency(finalCost)}`}
                                        </Button>
                                    ) : (
                                        <Button onClick={handleNext}>
                                            Next
                                        </Button>
                                    )}
                                </>
                            )}
                            {step === 4 && (
                                <Button className="w-full" onClick={() => navigate("/")}>
                                    Back to Home
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>

                {/* Order Summary */}
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Base Fare</span>
                                <span>{formatCurrency(totalCost)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Taxes & Fees</span>
                                <span>{formatCurrency(totalCost * 0.18)}</span>
                            </div>
                            {couponData && (
                                <div className="flex justify-between text-sm text-green-600 font-medium">
                                    <span>Coupon ({couponData.code})</span>
                                    <span>-{formatCurrency(discount)}</span>
                                </div>
                            )}
                            <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{formatCurrency(finalCost + (totalCost * 0.18))}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
