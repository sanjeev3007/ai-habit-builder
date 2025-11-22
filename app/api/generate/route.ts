import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { goal, reason, preferredTime, difficulty, duration, extraContext } = await request.json()

    const prompt = `You are an expert habit coach. Create a detailed ${duration}-day habit plan to help someone achieve their goal.

Goal: ${goal}
Reason: ${reason}
Preferred Time: ${preferredTime}
Difficulty: ${difficulty}
Duration: ${duration} days
Additional Context: ${extraContext || 'None'}

Create a comprehensive habit plan with the following structure in JSON format:

{
  "dailyTasks": [
    {
      "day": 1,
      "title": "Task title",
      "description": "Detailed description of what to do"
    }
    // ... for each day
  ],
  "weeklyCheckpoints": [
    {
      "week": 1,
      "title": "Weekly milestone title",
      "description": "What to reflect on this week",
      "milestones": ["Achievement 1", "Achievement 2"]
    }
    // ... for each week
  ],
  "motivationalMessages": [
    {
      "day": 1,
      "message": "Motivational message for the day"
    }
    // ... for key days (1, 3, 7, 14, 21, 30)
  ]
}

Guidelines:
- Make tasks specific, actionable, and achievable
- Progress should be gradual based on the difficulty level (${difficulty})
- Tasks should align with the preferred time: ${preferredTime}
- Include motivational messages for days 1, 3, 7, 14, 21, and 30 (if applicable)
- Create weekly checkpoints (one for each week)
- Make the plan personalized to their goal and reason
- Keep task descriptions clear and concise (2-3 sentences max)

Return ONLY valid JSON with no additional text or markdown formatting.`

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a habit-building expert. Respond only with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 8000,
    })

    const content = completion.choices[0]?.message?.content || ''

    // Clean up the response to ensure it's valid JSON
    let cleanedContent = content.trim()
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    }
    if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/```\n?/g, '')
    }

    const habitPlan = JSON.parse(cleanedContent)

    return NextResponse.json(habitPlan)
  } catch (error) {
    console.error('Error generating habit plan:', error)
    return NextResponse.json(
      { error: 'Failed to generate habit plan. Please try again.' },
      { status: 500 }
    )
  }
}
