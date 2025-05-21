
import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";
import { SpeechDifficultiesStep, SpeechDevelopmentQuestions } from "@/components/speech";
import { ChildCompletedView } from "@/components/children";
import { useRegistration, RegistrationStep } from "@/hooks/useRegistration";
import { AccountInfoForm, SubscriptionOptions, ProgressBar } from "@/components/registration";

export default function Register() {
  const { 
    fullName, setFullName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    subscriptionType, setSubscriptionType,
    error, isLoading,
    children, currentStep, 
    selectedChildIndex, setSelectedChildIndex,
    goToNextStep, goBack,
    handleSpeechDifficultiesSubmit,
    handleSpeechDevelopmentSubmit,
    addChild, removeChild, updateChildField,
    handleSubmit, currentChild,
    totalSteps
  } = useRegistration();

  return (
    <AuthLayout 
      title="Registracija" 
      subtitle="Ustvarite račun in začnite uporabljati aplikacijo."
      className="max-w-3xl"
    >
      <ProgressBar currentStep={currentStep + 1} totalSteps={totalSteps} />
      
      {/* Step 1: Subscription and Account Info */}
      {currentStep === RegistrationStep.SUBSCRIPTION_ACCOUNT_INFO && (
        <form onSubmit={goToNextStep} className="space-y-8">
          {error && !error.includes("otrok") && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Subscription Options */}
          <SubscriptionOptions 
            selectedOption={subscriptionType}
            onOptionChange={setSubscriptionType}
          />
          
          {/* Account Info */}
          <AccountInfoForm 
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
          />
          
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

      {/* Step 2: Child Information */}
      {currentStep === RegistrationStep.CHILD_INFO && (
        <div className="space-y-6">
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
            <h3 className="text-lg font-medium">Podatki o otrocih</h3>
          </div>
          
          <form onSubmit={goToNextStep} className="space-y-6">
            {error && error.includes("otrok") && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="p-6 border rounded-lg">
              <div className="space-y-6">
                <div>
                  <label htmlFor="child-name" className="block text-sm font-medium">
                    Ime otroka
                  </label>
                  <input
                    id="child-name"
                    value={currentChild.name}
                    onChange={(e) => updateChildField(currentChild.id, "name", e.target.value)}
                    placeholder="Vnesite ime otroka"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="birth-date" className="block text-sm font-medium">
                    Datum rojstva otroka
                  </label>
                  <Button
                    id="birth-date"
                    variant="outline"
                    onClick={() => {}}
                    className="w-full justify-start text-left font-normal"
                  >
                    {currentChild.birthDate 
                      ? new Date(currentChild.birthDate).toLocaleDateString('sl-SI') 
                      : "Izberite datum rojstva"}
                  </Button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Spol</label>
                  <div className="flex space-x-4">
                    {["M", "Ž", "N"].map(gender => (
                      <label key={gender} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={currentChild.gender === gender}
                          onChange={() => updateChildField(currentChild.id, "gender", gender)}
                          className="rounded-full"
                        />
                        <span>{gender === "N" ? "Ne želim izbrati" : gender}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Izberi avatarja</label>
                  <div className="grid grid-cols-4 gap-4 mt-3">
                    {/* Avatar selection grid here */}
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-dragon-green hover:bg-dragon-green/90 text-base font-medium py-6"
              disabled={isLoading}
            >
              Naprej
            </Button>
          </form>
        </div>
      )}

      {/* Step 3: Speech Difficulties */}
      {currentStep === RegistrationStep.SPEECH_DIFFICULTIES && (
        <div className="mt-4">
          <SpeechDifficultiesStep
            onBack={goBack}
            onSubmit={handleSpeechDifficultiesSubmit}
            childName={currentChild.name}
            initialDifficulties={currentChild.speechDifficulties}
            submitButtonText="Naprej"
            showDetailToggle={true}
          />
        </div>
      )}

      {/* Step 4: Speech Development Questions */}
      {currentStep === RegistrationStep.SPEECH_DEVELOPMENT && (
        <div className="mt-4">
          <SpeechDevelopmentQuestions
            onBack={goBack}
            onSubmit={handleSpeechDevelopmentSubmit}
            childName={currentChild.name}
            initialAnswers={currentChild.speechDevelopment}
          />
        </div>
      )}

      {/* Step 5: Review Child */}
      {currentStep === RegistrationStep.REVIEW_CHILD && (
        <div className="mt-4 space-y-6">
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
