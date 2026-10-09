import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBackSharp } from "react-icons/io5";
import { dataContext } from "../context/data.context.js";

function Customize2() {
  const {
    serverUrl,
    userdata,
    setUserData,
    backendimage,
    setFrontendImage,
    selectimage,
    setBackendImage,
    setSelectImage,
  } = useContext(dataContext);
  const [assistantName, setAssistantName] = useState(userdata?.assistantName || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!selectimage) {
      setError("Please select an assistant image first.");
      return;
    }

    const trimmedName = assistantName.trim();
    if (!trimmedName) {
      setError("Please enter a name for your assistant.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("assistantName", trimmedName);
      if (backendimage) {
        formData.append("assistantimage", backendimage);
      } else {
        formData.append("imageUrl", selectimage);
      }

      const { data } = await axios.post(`${serverUrl}/api/update`, formData, {
        withCredentials: true,
      });

      setUserData(data.user);
      setFrontendImage(null);
      setBackendImage(null);
      setSelectImage(null);
      navigate("/");
    } catch (submitError) {
      console.error(
        "Failed to update assistant:",
        submitError.response?.data?.message || submitError.message
      );
      setError(
        submitError.response?.data?.message ||
          submitError.message ||
          "Assistant update failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-20 text-white sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.25),transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.16),transparent_35%)]" />

      <button
        type="button"
        aria-label="Back to assistant portraits"
        className="absolute left-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-cyan-400/40 hover:bg-white/10 hover:text-white sm:left-8 sm:top-8"
        onClick={() => navigate("/customize")}
      >
        <IoArrowBackSharp className="h-5 w-5" />
      </button>

      <div className="relative z-10 w-full max-w-5xl">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300 sm:text-sm">
            Final step
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Make it yours
          </h1>
          <p className="mt-3 text-sm text-slate-300 sm:text-base">
            Give your assistant a name and you&apos;re ready to go.
          </p>
        </div>

        <div className="grid overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/70 shadow-[0_30px_80px_rgba(15,23,42,0.75)] backdrop-blur-xl md:grid-cols-[0.9fr_1.1fr]">
          <section className="flex flex-col items-center justify-center bg-gradient-to-br from-sky-600/10 via-slate-950/50 to-violet-600/15 p-6 sm:p-9">
            <div className="mb-4 flex w-full max-w-xs items-center justify-between text-sm">
              <span className="font-medium text-slate-200">Your assistant</span>
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                Portrait selected
              </span>
            </div>
            <div className="aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl shadow-slate-950/60">
              {selectimage ? (
                <img
                  src={selectimage}
                  alt="Selected assistant portrait"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-slate-400">
                  <span className="text-4xl text-cyan-300" aria-hidden="true">✦</span>
                  <p className="px-6 text-sm">No portrait selected yet</p>
                  <button
                    type="button"
                    className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                    onClick={() => navigate("/customize")}
                  >
                    Choose a portrait
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="flex items-center p-6 sm:p-9 lg:p-12">
            <form onSubmit={handleSubmit} className="w-full">
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
                Personal details
              </p>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                What should we call it?
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Choose a name that feels natural. You can always update your assistant later.
              </p>

              <label htmlFor="assistant-name" className="mb-2 mt-8 block text-sm font-medium text-slate-200">
                Assistant name
              </label>
              <input
                id="assistant-name"
                type="text"
                placeholder="For example, Shifra"
                autoComplete="off"
                maxLength={40}
                required
                className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/30"
                value={assistantName}
                onChange={(event) => setAssistantName(event.target.value)}
              />
              <p className="mt-2 text-xs text-slate-500">
                Use up to 40 characters.
              </p>

              {error && (
                <p
                  role="alert"
                  className="mt-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-7 flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-5 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating your assistant..." : "Create my assistant"}
              </button>
              <p className="mt-4 text-center text-xs text-slate-500">
                Your assistant is just one step away.
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Customize2;
