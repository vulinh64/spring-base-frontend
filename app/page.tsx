import Link from "next/link";
import type { ReactNode } from "react";
import {Hr} from "@/components/common/Hr.tsx";
import clsx from "clsx";

const bioCls = "text-lg text-gray-400 leading-relaxed";

interface LandingCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  cta: string;
}

function LandingCard({ icon, title, description, href, cta }: LandingCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-gray-800 bg-gray-900 p-6 hover:border-gray-700 transition-colors">
      <div className="flex justify-center mb-5">{icon}</div>
      <h2 className="text-xl font-semibold text-gray-100 mb-1">{title}</h2>
      <p className="flex-1 mt-2 text-base text-gray-400">{description}</p>
      <Hr className={clsx("my-6")}/>
      <Link
        href={href}
        className="mt-5 self-end inline-flex items-center gap-1 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        {cta} <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Welcome</h1>
        <p className="text-lg text-gray-400">
          A place for notes, articles, and small tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LandingCard
          href="/posts"
          title="Latest Posts"
          description="Read the most recent articles and updates from the blog."
          cta="Browse posts"
          icon={
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="8" width="48" height="60" rx="3" stroke="#60a5fa" strokeWidth="2"/>
              <path d="M 46 8 L 58 20 H 46 Z" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1.5"/>
              <path d="M 46 8 L 58 20" stroke="#60a5fa" strokeWidth="1.5"/>
              <line x1="18" y1="30" x2="50" y2="30" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
              <line x1="18" y1="38" x2="50" y2="38" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
              <line x1="18" y1="46" x2="40" y2="46" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
              <path d="M 55 55 L 68 42 L 73 47 L 60 60 Z" fill="#2563eb" stroke="#60a5fa" strokeWidth="1.5" strokeLinejoin="round"/>
              <line x1="60" y1="60" x2="57" y2="68" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="56.5" cy="69.5" r="1.5" fill="#60a5fa"/>
            </svg>
          }
        />

        <LandingCard
          href="/categories"
          title="Browse Categories"
          description="Explore posts organised by topic. Find what interests you most."
          cta="View categories"
          icon={
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="8" width="28" height="28" rx="4" fill="#1e3a5f" stroke="#60a5fa" strokeWidth="1.5"/>
              <line x1="14" y1="26" x2="30" y2="26" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"/>
              <rect x="44" y="8" width="28" height="28" rx="4" fill="#1a3a2a" stroke="#34d399" strokeWidth="1.5"/>
              <line x1="50" y1="26" x2="66" y2="26" stroke="#34d399" strokeWidth="2" strokeLinecap="round"/>
              <rect x="8" y="44" width="28" height="28" rx="4" fill="#3a1a3a" stroke="#c084fc" strokeWidth="1.5"/>
              <line x1="14" y1="62" x2="30" y2="62" stroke="#c084fc" strokeWidth="2" strokeLinecap="round"/>
              <rect x="44" y="44" width="28" height="28" rx="4" fill="#3a2a10" stroke="#fbbf24" strokeWidth="1.5"/>
              <line x1="50" y1="62" x2="66" y2="62" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          }
        />

        <LandingCard
          href="/tax-calculator"
          title="Tax Calculator"
          description="A quick tool to estimate your tax. Enter your income and get an instant breakdown."
          cta="Open calculator"
          icon={
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="16" y="6" width="48" height="68" rx="6" stroke="#60a5fa" strokeWidth="2"/>
              <rect x="22" y="12" width="36" height="18" rx="3" fill="#1e3a5f" stroke="#60a5fa" strokeWidth="1.5"/>
              <text x="40" y="26" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="#60a5fa" fontWeight="bold">%</text>
              <rect x="22" y="36" width="9" height="7" rx="2" fill="#334155"/>
              <rect x="35" y="36" width="9" height="7" rx="2" fill="#334155"/>
              <rect x="49" y="36" width="9" height="7" rx="2" fill="#1d4ed8"/>
              <rect x="22" y="47" width="9" height="7" rx="2" fill="#334155"/>
              <rect x="35" y="47" width="9" height="7" rx="2" fill="#334155"/>
              <rect x="49" y="47" width="9" height="7" rx="2" fill="#334155"/>
              <rect x="22" y="58" width="9" height="7" rx="2" fill="#334155"/>
              <rect x="35" y="58" width="22" height="7" rx="2" fill="#1d4ed8"/>
            </svg>
          }
        />
      </div>

      {/* About Me */}
      <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-2 items-stretch my-40 border border-gray-800 rounded-xl bg-gray-900 p-10">
        {/* Portrait */}
        <div className="flex items-center justify-center">
            <div className="md:w-full h-full aspect-2/3 rounded-xl bg-blue-900/30 border border-blue-800 flex items-center justify-center">
                <span className="text-4xl font-bold text-blue-400 select-none leading-none">VL</span>
            </div>
        </div>
          
        {/* Text */}
        <div className="flex flex-col gap-5 pl-8">
          <h2 className="text-4xl font-bold text-gray-100">Linh Nguyen</h2>
          <sub className="text-blue-500">Java Backend Developer/Occasional Vibe Coder</sub>
          <Hr className="my-4"/>
          <p className={bioCls}>
            My name is Linh Nguyen (yes, a Nguyen). I&apos;m a software engineer with a focus on backend development,
            primarily working with Java and Spring Boot.
          </p>
          <p className={bioCls}>
            Over the years I&apos;ve worked on projects of various scales, from small internal tools
            to systems handling high concurrency. I enjoy understanding how things work under the hood
            and writing about the lessons learned along the way.
          </p>
          <p className={bioCls}>
            This blog is where I document things I learn, build, and occasionally break. I hope you
            find something useful here. Vibe coder, as usual, so don't @ me 😊
          </p>
        </div>
      </section>
    </div>
  );
}
