import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChefHat, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <ChefHat className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Chef Mode - Hot Reload Test! 🔥</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Plateforme de formation culinaire avec guidage vocal et validation des compétences
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center text-primary">
                <Users className="h-6 w-6 mr-2" />
                Accès Sécurisé
              </CardTitle>
              <CardDescription>Connectez-vous pour accéder à votre interface personnalisée</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login">
                <Button className="w-full" size="lg">
                  Se connecter
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Formation Professionnelle</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Développez vos compétences culinaires avec notre système de formation interactif et obtenez une validation
            officielle de vos acquis.
          </p>
        </div>
      </div>
    </div>
  )
}
