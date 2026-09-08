import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LuArrowLeft, LuLayoutDashboard } from "react-icons/lu";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#1E1B4B] flex items-center justify-center p-6 text-white font-sans">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute w-56 h-56 bg-[#6366F1]/30 rounded-full blur-3xl -z-10" />

          <svg
            viewBox="0 0 200 160"
            className="w-48 h-40 drop-shadow-[0_20px_30px_rgba(79,70,229,0.35)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="cloudGrad"
                x1="20"
                y1="20"
                x2="180"
                y2="140"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#7C3AED" />
                <stop offset="1" stopColor="#4F46E5" />
              </linearGradient>
              <linearGradient
                id="serverGrad"
                x1="60"
                y1="70"
                x2="140"
                y2="130"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#312E81" />
                <stop offset="1" stopColor="#1E1B4B" />
              </linearGradient>
            </defs>

            <path
              d="M145 130H55C32.9 130 15 112.1 15 90c0-19.3 13.7-35.4 32-39.2C51.2 28.5 71.6 12 96 12c28.2 0 51.5 21.8 53.8 49.5C167.3 64.2 181 80.5 181 100c0 16.6-16.1 30-36 30z"
              fill="url(#cloudGrad)"
            />

            <rect
              x="62"
              y="65"
              width="76"
              height="22"
              rx="5"
              fill="url(#serverGrad)"
              stroke="#818CF8"
              strokeWidth="1.5"
            />
            <circle cx="74" cy="76" r="2.5" fill="#34D399" />
            <line
              x1="84"
              y1="76"
              x2="126"
              y2="76"
              stroke="#6366F1"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <rect
              x="62"
              y="93"
              width="76"
              height="22"
              rx="5"
              fill="url(#serverGrad)"
              stroke="#818CF8"
              strokeWidth="1.5"
            />
            <circle cx="74" cy="104" r="2.5" fill="#F87171" />
            <line
              x1="84"
              y1="104"
              x2="126"
              y2="104"
              stroke="#6366F1"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight text-white mb-2">
          404
        </h1>

        <h2 className="text-xl font-semibold text-[#E0E7FF] mb-3">
          Page Not Found
        </h2>

        <p className="text-sm text-[#A5B4FC] mb-2">
          The requested URL path is not valid:
        </p>
        <div className="bg-[#2E286D]/80 border border-[#4338CA] px-3.5 py-1.5 rounded-lg text-xs font-mono text-[#C7D2FE] break-all max-w-sm mb-6">
          {location.pathname || "/unknown-route"}
        </div>

        <div className="flex items-center justify-center gap-3 w-full">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#4F46E5] bg-[#312E81]/60 hover:bg-[#3730A3] text-white text-sm font-medium transition-all active:scale-[0.98]"
          >
            <LuArrowLeft className="text-base" />
            Go Back
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white text-sm font-medium shadow-md shadow-indigo-950/40 transition-all active:scale-[0.98]"
          >
            <LuLayoutDashboard className="text-base" />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
