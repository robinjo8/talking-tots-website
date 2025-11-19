import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbConfig {
  path: string;
  label: string;
  matchExact?: boolean;
}

const breadcrumbConfig: BreadcrumbConfig[] = [
  { path: "/", label: "Domov", matchExact: true },
  { path: "/moja-stran", label: "Moja stran" },
  { path: "/moje-aplikacije", label: "Moje aplikacije" },
  { path: "/logopedski-koticek", label: "Logopedski nasveti" },
  { path: "/razvoj-govora", label: "Razvoj govora" },
  { path: "/clanki/razvoj-govora", label: "Razvoj govora" },
  { path: "/profile", label: "Nastavitve" },
  { path: "/govornojezicovne-vaje", label: "Govorno-jezikovne vaje" },
  { path: "/govorno-jezikovne-vaje", label: "Govorno-jezikovne vaje" },
  { path: "/vaje-motorike-govoril", label: "Vaje motorike govoril" },
  { path: "/govorno-jezikovne-vaje/vaje-motorike-govoril", label: "Vaje motorike govoril" },
  { path: "/vaje-za-jezik", label: "Vaje za jezik" },
  { path: "/govorne-igre", label: "Govorne igre", matchExact: true },
  { path: "/moji-izzivi", label: "Moji izzivi" },
  { path: "/video-navodila", label: "Video navodila", matchExact: true },
];

// Paths where breadcrumb should NOT be shown (games and their subpages)
const excludedPaths = [
  "/spomin/",
  "/labirint/",
  "/sestavljanke/",
  "/drsna-sestavljanka/",
  "/igra-ujemanja/",
  "/artikulacija-vaje/",
  "/vaje-za-jezik",
  "/artikulacijski-test",
  "/video-navodila/crka-",
  "/art-izgovorjava",
];

export function BreadcrumbNavigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Don't show breadcrumb on excluded paths
  if (excludedPaths.some(excluded => currentPath.includes(excluded))) {
    return null;
  }

  // Don't show breadcrumb on home page
  if (currentPath === "/") {
    return null;
  }

  // Find matching breadcrumb items for current path
  const breadcrumbItems: BreadcrumbConfig[] = [
    { path: "/", label: "Domov", matchExact: true }
  ];

  // Find the current page config
  const currentPageConfig = breadcrumbConfig.find(config => {
    if (config.matchExact) {
      return config.path === currentPath;
    }
    return currentPath.startsWith(config.path);
  });

  if (currentPageConfig && currentPageConfig.path !== "/") {
    breadcrumbItems.push(currentPageConfig);
  }

  // If we only have home, don't show breadcrumb
  if (breadcrumbItems.length === 1) {
    return null;
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 pt-2 pb-1">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.path}>
              <BreadcrumbItem>
                {index === breadcrumbItems.length - 1 ? (
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    {index === 0 && <Home className="h-4 w-4" />}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.path} className="flex items-center gap-1.5">
                      {index === 0 && <Home className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
