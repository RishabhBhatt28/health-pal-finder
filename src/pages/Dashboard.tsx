import { useState } from "react";
import { motion } from "framer-motion";
import { Droplets, Moon, Footprints, Flame, TrendingUp, Plus, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const ActivityRing = ({
  value,
  max,
  color,
  size = 100,
  strokeWidth = 8,
  label,
  icon: Icon,
}: {
  value: number;
  max: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  label: string;
  icon: React.ElementType;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const offset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="w-4 h-4" style={{ color }} />
          <span className="text-sm font-bold">{value}</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
};

const Dashboard = () => {
  const [steps, setSteps] = useState(4523);
  const [waterGlasses, setWaterGlasses] = useState(4);
  const [sleepHours, setSleepHours] = useState(7.5);

  const caloriesBurned = Math.round(steps * 0.04);
  const distanceKm = (steps * 0.000762).toFixed(1);
  const activeMinutes = Math.round(steps / 100);

  const getSleepQuality = (hours: number) => {
    if (hours >= 7 && hours <= 9) return { label: "Good", color: "text-health-green" };
    if (hours >= 6) return { label: "Fair", color: "text-health-orange" };
    return { label: "Poor", color: "text-health-red" };
  };

  const sleepQuality = getSleepQuality(sleepHours);

  const healthTips = [
    "💧 Drink at least 8 glasses of water daily to stay hydrated.",
    "🚶 Walking 10,000 steps daily reduces risk of heart disease by 35%.",
    "😴 Adults need 7-9 hours of sleep for optimal health.",
    "🥗 Include 5 servings of fruits and vegetables in your diet.",
    "🧘 Practice deep breathing for 5 minutes to reduce stress.",
  ];
  const todayTip = healthTips[new Date().getDay() % healthTips.length];

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto">
      {/* Activity Rings */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
            Today's Activity
          </h2>
          <div className="flex justify-around items-center">
            <ActivityRing
              value={steps}
              max={10000}
              color="hsl(var(--health-green))"
              label="Steps"
              icon={Footprints}
              size={110}
              strokeWidth={10}
            />
            <ActivityRing
              value={caloriesBurned}
              max={500}
              color="hsl(var(--health-orange))"
              label="Calories"
              icon={Flame}
              size={110}
              strokeWidth={10}
            />
            <ActivityRing
              value={waterGlasses}
              max={8}
              color="hsl(var(--health-blue))"
              label="Water"
              icon={Droplets}
              size={110}
              strokeWidth={10}
            />
          </div>
        </CardContent>
      </Card>

      {/* Step Counter */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Step Counter</h3>
            <span className="text-xs text-muted-foreground">{steps.toLocaleString()} / 10,000</span>
          </div>
          <Slider
            value={[steps]}
            onValueChange={([v]) => setSteps(v)}
            max={15000}
            step={100}
            className="mb-3"
          />
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-muted rounded-lg p-2">
              <p className="text-lg font-bold text-health-green">{distanceKm}</p>
              <p className="text-xs text-muted-foreground">km</p>
            </div>
            <div className="bg-muted rounded-lg p-2">
              <p className="text-lg font-bold text-health-orange">{caloriesBurned}</p>
              <p className="text-xs text-muted-foreground">kcal</p>
            </div>
            <div className="bg-muted rounded-lg p-2">
              <p className="text-lg font-bold text-health-blue">{activeMinutes}</p>
              <p className="text-xs text-muted-foreground">min</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Water Intake */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Water Intake</h3>
            <span className="text-xs text-muted-foreground">{waterGlasses} / 8 glasses</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-6 h-10 rounded-md border-2 transition-colors ${
                    i < waterGlasses
                      ? "bg-health-blue border-health-blue"
                      : "border-border bg-muted"
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: i < waterGlasses ? 1 : 0.9 }}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWaterGlasses(Math.min(8, waterGlasses + 1))}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sleep Tracker */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Sleep Tracker</h3>
            <span className={`text-xs font-medium ${sleepQuality.color}`}>
              {sleepQuality.label}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-health-purple shrink-0" />
            <Slider
              value={[sleepHours * 10]}
              onValueChange={([v]) => setSleepHours(v / 10)}
              max={120}
              min={30}
              step={5}
              className="flex-1"
            />
            <span className="text-sm font-bold w-12 text-right">{sleepHours}h</span>
          </div>
        </CardContent>
      </Card>

      {/* Health Tip */}
      <Card className="health-gradient text-white">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold mb-1">Daily Health Tip</h3>
              <p className="text-sm text-white/90">{todayTip}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
