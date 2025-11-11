const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-orange-50" />
      
      {/* Floating shapes */}
      <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-green-400/20 rounded-full blur-3xl" />
      <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-blue-400/15 rounded-full blur-3xl" />
      <div className="absolute bottom-[15%] left-[15%] w-80 h-80 bg-orange-400/25 rounded-full blur-3xl" />
      <div className="absolute top-[60%] right-[5%] w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[30%] left-[40%] w-56 h-56 bg-green-300/15 rounded-full blur-3xl" />
      <div className="absolute top-[40%] left-[25%] w-48 h-48 bg-blue-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[40%] right-[30%] w-64 h-64 bg-orange-300/18 rounded-full blur-3xl" />
      <div className="absolute top-[75%] right-[20%] w-52 h-52 bg-yellow-300/15 rounded-full blur-3xl" />
      <div className="absolute top-[5%] left-[50%] w-60 h-60 bg-green-500/12 rounded-full blur-3xl" />
      <div className="absolute bottom-[10%] right-[45%] w-72 h-72 bg-blue-500/18 rounded-full blur-3xl" />
    </div>
  );
};

export default AnimatedBackground;
