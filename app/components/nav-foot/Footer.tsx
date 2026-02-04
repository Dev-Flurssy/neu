"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-12">
      <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">
            Neu Generator
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            A smart academic note generation platform built for NEU lecturers.
          </p>
        </div>

        {/* Project Links */}
        <div>
          <h4 className="text-white font-medium mb-3">Project</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/dashboard" className="hover:text-white transition">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/notes/new" className="hover:text-white transition">
                Generate Notes
              </Link>
            </li>
            <li>
              <Link href="/export" className="hover:text-white transition">
                Export
              </Link>
            </li>
          </ul>
        </div>

        {/* Technology */}
        <div>
          <h4 className="text-white font-medium mb-3">Technology</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Next.js</li>
            <li>Tailwind CSS</li>
            <li>Radix UI</li>
            <li>AI Integration</li>
          </ul>
        </div>

        {/* Institution */}
        <div>
          <h4 className="text-white font-medium mb-3">Institution</h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            Developed as part of an academic project for NEU.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Neu Generator — All rights reserved.
      </div>
    </footer>
  );
}
