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
        { label: "Dashboard", href: "/dashboard", icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        )},
        { label: "Create Note", href: "/notes/new", icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )},
      ]
    : [{ label: "Home", href: "/", icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )}];

  return (
    <nav className="border-b bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:shadow-lg transition-shadow">
              N
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              NEU Notes
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`
                    px-4 py-2 text-base font-medium rounded-lg transition-all
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    {link.icon}
                    <span>{link.label}</span>
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {!session ? (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2 text-base font-medium rounded-lg border-2 border-blue-600 text-blue-600 hover:border-blue-700 hover:bg-blue-50 transition-all"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="px-5 py-2 text-base font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md transition-all"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-base font-semibold">
                    {(session.user?.name?.[0] || session.user?.email?.[0] || "U").toUpperCase()}
                  </div>
                  <span className="text-base font-medium text-gray-700 max-w-[150px] truncate">
                    {session.user?.name || session.user?.email}
                  </span>
                </div>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-5 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-4 space-y-2">
            {links.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 border-t space-y-2">
              {!session ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-base font-medium rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition text-center"
                  >
                    Login
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition text-center"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {(session.user?.name?.[0] || session.user?.email?.[0] || "U").toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {session.user?.name || session.user?.email}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
