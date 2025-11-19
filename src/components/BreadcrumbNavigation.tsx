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
  parent?: string; // Parent path for hierarchy
}

// Hierarchical breadcrumb configuration
const breadcrumbConfig: BreadcrumbConfig[] = [
  { path: "/", label: "Domov" },
  { path: "/moja-stran", label: "Moja stran", parent: "/" },
  { path: "/moje-aplikacije", label: "Moje aplikacije", parent: "/" },
  { path: "/profile", label: "Nastavitve", parent: "/" },
  { path: "/moji-izzivi", label: "Moji izzivi", parent: "/" },
  { path: "/logopedski-koticek", label: "Logopedski nasveti", parent: "/" },
  { path: "/razvoj-govora", label: "Razvoj govora", parent: "/logopedski-koticek" },
  { path: "/clanki/razvoj-govora", label: "Razvoj govora", parent: "/logopedski-koticek" },
  
  // Govorne igre hierarchy
  { path: "/govorne-igre", label: "Govorne igre", parent: "/moje-aplikacije" },
  { path: "/govorne-igre/spomin", label: "Spomin", parent: "/govorne-igre" },
  { path: "/govorne-igre/labirint", label: "Labirint", parent: "/govorne-igre" },
  { path: "/govorne-igre/sestavljanke", label: "Sestavljanke", parent: "/govorne-igre" },
  { path: "/govorne-igre/drsna-sestavljanka", label: "Drsna sestavljanka", parent: "/govorne-igre" },
  { path: "/govorne-igre/igra-ujemanja", label: "Igra ujemanja", parent: "/govorne-igre" },
  
  // Govorno-jezikovne vaje hierarchy
  { path: "/govornojezicovne-vaje", label: "Govorno-jezikovne vaje", parent: "/moje-aplikacije" },
  { path: "/govorno-jezikovne-vaje", label: "Govorno-jezikovne vaje", parent: "/moje-aplikacije" },
  { path: "/vaje-motorike-govoril", label: "Vaje motorike govoril", parent: "/govorno-jezikovne-vaje" },
  { path: "/govorno-jezikovne-vaje/vaje-motorike-govoril", label: "Vaje motorike govoril", parent: "/govorno-jezikovne-vaje" },
  { path: "/vaje-za-jezik", label: "Vaje za jezik", parent: "/govorno-jezikovne-vaje" },
  
  // Video navodila hierarchy
  { path: "/video-navodila", label: "Video navodila", parent: "/moje-aplikacije" },
  { path: "/video-navodila/crka-c", label: "Crka C", parent: "/video-navodila" },
  { path: "/video-navodila/crka-k", label: "Crka K", parent: "/video-navodila" },
  { path: "/video-navodila/crka-l", label: "Crka L", parent: "/video-navodila" },
  { path: "/video-navodila/crka-r", label: "Crka R", parent: "/video-navodila" },
  { path: "/video-navodila/crka-s", label: "Crka S", parent: "/video-navodila" },
  { path: "/video-navodila/crka-z", label: "Crka Z", parent: "/video-navodila" },
  { path: "/video-navodila/crka-č", label: "Crka Č", parent: "/video-navodila" },
  { path: "/video-navodila/crka-š", label: "Crka Š", parent: "/video-navodila" },
  { path: "/video-navodila/crka-ž", label: "Crka Ž", parent: "/video-navodila" },
  
  // Artikulacija vaje
  { path: "/artikulacija-vaje", label: "Artikulacija vaje", parent: "/moje-aplikacije" },
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

  // Build hierarchical breadcrumb path
  const buildBreadcrumbPath = (path: string): BreadcrumbConfig[] => {
    const pathConfig = breadcrumbConfig.find(config => config.path === path);
    if (!pathConfig) return [];
    
    if (pathConfig.parent) {
      return [...buildBreadcrumbPath(pathConfig.parent), pathConfig];
    }
    
    return [pathConfig];
  };

  // Find the best matching config for current path
  let currentPageConfig = breadcrumbConfig.find(config => config.path === currentPath);
  
  // If exact match not found, try to find the longest matching path
  if (!currentPageConfig) {
    const matchingConfigs = breadcrumbConfig.filter(config => 
      currentPath.startsWith(config.path) && config.path !== "/"
    );
    
    if (matchingConfigs.length > 0) {
      // Sort by path length to get the most specific match
      matchingConfigs.sort((a, b) => b.path.length - a.path.length);
      currentPageConfig = matchingConfigs[0];
    }
  }

  if (!currentPageConfig || currentPageConfig.path === "/") {
    return null;
  }

  // Build the full hierarchical path
  const breadcrumbItems = buildBreadcrumbPath(currentPageConfig.path);

  // If we only have home or nothing, don't show breadcrumb
  if (breadcrumbItems.length === 0 || (breadcrumbItems.length === 1 && breadcrumbItems[0].path === "/")) {
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
