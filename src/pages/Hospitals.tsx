import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Star, Clock, Phone, Search, ChevronDown, ChevronUp, IndianRupee, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const serviceFilters = ["All", "X-Ray", "Blood Test", "MRI", "CT Scan", "Ultrasound", "ECG", "Surgery", "Cardiology", "Dental"];

export default function Hospitals() {
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: hospitals, isLoading } = useQuery({
    queryKey: ["hospitals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hospitals")
        .select("*, hospital_services(*)");
      if (error) throw error;
      return data;
    },
  });

  // Extract unique cities
  const cities = hospitals
    ? ["All", ...Array.from(new Set(hospitals.map((h) => h.city))).sort()]
    : ["All"];

  const filtered = hospitals?.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.address.toLowerCase().includes(search.toLowerCase());
    const matchesService = serviceFilter === "All" ||
      h.hospital_services?.some((s: any) => s.service_name === serviceFilter);
    const matchesCity = cityFilter === "All" || h.city === cityFilter;
    return matchesSearch && matchesService && matchesCity;
  });

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Hospitals</h1>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search hospitals..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* City Filter */}
      <div className="mb-3">
        <Select value={cityFilter} onValueChange={setCityFilter}>
          <SelectTrigger className="w-full">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city === "All" ? "All Cities" : city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Service Filter */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-3 scrollbar-hide">
        {serviceFilters.map((s) => (
          <Badge
            key={s}
            variant={serviceFilter === s ? "default" : "secondary"}
            className="cursor-pointer whitespace-nowrap shrink-0"
            onClick={() => setServiceFilter(s)}
          >
            {s}
          </Badge>
        ))}
      </div>

      {/* Hospital List */}
      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">Loading hospitals...</div>
      ) : filtered?.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">No hospitals found for the selected filters.</div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered?.map((hospital, i) => (
              <motion.div
                key={hospital.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-sm">{hospital.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {hospital.address}, {hospital.city}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-health-orange fill-health-orange" />
                            <span className="text-xs font-semibold">{hospital.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{hospital.open_time} - {hospital.close_time}</span>
                          </div>
                          {hospital.has_emergency && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Emergency</Badge>}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setExpandedId(expandedId === hospital.id ? null : hospital.id)}
                      >
                        {expandedId === hospital.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>

                    <AnimatePresence>
                      {expandedId === hospital.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pt-3 border-t space-y-2">
                            <p className="text-xs font-semibold flex items-center gap-1"><Phone className="h-3 w-3" /> {hospital.phone}</p>
                            <p className="text-xs font-semibold">Services & Prices:</p>
                            <div className="space-y-1">
                              {hospital.hospital_services?.map((s: any) => (
                                <div key={s.id} className="flex justify-between items-center bg-secondary/50 rounded px-2 py-1.5">
                                  <div>
                                    <span className="text-xs font-medium">{s.service_name}</span>
                                    {s.description && <p className="text-[10px] text-muted-foreground">{s.description}</p>}
                                  </div>
                                  <span className="text-xs font-bold flex items-center">
                                    <IndianRupee className="h-3 w-3" />{s.price}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
