"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

const NavBar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const links = session
    ? [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Create", href: "/notes/new" },
      ]
    : [{ label: "Home", href: "/" }];

  return (
    <nav className="border-b bg-white/90 backdrop-blur-md px-6 py-4 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-blue-700 hover:text-blue-800 transition"
        >
          NEU
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`px-3 py-2 text-base font-medium rounded-md transition ${
                  isActive
                    ? "text-blue-800 font-semibold"
                    : "text-gray-700 hover:text-blue-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Auth */}
          {!session ? (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-md border border-blue-600 text-blue-700 hover:bg-blue-50 transition font-medium"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="px-4 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-800 transition font-semibold"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <span className="text-gray-700 font-medium">
                {session.user?.name || session.user?.email}
              </span>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 rounded-md border border-red-500 text-red-600 hover:bg-red-50 transition font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700 text-3xl"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-4 space-y-4 border-t pt-4 animate-slideDown">
          {links.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2 rounded-md text-lg transition ${
                  isActive
                    ? "text-blue-800 font-semibold"
                    : "text-gray-700 hover:text-blue-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {!session ? (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded-md border border-blue-600 text-blue-700 hover:bg-blue-50 text-lg font-medium"
              >
                Login
              </Link>

              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-800 text-lg font-semibold"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <span className="block text-gray-700 font-medium px-4">
                {session.user?.name || session.user?.email}
              </span>

              <button
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="block w-full text-left px-4 py-2 rounded-md text-red-600 hover:bg-red-50 text-lg font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
