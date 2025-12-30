import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  Star,
  Play,
  Heart,
  ChevronDown,
  ChevronUp,
  ChevronRight,
} from "lucide-react";
import bibleReadingData from "../../biberead.json";

const Home = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [currentReading, setCurrentReading] = useState(null);
  const [allReadings, setAllReadings] = useState([]);

  useEffect(() => {
    const flattened = bibleReadingData.flatMap((month) =>
      month.reading_plan.map((r) => ({ ...r }))
    );
    setAllReadings(flattened);

    const today = new Date().toISOString().split("T")[0];
    setCurrentReading(flattened.find((r) => r.date === today));
  }, []);

  const toggleSection = (key) =>
    setExpandedSection((prev) => (prev === key ? null : key));

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="w-full">
      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* ================= LEFT : IMAGE ================= */}
        <div className="lg:col-span-2">
          <div className="relative h-[420px] lg:h-[520px] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://res.cloudinary.com/dadapse5k/image/upload/v1758990986/Gemini_Generated_Image_4fjw3j4fjw3j4fjw_ojm5ya.png"
              alt="Church Ministry"
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 p-8 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  Featured Ministry
                </span>
              </div>

              <h2 className="text-3xl font-bold mb-2">Welcome to WFC</h2>
              <p className="text-gray-200 mb-4">
                Building Faith • Growing Community • Serving Together
              </p>

              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition">
                <Play size={16} />
                Explore Ministry
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT : BIBLE READING ================= */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 h-[420px] lg:h-[520px] flex flex-col">

            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-6 text-white rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <BookOpen />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Today’s Reading</h3>
                    <p className="text-indigo-100">Daily Bible Plan</p>
                  </div>
                </div>

                <div className="text-right text-sm text-indigo-100">
                  <div className="flex items-center gap-2 justify-end">
                    <Calendar size={14} />
                    {currentReading
                      ? formatDate(currentReading.date)
                      : formatDate(new Date())}
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <Clock size={14} />
                    15–20 min
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {currentReading ? (
                currentReading.chapters.map((chapter, i) => {
                  const key = `section-${i}`;
                  const open = expandedSection === key;

                  return (
                    <div
                      key={i}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleSection(key)}
                        className="w-full p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                            Scripture
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {chapter}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                          {open ? <ChevronUp /> : <ChevronDown />}
                        </div>
                      </button>

                      {open && (
                        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-gray-700 dark:text-gray-300 mb-3">
                            Reflect on {chapter} and how God’s word applies today.
                          </p>
                          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm italic text-gray-600 dark:text-gray-400">
                            “Your word is a lamp to my feet and a light to my path.” – Psalm 119:105
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  No reading available today.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
