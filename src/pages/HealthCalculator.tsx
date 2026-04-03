import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Heart, Scale, Zap, Target, Activity } from "lucide-react";

interface HealthData {
  bmi: number;
  bmiCategory: string;
  idealWeightMin: number;
  idealWeightMax: number;
  bmr: number;
  bpCategory: string;
  healthScore: number;
  protein: number;
  carbs: number;
  fats: number;
}

const HealthCalculator = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bpSystolic, setBpSystolic] = useState("");
  const [bpDiastolic, setBpDiastolic] = useState("");
  const [result, setResult] = useState<HealthData | null>(null);

  const calculate = () => {
    const h = parseFloat(height) / 100; // cm to m
    const w = parseFloat(weight);
    const a = parseInt(age);
    const sys = parseInt(bpSystolic) || 120;
    const dia = parseInt(bpDiastolic) || 80;

    if (!h || !w || !a) return;

    const bmi = w / (h * h);
    const bmiCategory =
      bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";

    const idealWeightMin = 18.5 * h * h;
    const idealWeightMax = 24.9 * h * h;

    const bmr =
      gender === "male"
        ? 88.362 + 13.397 * w + 4.799 * parseFloat(height) - 5.677 * a
        : 447.593 + 9.247 * w + 3.098 * parseFloat(height) - 4.33 * a;

    const bpCategory =
      sys < 120 && dia < 80
        ? "Normal"
        : sys < 130 && dia < 80
        ? "Elevated"
        : sys < 140 || dia < 90
        ? "High Stage 1"
        : "High Stage 2";

    let healthScore = 100;
    if (bmi < 18.5 || bmi > 30) healthScore -= 25;
    else if (bmi > 25) healthScore -= 10;
    if (bpCategory !== "Normal") healthScore -= 15;
    if (a > 50) healthScore -= 5;
    healthScore = Math.max(0, Math.min(100, healthScore));

    const protein = Math.round(w * 0.8);
    const carbs = Math.round((bmr * 0.5) / 4);
    const fats = Math.round((bmr * 0.3) / 9);

    setResult({
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory,
      idealWeightMin: Math.round(idealWeightMin * 10) / 10,
      idealWeightMax: Math.round(idealWeightMax * 10) / 10,
      bmr: Math.round(bmr),
      bpCategory,
      healthScore,
      protein,
      carbs,
      fats,
    });
  };

  const getBmiColor = (bmi: number) => {
    if (bmi < 18.5) return "text-health-blue";
    if (bmi < 25) return "text-health-green";
    if (bmi < 30) return "text-health-orange";
    return "text-health-red";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-health-green";
    if (score >= 60) return "bg-health-orange";
    return "bg-health-red";
  };

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto">
      {/* Input Form */}
      <Card className="glass-card">
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Your Details
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Age</Label>
              <Input type="number" placeholder="25" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Height (cm)</Label>
              <Input type="number" placeholder="170" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Weight (kg)</Label>
              <Input type="number" placeholder="70" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">BP Systolic</Label>
              <Input type="number" placeholder="120" value={bpSystolic} onChange={(e) => setBpSystolic(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">BP Diastolic</Label>
              <Input type="number" placeholder="80" value={bpDiastolic} onChange={(e) => setBpDiastolic(e.target.value)} />
            </div>
          </div>
          <Button onClick={calculate} className="w-full health-gradient text-white">
            Calculate Health Score
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Health Score */}
          <Card className="glass-card">
            <CardContent className="pt-6 text-center">
              <Activity className="w-6 h-6 mx-auto mb-2 text-primary" />
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Health Score</h3>
              <div className="text-5xl font-bold mb-2">{result.healthScore}</div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${getScoreColor(result.healthScore)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${result.healthScore}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </CardContent>
          </Card>

          {/* BMI & BP */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="glass-card">
              <CardContent className="pt-4 text-center">
                <Scale className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">BMI</p>
                <p className={`text-2xl font-bold ${getBmiColor(result.bmi)}`}>{result.bmi}</p>
                <p className="text-xs font-medium">{result.bmiCategory}</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-4 text-center">
                <Heart className="w-5 h-5 mx-auto mb-1 text-health-red" />
                <p className="text-xs text-muted-foreground">Blood Pressure</p>
                <p className="text-lg font-bold">{bpSystolic || 120}/{bpDiastolic || 80}</p>
                <p className="text-xs font-medium">{result.bpCategory}</p>
              </CardContent>
            </Card>
          </div>

          {/* BMR & Ideal Weight */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="glass-card">
              <CardContent className="pt-4 text-center">
                <Zap className="w-5 h-5 mx-auto mb-1 text-health-orange" />
                <p className="text-xs text-muted-foreground">BMR</p>
                <p className="text-2xl font-bold">{result.bmr}</p>
                <p className="text-xs">kcal/day</p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-4 text-center">
                <Target className="w-5 h-5 mx-auto mb-1 text-health-teal" />
                <p className="text-xs text-muted-foreground">Ideal Weight</p>
                <p className="text-lg font-bold">{result.idealWeightMin} - {result.idealWeightMax}</p>
                <p className="text-xs">kg</p>
              </CardContent>
            </Card>
          </div>

          {/* Nutrient Goals */}
          <Card className="glass-card">
            <CardContent className="pt-6 space-y-3">
              <h3 className="text-sm font-semibold">Daily Nutrient Goals</h3>
              {[
                { label: "Protein", value: result.protein, max: 150, unit: "g", color: "bg-health-green" },
                { label: "Carbs", value: result.carbs, max: 400, unit: "g", color: "bg-health-blue" },
                { label: "Fats", value: result.fats, max: 100, unit: "g", color: "bg-health-orange" },
              ].map(({ label, value, max, unit, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{label}</span>
                    <span className="font-medium">{value}{unit}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((value / max) * 100, 100)}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default HealthCalculator;
