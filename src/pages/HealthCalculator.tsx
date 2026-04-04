import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Calculator, Heart, Activity, Brain } from "lucide-react";

function BMIGauge({ value }: { value: number }) {
  const getCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-health-blue", pct: 15 };
    if (bmi < 25) return { label: "Normal", color: "text-primary", pct: 40 };
    if (bmi < 30) return { label: "Overweight", color: "text-health-orange", pct: 65 };
    return { label: "Obese", color: "text-health-red", pct: 90 };
  };
  const cat = getCategory(value);
  const angle = -90 + (Math.min(value, 40) / 40) * 180;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-24 overflow-hidden">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <path d="M 10 95 A 85 85 0 0 1 190 95" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" strokeLinecap="round" />
          <path d="M 10 95 A 85 85 0 0 1 60 20" fill="none" stroke="hsl(var(--health-blue))" strokeWidth="12" strokeLinecap="round" />
          <path d="M 60 20 A 85 85 0 0 1 140 20" fill="none" stroke="hsl(var(--health-green))" strokeWidth="12" strokeLinecap="round" />
          <path d="M 140 20 A 85 85 0 0 1 170 55" fill="none" stroke="hsl(var(--health-orange))" strokeWidth="12" strokeLinecap="round" />
          <path d="M 170 55 A 85 85 0 0 1 190 95" fill="none" stroke="hsl(var(--health-red))" strokeWidth="12" strokeLinecap="round" />
          <motion.line
            x1="100" y1="95" x2="100" y2="20"
            stroke="hsl(var(--foreground))"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ transformOrigin: "100px 95px" }}
            initial={{ rotate: -90 }}
            animate={{ rotate: angle }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
      </div>
      <p className="text-3xl font-bold mt-1">{value.toFixed(1)}</p>
      <p className={`text-sm font-semibold ${cat.color}`}>{cat.label}</p>
    </div>
  );
}

export default function HealthCalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");

  const bmi = height && weight ? Number(weight) / Math.pow(Number(height) / 100, 2) : 0;

  const bmr =
    height && weight && age
      ? gender === "male"
        ? 88.362 + 13.397 * Number(weight) + 4.799 * Number(height) - 5.677 * Number(age)
        : 447.593 + 9.247 * Number(weight) + 3.098 * Number(height) - 4.33 * Number(age)
      : 0;

  const getBPCategory = (s: number, d: number) => {
    if (s < 120 && d < 80) return { label: "Normal", color: "text-primary" };
    if (s < 130 && d < 80) return { label: "Elevated", color: "text-health-orange" };
    if (s < 140 || d < 90) return { label: "High Stage 1", color: "text-health-orange" };
    return { label: "High Stage 2", color: "text-health-red" };
  };

  const healthScore = () => {
    let score = 50;
    if (bmi >= 18.5 && bmi < 25) score += 25;
    else if (bmi >= 25 && bmi < 30) score += 10;
    if (systolic && diastolic) {
      const bp = getBPCategory(Number(systolic), Number(diastolic));
      if (bp.label === "Normal") score += 25;
      else if (bp.label === "Elevated") score += 15;
    }
    return Math.min(100, score);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Health Calculator</h1>
      </div>

      <Tabs defaultValue="bmi" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="bmi">BMI</TabsTrigger>
          <TabsTrigger value="bp">BP</TabsTrigger>
          <TabsTrigger value="bmr">BMR</TabsTrigger>
          <TabsTrigger value="score">Score</TabsTrigger>
        </TabsList>

        <TabsContent value="bmi">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardHeader><CardTitle className="text-base flex gap-2"><Activity className="h-4 w-4" /> BMI Calculator</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Height (cm)</Label><Input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="170" /></div>
                  <div><Label>Weight (kg)</Label><Input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="70" /></div>
                </div>
                {bmi > 0 && <BMIGauge value={bmi} />}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="bp">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardHeader><CardTitle className="text-base flex gap-2"><Heart className="h-4 w-4" /> Blood Pressure</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Systolic (mmHg)</Label><Input type="number" value={systolic} onChange={e => setSystolic(e.target.value)} placeholder="120" /></div>
                  <div><Label>Diastolic (mmHg)</Label><Input type="number" value={diastolic} onChange={e => setDiastolic(e.target.value)} placeholder="80" /></div>
                </div>
                {systolic && diastolic && (
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className="text-lg font-bold">{systolic}/{diastolic} mmHg</p>
                    <p className={`font-semibold ${getBPCategory(Number(systolic), Number(diastolic)).color}`}>
                      {getBPCategory(Number(systolic), Number(diastolic)).label}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="bmr">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardHeader><CardTitle className="text-base flex gap-2"><Brain className="h-4 w-4" /> BMR Calculator</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Height (cm)</Label><Input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="170" /></div>
                  <div><Label>Weight (kg)</Label><Input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="70" /></div>
                  <div><Label>Age</Label><Input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="25" /></div>
                  <div>
                    <Label>Gender</Label>
                    <div className="flex gap-2 mt-1">
                      <Button size="sm" variant={gender === "male" ? "default" : "outline"} onClick={() => setGender("male")}>Male</Button>
                      <Button size="sm" variant={gender === "female" ? "default" : "outline"} onClick={() => setGender("female")}>Female</Button>
                    </div>
                  </div>
                </div>
                {bmr > 0 && (
                  <div className="text-center p-4 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold text-primary">{Math.round(bmr)}</p>
                    <p className="text-sm text-muted-foreground">calories/day (base metabolic rate)</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="score">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardHeader><CardTitle className="text-base">Health Score</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-5xl font-bold text-primary">{healthScore()}</p>
                  <p className="text-muted-foreground text-sm">out of 100</p>
                </div>
                <div className="space-y-2">
                  <div><Label className="text-xs">BMI</Label><Progress value={bmi > 0 ? Math.min(100, (25 / bmi) * 100) : 0} className="h-2" /></div>
                  <div><Label className="text-xs">Blood Pressure</Label><Progress value={systolic ? (getBPCategory(Number(systolic), Number(diastolic)).label === "Normal" ? 100 : 50) : 0} className="h-2" /></div>
                </div>
                <p className="text-xs text-muted-foreground text-center">Fill in BMI & BP tabs to improve accuracy</p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
