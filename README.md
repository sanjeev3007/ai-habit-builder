# AI Habit Builder App

Turn any personal goal into a clear 30-day habit plan with daily tasks, weekly checkpoints, streaks, and daily motivation — all powered by AI.

---

## 📌 Project Goal
Help users transform any personal goal into a simple, personalized habit routine by generating a complete 30-day plan with daily tasks, weekly checkpoints, streak tracking, and motivational messages.
This app makes habit-building easy, clear, and consistent using AI.

---

## 🚀 Core Features

### **1) Input Form**
- Goal input (e.g., "Learn JavaScript", "Lose weight", "Wake up early")
- Target duration (7 / 14 / 30 days — default 30)
- Habit difficulty (easy, medium, hard)
- Preferred time of day (morning / evening / custom)
- Reason behind the habit (increases personalization)

---

### **2) AI Habit Generation**
- Full 30-day habit roadmap
- Day-by-day micro actionable tasks
- Weekly checkpoints & milestones
- Daily motivational messages
- Transformation summary after 30 days
- Clean JSON-structured AI output

---

### **3) Customization**
- Regenerate entire plan or single day
- Adjust habit difficulty
- Manually edit tasks
- Add personal notes
- Drag-and-drop day rearrangement
- Skip or replace any task

---

### **4) Tracking & Insights**
- Daily check-in (Done / Not Done)
- Automatic streak badges (3, 7, 15, 30 days)
- Progress bar
- Weekly summary insights
- Consistency %, best performance day, improvement score

---

### **5) Motivation & Coaching**
- Daily motivational notifications
- AI-based "End of day reflection" prompts
- Adaptive plan adjustments if user misses multiple days
- Habit strength score (1–100)
- Weekly encouragement cards

---

### **6) Export Options**
- PDF export (30-day plan)
- Notion export (structured pages)
- Calendar export (.ics)
- Print-friendly format

---

### **7) Lead Capture**
- Email required before exporting PDF/Notion
- Save plans to user account
- Optional newsletter ("Daily Habit Tips")
- Optional admin analytics dashboard

---

## 🛠️ Tech Stack

### **Frontend**
- Next.js 15+ (App Router)
- Tailwind CSS
- shadcn/UI
- Zustand or React Context

### **Backend**
- Supabase PostgreSQL (users, habits, progress)
- Supabase Auth

### **AI**
- Groq (fast & cheap) or OpenAI GPT-4.1
- Structured JSON output

### **PDF Generation**
- jsPDF (client) or Puppeteer (server)

### **Notifications**
- Cron-based email reminders

---

## 🎨 Design Layout

### **Landing Page**
- Header: Logo | Features | About | CTA
- Hero section with headline, subheadline, demo preview
- Features (3 columns): Personalized | Consistent | AI-Powered
- How It Works (3 steps)
- Success stories + testimonials
- Footer: links, social icons, contact

---

### **App Interface Layout**

**Left Sidebar**
- Daily task list
- Day 1–30 navigation
- Streak indicator
- Weekly checkpoint list
- Save/Export buttons

**Main Canvas**
- Day preview (tasks + motivation)
- Edit & Regenerate buttons
- Done/Not Done toggle
- Reflection text input

**Top Bar**
- Habit title (editable)
- Progress bar
- Notification toggle
- User menu

---

## 📝 Input Form (Multi-step)

### **Step 1: Define Habit**
- Goal input
- Reason behind the goal
- Preferred time

### **Step 2: Personalization**
- Difficulty level
- Duration (7/14/30 days)
- Extra context

### **Step 3: Preview & Confirm**
- Summary preview
- Sample daily tasks
- Regenerate preview

Final: **Generate Plan**

---

## 🔄 User Flow

1. User lands and sees value proposition
2. Clicks **Create Habit Plan**
3. Completes multi-step form
4. AI generates habit plan
5. User customizes tasks
6. User saves the plan to dashboard
7. User checks-in daily → streak grows
8. User exports PDF or Notion (email captured)

---
