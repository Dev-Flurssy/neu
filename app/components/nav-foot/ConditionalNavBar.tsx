"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";
import AdminNavBar from "./AdminNavBar";

export default function ConditionalNavBar() {
  const pathname = usePathname();
  
  // Show AdminNavBar for all admin routes
  if (pathname?.startsWith("/admin")) {
    return <AdminNavBar />;
  }
  
  // Show regular NavBar for all other routes
  return <NavBar />;
}
