"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Warning } from "phosphor-react"

interface ProblemModalProps {
  isOpen: boolean
  onClose: () => void
  stepId: string
  recipeId: string
}

export function ProblemModal({ isOpen, onClose, stepId, recipeId }: ProblemModalProps) {
  const [problemType, setProblemType] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const problemTypes = [
    { value: "ingredient_missing", label: "Ingrédient manquant" },
    { value: "equipment_issue", label: "Problème d'ustensile" },
    { value: "temperature_problem", label: "Problème de température" },
    { value: "other", label: "Autre" },
  ]

  const handleSubmit = async () => {
    if (!problemType) return

    setIsSubmitting(true)

    try {
      // Mock API call - would send to backend
      const problemData = {
        stepId,
        recipeId,
        type: problemType,
        description,
        reportedAt: new Date().toISOString(),
      }

      console.log("[Problem Reported]", problemData)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message
      alert("Problème enregistré. Le chef a été notifié.")

      // Reset form and close
      setProblemType("")
      setDescription("")
      onClose()
    } catch (error) {
      console.error("Error reporting problem:", error)
      alert("Erreur lors de l'enregistrement du problème")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Warning className="h-5 w-5 text-destructive mr-2" />
            Signaler un problème
          </DialogTitle>
          <DialogDescription>Décrivez le problème rencontré. Le chef sera automatiquement notifié.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">Type de problème</Label>
            <RadioGroup value={problemType} onValueChange={setProblemType}>
              {problemTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <Label htmlFor={type.value} className="text-sm">
                    {type.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium mb-2 block">
              Description (optionnel)
            </Label>
            <Textarea
              id="description"
              placeholder="Décrivez le problème en détail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!problemType || isSubmitting}>
            {isSubmitting ? "Envoi..." : "Signaler"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
