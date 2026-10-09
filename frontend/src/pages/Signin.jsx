import { useContext, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import bg from "../assets/authBg.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { dataContext } from "../context/data.context.js";

function Signin() {
  const { serverUrl, setUserData } = useContext(dataContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handler = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/login`,
        { email, password },
        { withCredentials: true }
      );

      setEmail("");
      setPassword("");
      setUserData(data.user);
      navigate("/");
    } catch (error) {
      setErr(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),transparent_35%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/70 shadow-[0_30px_80px_rgba(15,23,42,0.75)] backdrop-blur-xl md:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden flex-col justify-between bg-gradient-to-br from-sky-600/15 via-slate-950/80 to-violet-600/20 p-8 md:flex">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-lg font-bold text-slate-950 shadow-lg shadow-cyan-500/30">
                V
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Workspace</p>
                <h2 className="text-xl font-semibold">Virtual Assistant</h2>
              </div>
            </div>

            <div className="space-y-6 text-white">
              <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
                Your workspace, ready when you are
              </div>

              <h1 className="max-w-sm text-4xl font-semibold leading-tight text-white">
                Pick up right where your ideas begin.
              </h1>

              <p className="max-w-md text-base text-slate-300">
                Sign in to return to your personalized assistant, keep your workflows moving, and bring everything together in one place.
              </p>

              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                  AI workflows
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                  Smart automation
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                  Personal dashboard
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-300">
              <div className="flex -space-x-2">
                {["A", "B", "C"].map((letter, index) => (
                  <div
                    key={letter}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border border-slate-600 text-xs font-semibold text-white ${
                      index === 0 ? "bg-blue-500" : index === 1 ? "bg-violet-500" : "bg-cyan-500"
                    }`}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <p className="text-sm">
                Trusted by <span className="font-semibold text-white">2,000+</span> creators and teams
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
            <form onSubmit={handler} className="w-full max-w-md">
              <div className="mb-8 text-center md:text-left">
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                  Welcome back
                </p>
                <h2 className="text-3xl font-bold text-white sm:text-4xl">Sign in</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Enter your details to access your account.
                </p>
              </div>

              <div className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">Email address</span>
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/30"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">Password</span>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 pr-12 text-base text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/30"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-300 transition hover:bg-white/5 hover:text-white"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <IoEyeOff className="h-5 w-5" /> : <IoEye className="h-5 w-5" />}
                    </button>
                  </div>
                </label>
              </div>

              {err.length > 0 && (
                <p role="alert" className="mt-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
                  {err}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:scale-[1.01] hover:shadow-xl hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-300">
                <span>Don&apos;t have an account?</span>
                <button
                  type="button"
                  className="font-semibold text-cyan-300 transition hover:text-cyan-200"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
