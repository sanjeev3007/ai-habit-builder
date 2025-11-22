"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Sparkles, Target, TrendingUp, Calendar } from "lucide-react"
import { useHabitStore } from "@/lib/store"

export default function GeneratePage() {
  const router = useRouter()
  const { setHabitPlan, setIsGenerating } = useHabitStore()

  useEffect(() => {
    const generatePlan = async () => {
      try {
        // Get form data from session storage
        const formDataStr = sessionStorage.getItem('habitFormData')
        if (!formDataStr) {
          router.push('/create')
          return
        }

        const formData = JSON.parse(formDataStr)

        // Call API to generate plan
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error('Failed to generate plan')
        }

        const data = await response.json()

        // Transform daily tasks to include IDs and completed status
        const dailyTasks = data.dailyTasks.map((task: any) => ({
          ...task,
          id: `task-${task.day}`,
          completed: false,
        }))

        // Create habit plan
        const habitPlan = {
          id: `habit-${Date.now()}`,
          goal: formData.goal,
          reason: formData.reason,
          difficulty: formData.difficulty,
          duration: formData.duration,
          preferredTime: formData.preferredTime,
          dailyTasks,
          weeklyCheckpoints: data.weeklyCheckpoints || [],
          motivationalMessages: data.motivationalMessages || [],
          createdAt: new Date(),
          currentDay: 1,
        }

        // Save to store
        setHabitPlan(habitPlan)
        setIsGenerating(false)

        // Clear session storage
        sessionStorage.removeItem('habitFormData')

        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } catch (error) {
        console.error('Error generating plan:', error)
        setIsGenerating(false)
        // TODO: Show error message
        router.push('/create')
      }
    }

    generatePlan()
  }, [router, setHabitPlan, setIsGenerating])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="mb-8 relative">
          <div className="h-24 w-24 mx-auto relative">
            <Loader2 className="h-24 w-24 text-primary animate-spin" />
            <Sparkles className="h-8 w-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">Creating Your Habit Plan</h1>
        <p className="text-muted-foreground mb-8">
          Our AI is crafting a personalized roadmap just for you...
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 animate-pulse">
            <Target className="h-5 w-5 text-primary" />
            <span className="text-sm">Analyzing your goal...</span>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 animate-pulse" style={{ animationDelay: '0.2s' }}>
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-sm">Creating daily tasks...</span>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 animate-pulse" style={{ animationDelay: '0.4s' }}>
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm">Setting up milestones...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
