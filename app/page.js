"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";

const PlexusSphere = dynamic(() => import("../components/PlexusSphere"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

const STATS = [
  { value: "99.9%", label: "Uptime SLA" },
  { value: "256-bit", label: "Encryption" },
  { value: "<2ms", label: "Latency" },
  { value: "50M+", label: "Events / Day" },
];

const FEATURES = [
  { icon: "🛡️", text: "Zero-Trust Architecture" },
  { icon: "🌐", text: "Global Edge Network" },
  { icon: "🔐", text: "AI Threat Detection" },
  { icon: "⚡", text: "Real-Time Response" },
];

export default function HeroPage() {
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const badgeRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const scanLineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(
        [headlineRef.current, subRef.current, badgeRef.current, ctaRef.current],
        { opacity: 0, y: 40 }
      );
      gsap.set(".stat-card", { opacity: 0, y: 30, scale: 0.9 });
      gsap.set(".feature-item", { opacity: 0, x: -30 });

      // Scan line effect
      gsap.fromTo(
        scanLineRef.current,
        { scaleX: 0, opacity: 0.8 },
        { scaleX: 1, opacity: 0, duration: 1.2, ease: "power2.out", delay: 0.2 }
      );

      // Staggered entrance
      const tl = gsap.timeline({ delay: 0.5 });

      tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.5)" })
        .to(headlineRef.current, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.2")
        .to(subRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.4")
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3")
        .to(".feature-item", {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        }, "-=0.2")
        .to(".stat-card", {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.2)",
        }, "-=0.3");

      // Continuous glow pulse on headline
      gsap.to(headlineRef.current, {
        textShadow: "0 0 30px rgba(0,200,255,0.9), 0 0 60px rgba(0,100,255,0.5)",
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 2,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#020818]">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,100,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,100,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow overlays */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute rounded-full opacity-20"
          style={{
            width: "60vw",
            height: "60vw",
            right: "-10vw",
            top: "-10vw",
            background: "radial-gradient(circle, rgba(0,100,255,0.35) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute rounded-full opacity-15"
          style={{
            width: "40vw",
            height: "40vw",
            left: "-5vw",
            bottom: "0",
            background: "radial-gradient(circle, rgba(0,200,255,0.25) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Scan line animation */}
      <div
        ref={scanLineRef}
        className="pointer-events-none absolute left-0 right-0 top-0 h-0.5 origin-left"
        style={{ background: "linear-gradient(90deg, transparent, #00d4ff, transparent)" }}
      />

      {/* ─────────────── LAYOUT ─────────────── */}
      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row items-center">

        {/* ── LEFT: Text Content ── */}
        <div className="flex w-full flex-col justify-center px-8 pt-24 pb-12 lg:w-1/2 lg:px-16 lg:pt-0">

          {/* Badge */}
          <div ref={badgeRef} className="mb-6 inline-flex items-center gap-2 self-start">
            <span
              className="rounded-full border px-4 py-1.5 text-xs font-semibold tracking-widest uppercase"
              style={{
                borderColor: "rgba(0,200,255,0.4)",
                background: "rgba(0,100,255,0.1)",
                color: "#00d4ff",
                boxShadow: "0 0 12px rgba(0,200,255,0.2)",
              }}
            >
              ◈ Next-Gen Security Platform
            </span>
          </div>

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="mb-6 text-5xl font-black leading-[1.05] tracking-tight lg:text-7xl"
            style={{ color: "#f0f8ff" }}
          >
            Akıllı{" "}
            <span
              className="neon-text"
              style={{
                background: "linear-gradient(135deg, #00d4ff, #0066ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Kurumsal
            </span>
            <br />
            Güvenlik &{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00ffcc, #0099ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Bağlantı
            </span>
          </h1>

          {/* Sub-headline */}
          <p
            ref={subRef}
            className="mb-8 max-w-lg text-lg leading-relaxed"
            style={{ color: "rgba(180,210,240,0.8)" }}
          >
            Sıfır güven mimarisini yapay zeka destekli tehdit istihbaratıyla birleştiren
            fütüristik güvenlik altyapısı. Ağınızı gerçek zamanlı izleyin, koruyun,
            ve optimize edin.
          </p>

          {/* Feature list */}
          <div ref={featuresRef} className="mb-8 grid grid-cols-2 gap-3">
            {FEATURES.map((f) => (
              <div
                key={f.text}
                className="feature-item flex items-center gap-2 rounded-lg px-3 py-2"
                style={{
                  background: "rgba(0,50,120,0.25)",
                  border: "1px solid rgba(0,150,255,0.2)",
                }}
              >
                <span className="text-lg">{f.icon}</span>
                <span className="text-sm font-medium" style={{ color: "#a0c8f0" }}>
                  {f.text}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-wrap gap-4">
            <button
              className="group relative overflow-hidden rounded-xl px-8 py-4 text-base font-bold tracking-wide text-white transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #0055cc, #0099ff)",
                boxShadow: "0 0 20px rgba(0,150,255,0.4), 0 4px 15px rgba(0,50,150,0.4)",
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1.05,
                  boxShadow: "0 0 35px rgba(0,200,255,0.7), 0 6px 25px rgba(0,50,150,0.5)",
                  duration: 0.25,
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1,
                  boxShadow: "0 0 20px rgba(0,150,255,0.4), 0 4px 15px rgba(0,50,150,0.4)",
                  duration: 0.25,
                });
              }}
            >
              <span className="relative z-10">Demo İste →</span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(135deg, #0066ff, #00ccff)",
                }}
              />
            </button>

            <button
              className="rounded-xl px-8 py-4 text-base font-semibold tracking-wide transition-all duration-300"
              style={{
                border: "1px solid rgba(0,200,255,0.4)",
                color: "#00d4ff",
                background: "rgba(0,100,255,0.07)",
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1.04,
                  background: "rgba(0,100,255,0.18)",
                  boxShadow: "0 0 20px rgba(0,200,255,0.25)",
                  duration: 0.25,
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1,
                  background: "rgba(0,100,255,0.07)",
                  boxShadow: "none",
                  duration: 0.25,
                });
              }}
            >
              Daha Fazla Bilgi
            </button>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="mt-12 grid grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="stat-card flex flex-col items-center rounded-xl py-4 px-2"
                style={{
                  background: "rgba(0,30,80,0.4)",
                  border: "1px solid rgba(0,150,255,0.2)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span
                  className="text-xl font-black mb-1"
                  style={{
                    color: "#00d4ff",
                    textShadow: "0 0 10px rgba(0,200,255,0.5)",
                  }}
                >
                  {s.value}
                </span>
                <span className="text-xs font-medium text-center" style={{ color: "rgba(150,190,220,0.7)" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: 3D Canvas ── */}
        <div className="relative w-full lg:w-1/2" style={{ height: "100vh" }}>
          {/* Vignette edges */}
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, #020818 100%)",
            }}
          />

          {/* HUD ring decoration */}
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <div
              className="animate-float rounded-full"
              style={{
                width: "420px",
                height: "420px",
                border: "1px solid rgba(0,200,255,0.12)",
                boxShadow: "0 0 40px rgba(0,100,255,0.08), inset 0 0 40px rgba(0,100,255,0.04)",
              }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <div
              className="rounded-full"
              style={{
                width: "320px",
                height: "320px",
                border: "1px dashed rgba(0,200,255,0.08)",
                animation: "spin 30s linear infinite",
              }}
            />
          </div>

          {/* HUD labels */}
          <div
            className="pointer-events-none absolute top-1/2 right-8 z-20 -translate-y-1/2 flex flex-col gap-6 text-right"
            style={{ color: "rgba(0,200,255,0.5)" }}
          >
            {["NODE:247", "CONN:1.2K", "LATENCY:1.4ms", "STATUS:SECURE"].map((label) => (
              <div key={label} className="text-xs font-mono tracking-widest">
                <span className="animate-blink mr-1">▶</span>
                {label}
              </div>
            ))}
          </div>

          <PlexusSphere />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(to bottom, transparent, #020818)",
        }}
      />

      {/* Spin keyframe inline */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
