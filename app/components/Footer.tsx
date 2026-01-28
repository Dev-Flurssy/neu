"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-12">
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">
            Neu Generator
          </h3>
          <p className="text-sm text-gray-400">
            A smart academic note generation platform built for NEU lecturers.
          </p>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3">Project</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#">Dashboard</Link>
            </li>
            <li>
              <Link href="#">Generate Notes</Link>
            </li>
            <li>
              <Link href="#">Export</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3">Technology</h4>
          <ul className="space-y-2 text-sm">
            <li>Next.js</li>
            <li>Tailwind CSS</li>
            <li>Radix UI</li>
            <li>AI Integration</li>
          </ul>
        </div>

        {}
        <div>
          <h4 className="text-white font-medium mb-3">Institution</h4>
          <p className="text-sm text-gray-400">
            Developed as part of an academic project for NEU.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Neu Generator — All rights reserved.
      </div>
    </footer>
  );
}
