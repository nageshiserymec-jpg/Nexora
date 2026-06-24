import React from "react";
import { Link } from "react-router-dom";

const Home = ({ loged }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#283c86] to-[#45a247] text-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-black/40 backdrop-blur-lg py-24 px-6 md:px-20 rounded-b-[3rem] shadow-xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Chart Your Future with{" "}
            <span className="text-green-300">Nexora</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8">
            ML-powered insights that transform your interests into career
            direction.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="#explore"
              className="bg-green-400 text-black font-semibold px-6 py-2 rounded-full hover:bg-green-300 transition">
              Explore Now
            </Link>
            <a
              href="#about"
              className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition">
              What’s Inside
            </a>
          </div>
        </div>
      </header>

      {/* Zigzag Section */}
      <section id="explore" className="px-6 md:px-20 py-24">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          Tailored Journeys
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              label: "Class 10th",
              desc: "Stream & skill recommendations after 10th based on your interests.",
              path: "/class-10",
              bg: "bg-blue-600/50",
            },
            {
              label: "Class 12th",
              desc: "Explore college paths based on hobbies, skills, and passion.",
              path: "/class-12",
              bg: "bg-purple-600/50",
            },
            {
              label: "After CET",
              desc: "CET rank to course match prediction with real data insights.",
              path: "/cetDashboard",
              bg: "bg-orange-500/50",
            },
          ].map(({ label, desc, path, bg }) => (
            <Link
              to={loged ? path : "/signup"}
              key={label}
              className={`${bg} rounded-xl p-6 shadow-lg hover:scale-105 transition duration-300 text-white`}>
              <h3 className="text-2xl font-semibold mb-3">{label}</h3>
              <p className="text-sm text-gray-200">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Diagonal About Section */}
      <section id="about" className="relative py-24 bg-black/40 px-6 md:px-20">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-black opacity-20 rotate-2"></div>
        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center z-10">
          <div>
            <h2 className="text-4xl font-bold text-green-300 mb-6">
              Why Choose Nexora?
            </h2>
            <ul className="space-y-4 text-gray-200">
              <li>
                <strong className="text-green-400">ML-Powered Matching:</strong>{" "}
                We analyze your interests, not just marks.
              </li>
              <li>
                <strong className="text-green-400">Clear Pathways:</strong>{" "}
                Visualize your future with confidence.
              </li>
              <li>
                <strong className="text-green-400">Post-CET Guidance:</strong>{" "}
                Make sense of ranks and cutoffs.
              </li>
              <li>
                <strong className="text-green-400">Zero Guesswork:</strong>{" "}
                Every suggestion backed by smart data.
              </li>
            </ul>
          </div>
          <div className="relative bg-gradient-to-br from-[#1f1c2c] to-[#928DAB] rounded-3xl h-64 md:h-80 shadow-xl overflow-hidden group">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm group-hover:backdrop-blur-md transition duration-300 z-10"></div>

            <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-6">
              <div className="text-5xl mb-4 animate-bounce">🚀</div>
              <h3 className="text-2xl font-bold">Imagine Your Dream Career</h3>
              <p className="text-sm text-gray-200 mt-2">
                Nexora + You = The Future. Let’s decode your passion!
              </p>
            </div>

            <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-400/30 rounded-full blur-2xl group-hover:scale-125 transition duration-500"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/60 text-white py-6 mt-16 rounded-t-2xl">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm md:text-lg text-gray-400">
            © 2025 Nexora • Built for students, powered by machine learning.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
