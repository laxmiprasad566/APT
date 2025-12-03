import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/api/client";

interface Location {
  id: string;
  name: string;
  location_type: string;
}

interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const LocationSelect = ({ value, onChange, placeholder }: LocationSelectProps) => {
  const [open, setOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      console.log("Fetching locations...");
      const data = await api.getLocations();
      console.log("Locations fetched:", data?.length);
      if (Array.isArray(data)) {
        setLocations(data);
      } else {
        console.error("Invalid locations data format:", data);
        setLocations([]);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const groupedLocations = locations.reduce((acc, location) => {
    const type = location.location_type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(location);
    return acc;
  }, {} as Record<string, Location[]>);

  const typeLabels: Record<string, string> = {
    mega_city: "Mega Cities",
    city: "Cities",
    town: "Towns",
    village: "Villages",
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-11"
        >
          {value || placeholder || "Select location..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search location..." />
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading locations..." : "No location found."}
            </CommandEmpty>
            {Object.entries(groupedLocations).map(([type, locs]) => (
              <CommandGroup key={type} heading={typeLabels[type] || type}>
                {locs.map((location) => (
                  <CommandItem
                    key={location.id}
                    value={location.name}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === location.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {location.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
