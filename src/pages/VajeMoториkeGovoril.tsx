import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { SequentialExerciseGrid } from "@/components/exercises/SequentialExerciseGrid";

const VajeMoториkeGovoril = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-6xl mx-auto pt-20 md:pt-24 pb-20 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Vaje motorike govoril</h1>
        <SequentialExerciseGrid />
      </div>
    </div>
  );
};

export default VajeMoториkeGovoril;