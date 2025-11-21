import jsPDF from 'jspdf'
import { HabitPlan } from './store'
import { format } from 'date-fns'

export function exportHabitPlanToPDF(habitPlan: HabitPlan) {
  const pdf = new jsPDF()
  let yPos = 20

  // Title
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Habit Plan', 20, yPos)
  yPos += 15

  // Goal
  pdf.setFontSize(16)
  pdf.text(habitPlan.goal, 20, yPos)
  yPos += 10

  // Metadata
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Duration: ${habitPlan.duration} days`, 20, yPos)
  yPos += 6
  pdf.text(`Difficulty: ${habitPlan.difficulty}`, 20, yPos)
  yPos += 6
  pdf.text(`Preferred Time: ${habitPlan.preferredTime}`, 20, yPos)
  yPos += 6
  pdf.text(`Created: ${format(new Date(habitPlan.createdAt), 'MMM dd, yyyy')}`, 20, yPos)
  yPos += 15

  // Reason
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Why This Habit:', 20, yPos)
  yPos += 8
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  const reasonLines = pdf.splitTextToSize(habitPlan.reason, 170)
  reasonLines.forEach((line: string) => {
    if (yPos > 270) {
      pdf.addPage()
      yPos = 20
    }
    pdf.text(line, 20, yPos)
    yPos += 6
  })
  yPos += 10

  // Daily Tasks
  pdf.addPage()
  yPos = 20
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Daily Tasks', 20, yPos)
  yPos += 12

  habitPlan.dailyTasks.forEach((task) => {
    if (yPos > 260) {
      pdf.addPage()
      yPos = 20
    }

    // Day number and title
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`Day ${task.day}: ${task.title}`, 20, yPos)
    yPos += 8

    // Description
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    const descLines = pdf.splitTextToSize(task.description, 170)
    descLines.forEach((line: string) => {
      if (yPos > 270) {
        pdf.addPage()
        yPos = 20
      }
      pdf.text(line, 25, yPos)
      yPos += 6
    })
    yPos += 8
  })

  // Weekly Checkpoints
  if (habitPlan.weeklyCheckpoints && habitPlan.weeklyCheckpoints.length > 0) {
    pdf.addPage()
    yPos = 20
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Weekly Checkpoints', 20, yPos)
    yPos += 12

    habitPlan.weeklyCheckpoints.forEach((checkpoint) => {
      if (yPos > 250) {
        pdf.addPage()
        yPos = 20
      }

      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`Week ${checkpoint.week}: ${checkpoint.title}`, 20, yPos)
      yPos += 8

      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      const descLines = pdf.splitTextToSize(checkpoint.description, 170)
      descLines.forEach((line: string) => {
        if (yPos > 270) {
          pdf.addPage()
          yPos = 20
        }
        pdf.text(line, 25, yPos)
        yPos += 6
      })

      if (checkpoint.milestones && checkpoint.milestones.length > 0) {
        yPos += 4
        checkpoint.milestones.forEach((milestone) => {
          if (yPos > 270) {
            pdf.addPage()
            yPos = 20
          }
          pdf.text(`• ${milestone}`, 30, yPos)
          yPos += 6
        })
      }
      yPos += 8
    })
  }

  // Save the PDF
  const fileName = `habit-plan-${habitPlan.goal.toLowerCase().replace(/\s+/g, '-')}.pdf`
  pdf.save(fileName)
}
