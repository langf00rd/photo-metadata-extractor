import Image from "next/image";
import Link from "next/link";

const PHOTOS = [
  { src: "/screenshots/1.png", rotate: "-rotate-2", top: "12%", left: "2%" },
  { src: "/screenshots/2.png", rotate: "rotate-3", top: "5%", left: "22%" },
  { src: "/screenshots/3.png", rotate: "-rotate-1", top: "8%", left: "58%" },
  { src: "/screenshots/4.png", rotate: "rotate-2", top: "3%", left: "78%" },
  { src: "/screenshots/3.png", rotate: "rotate-1", top: "55%", left: "1%" },
  { src: "/screenshots/1.png", rotate: "-rotate-3", top: "60%", left: "20%" },
  { src: "/screenshots/4.png", rotate: "rotate-2", top: "52%", left: "60%" },
  { src: "/screenshots/2.png", rotate: "-rotate-1", top: "58%", left: "80%" },
];

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden relative flex items-center justify-center bg-white">
      {PHOTOS.map((p, i) => (
        <div
          key={i}
          className={`absolute ${p.rotate} opacity-90 hover:opacity-100 hover:scale-105 hover:z-10 transition-all duration-300`}
          style={{ top: p.top, left: p.left }}
        >
          <Image
            className="border border-neutral-200 rounded shadow-sm scale-[1.4]"
            src={p.src}
            alt=""
            loading="eager"
            width={220}
            height={280}
          />
        </div>
      ))}

      <div className="relative z-10 max-w-125 space-y-3 text-center bg-white/40 backdrop-blur-sm px-8 py-6 rounded-lg">
        <h1 className="text-3xl tracking-tight text-neutral-900">
          Show your work.
        </h1>
        <p className="text-neutral-500 text-sm leading-relaxed">
          Drop a photo and share the settings behind the shot — camera, lens,
          aperture, ISO, shutter speed. Free, instant, and nothing ever leaves
          your browser.
        </p>
        <Link href="/app">
          <button className="mt-1 bg-black text-white text-sm py-1.5 pb-2 rounded-sm px-4 hover:bg-neutral-800 transition-colors cursor-pointer">
            Try it free
          </button>
        </Link>
      </div>
    </div>
  );
}
