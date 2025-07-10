import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const VajeMoториkeGovoril = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const supabaseUrl = "https://ecmtctwovkheohqwahvt.supabase.co";
  const bucketName = "slike-vaje-motorike-govoril";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-4xl mx-auto pt-8 pb-20 px-4">
        <p className="text-muted-foreground mb-8 text-center">
          Vaje motorike govoril so namenjene razgibavanju govoril – ust, ustnic in jezika.
        </p>
        
        <div className="space-y-8">
          {/* First Image */}
          <div className="text-center">
            <img 
              src={`${supabaseUrl}/storage/v1/object/public/${bucketName}/nasmeh.jpg?v=${Date.now()}`}
              alt="Nasmehni se"
              className="w-full max-w-2xl mx-auto rounded-2xl shadow-lg"
              loading="eager"
              decoding="async"
              onError={(e) => {
                console.error('Failed to load first image:', e.currentTarget.src);
                console.error('User agent:', navigator.userAgent);
                e.currentTarget.style.border = '2px solid red';
                e.currentTarget.style.background = 'lightgray';
              }}
              onLoad={() => console.log('First image loaded successfully')}
            />
            <p className="text-lg font-medium text-gray-700 mt-4">Nasmehni se</p>
          </div>

          {/* Second Image */}
          <div className="text-center">
            <img 
              src={`${supabaseUrl}/storage/v1/object/public/${bucketName}/nasmeh-zobje.jpg?v=${Date.now()}`}
              alt="Nasmehni se in pokaži zobe"
              className="w-full max-w-2xl mx-auto rounded-2xl shadow-lg"
              loading="eager"
              decoding="async"
              onError={(e) => {
                console.error('Failed to load second image:', e.currentTarget.src);
                console.error('User agent:', navigator.userAgent);
                e.currentTarget.style.border = '2px solid red';
                e.currentTarget.style.background = 'lightgray';
              }}
              onLoad={() => console.log('Second image loaded successfully')}
            />
            <p className="text-lg font-medium text-gray-700 mt-4">Nasmehni se in pokaži zobe</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VajeMoториkeGovoril;