import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Phone, ChevronDown, ChevronUp, Navigation } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const serviceTypes = ["All", "X-Ray", "Blood Test", "MRI", "CT Scan", "ECG", "Ultrasound"] as const;

interface Hospital {
  id: number;
  name: string;
  address: string;
  distance: string;
  rating: number;
  waitTime: string;
  phone: string;
  services: { type: string; priceMin: number; priceMax: number }[];
  slots: string[];
}

const hospitals: Hospital[] = [
  {
    id: 1,
    name: "Apollo Diagnostics Centre",
    address: "MG Road, Agra",
    distance: "1.2 km",
    rating: 4.5,
    waitTime: "15 min",
    phone: "+91 98765 43210",
    services: [
      { type: "X-Ray", priceMin: 300, priceMax: 500 },
      { type: "Blood Test", priceMin: 200, priceMax: 800 },
      { type: "MRI", priceMin: 4500, priceMax: 6000 },
      { type: "ECG", priceMin: 250, priceMax: 400 },
    ],
    slots: ["9:00 AM", "10:30 AM", "2:00 PM", "4:30 PM"],
  },
  {
    id: 2,
    name: "SRL Diagnostics",
    address: "Sanjay Place, Agra",
    distance: "2.5 km",
    rating: 4.2,
    waitTime: "20 min",
    phone: "+91 98765 12345",
    services: [
      { type: "Blood Test", priceMin: 150, priceMax: 600 },
      { type: "Ultrasound", priceMin: 800, priceMax: 1500 },
      { type: "CT Scan", priceMin: 3000, priceMax: 5000 },
      { type: "ECG", priceMin: 200, priceMax: 350 },
    ],
    slots: ["8:30 AM", "11:00 AM", "1:00 PM", "3:30 PM"],
  },
  {
    id: 3,
    name: "Pushpanjali Hospital",
    address: "Bypass Road, Agra",
    distance: "3.8 km",
    rating: 4.7,
    waitTime: "10 min",
    phone: "+91 98765 67890",
    services: [
      { type: "MRI", priceMin: 4000, priceMax: 5500 },
      { type: "CT Scan", priceMin: 2500, priceMax: 4500 },
      { type: "X-Ray", priceMin: 250, priceMax: 450 },
      { type: "Blood Test", priceMin: 180, priceMax: 750 },
      { type: "Ultrasound", priceMin: 700, priceMax: 1200 },
    ],
    slots: ["9:00 AM", "11:30 AM", "2:30 PM", "5:00 PM"],
  },
  {
    id: 4,
    name: "Max Healthcare",
    address: "Civil Lines, Agra",
    distance: "4.1 km",
    rating: 4.8,
    waitTime: "25 min",
    phone: "+91 98765 11111",
    services: [
      { type: "MRI", priceMin: 5000, priceMax: 7000 },
      { type: "CT Scan", priceMin: 3500, priceMax: 5500 },
      { type: "Blood Test", priceMin: 250, priceMax: 900 },
      { type: "ECG", priceMin: 300, priceMax: 500 },
      { type: "X-Ray", priceMin: 350, priceMax: 600 },
      { type: "Ultrasound", priceMin: 900, priceMax: 1800 },
    ],
    slots: ["8:00 AM", "10:00 AM", "12:00 PM", "3:00 PM", "5:00 PM"],
  },
];

const HospitalFinder = () => {
  const [selectedService, setSelectedService] = useState("All");
  const [sortBy, setSortBy] = useState("nearest");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [bookedSlots, setBookedSlots] = useState<Record<string, string>>({});

  const filtered = hospitals
    .filter(
      (h) => selectedService === "All" || h.services.some((s) => s.type === selectedService)
    )
    .sort((a, b) => {
      if (sortBy === "nearest") return parseFloat(a.distance) - parseFloat(b.distance);
      return b.rating - a.rating;
    });

  const bookSlot = (hospitalId: number, slot: string) => {
    setBookedSlots((prev) => ({ ...prev, [hospitalId]: slot }));
  };

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto">
      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="pt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {serviceTypes.map((service) => (
              <Badge
                key={service}
                variant={selectedService === service ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  selectedService === service ? "health-gradient text-white border-0" : ""
                }`}
                onClick={() => setSelectedService(service)}
              >
                {service}
              </Badge>
            ))}
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nearest">Sort by Nearest</SelectItem>
              <SelectItem value="rating">Sort by Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Hospital Cards */}
      <div className="space-y-3">
        {filtered.map((hospital) => (
          <motion.div key={hospital.id} layout>
            <Card className="glass-card overflow-hidden">
              <CardContent className="pt-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{hospital.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {hospital.address}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {hospital.distance}
                  </Badge>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-4 text-xs mb-3">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-health-orange fill-health-orange" />
                    <span className="font-medium">{hospital.rating}</span>
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" /> {hospital.waitTime}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5" /> {hospital.phone}
                  </span>
                </div>

                {/* Expand Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setExpandedId(expandedId === hospital.id ? null : hospital.id)}
                >
                  {expandedId === hospital.id ? (
                    <>Hide Details <ChevronUp className="w-4 h-4 ml-1" /></>
                  ) : (
                    <>View Prices & Book <ChevronDown className="w-4 h-4 ml-1" /></>
                  )}
                </Button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedId === hospital.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {/* Price List */}
                      <div className="mt-3 border-t border-border pt-3">
                        <h4 className="text-xs font-semibold mb-2">Service Price List</h4>
                        <div className="space-y-1">
                          {hospital.services
                            .filter((s) => selectedService === "All" || s.type === selectedService)
                            .map((service) => (
                              <div
                                key={service.type}
                                className="flex justify-between text-xs bg-muted rounded-md px-3 py-1.5"
                              >
                                <span>{service.type}</span>
                                <span className="font-medium">
                                  ₹{service.priceMin} - ₹{service.priceMax}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Appointment Slots */}
                      <div className="mt-3 border-t border-border pt-3">
                        <h4 className="text-xs font-semibold mb-2">Available Slots</h4>
                        {bookedSlots[hospital.id] ? (
                          <div className="bg-health-green/10 border border-health-green/30 rounded-lg p-3 text-center">
                            <p className="text-sm font-medium text-health-green">
                              ✓ Booked at {bookedSlots[hospital.id]}
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {hospital.slots.map((slot) => (
                              <Button
                                key={slot}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => bookSlot(hospital.id, slot)}
                              >
                                {slot}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Get Directions */}
                      <Button
                        className="w-full mt-3 health-gradient text-white"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps/search/${encodeURIComponent(hospital.name + " " + hospital.address)}`,
                            "_blank"
                          )
                        }
                      >
                        <Navigation className="w-4 h-4 mr-2" /> Get Directions
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HospitalFinder;
