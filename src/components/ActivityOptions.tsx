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
  return <>
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-dragon-green">MOJE APLIKACIJE</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        
        {/* Govorno-jezikovne vaje */}
        <Card className="transition-all duration-300 hover:shadow-lg rounded-3xl border-2 border-gray-200 cursor-pointer" onClick={handleGoToExercises}>
          <CardHeader className="bg-gradient-to-r from-app-blue/10 to-app-teal/10 rounded-t-3xl pb-4">
            <CardTitle className="text-lg font-semibold text-app-blue text-center">GOVORNO-JEZIKOVNE VAJE</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-4 text-center flex flex-col items-center gap-4">
            <div className="w-32 h-32 flex items-center justify-center">
              <img src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_vaje.png" alt="Zmajček vaje" className="w-full h-full object-contain" />
            </div>
            <p className="text-sm text-gray-600">Prilagojene aktivnosti za izboljšanje izgovorjave.</p>
          </CardContent>
          <CardFooter className="pb-6">
            <Button className="w-full bg-app-blue hover:bg-app-blue/90 rounded-2xl" onClick={e => {
            e.stopPropagation();
            handleGoToExercises();
          }}>POJDI NA VAJE</Button>
          </CardFooter>
        </Card>
        
        {/* Govorne igre */}
        <Card className="transition-all duration-300 hover:shadow-lg rounded-3xl border-2 border-gray-200 cursor-pointer" onClick={handleGoToGames}>
          <CardHeader className="bg-gradient-to-r from-dragon-green/10 to-dragon-green/10 rounded-t-3xl pb-4">
            <CardTitle className="text-lg font-semibold text-dragon-green text-center">GOVORNE IGRE</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-4 text-center flex flex-col items-center gap-4">
            <div className="w-32 h-32 flex items-center justify-center">
              <img src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_igre.png" alt="Zmajček igre" className="w-full h-full object-contain" />
            </div>
            <p className="text-sm text-gray-600">Zabavne igre za izboljšanje izgovorjave.</p>
          </CardContent>
          <CardFooter className="pb-6">
            <Button className="w-full bg-app-blue hover:bg-app-blue/90 rounded-2xl" onClick={e => {
            e.stopPropagation();
            handleGoToGames();
          }}>ZAČNI IGRO</Button>
          </CardFooter>
        </Card>
        
        {/* Artikulacijski test */}
        <Card className="transition-all duration-300 hover:shadow-lg rounded-3xl border-2 border-gray-200 h-full flex flex-col cursor-pointer" onClick={handleGoToArticulationTest}>
          <CardHeader className="bg-gradient-to-r from-app-purple/10 to-app-teal/10 rounded-t-3xl pb-4">
            <CardTitle className="text-lg font-semibold text-app-purple text-center">TEST IZGOVORJAVE</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-4 flex-grow text-center flex flex-col items-center gap-4">
            <div className="w-32 h-32 flex items-center justify-center">
              <img src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_artikulacija.png" alt="Zmajček artikulacija" className="w-full h-full object-contain" />
            </div>
            <p className="text-sm text-gray-600">Test izgovorjave za vse slovenske soglasnike.</p>
          </CardContent>
          <CardFooter className="pb-6">
            <Button className="w-full bg-[#9b87f5] hover:bg-[#8B5CF6] rounded-2xl" onClick={e => {
            e.stopPropagation();
            handleGoToArticulationTest();
          }}>ZAČNI TEST</Button>
          </CardFooter>
        </Card>
        
        {/* Moji izzivi */}
        <Card className="transition-all duration-300 hover:shadow-lg rounded-3xl border-2 border-gray-200 h-full flex flex-col cursor-pointer" onClick={handleGoToMyChallenges}>
          <CardHeader className="bg-gradient-to-r from-app-orange/10 to-app-yellow/10 rounded-t-3xl pb-4">
            <CardTitle className="text-lg font-semibold text-app-orange text-center">MOJI IZZIVI</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-4 flex-grow text-center flex flex-col items-center gap-4">
            <div className="w-32 h-32 flex items-center justify-center">
              <img src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_izzivi.png" alt="Zmajček izzivi" className="w-full h-full object-contain" />
            </div>
            <p className="text-sm text-gray-600">Priporočila pametnega asistenta.</p>
          </CardContent>
          <CardFooter className="pb-6">
            <Button className="w-full bg-app-orange hover:bg-app-orange/90 rounded-2xl" onClick={e => {
            e.stopPropagation();
            handleGoToMyChallenges();
          }}>PREVERI IZZIVE</Button>
          </CardFooter>
        </Card>
        
        {/* Video navodila */}
        <Card className="transition-all duration-300 hover:shadow-lg rounded-3xl border-2 border-gray-200 h-full flex flex-col cursor-pointer" onClick={handleGoToVideoInstructions}>
          <CardHeader className="bg-gradient-to-r from-app-teal/10 to-dragon-green/10 rounded-t-3xl pb-4">
            <CardTitle className="text-lg font-semibold text-app-teal text-center">VIDEO NAVODILA</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-4 flex-grow text-center flex flex-col items-center gap-4">
            <div className="w-32 h-32 flex items-center justify-center">
              <img src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_video.png" alt="Zmajček video" className="w-full h-full object-contain" />
            </div>
            <p className="text-sm text-gray-600">Poglej kako logoped pravilno izgovori posamezne črke.</p>
          </CardContent>
          <CardFooter className="pb-6">
            <Button className="w-full bg-app-teal hover:bg-app-teal/90 rounded-2xl" onClick={e => {
            e.stopPropagation();
            handleGoToVideoInstructions();
          }}>POGLEJ VIDEO</Button>
          </CardFooter>
        </Card>
      </div>
    </>;
}