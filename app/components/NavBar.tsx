"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const NavBar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const links = [
    { label: "Home", href: "/" },
    ...(session
      ? [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Create", href: "/notes/new" },
        ]
      : []),
  ];

  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">
      <h1 className="text-xl font-bold">NEU</h1>

      <ul className="flex gap-6">
        {links.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(link.href + "/");

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`${
                  isActive ? "text-blue-800 font-semibold" : "text-blue-500"
                } hover:text-orange-400`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="flex gap-4 items-center">
        {!session ? (
          <>
            <Link href="/login" className="text-blue-500 hover:text-orange-400">
              Login
            </Link>
            <Link
              href="/signup"
              className="text-blue-500 hover:text-orange-400"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <span className="text-gray-600">
              {session.user?.name || session.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
