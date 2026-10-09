import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { RiImageAddLine } from "react-icons/ri";
import Card from "../components/Card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { dataContext } from "../context/data.context.js";

const assistantImages = [
  { src: image1, name: "Assistant portrait one" },
  { src: image2, name: "Assistant portrait two" },
  { src: image3, name: "Assistant portrait three" },
  { src: image4, name: "Assistant portrait four" },
  { src: image5, name: "Assistant portrait five" },
  { src: image6, name: "Assistant portrait six" },
  { src: image7, name: "Assistant portrait seven" },
];

export default function Customize() {
  const navigate = useNavigate();
  const {
    frontendimage,
    setFrontendImage,
    setBackendImage,
    selectimage,
    setSelectImage,
  } = useContext(dataContext);

  const handleChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setBackendImage(file);
    setFrontendImage(imageUrl);
    setSelectImage(imageUrl);
    event.target.value = "";
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.25),transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.16),transparent_35%)]" />

      <button
        type="button"
        aria-label="Go back"
        className="absolute left-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-cyan-400/40 hover:bg-white/10 hover:text-white sm:left-8 sm:top-8"
        onClick={() => navigate("/")}
      >
        <IoArrowBackSharp className="h-5 w-5" />
      </button>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center px-4 pb-10 pt-24 sm:px-6 sm:pt-28">
        <div className="mb-9 max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300 sm:text-sm">
            Personalize your workspace
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Choose your assistant
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Pick a portrait that feels right, or upload an image of your own. You can give your assistant a name next.
          </p>
        </div>

        <section
          aria-label="Assistant image options"
          className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4"
        >
          {assistantImages.map(({ src, name }) => (
            <Card key={src} image={src} name={name} />
          ))}

          <label className="group relative flex aspect-[3/4] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-cyan-300/50 bg-white/[0.04] text-center transition hover:border-cyan-200 hover:bg-cyan-400/10 hover:shadow-lg hover:shadow-cyan-950/40 focus-within:ring-2 focus-within:ring-cyan-300 focus-within:ring-offset-2 focus-within:ring-offset-slate-950">
            {frontendimage ? (
              <>
                <img
                  src={frontendimage}
                  alt="Your uploaded assistant portrait"
                  className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-slate-950/80 px-3 py-3 text-sm font-medium text-white backdrop-blur-sm">
                  Change image
                </span>
              </>
            ) : (
              <span className="flex flex-col items-center px-3">
                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 transition group-hover:bg-cyan-400/20">
                  <RiImageAddLine className="h-6 w-6" />
                </span>
                <span className="text-sm font-semibold text-white">Upload your own</span>
                <span className="mt-1 text-xs text-slate-400">Choose an image</span>
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              aria-label="Upload an assistant image"
              onChange={handleChange}
            />
          </label>
        </section>

        <div className="mt-8 flex w-full max-w-3xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-slate-400" aria-live="polite">
            {selectimage ? "Portrait selected. You can change it any time." : "Select a portrait to continue."}
          </p>
          {selectimage && (
            <button
              type="button"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-7 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/20 sm:w-auto"
              onClick={() => navigate("/customize2")}
            >
              Continue
              <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
