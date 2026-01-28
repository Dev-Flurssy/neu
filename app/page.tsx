"use client";

import Image from "next/image";

export default function HomePage() {
  return (
    <main className="bg-gray-50">
      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
          Building a Smart <span className="text-blue-600">Note Generator</span>{" "}
          for NEU
        </h1>

        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-10">
          Neu Generator helps lecturers create, edit, and export academic notes
          efficiently using modern tools and AI assistance.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
            Get Started
          </button>
          <button className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
            View Project Phases
          </button>
        </div>
      </section>

      {/* PROJECT SUMMARY */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-center">
          Project Summary
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-center text-base sm:text-lg">
          Neu Generator supports lecturers by automating note creation,
          providing an intuitive editor, and enabling exports to multiple
          formats such as PDF, Word, and PowerPoint.
        </p>
      </section>

      {/* PHASES */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-semibold mb-12 text-center">
          Note Generation Phases
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <PhaseCard
            title="Sign Up"
            description="Create an account using Email or Gmail to get started."
            avatar="/images/signup.webp"
            role="Step 1"
          />
          <PhaseCard
            title="Draft or Generate Notes"
            description="Enter a title and short description, or let AI generate the first draft."
            avatar="/images/notedraft2.jpg"
            role="Step 2"
          />
          <PhaseCard
            title="Edit & Personalize"
            description="Refine your notes, adjust formatting, and prepare them for export."
            avatar="/images/notedraft.jpg"
            role="Step 3"
          />
        </div>
      </section>
    </main>
  );
}

function PhaseCard({
  title,
  description,
  avatar,
  role,
}: {
  title: string;
  description: string;
  avatar: string;
  role: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition max-w-sm mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <Image
          src={avatar}
          alt={title}
          width={56}
          height={56}
          className="rounded-full object-cover"
        />
        <div>
          <div className="font-semibold text-lg">{title}</div>
          <div className="text-gray-500 text-sm">{role}</div>
        </div>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
