import ValidationRequest from "@/components/worker/validation-request"

export default function ValidationPage() {
  // Mock session data - would come from API or route params
  const sessionData = {
    id: "session-123",
    recipeName: "Poulet Rôti Express",
    duration: 18,
    estimatedDuration: 15,
    completedSteps: 5,
    totalSteps: 5,
    score: 87,
    photos: ["/roasted-chicken-with-vegetables.jpg", "/plated-dish.jpg"],
    notes: "Cuisson parfaite, présentation soignée. Légumes bien dorés.",
    problems: 0,
  }

  return <ValidationRequest sessionData={sessionData} />
}
