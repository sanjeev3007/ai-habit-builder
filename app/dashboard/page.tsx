"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useHabitStore } from "@/lib/store"
import { exportHabitPlanToPDF } from "@/lib/pdf-export"
import {
  Target,
  CheckCircle2,
  Circle,
  Flame,
  Calendar,
  Edit2,
  Download,
  Menu,
  X,
  TrendingUp,
  Award,
  RefreshCw
} from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const {
    habitPlan,
    currentDay,
    setCurrentDay,
    completeTask,
    updateDailyTask,
    progress,
  } = useHabitStore()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [reflection, setReflection] = useState("")

  useEffect(() => {
    if (!habitPlan) {
      router.push('/create')
    }
  }, [habitPlan, router])

  if (!habitPlan) {
    return null
  }

  const handleExportPDF = () => {
    if (habitPlan) {
      exportHabitPlanToPDF(habitPlan)
    }
  }

  const currentTask = habitPlan.dailyTasks.find((task) => task.day === currentDay)
  const progressPercentage = (progress.totalCompleted / habitPlan.dailyTasks.length) * 100
  const motivationalMessage = habitPlan.motivationalMessages.find((m) => m.day === currentDay)

  const handleCheckIn = () => {
    if (currentTask && !currentTask.completed) {
      completeTask(currentDay)
      if (reflection) {
        updateDailyTask(currentDay, { notes: reflection })
      }
    }
  }

  const getStreakBadge = (streak: number) => {
    if (streak >= 30) return { icon: "🏆", text: "Legend", color: "bg-yellow-500" }
    if (streak >= 15) return { icon: "💎", text: "Diamond", color: "bg-blue-500" }
    if (streak >= 7) return { icon: "🔥", text: "Week Warrior", color: "bg-orange-500" }
    if (streak >= 3) return { icon: "⭐", text: "3-Day Star", color: "bg-green-500" }
    return null
  }

  const streakBadge = getStreakBadge(progress.currentStreak)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <h1 className="font-semibold text-lg">{habitPlan.goal}</h1>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Day {currentDay} of {habitPlan.duration}</span>
                  <span>•</span>
                  <span>{Math.round(progressPercentage)}% Complete</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm">Home</Button>
            </Link>
          </div>
        </div>
        <div className="container mx-auto px-4 pb-2">
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed lg:static lg:translate-x-0 inset-y-0 left-0 z-40 w-80 border-r bg-background transition-transform duration-300 overflow-y-auto`}
        >
          <div className="p-6 space-y-6">
            {/* Streak Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="h-8 w-8 text-orange-500" />
                    <div>
                      <div className="text-3xl font-bold">{progress.currentStreak}</div>
                      <div className="text-xs text-muted-foreground">days</div>
                    </div>
                  </div>
                  {streakBadge && (
                    <Badge className={streakBadge.color}>
                      {streakBadge.icon} {streakBadge.text}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="pt-6 pb-4">
                  <div className="text-2xl font-bold">{progress.habitStrengthScore}</div>
                  <div className="text-xs text-muted-foreground">Strength</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 pb-4">
                  <div className="text-2xl font-bold">{progress.consistencyPercentage}%</div>
                  <div className="text-xs text-muted-foreground">Consistency</div>
                </CardContent>
              </Card>
            </div>

            {/* Day Navigation */}
            <div>
              <h3 className="font-semibold mb-3 text-sm">Daily Tasks</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {habitPlan.dailyTasks.map((task) => (
                  <button
                    key={task.day}
                    onClick={() => setCurrentDay(task.day)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      currentDay === task.day
                        ? "bg-primary text-primary-foreground border-primary"
                        : "hover:bg-muted border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                      <div className="text-left">
                        <div className="font-medium text-sm">Day {task.day}</div>
                        <div className={`text-xs truncate max-w-[160px] ${
                          currentDay === task.day ? "text-primary-foreground/80" : "text-muted-foreground"
                        }`}>
                          {task.title}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Weekly Checkpoints */}
            {habitPlan.weeklyCheckpoints.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 text-sm">Weekly Checkpoints</h3>
                <div className="space-y-2">
                  {habitPlan.weeklyCheckpoints.map((checkpoint) => (
                    <Card key={checkpoint.week}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Week {checkpoint.week}</CardTitle>
                        <CardDescription className="text-xs">{checkpoint.title}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 max-w-4xl">
            {/* Motivational Message */}
            {motivationalMessage && (
              <Card className="mb-6 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Award className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Daily Motivation</h3>
                      <p className="text-muted-foreground">{motivationalMessage.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Current Day Task */}
            {currentTask && (
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">Day {currentTask.day}: {currentTask.title}</CardTitle>
                      <CardDescription className="mt-2">{habitPlan.preferredTime}</CardDescription>
                    </div>
                    <Badge variant={currentTask.completed ? "default" : "outline"}>
                      {currentTask.completed ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Today's Task</h3>
                    <p className="text-muted-foreground leading-relaxed">{currentTask.description}</p>
                  </div>

                  {!currentTask.completed && (
                    <>
                      <div className="space-y-2">
                        <h3 className="font-semibold">End of Day Reflection (Optional)</h3>
                        <Textarea
                          placeholder="How did it go? What did you learn?"
                          value={reflection}
                          onChange={(e) => setReflection(e.target.value)}
                          rows={3}
                        />
                      </div>

                      <Button onClick={handleCheckIn} size="lg" className="w-full">
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Mark as Complete
                      </Button>
                    </>
                  )}

                  {currentTask.completed && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-semibold">Completed!</span>
                      </div>
                      {currentTask.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>Your reflection:</strong> {currentTask.notes}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Task
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progress Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{progress.totalCompleted}</div>
                    <div className="text-xs text-muted-foreground">Tasks Completed</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{progress.currentStreak}</div>
                    <div className="text-xs text-muted-foreground">Current Streak</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{progress.longestStreak}</div>
                    <div className="text-xs text-muted-foreground">Longest Streak</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">{progress.habitStrengthScore}</div>
                    <div className="text-xs text-muted-foreground">Habit Strength</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
