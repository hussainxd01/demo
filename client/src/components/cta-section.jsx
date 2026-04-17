import { playfair } from "@/lib/fonts/font";
import { useState } from "react";

const IMAGES = {
  panel1: "/layout1.png",
  panel2: "/layout2.png",
  panelWide: "/layout3.png",
};

function Img({ src, alt }) {
  const [err, setErr] = useState(false);
  return (
    <img
      src={err ? "https://placehold.co/800x800/111?text=." : src}
      alt={alt}
      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      onError={() => setErr(true)}
    />
  );
}

export default function CTASection() {
  return (
    <section>
      {/* Top row — two equal squares */}
      <div className="grid grid-cols-2 sm:grid-cols-2">
        {/* Panel 1 */}
        <div className="relative overflow-hidden group aspect-square">
          <Img src={IMAGES.panel1} alt="Timeless classics" />
          {/* dark gradient at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          {/* text — bottom left, matching reference */}
          <div className="absolute bottom-10 left-8 sm:bottom-12 sm:left-10">
            <h2 className="text-[2rem] sm:text-[2.6rem] font-light leading-[1.05] text-white">
              Timeless{" "}
              <span
                className={`${playfair.className} italic  tracking-tight inline-block font-extralight skew-x-[-6deg]`}
              >
                classics
              </span>
            </h2>
            <button className="mt-4 block text-[11px] tracking-[0.25em] uppercase text-white border-b border-white/60 pb-[2px] hover:border-white transition-colors">
              Explore
            </button>
          </div>
        </div>

        {/* Panel 2 */}
        <div className="relative overflow-hidden group aspect-square">
          <Img src={IMAGES.panel2} alt="Editorial" />
        </div>
      </div>

      {/* Bottom row — full width rectangle */}
      <div
        className="relative overflow-hidden group"
        style={{ aspectRatio: "16/7" }}
      >
        <Img
          src={IMAGES.panelWide}
          alt="The brand designs clothing to make everyone feel unique"
        />
        <div className="absolute inset-0 bg-black/30" />
        {/* text centered, matching reference */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-[2rem] sm:text-[3rem] md:text-[3.5rem] font-light leading-[1.15] text-white max-w-4xl">
            The brand designs clothing to make everyone feel{" "}
            <span
              className={`${playfair.className} italic  tracking-tight inline-block font-extralight skew-x-[-6deg]`}
            >
              unique.
            </span>
          </p>
          <button className="mt-7 text-[11px] tracking-[0.25em] uppercase text-white border border-white/70 rounded-full px-8 py-3 hover:bg-white hover:text-black transition-all duration-300">
            Lookbook
          </button>
        </div>
      </div>
    </section>
  );
}
