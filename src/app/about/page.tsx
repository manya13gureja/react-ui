'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { HoverLinkPreview } from '@/app/components/HoverLink';

export default function About() {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;
    timeout = setTimeout(() => {
      btn.classList.add('shake');
      interval = setInterval(() => {
        btn.classList.remove('shake');

        void btn.offsetWidth;
        btn.classList.add('shake');
      }, 3000);
    }, 2700);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center px-102 py-16">
      <h1 className="text-lg font-bold mb-24 text-pink-700 font-redrose">About eunoia ui</h1>
      <p className="text-md text-gray-700 mb-8 text-center font-lato">
        The project explores UI components and patterns, done differently.
        <br />A collection of interactive and flagerbasting UI experiments and components which I
        find cool, and build overtime.
      </p>

      <p className="text-md text-gray-700 mb-6 mt-6 text-center font-lato">
        I hope you explore, learn, and get inspired by delightful web interactions, built with love
        and some Nextjs and TailwindCSS ;) <br></br>
        <span className="font-bold text-pink-800 underline">TW:</span> you might get the itch of
        these interactions and play them in your mind before sleep every night (I most certainly
        do🫢).
      </p>
      <Link
        ref={buttonRef}
        href="/"
        className=" font-redrose inline-block mt-16 text-pink-700 font-semibold px-6 py-3 rounded-4xl border border-pink-200 bg-white/40 backdrop-blur-md shadow-md transition-all duration-200 hover:bg-pink-50/60 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 shake-animate"
        style={{
          fontSize: '1rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          boxShadow: '0 2px 16px 0 rgba(236, 72, 153, 0.08)',
        }}
      >
        now go explore
      </Link>
      <footer className="max-w-4xl mx-auto mt-36  pt-24  text-center text-sm text-pink-900 font-light">
        <div className="inline-block">
          Built by{' '}
          <HoverLinkPreview label="Manya" url="https://x.com/milkfuggler" image="/manya.png" />
        </div>
      </footer>
    </div>
  );
}
