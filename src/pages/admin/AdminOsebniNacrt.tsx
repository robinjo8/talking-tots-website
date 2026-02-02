import { useParams } from "react-router-dom";
import { AdminGameWrapper } from "@/components/admin/games/AdminGameWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { useLogopedistChild } from "@/hooks/useLogopedistChildren";

export default function AdminOsebniNacrt() {
  const { childId } = useParams<{ childId: string }>();
  const { data: child } = useLogopedistChild(childId);

  return (
    <AdminGameWrapper 
      title="Moj osebni načrt"
      backPath={`/admin/children/${childId}/workspace`}
    >
      <div className="max-w-3xl mx-auto">
        <Card className="transition-all duration-300 rounded-2xl border-2 border-gray-200 h-full flex flex-col">
          <CardHeader className="bg-gradient-to-r from-app-orange/10 to-app-yellow/10 rounded-t-2xl pb-4">
            <CardTitle className="text-xl flex items-center justify-center gap-2 text-center">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                <Zap className="h-6 w-6 text-app-orange" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-4 flex-grow text-center">
            <h3 className="text-lg font-semibold mb-2 text-app-orange">
              Osebni načrt {child ? `za ${child.name}` : ''}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Tukaj boš našel osebni načrt za vadbo govora!
            </p>
            
            <div className="bg-gray-50 rounded-xl p-6 text-left">
              <h4 className="font-semibold text-gray-800 mb-3">Priporočene aktivnosti:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-dragon-green">✓</span>
                  Vaje motorike govoril
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-dragon-green">✓</span>
                  Igre za utrjevanje izgovorjave
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-dragon-green">✓</span>
                  Video navodila za pravilno artikulacijo
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminGameWrapper>
  );
}
