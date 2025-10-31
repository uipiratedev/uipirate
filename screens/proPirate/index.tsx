export default function ProPirate() {
  const APPLY_LINK = "https://forms.gle/your-form-id"; // Replace with your Google Form URL
  const START_DATE = "Starts Nov 15"; // Update as needed
  const PRICE = "$199"; // Update if needed

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 [color-scheme:light]">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 font-black text-lg">
              ⚓
            </span>
            <span className="font-semibold tracking-tight">
              UI Pirate — Elite Mentorship
            </span>
          </div>
          <a
            href={APPLY_LINK}
            className="rounded-xl px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
          >
            Apply Now
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_-10%,#10b98122,transparent_60%)]" />
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Not a course. Not lectures.{" "}
              <span className="text-emerald-600">Only results.</span>
            </h1>
            <p className="mt-6 text-lg text-neutral-600 max-w-2xl">
              Global, live mentorship for designers who learn by doing. Build a
              real SaaS product, redesign an enterprise app, and ship a
              portfolio that looks experienced. No theory. No hand-holding. No
              excuses.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 border border-neutral-200 px-3 py-1">
                🌍 Global • English
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 border border-neutral-200 px-3 py-1">
                👥 1–12 seats (pilot)
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 border border-neutral-200 px-3 py-1">
                ⏱️ 6–8 weeks live
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 border border-neutral-200 px-3 py-1">
                💳 {PRICE}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 border border-neutral-200 px-3 py-1">
                📅 {START_DATE}
              </span>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={APPLY_LINK}
                className="rounded-2xl px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
              >
                Apply Now
              </a>
              <a
                href="#how"
                className="rounded-2xl px-6 py-3 border border-neutral-300 hover:border-neutral-400 transition"
              >
                How it works
              </a>
            </div>
            <p className="mt-6 text-sm text-neutral-500">
              No DMs. No discovery calls. You apply → you execute → you grow.
            </p>
          </div>
          <div className="md:col-span-5">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
              <div className="text-sm text-neutral-500">Mentor</div>
              <h3 className="mt-1 text-xl font-semibold">
                Vishal — Founder, UI Pirate
              </h3>
              <p className="mt-3 text-neutral-600 text-sm leading-6">
                8+ years building SaaS/UI systems. Trained 15–20 interns who
                went on to earn 7–12 LPA+ and senior roles. This mentorship
                formalizes the same results-first approach.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-neutral-600">
                <li>• Zero theory. Real deliverables.</li>
                <li>• Brutally honest feedback.</li>
                <li>• Portfolio that employers respect.</li>
              </ul>
              <a
                href={APPLY_LINK}
                className="mt-6 inline-flex rounded-xl px-4 py-2 bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition"
              >
                Start Application
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What you'll do */}
      <section id="how" className="border-t border-neutral-200 bg-white/70">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold">What you will do</h2>
          <p className="mt-3 text-neutral-600 max-w-2xl">
            You learn by shipping. Expect deadlines, revisions, and standards
            that mirror real product teams.
          </p>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Build a complete SaaS product",
                desc: "Brief → research → flows → wireframes → system → UI → prototype. Learn to think and deliver like a product designer.",
              },
              {
                title: "Redesign an enterprise app",
                desc: "Choose a real, widely-used product. Identify UX problems, propose improvements, and ship a defensible redesign.",
              },
              {
                title: "Make a portfolio that looks experienced",
                desc: "Case studies that read like real work. No Dribbble fluff. Show decisions, constraints, and outcomes.",
              },
            ].map((c, i) => (
              <div
                key={i}
                className="rounded-2xl border border-neutral-200 bg-white p-6"
              >
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-neutral-600 text-sm leading-6">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-lg font-semibold">What you get</h3>
              <ul className="mt-3 space-y-2 text-neutral-600 text-sm leading-6">
                <li>• Live, async-first mentorship (no recordings).</li>
                <li>• Weekly deliverables & honest critique.</li>
                <li>• Templates for briefs, flows, case studies.</li>
                <li>• Interview/referral guidance from alumni network.</li>
                <li>• Access to a focused peer group (1–12 people).</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-lg font-semibold">What we do NOT do</h3>
              <ul className="mt-3 space-y-2 text-neutral-600 text-sm leading-6">
                <li>• No Figma basics, Photoshop/Canva classes.</li>
                <li>• No theory lectures or hand-holding.</li>
                <li>• No attendance certificates or placement guarantees.</li>
                <li>• No endless calls. Your work speaks, not words.</li>
                <li>• No excuses — missed deadlines lead to removal.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Selection flow */}
      <section className="border-t border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            How selection works
          </h2>
          <ol className="mt-8 grid md:grid-cols-3 gap-6 text-sm text-neutral-600">
            <li className="rounded-2xl border border-neutral-200 bg-white p-6">
              <span className="text-neutral-500">Step 1</span>
              <h3 className="text-lg font-semibold mt-1">Apply (2–3 mins)</h3>
              <p className="mt-2">
                Share who you are, your time, and any work. No DMs. No calls.
              </p>
            </li>
            <li className="rounded-2xl border border-neutral-200 bg-white p-6">
              <span className="text-neutral-500">Step 2</span>
              <h3 className="text-lg font-semibold mt-1">48-hour task</h3>
              <p className="mt-2">
                Redesign one screen from any app. Submit Figma + 3 bullets. On
                time or out.
              </p>
            </li>
            <li className="rounded-2xl border border-neutral-200 bg-white p-6">
              <span className="text-neutral-500">Step 3</span>
              <h3 className="text-lg font-semibold mt-1">Start mentorship</h3>
              <p className="mt-2">
                If you pass, we begin immediately — even with a batch of 1.
              </p>
            </li>
          </ol>

          <div className="mt-10">
            <a
              href={APPLY_LINK}
              className="inline-flex rounded-2xl px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
            >
              Apply Now
            </a>
          </div>
        </div>
      </section>

      {/* Refund policy */}
      <section className="border-t border-neutral-200 bg-white/70">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold">Performance Refund</h2>
          <p className="mt-3 text-neutral-600 max-w-2xl">
            We reward outcomes. Finish the mentorship and land paid work within
            60 days — get your money back.
          </p>

          <div className="mt-8 grid md:grid-cols-3 gap-6 text-sm">
            {[
              {
                title: "15–20 days",
                desc: (
                  <>
                    Job offer or paid client in 15–20 days post-program →{" "}
                    <span className="font-semibold text-emerald-600">
                      100% refund
                    </span>
                    .
                  </>
                ),
              },
              {
                title: "30–45 days",
                desc: (
                  <>
                    Job/client within 30–45 days →{" "}
                    <span className="font-semibold text-emerald-600">
                      100% refund
                    </span>
                    .
                  </>
                ),
              },
              {
                title: "Up to 60 days",
                desc: (
                  <>
                    Success within 60 days →{" "}
                    <span className="font-semibold text-emerald-600">
                      100% refund
                    </span>
                    . After 60 days, refunds aren’t guaranteed, but support
                    continues.
                  </>
                ),
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-neutral-200 bg-white p-6"
              >
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-neutral-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <ul className="mt-8 text-sm text-neutral-500 space-y-2">
            <li>
              • Proof required: offer letter, paid invoice, client confirmation,
              or verifiable live product revenue.
            </li>
            <li>
              • You must complete all program deliverables on time to be
              eligible.
            </li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold">FAQ</h2>
          <div className="mt-8 grid md:grid-cols-2 gap-6 text-sm text-neutral-600">
            {[
              {
                q: "Is this beginner-friendly?",
                a: "Yes, if you’re serious. You must show any attempt at work and commit ≥6 hours/week.",
              },
              {
                q: "Are there recordings?",
                a: "No. It’s live/async, feedback-first. You learn by shipping.",
              },
              {
                q: "Do you guarantee jobs?",
                a: "No. We guarantee standards, mentorship, and a portfolio that earns respect. Refunds are performance-based.",
              },
              {
                q: "How do I start?",
                a: "Apply → complete 48-hour task → if accepted, we start immediately (even with a batch of 1).",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-neutral-200 bg-white p-6"
              >
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="mt-2">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <a
              href={APPLY_LINK}
              className="inline-flex rounded-2xl px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
            >
              Apply Now
            </a>
            <p className="mt-4 text-neutral-500 text-sm">
              No chats. No sales calls. Your work is your application.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-neutral-500 flex flex-wrap items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} UI Pirate. Work. Don’t talk.</p>
          <div className="flex items-center gap-4">
            <a href={APPLY_LINK} className="hover:text-neutral-700">
              Apply
            </a>
            <a href="#how" className="hover:text-neutral-700">
              How it works
            </a>
            <a href="#" className="hover:text-neutral-700">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
