import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Loader2, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"

export function SignupForm({ className, ...props }: React.ComponentProps<"form">) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'client'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  
  const { register, error, clearError } = useAuth()
  const router = useRouter()

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'Le prénom est requis'
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Le nom de famille est requis'
    }
    
    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format d\'email invalide'
    }
    
    if (!formData.password) {
      errors.password = 'Le mot de passe est requis'
    } else if (formData.password.length < 8) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères'
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const success = await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.userType === 'business' ? `${formData.firstName.toLowerCase()}_${formData.lastName.toLowerCase()}` : undefined
      })
      
      if (success) {
        router.push('/dashboard')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="green-gradient w-16 h-16 rounded-full flex items-center justify-center mb-4 green-shadow">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Créer un compte</h1>
        <p className="text-gray-600 text-sm text-balance max-w-sm">
          Rejoignez notre plateforme agricole et commencez votre voyage
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 text-sm">{error.message}</span>
        </div>
      )}

      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName" className="text-gray-700 font-medium">
              Prénom *
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Jean"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={cn(
                "border-gray-200 focus:border-green-500 focus:ring-green-500",
                validationErrors.firstName && "border-red-300 focus:border-red-500 focus:ring-red-500"
              )}
              required
            />
            {validationErrors.firstName && (
              <span className="text-red-500 text-xs">{validationErrors.firstName}</span>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="lastName" className="text-gray-700 font-medium">
              Nom de famille *
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Dupont"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={cn(
                "border-gray-200 focus:border-green-500 focus:ring-green-500",
                validationErrors.lastName && "border-red-300 focus:border-red-500 focus:ring-red-500"
              )}
              required
            />
            {validationErrors.lastName && (
              <span className="text-red-500 text-xs">{validationErrors.lastName}</span>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className="text-gray-700 font-medium">
            Adresse email *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="jean.dupont@exemple.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={cn(
              "border-gray-200 focus:border-green-500 focus:ring-green-500",
              validationErrors.email && "border-red-300 focus:border-red-500 focus:ring-red-500"
            )}
            required
          />
          {validationErrors.email && (
            <span className="text-red-500 text-xs">{validationErrors.email}</span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password" className="text-gray-700 font-medium">
            Mot de passe *
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={cn(
                "pr-10 border-gray-200 focus:border-green-500 focus:ring-green-500",
                validationErrors.password && "border-red-300 focus:border-red-500 focus:ring-red-500"
              )}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {validationErrors.password && (
            <span className="text-red-500 text-xs">{validationErrors.password}</span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirm-password" className="text-gray-700 font-medium">
            Confirmer le mot de passe *
          </Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={cn(
                "pr-10 border-gray-200 focus:border-green-500 focus:ring-green-500",
                validationErrors.confirmPassword && "border-red-300 focus:border-red-500 focus:ring-red-500"
              )}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <span className="text-red-500 text-xs">{validationErrors.confirmPassword}</span>
          )}
        </div>

        {/*<div className="grid gap-2">
          <Label htmlFor="user-type" className="text-gray-700 font-medium">
            Comment allez-vous utiliser notre plateforme ? *
          </Label>
          <Select 
            value={formData.userType} 
            onValueChange={(value) => handleInputChange('userType', value)}
            required
          >
            <SelectTrigger className="border-gray-200 focus:border-green-500 focus:ring-green-500">
              <SelectValue placeholder="Sélectionnez votre objectif" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client">
                Client - Consulter et acheter nos produits et services
              </SelectItem>
              <SelectItem value="business">
                Entreprise - Vendre des produits agricoles
              </SelectItem>
            </SelectContent>
          </Select>
        </div>*/}

        <Button 
          type="submit" 
          className="w-full green-gradient text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-all duration-200 green-shadow"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Création du compte...
            </>
          ) : (
            'Créer mon compte'
          )}
        </Button>

        <div className="relative text-center text-sm">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Ou continuer avec</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full bg-white border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          S'inscrire avec Google
        </Button>
      </div>

      <div className="text-center text-sm text-gray-600">
        Vous avez déjà un compte ?{" "}
        <Link href="/login" className="text-green-600 hover:text-green-700 font-medium underline underline-offset-4">
          Se connecter
        </Link>
      </div>
    </form>
  )
}
