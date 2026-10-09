import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { dataContext } from "../context/data.context.js";
import { useNavigate } from "react-router-dom";
import userImg from "../assets/user.gif";
import aiImg from "../assets/ai.gif";
import axios from "axios";

function Home() {
  const { serverUrl, userdata, setUserData, getGeminiResponse } =
    useContext(dataContext);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const navigate = useNavigate();
  const isSpeakingRef = useRef(false);
  const isProcessingRef = useRef(false);
  const recognitionRef = useRef(null);

  const handlerLogOut = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/logout`,
        {},
        { withCredentials: true },
      );
      setUserData(null);
      navigate("/signin");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || err.message || "Logout failed.",
      );
    }
  };

  const speak = useCallback((text) => {
    if (!text) {
      console.error("Speech was not started: response text is empty.");
      return;
    }

    if (
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)
    ) {
      console.error("Speech synthesis is not supported by this browser.");
      return;
    }

    try {
      isSpeakingRef.current = false;
      setIsAssistantSpeaking(false);
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      isSpeakingRef.current = true;
      setIsAssistantSpeaking(true);

      utterance.onstart = () => {
        isSpeakingRef.current = true;
        setIsAssistantSpeaking(true);
      };

      utterance.onend = () => {
        isSpeakingRef.current = false;
        setIsAssistantSpeaking(false);
      };

      utterance.onerror = (event) => {
        isSpeakingRef.current = false;
        setIsAssistantSpeaking(false);
        console.error("Speech playback failed:", event.error);
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      isSpeakingRef.current = false;
      setIsAssistantSpeaking(false);
      console.error("Failed to start speech playback:", error);
    }
  }, []);

  const handleCommand = useCallback((data) => {
    if (!data || typeof data.response !== "string" || !data.response.trim()) {
      throw new Error("Assistant returned an empty response.");
    }

    const { type, userinput, response } = data;
    speak(response);

    switch (type) {
      case "google_open":
        window.location.assign("https://www.google.com/");
        break;
      case "google_search":
      case "youtube_search":
      case "youtube_play": {
        if (!userinput) {
          console.error(`No search query provided for "${type}".`);
          return;
        }

        const query = encodeURIComponent(userinput);
        const url =
          type === "google_search"
            ? `https://www.google.com/search?q=${query}`
            : `https://www.youtube.com/results?search_query=${query}`;
        window.open(url, "_blank", "noopener,noreferrer");
        break;
      }
      case "calculator_open":
        window.open("https://www.google.com/search?q=calculator", "_blank", "noopener,noreferrer");
        break;
      case "instagram_open":
        window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
        break;
      case "facebook_open":
        window.open("https://www.facebook.com/", "_blank", "noopener,noreferrer");
        break;
      case "google_maps": {
        const query = encodeURIComponent(userinput || "");
        window.open(`https://www.google.com/maps/search/${query}`, "_blank", "noopener,noreferrer");
        break;
      }
      case "weather_show": {
        const query = encodeURIComponent(userinput || "weather");
        window.open(`https://www.google.com/search?q=${query}`, "_blank", "noopener,noreferrer");
        break;
      }
      default:
        break;
    }
  }, [speak]);

  useEffect(() => {
    const assistantName = userdata?.assistantName?.trim();
    if (!assistantName) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech recognition is not supported by this browser.");
      return;
    }

    try {
      recognitionRef.current = new SpeechRecognition();
    } catch (error) {
      console.error("Failed to create speech recognition:", error);
      return;
    }

    const recognition = recognitionRef.current;
    recognition.continuous = true;
    recognition.lang = "en-IN";

    let isListening = false;
    let isStarting = false;
    let isDisposed = false;

    const startRecognition = () => {
      if (isDisposed || isListening || isStarting) return;

      isStarting = true;
      try {
        recognition.start();
      } catch (error) {
        isStarting = false;
        console.error("Failed to start speech recognition:", error);
      }
    };

    recognition.onstart = () => {
      isStarting = false;
      isListening = true;
      if (isDisposed) {
        try {
          recognition.stop();
        } catch (error) {
          console.error("Failed to stop disposed speech recognition:", error);
        }
        return;
      }
      console.log("Speech recognition started.");
    };

    recognition.onend = () => {
      isStarting = false;
      isListening = false;
      console.log("Speech recognition ended.");
    };

    recognition.onresult = async (event) => {
      if (isSpeakingRef.current || isProcessingRef.current) {
        return;
      }

      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();
      if (
        transcript
          .toLocaleLowerCase()
          .includes(assistantName.toLocaleLowerCase())
      ) {
        isProcessingRef.current = true;
        setIsProcessing(true);
        setErrorMessage("");
        setAiText("");
        setUserText(transcript);
        try {
          const response = await getGeminiResponse(transcript);
          handleCommand(response);
          setAiText(response.response);
        } catch (error) {
          setErrorMessage(
            error.response?.data?.message ||
              error.message ||
              "Sorry, I couldn't process that request.",
          );
        } finally {
          isProcessingRef.current = false;
          setIsProcessing(false);
        }
      }
    };

    recognition.onerror = (event) => {
      isStarting = false;
      console.log(event.error || "Speech recognition failed.");
    };

    startRecognition();
    const recognitionCheck = window.setInterval(startRecognition, 10000);

    return () => {
      isDisposed = true;
      window.clearInterval(recognitionCheck);
      if (isListening) {
        try {
          recognition.stop();
        } catch (error) {
          console.error("Failed to stop speech recognition:", error);
        }
      }
      recognitionRef.current = null;
    };
  }, [getGeminiResponse, handleCommand, userdata?.assistantName]);

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center overflow-x-hidden bg-gradient-to-b from-[#05052b] via-[#020217] to-black px-4 pb-10 pt-24 text-white sm:px-6">
      <header className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 border-b border-white/10 bg-black/20 px-4 py-4 backdrop-blur sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={userdata?.assistantImage}
            className="h-11 w-11 shrink-0 rounded-full border border-blue-300/60 object-cover"
            alt=""
          />
          <div className="min-w-0">
            <h1 className="truncate font-semibold">{userdata?.assistantName}</h1>
            <p className="text-xs text-blue-200/75">Your personal assistant</p>
          </div>
        </div>
        <nav className="flex shrink-0 items-center gap-2">
          <button
            className="rounded-lg border border-white/15 px-3 py-2 text-sm text-white/90 transition hover:bg-white/10 sm:px-4"
            onClick={() => navigate("/customize")}
          >
            <span className="sm:hidden">Customize</span>
            <span className="hidden sm:inline">Change assistant</span>
          </button>
          <button
            className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-blue-100 sm:px-4"
            onClick={handlerLogOut}
          >
            Log out
          </button>
        </nav>
      </header>

      <section className="flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-5">
        <div className="flex flex-col items-center">
          <div
            className={`relative flex h-44 w-44 items-center justify-center rounded-full border border-blue-300/30 bg-blue-950/40 shadow-[0_0_70px_rgba(59,130,246,0.2)] sm:h-52 sm:w-52 ${
              isAssistantSpeaking ? "ring-4 ring-blue-400/30" : ""
            }`}
          >
            <img
              src={isProcessing || isAssistantSpeaking ? aiImg : userImg}
              className="h-36 w-36 object-contain sm:h-44 sm:w-44"
              alt={
                isProcessing || isAssistantSpeaking
                  ? "Assistant responding"
                  : "Assistant listening"
              }
            />
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <span
              className={`h-2 w-2 rounded-full ${
                isProcessing
                  ? "animate-pulse bg-amber-300"
                  : isAssistantSpeaking
                    ? "animate-pulse bg-blue-300"
                    : "bg-emerald-400"
              }`}
            />
            <p className="text-sm text-white/80" aria-live="polite">
              {isProcessing
                ? "Thinking..."
                : isAssistantSpeaking
                  ? "Speaking..."
                  : "Listening for your command"}
            </p>
          </div>
        </div>

        <div className="w-full space-y-3" aria-live="polite">
          {userText && (
            <div className="ml-auto max-w-[90%] rounded-2xl rounded-br-sm border border-blue-300/20 bg-blue-500/15 px-4 py-3 sm:max-w-[80%]">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-200">
                You
              </p>
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-white/90">
                {userText}
              </p>
            </div>
          )}
          {isProcessing && (
            <div className="mr-auto rounded-2xl rounded-bl-sm border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
              Preparing a response...
            </div>
          )}
          {aiText && (
            <div className="mr-auto max-w-[95%] rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.08] px-4 py-3 shadow-lg shadow-black/10 sm:max-w-[85%]">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
                {userdata?.assistantName || "Assistant"}
              </p>
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-white sm:text-base">
                {aiText}
              </p>
            </div>
          )}
          {errorMessage && (
            <p
              role="alert"
              className="rounded-xl border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            >
              {errorMessage}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default Home;
