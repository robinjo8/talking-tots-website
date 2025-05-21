
import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";
import { SpeechDifficultiesStep } from "@/components/SpeechDifficultiesStep";
import { SpeechDevelopmentQuestions } from "@/components/SpeechDevelopmentQuestions";
import { ChildCompletedView } from "@/components/children";
import { useRegistration, RegistrationStep } from "@/hooks/useRegistration";
import { AccountInfoForm, ChildInformationForm } from "@/components/registration";

export default function Register() {
  const { 
    username, setUsername,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    error, isLoading,
    children, currentStep, 
    selectedChildIndex, setSelectedChildIndex,
    goToNextStep, goBack,
    handleSpeechDifficultiesSubmit,
    handleSpeechDevelopmentSubmit,
    addChild, removeChild, updateChildField,
    handleSubmit, currentChild
  } = useRegistration();

  return (
    <AuthLayout 
      title="Ustvarite račun" 
      subtitle="Registrirajte se in začnite uporabljati aplikacijo."
    >
      {currentStep === RegistrationStep.ACCOUNT_INFO && (
        <form onSubmit={goToNextStep} className="mt-8 space-y-6">
          {error && !error.includes("otrok") && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <AccountInfoForm 
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
          />
          
          <ChildInformationForm 
            children={children}
            selectedChildIndex={selectedChildIndex}
            setSelectedChildIndex={setSelectedChildIndex}
            removeChild={removeChild}
            updateChildField={updateChildField}
            error={error}
          />
          
          {children.some(child => child.isComplete) && (
            <Button
              type="button"
              variant="outline"
              onClick={addChild}
              className="mt-4 border-dragon-green text-dragon-green hover:bg-dragon-green/10 w-full"
            >
              Dodaj otroka
            </Button>
          )}
          
          <Button
            type="submit"
            className="w-full bg-dragon-green hover:bg-dragon-green/90 text-base font-medium py-6"
            disabled={isLoading}
          >
            Naprej
          </Button>
          
          <div className="text-sm text-center">
            Že imate račun?{" "}
            <Link to="/login" className="text-dragon-green hover:underline font-medium">
              Prijavite se
            </Link>
          </div>
        </form>
      )}

      {currentStep === RegistrationStep.SPEECH_DIFFICULTIES && (
        <div className="mt-8">
          <SpeechDifficultiesStep
            onBack={goBack}
            onSubmit={handleSpeechDifficultiesSubmit}
            childName={currentChild.name}
            initialDifficulties={currentChild.speechDifficulties}
            submitButtonText="Naprej"
          />
        </div>
      )}

      {currentStep === RegistrationStep.SPEECH_DEVELOPMENT && (
        <div className="mt-8">
          <SpeechDevelopmentQuestions
            onBack={goBack}
            onSubmit={handleSpeechDevelopmentSubmit}
            childName={currentChild.name}
            initialAnswers={currentChild.speechDevelopment}
          />
        </div>
      )}

      {currentStep === RegistrationStep.REVIEW_CHILD && (
        <div className="mt-8 space-y-6">
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={goBack}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Nazaj
            </Button>
            <h3 className="text-lg font-medium">Pregled profila za {currentChild.name}</h3>
          </div>
          
          <ChildCompletedView 
            child={currentChild} 
            onAddNewChild={addChild} 
            onClose={handleSubmit} 
          />
        </div>
      )}
    </AuthLayout>
  );
}
