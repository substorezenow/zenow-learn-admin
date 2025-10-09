"use client";
import { motion } from "framer-motion";
import { BookOpen, Loader } from "lucide-react";
import { useEffect } from "react";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/login";
    },3000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="relative  min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        className="absolute -top-32 -left-32 w-96 h-96 bg-pink-400 opacity-30 rounded-full filter blur-3xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-400 opacity-30 rounded-full filter blur-3xl"
        animate={{ scale: [1, 1.1, 1], rotate: [0, -360, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />

      {/* Logo with animation and learn icon */}
      {/* Unique and interesting animated loader higher on the screen */}
      <motion.div
        className="z-10 mt-10 sm:mt-16 relative flex items-center justify-center"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.7, type: "spring" }}
      >
        {/* Animated BookOpen icon with pulsing and floating */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.15, 1],
            color: ["#fff", "#a5b4fc", "#f472b6", "#fff"],
          }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="relative"
        >
          <BookOpen className="w-12 h-12 drop-shadow-xl" />
          {/* Sparkles */}
          <motion.svg
            className="absolute -top-3 -left-4 w-5 h-5 text-pink-300 opacity-80"
            initial={{ scale: 0.7, opacity: 0.7 }}
            animate={{ scale: [0.7, 1.2, 0.7], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </motion.svg>
          <motion.svg
            className="absolute -bottom-3 -right-4 w-4 h-4 text-indigo-300 opacity-80"
            initial={{ scale: 0.7, opacity: 0.7 }}
            animate={{ scale: [0.7, 1.1, 0.7], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: 0.7 }}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="2"
              stroke="currentColor"
              strokeWidth="2"
            />
          </motion.svg>
        </motion.div>
      </motion.div>
      {/* Animated Loader icon (Lucide) */}

      {/* Animated title */}
      <motion.h1
        className="z-10 font-extrabold text-white drop-shadow-md sm:drop-shadow-lg text-center mb-2 mt-4 sm:mb-4 px-2 sm:px-0 break-words"
        style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
      >
        Welcome to{" "}
        <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-lg whitespace-nowrap">
          Zenow Academy
        </span>
      </motion.h1>

      {/* Animated subtitle */}
      <motion.p
        className="z-10 text-white/80 mb-6 sm:mb-8 text-center max-w-xs sm:max-w-xl px-2 sm:px-0 drop-shadow-sm sm:drop-shadow-md"
        style={{ fontSize: "clamp(1.1rem, 3vw, 2rem)" }}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.7, type: "spring" }}
      >
        Empowering your learning journey with modern tools and a vibrant
        community.
      </motion.p>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="relative"
      >
        <Loader className="w-14 h-14 text-white/90 drop-shadow-xl" />
      </motion.div>
    </div>
  );
}
