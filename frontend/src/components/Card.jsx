import { useContext } from "react";
import { dataContext } from "../context/data.context.js";

function Card({ image, name }) {
  const { setFrontendImage, setBackendImage, selectimage, setSelectImage } =
    useContext(dataContext);
  const isSelected = selectimage === image;

  const handleSelect = () => {
    setBackendImage(null);
    setFrontendImage(null);
    setSelectImage(image);
  };

  return (
    <button
      type="button"
      aria-label={name}
      aria-pressed={isSelected}
      onClick={handleSelect}
      className={`group relative aspect-[3/4] overflow-hidden rounded-2xl border bg-slate-900 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
        isSelected
          ? "border-cyan-300 ring-2 ring-cyan-300/70 ring-offset-2 ring-offset-slate-950"
          : "border-white/10 hover:border-cyan-300/60"
      }`}
    >
      <img
        src={image}
        alt=""
        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />
      <span
        className={`absolute inset-x-0 bottom-0 px-3 py-3 text-left text-xs font-medium backdrop-blur-sm transition sm:text-sm ${
          isSelected
            ? "bg-cyan-950/80 text-cyan-100"
            : "bg-slate-950/65 text-slate-200 group-hover:bg-slate-950/80"
        }`}
      >
        {isSelected ? "Selected" : name}
      </span>
    </button>
  );
}

export default Card;
