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
  { path: "/clanki/motorika-govoril", label: "Motorika govoril", parent: "/logopedski-koticek" },
  { path: "/clanki/pogosta-vprasanja", label: "Pogosta vprašanja", parent: "/logopedski-koticek" },
  
  // Govorne igre hierarchy
  { path: "/govorne-igre", label: "Govorne igre", parent: "/moje-aplikacije" },
  
  // Spomin
  { path: "/govorne-igre/spomin", label: "Spomin", parent: "/govorne-igre" },
  { path: "/govorne-igre/spomin/spomin-c", label: "C", parent: "/govorne-igre/spomin" },
  { path: "/govorne-igre/spomin/spomin-č", label: "Č", parent: "/govorne-igre/spomin" },
  { path: "/govorne-igre/spomin/spomin-k", label: "K", parent: "/govorne-igre/spomin" },
  { path: "/govorne-igre/spomin/spomin-l", label: "L", parent: "/govorne-igre/spomin" },
  { path: "/govorne-igre/spomin/spomin-r", label: "R", parent: "/govorne-igre/spomin" },
  { path: "/govorne-igre/spomin/spomin-s", label: "S", parent: "/govorne-igre/spomin" },
  { path: "/govorne-igre/spomin/spomin-š", label: "Š", parent: "/govorne-igre/spomin" },
  { path: "/govorne-igre/spomin/spomin-z", label: "Z", parent: "/govorne-igre/spomin" },
  { path: "/govorne-igre/spomin/spomin-ž", label: "Ž", parent: "/govorne-igre/spomin" },
  
  // Labirint
  { path: "/govorne-igre/labirint", label: "Labirint", parent: "/govorne-igre" },
  { path: "/govorne-igre/labirint/c", label: "C", parent: "/govorne-igre/labirint" },
  
  // Sestavljanke
  { path: "/govorne-igre/sestavljanke", label: "Sestavljanke", parent: "/govorne-igre" },
  
  // Drsna igra
  { path: "/govorne-igre/drsna-sestavljanka", label: "Drsna igra", parent: "/govorne-igre" },
  
  // Igra ujemanja
  { path: "/govorne-igre/igra-ujemanja", label: "Igra ujemanja", parent: "/govorne-igre" },
  
  // Zaporedja
  { path: "/govorne-igre/zaporedja", label: "Zaporedja", parent: "/govorne-igre" },
  { path: "/govorne-igre/zaporedja/c", label: "C", parent: "/govorne-igre/zaporedja" },
  
  // Kolo besed
  { path: "/govorne-igre/kolo-srece", label: "Kolo besed", parent: "/govorne-igre" },
  { path: "/govorne-igre/kolo-srece/c", label: "C", parent: "/govorne-igre/kolo-srece" },
  { path: "/govorne-igre/kolo-srece/ch", label: "Č", parent: "/govorne-igre/kolo-srece" },
  { path: "/govorne-igre/kolo-srece/k", label: "K", parent: "/govorne-igre/kolo-srece" },
  { path: "/govorne-igre/kolo-srece/l", label: "L", parent: "/govorne-igre/kolo-srece" },
  { path: "/govorne-igre/kolo-srece/r", label: "R", parent: "/govorne-igre/kolo-srece" },
  { path: "/govorne-igre/kolo-srece/s", label: "S", parent: "/govorne-igre/kolo-srece" },
  { path: "/govorne-igre/kolo-srece/sh", label: "Š", parent: "/govorne-igre/kolo-srece" },
  { path: "/govorne-igre/kolo-srece/z", label: "Z", parent: "/govorne-igre/kolo-srece" },
  { path: "/govorne-igre/kolo-srece/zh", label: "Ž", parent: "/govorne-igre/kolo-srece" },
  
  // Smešne povedi (Met kocke)
  { path: "/govorne-igre/met-kocke", label: "Smešne povedi", parent: "/govorne-igre" },
  { path: "/govorne-igre/met-kocke/c", label: "C", parent: "/govorne-igre/met-kocke" },
  { path: "/govorne-igre/met-kocke/ch", label: "Č", parent: "/govorne-igre/met-kocke" },
  { path: "/govorne-igre/met-kocke/k", label: "K", parent: "/govorne-igre/met-kocke" },
  { path: "/govorne-igre/met-kocke/l", label: "L", parent: "/govorne-igre/met-kocke" },
  { path: "/govorne-igre/met-kocke/r", label: "R", parent: "/govorne-igre/met-kocke" },
  { path: "/govorne-igre/met-kocke/s", label: "S", parent: "/govorne-igre/met-kocke" },
  { path: "/govorne-igre/met-kocke/sh", label: "Š", parent: "/govorne-igre/met-kocke" },
  { path: "/govorne-igre/met-kocke/z", label: "Z", parent: "/govorne-igre/met-kocke" },
  { path: "/govorne-igre/met-kocke/zh", label: "Ž", parent: "/govorne-igre/met-kocke" },
  
  // Ponovi poved
  { path: "/govorne-igre/ponovi-poved", label: "Ponovi poved", parent: "/govorne-igre" },
  { path: "/govorne-igre/ponovi-poved/c", label: "C", parent: "/govorne-igre/ponovi-poved" },
  { path: "/govorne-igre/ponovi-poved/ch", label: "Č", parent: "/govorne-igre/ponovi-poved" },
  { path: "/govorne-igre/ponovi-poved/k", label: "K", parent: "/govorne-igre/ponovi-poved" },
  { path: "/govorne-igre/ponovi-poved/l", label: "L", parent: "/govorne-igre/ponovi-poved" },
  { path: "/govorne-igre/ponovi-poved/r", label: "R", parent: "/govorne-igre/ponovi-poved" },
  { path: "/govorne-igre/ponovi-poved/s", label: "S", parent: "/govorne-igre/ponovi-poved" },
  { path: "/govorne-igre/ponovi-poved/sh", label: "Š", parent: "/govorne-igre/ponovi-poved" },
  { path: "/govorne-igre/ponovi-poved/z", label: "Z", parent: "/govorne-igre/ponovi-poved" },
  { path: "/govorne-igre/ponovi-poved/zh", label: "Ž", parent: "/govorne-igre/ponovi-poved" },
  
  // Bingo
  { path: "/govorne-igre/bingo", label: "Bingo", parent: "/govorne-igre" },
  { path: "/govorne-igre/bingo/c", label: "C", parent: "/govorne-igre/bingo" },
  { path: "/govorne-igre/bingo/ch", label: "Č", parent: "/govorne-igre/bingo" },
  { path: "/govorne-igre/bingo/k", label: "K", parent: "/govorne-igre/bingo" },
  { path: "/govorne-igre/bingo/l", label: "L", parent: "/govorne-igre/bingo" },
  { path: "/govorne-igre/bingo/r", label: "R", parent: "/govorne-igre/bingo" },
  { path: "/govorne-igre/bingo/s", label: "S", parent: "/govorne-igre/bingo" },
  { path: "/govorne-igre/bingo/sh", label: "Š", parent: "/govorne-igre/bingo" },
  { path: "/govorne-igre/bingo/z", label: "Z", parent: "/govorne-igre/bingo" },
  { path: "/govorne-igre/bingo/zh", label: "Ž", parent: "/govorne-igre/bingo" },
  
  // Govorno-jezikovne vaje hierarchy
  { path: "/govornojezicovne-vaje", label: "Govorno-jezikovne vaje", parent: "/moje-aplikacije" },
  { path: "/govorno-jezikovne-vaje", label: "Govorno-jezikovne vaje", parent: "/moje-aplikacije" },
  { path: "/vaje-motorike-govoril", label: "Vaje motorike govoril", parent: "/moje-aplikacije" },
  { path: "/govorno-jezikovne-vaje/vaje-motorike-govoril", label: "Vaje motorike govoril", parent: "/govorno-jezikovne-vaje" },
  
  // Video navodila hierarchy
  { path: "/video-navodila", label: "Video navodila", parent: "/moje-aplikacije" },
  { path: "/video-navodila/c", label: "C", parent: "/video-navodila" },
  { path: "/video-navodila/ch", label: "Č", parent: "/video-navodila" },
  { path: "/video-navodila/k", label: "K", parent: "/video-navodila" },
  { path: "/video-navodila/l", label: "L", parent: "/video-navodila" },
  { path: "/video-navodila/r", label: "R", parent: "/video-navodila" },
  { path: "/video-navodila/s", label: "S", parent: "/video-navodila" },
  { path: "/video-navodila/sh", label: "Š", parent: "/video-navodila" },
  { path: "/video-navodila/z", label: "Z", parent: "/video-navodila" },
  { path: "/video-navodila/zh", label: "Ž", parent: "/video-navodila" },
  
  // Artikulacija vaje
  { path: "/artikulacija-vaje", label: "Artikulacija vaje", parent: "/moje-aplikacije" },
];

// Paths where breadcrumb should NOT be shown (actual game pages, not listing pages)
const excludedPaths = [
  // Exclude individual game pages but not listing pages
  "/govorne-igre/spomin/spomin-",  // Individual spomin games (e.g., /spomin/spomin-c)
  "/govorne-igre/labirint/c",      // Individual labirint games
  "/govorne-igre/labirint/k",
  "/govorne-igre/labirint/l",
  "/govorne-igre/sestavljanke/c",  // Individual sestavljanke games
  "/govorne-igre/sestavljanke/k",
  "/govorne-igre/sestavljanke/l",
  "/govorne-igre/drsna-sestavljanka/c", // Individual drsna games
  "/govorne-igre/drsna-sestavljanka/k",
  "/govorne-igre/drsna-sestavljanka/l",
  "/govorne-igre/igra-ujemanja/c",      // Individual ujemanja games
  "/govorne-igre/igra-ujemanja/k",
  "/govorne-igre/igra-ujemanja/l",
  "/artikulacija-vaje/",
  "/vaje-za-jezik",
  "/artikulacijski-test",
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
            <>
              <BreadcrumbItem key={`item-${item.path}`}>
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
                <BreadcrumbSeparator key={`sep-${item.path}`}>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
