"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface IntakeFormProps {
  studentId: string
  existingData?: any
}

export function IntakeForm({ studentId, existingData }: IntakeFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    basics: {
      currentGrade: existingData?.basics?.currentGrade || "",
      gpa: existingData?.basics?.gpa || "",
      satScore: existingData?.basics?.satScore || "",
      actScore: existingData?.basics?.actScore || "",
    },
    academics: {
      intendedMajor: existingData?.academics?.intendedMajor || "",
      academicInterests: existingData?.academics?.academicInterests || "",
    },
    extracurriculars: {
      activities: existingData?.extracurriculars?.activities || "",
      leadership: existingData?.extracurriculars?.leadership || "",
      awards: existingData?.extracurriculars?.awards || "",
    },
    colleges: {
      schoolsOfInterest: existingData?.colleges?.schoolsOfInterest || "",
      constraints: existingData?.colleges?.constraints || "",
    },
    additional: {
      additionalInfo: existingData?.additional?.additionalInfo || "",
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/student/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          data: formData,
        }),
      })

      if (response.ok) {
        alert("Intake form submitted successfully!")
        window.location.reload()
      }
    } catch (error) {
      console.error("Error submitting intake form:", error)
      alert("Failed to submit form. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currentGrade">Current Grade</Label>
            <Input
              id="currentGrade"
              value={formData.basics.currentGrade}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  basics: { ...formData.basics, currentGrade: e.target.value },
                })
              }
              placeholder="e.g., 12th, 11th"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gpa">GPA</Label>
            <Input
              id="gpa"
              type="number"
              step="0.01"
              value={formData.basics.gpa}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  basics: { ...formData.basics, gpa: e.target.value },
                })
              }
              placeholder="e.g., 3.8"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="satScore">SAT Score (optional)</Label>
            <Input
              id="satScore"
              type="number"
              value={formData.basics.satScore}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  basics: { ...formData.basics, satScore: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="actScore">ACT Score (optional)</Label>
            <Input
              id="actScore"
              type="number"
              value={formData.basics.actScore}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  basics: { ...formData.basics, actScore: e.target.value },
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Academic Interests</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="intendedMajor">Intended Major(s)</Label>
            <Input
              id="intendedMajor"
              value={formData.academics.intendedMajor}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  academics: { ...formData.academics, intendedMajor: e.target.value },
                })
              }
              placeholder="e.g., Computer Science, Biology"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="academicInterests">Academic Interests</Label>
            <Textarea
              id="academicInterests"
              value={formData.academics.academicInterests}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  academics: { ...formData.academics, academicInterests: e.target.value },
                })
              }
              placeholder="Describe your academic interests and goals..."
              className="min-h-[100px]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Extracurricular Activities</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="activities">Activities & Involvement</Label>
            <Textarea
              id="activities"
              value={formData.extracurriculars.activities}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  extracurriculars: { ...formData.extracurriculars, activities: e.target.value },
                })
              }
              placeholder="List your extracurricular activities..."
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="leadership">Leadership Roles</Label>
            <Textarea
              id="leadership"
              value={formData.extracurriculars.leadership}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  extracurriculars: { ...formData.extracurriculars, leadership: e.target.value },
                })
              }
              placeholder="Describe any leadership positions or roles..."
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="awards">Awards & Honors</Label>
            <Textarea
              id="awards"
              value={formData.extracurriculars.awards}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  extracurriculars: { ...formData.extracurriculars, awards: e.target.value },
                })
              }
              placeholder="List any awards, honors, or recognitions..."
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">College Preferences</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schoolsOfInterest">Schools of Interest</Label>
            <Textarea
              id="schoolsOfInterest"
              value={formData.colleges.schoolsOfInterest}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  colleges: { ...formData.colleges, schoolsOfInterest: e.target.value },
                })
              }
              placeholder="List colleges/universities you're interested in..."
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="constraints">Constraints & Preferences</Label>
            <Textarea
              id="constraints"
              value={formData.colleges.constraints}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  colleges: { ...formData.colleges, constraints: e.target.value },
                })
              }
              placeholder="Any constraints (location, size, cost) or preferences..."
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Additional Information</h2>
        <div className="space-y-2">
          <Label htmlFor="additionalInfo">Anything else you'd like us to know?</Label>
          <Textarea
            id="additionalInfo"
            value={formData.additional.additionalInfo}
            onChange={(e) =>
              setFormData({
                ...formData,
                additional: { ...formData.additional, additionalInfo: e.target.value },
              })
            }
            placeholder="Additional information, questions, or concerns..."
            className="min-h-[100px]"
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Submit Intake Form"}
      </Button>
    </form>
  )
}
