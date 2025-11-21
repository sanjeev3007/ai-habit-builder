# AI Habit Builder - Setup Guide

This guide will help you set up and run the AI Habit Builder application.

## Prerequisites

- Node.js 20+ installed
- npm or yarn package manager
- A Groq API key (get one from https://console.groq.com)

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai-habit-builder
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your Groq API key:
```env
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

## Features

### Completed Features

- **Landing Page**: Beautiful landing page with hero section, features, and CTA
- **Multi-step Form**: 3-step form for creating personalized habit plans
  - Step 1: Define your goal, reason, and preferred time
  - Step 2: Choose difficulty level and duration (7/14/30 days)
  - Step 3: Review and confirm your plan
- **AI-Powered Generation**: Uses Groq AI to generate personalized 30-day habit plans
- **Dashboard Interface**: Complete habit tracking interface with:
  - Daily task list and navigation
  - Current streak tracking with badges (3-day, 7-day, 15-day, 30-day)
  - Progress bar and habit strength score
  - Daily check-ins with optional reflections
  - Motivational messages
  - Weekly checkpoints
- **PDF Export**: Export your complete habit plan as a PDF
- **State Management**: Zustand for persistent state management
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: Next.js 15+ with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/UI (manually configured)
- **State Management**: Zustand with persistence
- **AI**: Groq SDK (llama-3.3-70b-versatile model)
- **PDF Generation**: jsPDF
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Project Structure

```
ai-habit-builder/
├── app/
│   ├── api/
│   │   └── generate/       # AI generation API route
│   ├── create/            # Multi-step form page
│   ├── dashboard/         # Main habit tracking interface
│   ├── generate/          # Loading page during AI generation
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/
│   └── ui/                # shadcn/UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── textarea.tsx
│       ├── progress.tsx
│       └── badge.tsx
├── lib/
│   ├── store.ts           # Zustand store
│   ├── utils.ts           # Utility functions
│   └── pdf-export.ts      # PDF export functionality
└── public/                # Static assets
```

## How to Use

1. **Visit the Landing Page**: Browse the features and how it works
2. **Click "Create Your Habit Plan"**: Start the habit creation process
3. **Fill Out the Form**:
   - Step 1: Enter your goal, motivation, and preferred time
   - Step 2: Select difficulty (easy/medium/hard) and duration (7/14/30 days)
   - Step 3: Review your inputs and click "Generate My Plan"
4. **Wait for AI Generation**: The AI will create your personalized plan
5. **Track Your Progress**:
   - Navigate through days using the sidebar
   - Complete daily tasks and add reflections
   - Build your streak and earn badges
   - Export your plan as PDF anytime

## AI Integration

The app uses Groq's `llama-3.3-70b-versatile` model to generate:
- Day-by-day actionable tasks
- Weekly checkpoints and milestones
- Motivational messages for key days
- Personalized content based on your goal, difficulty, and schedule

## Customization

### Changing AI Model

Edit `app/api/generate/route.ts` to change the model:
```typescript
model: 'llama-3.3-70b-versatile', // Change this to another Groq model
```

### Adjusting Colors

Edit `app/globals.css` to customize the color scheme:
```css
:root {
  --primary: 240 5.9% 10%; /* Change primary color */
  /* ... other colors ... */
}
```

## Troubleshooting

### API Key Issues
- Make sure your Groq API key is correctly set in `.env.local`
- Restart the development server after changing environment variables

### Build Errors
- Clear the `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### State Not Persisting
- Check browser localStorage
- Clear localStorage if you need to reset: Open DevTools → Application → Local Storage → Clear

## Future Enhancements

Potential features to add:
- Supabase integration for user authentication and cloud storage
- Email notifications and reminders
- Notion export functionality
- Calendar (.ics) export
- Social sharing features
- Multiple habit plans management
- Analytics dashboard
- Community features

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License
