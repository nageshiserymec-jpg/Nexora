import axios from "axios";
import React, { useEffect, useState } from "react";
import GraphIcon from "./line-chart.png";
import { Link } from "react-router-dom";

const Result = ({ last }) => {
  const [colleges, setColleges] = useState([]);
  const [casteRank, setCasteRank] = useState("GM");
  const [loading, setLoading] = useState(false);
  const [graph, setGraph] = useState("");

  const baseUrls = {
    engineering: `${import.meta.env.VITE_BACKEND_URL}/clg`,
    agriculture: `${import.meta.env.VITE_BACKEND_URL}/agri`,
    veterinary: `${import.meta.env.VITE_BACKEND_URL}/vet`,
    pharmacy: `${import.meta.env.VITE_BACKEND_URL}/phr`,
  };

  const fetchUrl = (degree, rank, branch) => {
    return degree === "engineering"
      ? `${baseUrls[degree]}/${rank}/${branch}`
      : `${baseUrls[degree]}/${rank}`;
  };

  const calculateChance = (casteRank, userRank) => {
    return casteRank >= userRank
      ? 100
      : Math.max(0, (1 - (userRank - casteRank) / userRank) * 100);
  };

  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        let url = "";
        const { degree, rank, branch, caste } = last;

        if (degree && rank) {
          url = fetchUrl(degree, rank, branch);
        }

        if (url) {
          const response = await axios.get(url);
          setColleges(response.data.colleges);
          setCasteRank(
            { GM: "gm_rank", SC: "sc_rank", ST: "st_rank", OBC: "obc_rank" }[
              caste
            ] || "gm_rank"
          );
        }
      } catch (error) {
        console.error("Error fetching colleges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
    setGraph(last.degree);
  }, [last.rank, last.branch, last.degree, last.caste]);

  return (
    <div className="min-h-svh bg-gradient-to-br from-[#283c86] to-[#45a247] text-white">
      <div className="p-6 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 text-lg sm:text-2xl font-bold text-center gap-6">
          <h1>
            Your Rank: <b>{last.rank}</b>
          </h1>
          {last.degree && (
            <h2>
              Degree: <b>{last.degree}</b>
            </h2>
          )}
          <h2>
            Branch: <b>{last.degree === "engineering" ? last.branch : "N/A"}</b>
          </h2>
          <h2>
            Category: <b>{last.caste}</b>
          </h2>
        </div>

        <hr className="w-2/3 h-1 bg-gray-400 rounded mx-auto my-6" />

        <h1 className="text-center text-3xl sm:text-5xl my-6 font-bold">
          Matching Colleges
        </h1>

        {loading ? (
          <div className="text-center text-xl font-semibold">Loading...</div>
        ) : colleges.length === 0 ? (
          <div className="text-center text-xl font-semibold text-gray-300">
            No colleges match your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-1 sm:grid-cols-4 text-sm sm:text-lg font-semibold rounded-md bg-white/20 border border-white/30">
              <div className="border border-white/30 p-3 text-center text-white">
                College ID
              </div>
              <div className="border border-white/30 p-3 text-center text-white">
                College Name
              </div>
              <div className="border border-white/30 p-3 text-center text-white">
                Predicted Cut-off
              </div>
              <div className="border border-white/30 p-3 text-center text-white">
                Chances (%)
              </div>
            </div>

            <ul className="font-semibold">
              {colleges
                .sort((a, b) => {
                  const chanceA = calculateChance(a[casteRank], last.rank);
                  const chanceB = calculateChance(b[casteRank], last.rank);
                  return chanceA === chanceB
                    ? a[casteRank] - b[casteRank]
                    : chanceA - chanceB;
                })
                .map((college, index) => (
                  <li key={college._id}>
                    <div
                      className={`grid grid-cols-1 sm:grid-cols-4 text-sm sm:text-lg p-3 ${
                        index % 2 === 0 ? "bg-white/10" : "bg-white/20"
                      } border-b border-white/30 rounded-md sm:rounded-none`}>
                      <div className="p-3 text-center font-medium sm:font-normal">
                        <span className="sm:hidden font-bold">
                          College ID:{" "}
                        </span>
                        {college.college_id}
                      </div>
                      <div className="p-3 text-center font-medium sm:font-normal">
                        <span className="sm:hidden font-bold">
                          College Name:{" "}
                        </span>
                        {college.college_name}
                      </div>
                      <div className="p-3 text-center font-medium sm:font-normal">
                        <span className="sm:hidden font-bold">
                          Predicted Cut-off:{" "}
                        </span>
                        {college[casteRank]}
                      </div>
                      <div className="p-3 text-center font-medium sm:font-normal">
                        <span className="sm:hidden font-bold">Chances: </span>
                        {calculateChance(college[casteRank], last.rank).toFixed(
                          2
                        )}
                        %
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      {graph === "engineering" && (
        <button className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-white hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full p-3 sm:p-5 shadow-lg transition">
          <Link to="/cetGraph">
            <img src={GraphIcon} className="h-8 sm:h-12" alt="Graph Icon" />
          </Link>
        </button>
      )}
    </div>
  );
};

export default Result;
