"use client";

import { useState } from "react";

export default function LearningPlanPage() {
  const [form, setForm] = useState({
    studentAge: "Grade 8 (Age 13-14)",
    subject: "",
    currentLevel: "Beginner",
    learningGoals: "",
    timePerWeek: "5",
    resources: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.learningGoals.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Personalized Learning Plan</h1>
            <p className="text-xs text-gray-400">Generate custom tutoring plans with milestones &amp; session agendas</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="lg:w-2/5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Subject <span className="text-red-400">*</span>
              </label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="e.g. Calculus, Spanish, Piano"
                required
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Student Age / Grade</label>
              <select
                name="studentAge"
                value={form.studentAge}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              >
                {["Elementary (Age 6-10)","Grade 4-5 (Age 9-11)","Grade 6-7 (Age 11-13)","Grade 8 (Age 13-14)","Grade 9-10 (Age 14-16)","Grade 11-12 (Age 16-18)","College/University","Adult Learner"].map(a => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Current Level</label>
              <select
                name="currentLevel"
                value={form.currentLevel}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              >
                {["Complete Beginner","Beginner","Intermediate","Advanced Intermediate","Advanced"].map(l => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Learning Goals <span className="text-red-400">*</span>
              </label>
              <textarea
                name="learningGoals"
                value={form.learningGoals}
                onChange={handleChange}
                rows={2}
                placeholder="e.g. Pass AP Calculus AB exam with 4+, Build conversational Spanish fluency"
                required
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Hours Available Per Week</label>
              <select
                name="timePerWeek"
                value={form.timePerWeek}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              >
                {["2","3","5","7","10","15"].map(h => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Available Resources</label>
              <textarea
                name="resources"
                value={form.resources}
                onChange={handleChange}
                rows={2}
                placeholder="e.g. Khan Academy subscription, textbook, laptop, tutor access"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-teal-600 hover:bg-teal-500 focus:ring-teal-500 transition-all duration-200 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating Learning Plan…
                </span>
              ) : (
                "Generate Learning Plan"
              )}
            </button>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700 rounded-xl text-red-300 text-sm">{error}</div>
            )}
          </form>
        </div>

        {/* Output */}
        <div className="lg:w-3/5">
          {result ? (
            <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-700 bg-gradient-to-r from-teal-900/40 to-teal-800/40 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-400" />
                <span className="text-sm font-medium text-gray-300">Generated Learning Plan</span>
              </div>
              <div className="p-6 overflow-auto max-h-[70vh]">
                <pre className="whitespace-pre-wrap text-sm text-gray-200 font-mono leading-relaxed">{result}</pre>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-gray-700 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-teal-600/20 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-400 mb-2">Your learning plan will appear here</h3>
              <p className="text-sm text-gray-500 max-w-xs">Generate a personalized tutoring plan with weekly schedules, session agendas, 30-60-90 day milestones, and recommended resources.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
