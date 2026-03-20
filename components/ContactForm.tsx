"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      type: (form.elements.namedItem("type") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          required
          placeholder="Your name"
          className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Email address"
          className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
        />
      </div>
      <select
        name="type"
        className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 text-gray-300 focus:outline-none focus:border-blue-500 transition"
      >
        <option value="">I am a...</option>
        <option>Individual investor</option>
        <option>Finance team / company</option>
        <option>Wealth manager</option>
        <option>Startup / founder</option>
        <option>Other</option>
      </select>
      <textarea
        name="message"
        required
        rows={4}
        placeholder="How can we help? (custom dashboard, question, feedback...)"
        className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-600/25"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
      {status === "success" && (
        <p className="text-green-400 text-sm text-center">Message sent! We'll reply within 24 hours.</p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
