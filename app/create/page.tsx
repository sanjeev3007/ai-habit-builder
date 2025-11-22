"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Target, ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { useHabitStore } from "@/lib/store"

export default function CreateHabitPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const { setIsGenerating, isGenerating } = useHabitStore()

  // Form state
  const [formData, setFormData] = useState({
    goal: "",
    reason: "",
    preferredTime: "",
    difficulty: "medium" as "easy" | "medium" | "hard",
    duration: 30 as 7 | 14 | 30,
    extraContext: "",
  })

  const updateFormData = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Store form data temporarily
    sessionStorage.setItem('habitFormData', JSON.stringify(formData))
    router.push('/generate')
  }

  const isStepValid = () => {
    if (step === 1) {
      return formData.goal.trim() !== "" && formData.reason.trim() !== "" && formData.preferredTime.trim() !== ""
    }
    if (step === 2) {
      return true // All fields have defaults
    }
    return true
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">AI Habit Builder</span>
          </Link>
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= i
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i}
                  </div>
                  {i < 3 && (
                    <div
                      className={`h-1 w-16 md:w-32 mx-2 ${
                        step > i ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Define Habit</span>
              <span>Personalize</span>
              <span>Confirm</span>
            </div>
          </div>

          {/* Step 1: Define Habit */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Define Your Habit</CardTitle>
                <CardDescription>
                  Tell us about the habit you want to build
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="goal">What habit do you want to build?</Label>
                  <Input
                    id="goal"
                    placeholder="e.g., Learn JavaScript, Exercise daily, Wake up early..."
                    value={formData.goal}
                    onChange={(e) => updateFormData("goal", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Why is this habit important to you?</Label>
                  <Textarea
                    id="reason"
                    placeholder="Explain your motivation and what you hope to achieve..."
                    value={formData.reason}
                    onChange={(e) => updateFormData("reason", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Preferred time of day</Label>
                  <Input
                    id="time"
                    placeholder="e.g., Morning, Evening, After work..."
                    value={formData.preferredTime}
                    onChange={(e) => updateFormData("preferredTime", e.target.value)}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleNext} disabled={!isStepValid()}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Personalization */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Personalize Your Plan</CardTitle>
                <CardDescription>
                  Customize the difficulty and duration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Habit difficulty</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {(["easy", "medium", "hard"] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => updateFormData("difficulty", level)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.difficulty === level
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-semibold capitalize">{level}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {level === "easy" && "Gentle pace"}
                          {level === "medium" && "Moderate pace"}
                          {level === "hard" && "Challenging pace"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Plan duration</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {([7, 14, 30] as const).map((days) => (
                      <button
                        key={days}
                        onClick={() => updateFormData("duration", days)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.duration === days
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-semibold">{days} Days</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {days === 7 && "Quick start"}
                          {days === 14 && "2 weeks"}
                          {days === 30 && "Full month"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="context">Additional context (optional)</Label>
                  <Textarea
                    id="context"
                    placeholder="Any additional information that might help personalize your plan..."
                    value={formData.extraContext}
                    onChange={(e) => updateFormData("extraContext", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleNext}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Preview & Confirm */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Plan</CardTitle>
                <CardDescription>
                  Make sure everything looks good before generating
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="font-semibold mb-1">Goal</div>
                    <div className="text-muted-foreground">{formData.goal}</div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="font-semibold mb-1">Motivation</div>
                    <div className="text-muted-foreground">{formData.reason}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="font-semibold mb-1">Time</div>
                      <div className="text-muted-foreground">{formData.preferredTime}</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="font-semibold mb-1">Difficulty</div>
                      <div className="text-muted-foreground capitalize">{formData.difficulty}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="font-semibold mb-1">Duration</div>
                    <div className="text-muted-foreground">{formData.duration} days</div>
                  </div>

                  {formData.extraContext && (
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="font-semibold mb-1">Additional Context</div>
                      <div className="text-muted-foreground">{formData.extraContext}</div>
                    </div>
                  )}
                </div>

                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="text-sm">
                    Your personalized {formData.duration}-day habit plan will be generated with daily tasks,
                    weekly checkpoints, and motivational messages tailored to your goal.
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate My Plan
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
