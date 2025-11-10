import { FeaturesCarousel } from "@/components/FeaturesCarousel";
export const FeaturesSection = () => {
  return <section id="features" className="relative py-10 md:py-20 px-4 md:px-[40px] bg-dragon-green w-full overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180" style={{
      height: '80px'
    }}>
        <svg className="relative block w-full" style={{
        height: '80px'
      }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#4CAF50" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]" style={{
      height: '80px'
    }}>
        <svg className="relative block w-full" style={{
        height: '80px'
      }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#4CAF50" />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Kako deluje TomiTalk?</h2>
        </div>
        
        <FeaturesCarousel />
      </div>
    </section>;
};