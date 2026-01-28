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
    <nav className="border-b bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-blue-700"
        >
          NEU
        </Link>

        {/* Desktop Right Section: Links + User */}
        <div className="hidden md:flex items-center gap-6">
          {/* Links */}
          {links.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`transition-colors ${
                  isActive
                    ? "text-blue-800 font-semibold"
                    : "text-gray-600 hover:text-blue-700"
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
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 transition-colors"
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
                className="rounded-md border border-red-500 px-3 py-1 text-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <span className="text-2xl">&times;</span>
          ) : (
            <span className="text-2xl">&#9776;</span>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-4 space-y-4 border-t pt-4">
          {links.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block text-lg ${
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
                className="block text-gray-700 hover:text-blue-700 text-lg"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="block text-blue-700 font-semibold text-lg"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <span className="block text-gray-700 font-medium">
                {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="block text-left text-red-600 text-lg"
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
