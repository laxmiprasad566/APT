import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Copy, Check, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BookingPlatform {
    name: string;
    baseUrl: string;
    code: string;
}

interface CouponData {
    code: string;
    value: number;
    description: string;
}

interface BookingOptionsProps {
    bookingLinks: BookingPlatform[];
    coupon: CouponData;
    transportMode: string;
}

export const BookingOptions: React.FC<BookingOptionsProps> = ({ bookingLinks, coupon, transportMode }) => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [copied, setCopied] = useState(false);
    const [smsSent, setSmsSent] = useState(false);
    const { toast } = useToast();

    const handleCopyCoupon = () => {
        navigator.clipboard.writeText(coupon.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
            title: "Coupon copied!",
            description: "Paste it at checkout to avail discount",
        });
    };

    const handleSendSMS = () => {
        if (!mobileNumber || mobileNumber.length !== 10) {
            toast({
                title: "Invalid number",
                description: "Please enter a valid 10-digit mobile number",
                variant: "destructive",
            });
            return;
        }

        // Simulate SMS sending (in production, call backend API)
        setSmsSent(true);
        toast({
            title: "Coupon sent!",
            description: `SMS sent to ${mobileNumber} with your coupon code`,
        });
    };

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    🎉 Booking & Rewards
                </CardTitle>
                <CardDescription>
                    Book through our partners and save with exclusive coupons!
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Coupon Display */}
                <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="text-sm text-muted-foreground">{coupon.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <code className="text-2xl font-bold text-primary">{coupon.code}</code>
                                <Badge variant="secondary">Save ₹{coupon.value}</Badge>
                            </div>
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCopyCoupon}
                            className="ml-2"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>

                    {/* Mobile Number Input */}
                    <div className="flex gap-2 mt-3">
                        <div className="flex-1">
                            <Label htmlFor="mobile" className="sr-only">Mobile Number</Label>
                            <Input
                                id="mobile"
                                type="tel"
                                placeholder="Enter mobile number for SMS"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                maxLength={10}
                            />
                        </div>
                        <Button
                            size="sm"
                            onClick={handleSendSMS}
                            disabled={smsSent}
                            className="flex items-center gap-1"
                        >
                            <Send className="w-4 h-4" />
                            {smsSent ? 'Sent' : 'Send SMS'}
                        </Button>
                    </div>
                </div>

                {/* Booking Platform Links */}
                <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Book with our partners:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {bookingLinks.map((platform) => (
                            <Button
                                key={platform.name}
                                variant="outline"
                                className="justify-start"
                                asChild
                            >
                                <a
                                    href={`${platform.baseUrl}?${platform.code}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    {platform.name}
                                </a>
                            </Button>
                        ))}
                    </div>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                    💡 Tip: Use coupon code <strong>{coupon.code}</strong> at checkout for instant savings!
                </p>
            </CardContent>
        </Card>
    );
};
