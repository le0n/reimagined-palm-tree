// src/app/page.tsx
import Link from 'next/link';

const playfulTaglines = [
  'Feeling indecisive? Let us spin the date wheel 💫',
  'Your next adventure is just a click away!',
  'Shuffle nearby gems until the perfect spot appears ✨'
];

export default function HomePage() {
  return (
    <div className="hero min-h-[70vh] rounded-3xl bg-gradient-to-br from-primary/10 via-base-100 to-accent/10 p-6 shadow-lg">
      <div className="hero-content max-w-3xl flex-col gap-8 text-center lg:text-left">
        <div className="space-y-4">
          <span className="badge badge-secondary badge-outline px-4 py-3 text-sm font-semibold uppercase tracking-wide">
            Date night, playfully solved
          </span>
          <h1 className="text-4xl font-black leading-tight sm:text-5xl">
            Indecisive about dinner, drinks, or late-night adventures?
            <br className="hidden sm:block" />
            DateDash turns “I don’t know” into “Surprise us!”
          </h1>
          <p className="text-base-content/80 text-lg">
            Filter by radius, star reviews, cuisine cravings, and themed vibes—then let our map
            serve up nearby spots worth swooning over.
          </p>
        </div>
        <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-start">
          <Link
            href="/explore"
            className="btn btn-primary btn-wide sm:btn-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            Start exploring
          </Link>
          <Link
            href="/explore"
            className="btn btn-ghost btn-wide sm:btn-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
          >
            Show me a surprise
          </Link>
        </div>
        <div className="mt-6 space-y-1 text-sm text-base-content/70">
          {playfulTaglines.map((tagline) => (
            <p key={tagline}>{tagline}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
