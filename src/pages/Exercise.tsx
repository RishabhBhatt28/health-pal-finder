import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Timer, Flame, Play, Pause, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const exercises = [
  { name: "Push-ups", duration: 60, calories: 7, category: "Strength", icon: "💪" },
  { name: "Squats", duration: 60, calories: 8, category: "Strength", icon: "🦵" },
  { name: "Jumping Jacks", duration: 60, calories: 10, category: "Cardio", icon: "⭐" },
  { name: "Plank", duration: 30, calories: 5, category: "Core", icon: "🧘" },
  { name: "Burpees", duration: 60, calories: 12, category: "HIIT", icon: "🔥" },
  { name: "Lunges", duration: 60, calories: 6, category: "Strength", icon: "🏋️" },
  { name: "Mountain Climbers", duration: 45, calories: 9, category: "Cardio", icon: "🏔️" },
  { name: "Yoga Stretch", duration: 120, calories: 3, category: "Flexibility", icon: "🧘‍♀️" },
];

export default function Exercise() {
  const [activeExercise, setActiveExercise] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalCalories, setTotalCalories] = useState(0);

  const startExercise = (idx: number) => {
    setActiveExercise(idx);
    setTimeLeft(exercises[idx].duration);
    setIsRunning(true);

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          setTotalCalories((c) => c + exercises[idx].calories);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Dumbbell className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Exercise</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Flame className="h-8 w-8 text-health-orange" />
            <div>
              <p className="text-2xl font-bold">{totalCalories}</p>
              <p className="text-xs text-muted-foreground">Calories Burned</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Timer className="h-8 w-8 text-health-blue" />
            <div>
              <p className="text-2xl font-bold">{activeExercise !== null ? formatTime(timeLeft) : "--:--"}</p>
              <p className="text-xs text-muted-foreground">Timer</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Exercise */}
      {activeExercise !== null && isRunning && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Card className="mb-4 border-primary">
            <CardContent className="p-6 text-center">
              <p className="text-4xl mb-2">{exercises[activeExercise].icon}</p>
              <p className="text-lg font-bold">{exercises[activeExercise].name}</p>
              <p className="text-4xl font-bold text-primary my-3">{formatTime(timeLeft)}</p>
              <Button variant="outline" onClick={() => { setIsRunning(false); setActiveExercise(null); setTimeLeft(0); }}>
                <Pause className="h-4 w-4 mr-1" /> Stop
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Exercise List */}
      <div className="space-y-3">
        {exercises.map((ex, i) => (
          <motion.div key={ex.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{ex.icon}</span>
                  <div>
                    <p className="font-semibold">{ex.name}</p>
                    <div className="flex gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-xs">{ex.category}</Badge>
                      <span className="text-xs text-muted-foreground">{ex.duration}s · {ex.calories} cal</span>
                    </div>
                  </div>
                </div>
                <Button size="icon" variant="ghost" onClick={() => startExercise(i)} disabled={isRunning}>
                  <Play className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
