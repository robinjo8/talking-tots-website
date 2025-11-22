const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Clean green mesh gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(122,39%,96%)] via-[hsl(142,50%,90%)] to-[hsl(122,39%,85%)]" />
      
      {/* Subtle animated green circles */}
      <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-[hsl(122,39%,49%)]/8 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-[60%] right-[8%] w-[500px] h-[500px] bg-[hsl(142,50%,60%)]/6 rounded-full blur-3xl" />
      <div className="absolute bottom-[15%] left-[20%] w-80 h-80 bg-[hsl(122,39%,49%)]/10 rounded-full blur-3xl" />
      <div className="absolute top-[40%] right-[35%] w-64 h-64 bg-[hsl(142,50%,70%)]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[30%] right-[15%] w-72 h-72 bg-[hsl(122,39%,49%)]/7 rounded-full blur-3xl" />
    </div>
  );
};

export default AnimatedBackground;
