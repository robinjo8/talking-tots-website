import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
import { AppLayout } from "@/components/AppLayout";

const RazvojGovora = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <Header />
      <PageHeader 
        title="Razvoj govora" 
        backPath="/logopedski-koticek"
      />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-card rounded-2xl shadow-sm border-2 border-gray-200 overflow-hidden">
          <div className="w-full" style={{ height: 'calc(100vh - 240px)', minHeight: '600px' }}>
            <iframe
              src="/clanki/razvoj-govora.pdf"
              className="w-full h-full"
              title="Razvoj govora"
            />
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <a 
            href="/clanki/razvoj-govora.pdf" 
            download="Razvoj_govora.pdf"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Prenesi PDF
          </a>
        </div>
      </div>
    </AppLayout>
  );
};

export default RazvojGovora;
