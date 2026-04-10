import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ActivityRing } from "@/components/dashboard/ActivityRing";
import { Footprints, Flame, Droplets, Moon, Plus, Minus, Heart } from "lucide-react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const [steps, setSteps] = useState(6500);
  const [water, setWater] = useState(5);
  const [sleep, setSleep] = useState(7);

  const calories = Math.round(steps * 0.04);
  const stepsGoal = 10000;
  const waterGoal = 8;
  const caloriesGoal = 400;

  const getSleepQuality = (h: number) => {
    if (h >= 7 && h <= 9) return { text: "Good", color: "text-primary" };
    if (h >= 6) return { text: "Fair", color: "text-health-orange" };
    return { text: "Poor", color: "text-health-red" };
  };
  const sleepQ = getSleepQuality(sleep);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-6">
          <Heart className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Health Dashboard</h1>
        </div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
        {/* Activity Rings */}
        <motion.div variants={item}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Today's Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <ActivityRing
                  progress={(steps / stepsGoal) * 100}
                  color="hsl(var(--health-green))"
                  label="Steps"
                  value={steps.toLocaleString()}
                  icon={<Footprints className="h-5 w-5 text-primary" />}
                />
                <ActivityRing
                  progress={(calories / caloriesGoal) * 100}
                  color="hsl(var(--health-orange))"
                  label="Calories"
                  value={`${calories} kcal`}
                  icon={<Flame className="h-5 w-5 text-health-orange" />}
                />
                <ActivityRing
                  progress={(water / waterGoal) * 100}
                  color="hsl(var(--health-blue))"
                  label="Water"
                  value={`${water} glasses`}
                  icon={<Droplets className="h-5 w-5 text-health-blue" />}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Grid for tablet/desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Step Counter */}
          <motion.div variants={item}>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Footprints className="h-4 w-4 text-primary" /> Step Counter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>{steps.toLocaleString()} steps</span>
                  <span className="text-muted-foreground">{stepsGoal.toLocaleString()} goal</span>
                </div>
                <Slider
                  value={[steps]}
                  onValueChange={([v]) => setSteps(v)}
                  min={0}
                  max={20000}
                  step={100}
                  className="w-full"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Water Intake */}
          <motion.div variants={item}>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-health-blue" /> Water Intake
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-6">
                  <Button size="icon" variant="outline" onClick={() => setWater(Math.max(0, water - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-health-blue">{water}</p>
                    <p className="text-xs text-muted-foreground">of {waterGoal} glasses</p>
                  </div>
                  <Button size="icon" variant="outline" onClick={() => setWater(water + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sleep Tracker */}
          <motion.div variants={item}>
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Moon className="h-4 w-4 text-health-purple" /> Sleep Tracker
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>{sleep} hours</span>
                  <span className={sleepQ.color}>{sleepQ.text} quality</span>
                </div>
                <Slider
                  value={[sleep]}
                  onValueChange={([v]) => setSleep(v)}
                  min={0}
                  max={12}
                  step={0.5}
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
