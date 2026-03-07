import React from "react";

const HeroSection = () => {
  return (
    <section className="py-6">
      <div className="max-w-300 mx-auto ">
        <div className="bg-[#f3e3c9] rounded-2xl p-10 md:px-16 md:py-4 shadow-md ">
          <div className="grid grid-cols-12 gap-8 items-center">
            {/* Left */}
            <div className="col-span-12 md:col-span-5">
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#1f1a16] leading-tight mb-6">
                Your Library
              </h1>
              <p className="text-gray-700 text-lg md:text-xl max-w-[38ch] mb-8">
                Convert your books into interactive AI conversations. Listen,
                learn, and discuss your favorite reads.
              </p>

              <button className="inline-flex items-center gap-3 bg-white text-[#1f1a16] font-semibold px-6 py-3 rounded-lg shadow hover:shadow-lg transition">
                <span className="text-2xl">+</span>
                <span>Add new book</span>
              </button>
            </div>

            {/* Center */}
            <div className="col-span-12 md:col-span-4 flex justify-center md:justify-center relative">
              <img
                src="/assets/hero-illustration.png"
                alt="vintage books and globe"
                className="w-[320px] md:w-105 lg:w-120 object-contain"
              />
            </div>

            {/* Right */}
            <div className="col-span-12 md:col-span-3 flex justify-center md:justify-end">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-[#e6cfaf] flex items-center justify-center text-[#1f1a16] font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#1f1a16]">
                        Upload PDF
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Add your book file
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-[#e6cfaf] flex items-center justify-center text-[#1f1a16] font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#1f1a16]">
                        AI Processing
                      </h4>
                      <p className="text-gray-600 text-sm">
                        We analyze the content
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-[#e6cfaf] flex items-center justify-center text-[#1f1a16] font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-[#1f1a16]">
                        Voice Chat
                      </h4>
                      <p className="text-gray-600 text-sm">Discuss with AI</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
