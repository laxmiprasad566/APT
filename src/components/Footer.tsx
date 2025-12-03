import { MapPin, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_NAME, APP_SHORT_NAME, APP_DESCRIPTION } from "@/constants/branding";

export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {APP_SHORT_NAME}
                </h3>
                <p className="text-xs text-muted-foreground">{APP_NAME}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {APP_DESCRIPTION}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#home" className="hover:text-foreground transition-colors">Plan Trip</a>
              </li>
              <li>
                <a href="#impact" className="hover:text-foreground transition-colors">Impact</a>
              </li>
              <li>
                <a href="#alerts" className="hover:text-foreground transition-colors">Alerts</a>
              </li>
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/railway" className="hover:text-foreground transition-colors">Explore Railways</Link>
              </li>
              <li>
                <a href="#impact" className="hover:text-foreground transition-colors">Performance Reports</a>
              </li>
              <li>
                <a href="#alerts" className="hover:text-foreground transition-colors">Metro Alerts</a>
              </li>
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">Premium Travel</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@apt.gov</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>1800-APT-HELP</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
