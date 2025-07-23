import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
export function ActivityOptions() {
  const navigate = useNavigate();
  const handleGoToExercises = () => {
    navigate("/govorno-jezikovne-vaje");
  };
  const handleGoToGames = () => {
    navigate("/govorne-igre");
  };
  const handleGoToArticulationTest = () => {
    navigate("/artikulacijski-test");
  };
  const handleGoToMyChallenges = () => {
    navigate("/moji-izzivi");
  };
  const handleGoToVideoInstructions = () => {
    navigate("/video-navodila");
  };

  const handleGoToLogopedskiKoticek = () => {
    navigate("/logopedski-koticek");
  };
  return <>
      
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-12">
        
        {/* Govorno-jezikovne vaje */}
        <Card className="transition-all duration-300 hover:shadow-lg rounded-3xl border-2 border-gray-200 h-full flex flex-col cursor-pointer" onClick={handleGoToExercises}>
          <CardHeader className="bg-gradient-to-r from-app-blue/10 to-app-teal/10 rounded-t-3xl pb-2 md:pb-4">
            <CardTitle className="text-sm md:text-lg font-semibold text-app-blue text-center whitespace-nowrap">GOVORNE VAJE</CardTitle>
          </CardHeader>
          <CardContent className="pt-3 md:pt-6 pb-2 md:pb-4 flex-grow text-center flex flex-col items-center justify-between gap-2 md:gap-4">
            <div className="w-20 h-20 md:w-40 md:h-40 flex items-center justify-center">
              <img src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_vaje.png" alt="Zmajček vaje" className="w-full h-full object-contain" />
            </div>
            <p className="text-xs md:text-sm text-gray-600 leading-tight">Prilagojene aktivnosti za izboljšanje izgovorjave.</p>
          </CardContent>
          <CardFooter className="pb-3 md:pb-6 mt-auto">
            <Button className="w-full bg-app-blue hover:bg-app-blue/90 rounded-2xl text-xs md:text-sm py-2 md:py-3" onClick={e => {
            e.stopPropagation();
            handleGoToExercises();
          }}>POJDI NA VAJE</Button>
          </CardFooter>
        </Card>
        
        {/* Govorne igre */}
        <Card className="transition-all duration-300 hover:shadow-lg rounded-3xl border-2 border-gray-200 h-full flex flex-col cursor-pointer" onClick={handleGoToGames}>
          <CardHeader className="bg-gradient-to-r from-dragon-green/10 to-dragon-green/10 rounded-t-3xl pb-2 md:pb-4">
            <CardTitle className="text-sm md:text-lg font-semibold text-dragon-green text-center whitespace-nowrap">GOVORNE IGRE</CardTitle>
          </CardHeader>
          <CardContent className="pt-3 md:pt-6 pb-2 md:pb-4 flex-grow text-center flex flex-col items-center justify-between gap-2 md:gap-4">
            <div className="w-20 h-20 md:w-40 md:h-40 flex items-center justify-center">
              <img src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_igre.png" alt="Zmajček igre" className="w-full h-full object-contain" />
            </div>
            <p className="text-xs md:text-sm text-gray-600 leading-tight">Zabavne igre za izboljšanje izgovorjave.</p>
          </CardContent>
          <CardFooter className="pb-3 md:pb-6 mt-auto">
            <Button className="w-full bg-dragon-green hover:bg-dragon-green/90 rounded-2xl text-xs md:text-sm py-2 md:py-3" onClick={e => {
            e.stopPropagation();
            handleGoToGames();
          }}>ZAČNI IGRO</Button>
          </CardFooter>
        </Card>
        
        {/* Artikulacijski test */}
        <Card className="transition-all duration-300 hover:shadow-lg rounded-3xl border-2 border-gray-200 h-full flex flex-col cursor-pointer" onClick={handleGoToArticulationTest}>
          <CardHeader className="bg-gradient-to-r from-app-purple/10 to-app-teal/10 rounded-t-3xl pb-2 md:pb-4">
            <CardTitle className="text-sm md:text-lg font-semibold text-app-purple text-center whitespace-nowrap">TEST IZGOVORJAVE</CardTitle>
          </CardHeader>
          <CardContent className="pt-3 md:pt-6 pb-2 md:pb-4 flex-grow text-center flex flex-col items-center justify-between gap-2 md:gap-4">
            <div className="w-20 h-20 md:w-40 md:h-40 flex items-center justify-center">
              <img src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_artikulacija.png" alt="Zmajček artikulacija" className="w-full h-full object-contain" />
            </div>
            <p className="text-xs md:text-sm text-gray-600 leading-tight">Test izgovorjave za vse slovenske soglasnike.</p>
          </CardContent>
          <CardFooter className="pb-3 md:pb-6 mt-auto">
            <Button className="w-full bg-[#9b87f5] hover:bg-[#8B5CF6] rounded-2xl text-xs md:text-sm py-2 md:py-3" onClick={e => {
            e.stopPropagation();
            handleGoToArticulationTest();
          }}>ZAČNI TEST</Button>
          </CardFooter>
        </Card>
        
        {/* Moji izzivi */}
        <Card className="transition-all duration-300 hover:shadow-lg rounded-3xl border-2 border-gray-200 h-full flex flex-col cursor-pointer" onClick={handleGoToMyChallenges}>
          <CardHeader className="bg-gradient-to-r from-app-orange/10 to-app-yellow/10 rounded-t-3xl pb-2 md:pb-4">
            <CardTitle className="text-sm md:text-lg font-semibold text-app-orange text-center whitespace-nowrap">MOJI IZZIVI</CardTitle>
          </CardHeader>
          <CardContent className="pt-3 md:pt-6 pb-2 md:pb-4 flex-grow text-center flex flex-col items-center justify-between gap-2 md:gap-4">
            <div className="w-20 h-20 md:w-40 md:h-40 flex items-center justify-center">
              <img src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_izzivi.png" alt="Zmajček izzivi" className="w-full h-full object-contain" />
            </div>
            <p className="text-xs md:text-sm text-gray-600 leading-tight">Priporočila pametnega asistenta.</p>
          </CardContent>
          <CardFooter className="pb-3 md:pb-6 mt-auto">
            <Button className="w-full bg-app-orange hover:bg-app-orange/90 rounded-2xl text-xs md:text-sm py-2 md:py-3" onClick={e => {
            e.stopPropagation();
            handleGoToMyChallenges();
          }}>PREVERI IZZIVE</Button>
          </CardFooter>
        </Card>
        
        {/* Video navodila */}
        <Card className="transition-all duration-300 hover:shadow-lg rounded-3xl border-2 border-gray-200 h-full flex flex-col cursor-pointer" onClick={handleGoToVideoInstructions}>
          <CardHeader className="bg-gradient-to-r from-app-teal/10 to-dragon-green/10 rounded-t-3xl pb-2 md:pb-4">
            <CardTitle className="text-sm md:text-lg font-semibold text-app-teal text-center whitespace-nowrap">VIDEO NAVODILA</CardTitle>
          </CardHeader>
          <CardContent className="pt-3 md:pt-6 pb-2 md:pb-4 flex-grow text-center flex flex-col items-center justify-between gap-2 md:gap-4">
            <div className="w-20 h-20 md:w-40 md:h-40 flex items-center justify-center">
              <img src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_video.png" alt="Zmajček video" className="w-full h-full object-contain" />
            </div>
            <p className="text-xs md:text-sm text-gray-600 leading-tight">Poglej kako logoped pravilno izgovori posamezne črke.</p>
          </CardContent>
          <CardFooter className="pb-3 md:pb-6 mt-auto">
            <Button className="w-full bg-app-teal hover:bg-app-teal/90 rounded-2xl text-xs md:text-sm py-2 md:py-3" onClick={e => {
            e.stopPropagation();
            handleGoToVideoInstructions();
          }}>POGLEJ VIDEO</Button>
          </CardFooter>
        </Card>
        
        {/* Logopedski nasveti */}
        <Card className="transition-all duration-300 hover:shadow-lg rounded-3xl border-2 border-gray-200 h-full flex flex-col cursor-pointer" onClick={handleGoToLogopedskiKoticek}>
          <CardHeader className="bg-gradient-to-r from-app-purple/10 to-app-blue/10 rounded-t-3xl pb-2 md:pb-4">
            <CardTitle className="text-sm md:text-lg font-semibold text-app-purple text-center whitespace-nowrap">LOGOPEDSKI NASVETI</CardTitle>
          </CardHeader>
          <CardContent className="pt-3 md:pt-6 pb-2 md:pb-4 flex-grow text-center flex flex-col items-center justify-between gap-2 md:gap-4">
            <div className="w-20 h-20 md:w-40 md:h-40 flex items-center justify-center">
              <img src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_logoped.png" alt="Zmajček logoped" className="w-full h-full object-contain" />
            </div>
            <p className="text-xs md:text-sm text-gray-600 leading-tight">Koristni nasveti in informacije o govornem razvoju.</p>
          </CardContent>
          <CardFooter className="pb-3 md:pb-6 mt-auto">
            <Button className="w-full bg-[#9b87f5] hover:bg-[#8B5CF6] rounded-2xl text-xs md:text-sm py-2 md:py-3" onClick={e => {
            e.stopPropagation();
            handleGoToLogopedskiKoticek();
          }}>PREBERI NASVETE</Button>
          </CardFooter>
        </Card>
      </div>
    </>;
}