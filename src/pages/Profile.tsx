import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Save, LogOut, Loader2, Heart, Ruler, Weight, Calendar, Droplets } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const genders = ["Male", "Female", "Other"];

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    display_name: "",
    date_of_birth: "",
    gender: "",
    height_cm: "",
    weight_kg: "",
    blood_group: "",
  });

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setProfile({
          display_name: data.display_name || "",
          date_of_birth: data.date_of_birth || "",
          gender: data.gender || "",
          height_cm: data.height_cm?.toString() || "",
          weight_kg: data.weight_kg?.toString() || "",
          blood_group: data.blood_group || "",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: profile.display_name || null,
          date_of_birth: profile.date_of_birth || null,
          gender: profile.gender || null,
          height_cm: profile.height_cm ? parseFloat(profile.height_cm) : null,
          weight_kg: profile.weight_kg ? parseFloat(profile.weight_kg) : null,
          blood_group: profile.blood_group || null,
        })
        .eq("user_id", user!.id);

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto pb-24">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">My Profile</h1>
      </div>

      {/* Avatar & Email */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mb-4">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-bold">{profile.display_name || "User"}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profile Form */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1"><User className="h-3 w-3" /> Display Name</Label>
              <Input value={profile.display_name} onChange={(e) => setProfile({ ...profile, display_name: e.target.value })} placeholder="Your name" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1"><Calendar className="h-3 w-3" /> Date of Birth</Label>
              <Input type="date" value={profile.date_of_birth} onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1"><Heart className="h-3 w-3" /> Gender</Label>
              <Select value={profile.gender} onValueChange={(v) => setProfile({ ...profile, gender: v })}>
                <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>
                  {genders.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1"><Ruler className="h-3 w-3" /> Height (cm)</Label>
                <Input type="number" value={profile.height_cm} onChange={(e) => setProfile({ ...profile, height_cm: e.target.value })} placeholder="170" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1"><Weight className="h-3 w-3" /> Weight (kg)</Label>
                <Input type="number" value={profile.weight_kg} onChange={(e) => setProfile({ ...profile, weight_kg: e.target.value })} placeholder="70" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1"><Droplets className="h-3 w-3" /> Blood Group</Label>
              <Select value={profile.blood_group} onValueChange={(v) => setProfile({ ...profile, blood_group: v })}>
                <SelectTrigger><SelectValue placeholder="Select blood group" /></SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Profile
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Emergency SOS */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="mb-4 border-destructive/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-destructive">Emergency SOS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">Tap to call emergency services or nearby hospitals instantly.</p>
            <div className="grid grid-cols-2 gap-2">
              <a href="tel:112" className="block">
                <Button variant="destructive" className="w-full text-sm font-bold">
                  📞 Call 112
                </Button>
              </a>
              <a href="tel:108" className="block">
                <Button variant="destructive" className="w-full text-sm font-bold">
                  🚑 Ambulance 108
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Logout */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </motion.div>
    </div>
  );
}
