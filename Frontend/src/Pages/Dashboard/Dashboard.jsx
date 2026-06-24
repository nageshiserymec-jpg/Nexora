import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ setLast }) => {
  const [all, setAll] = useState({
    rank: 0,
    caste: "GM",
    degree: "engineering",
    branch: "Artificial Intelligence and Machine Learning",
  });

  const [range, setRange] = useState(1);

  const [selectDegree, setSelectDegree] = useState("engineering");
  const [selectBranch, setSelectBranch] = useState(
    "Artificial Intelligence and Machine Learning"
  );

  const [rank, setRank] = useState("");

  const [selectCaste, setSelectCaste] = useState("GM");

  const [selectedRank, setSelectedRank] = useState("5000");

  const navigate = useNavigate();

  const handleRankChange = (e) => {
    setSelectedRank(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (range && (isNaN(Number(rank)) || rank.trim() === "")) {
      alert("Please enter a valid rank.");
      return;
    }

    if (!range && !selectedRank) {
      alert("Please select a rank range.");
      return;
    }

    const finalRank = range ? rank : selectedRank;

    setAll({
      rank: finalRank,
      caste: selectCaste,
      degree: selectDegree,
      branch: selectBranch,
    });

    navigate("/cetResult");
  };

  useEffect(() => {
    if (all.rank === null) {
      alert("Please enter your rank");
    }
  }, []);

  useEffect(() => {
    setLast(all);
  }, [all]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#283c86] to-[#45a247] flex flex-col items-center px-4 sm:px-6 lg:px-8">
      <section className="bg-black/30 w-full max-w-2xl md:max-w-3xl lg:max-w-4xl mt-20 p-6 sm:p-8 md:p-10 rounded-xl shadow-lg">
        <h2 className="text-white text-lg sm:text-2xl font-bold text-center mb-6">
          Discover Your Path Beyond KCET
        </h2>

        <div className="flex items-center gap-4 bg-black/35 p-4 rounded-lg shadow-md w-full">
          <label
            htmlFor="range"
            className="text-md font-semibold text-white w-full sm:w-auto">
            Rank in Range:
            <span className="text-sm text-gray-400 block">
              Select when unsure of your rank
            </span>
          </label>
          <button
            type="button"
            className={`relative w-14 h-7 flex items-center rounded-full transition-all duration-300 ${
              !range ? "bg-green-500" : "bg-gray-500"
            }`}
            onClick={() => setRange((prev) => !prev)}>
            <div
              className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                !range ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <form
          className="grid gap-6 mt-6 text-white w-full"
          onSubmit={handleSubmit}>
          {range ? (
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
              <label
                htmlFor="rank"
                className="font-bold w-full sm:w-1/3 text-center sm:text-left">
                Rank:
              </label>
              <input
                type="number"
                id="rank"
                name="rank"
                required
                min="1"
                className="w-full px-4 py-2 rounded-lg bg-white text-black border border-gray-600 focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setRank(e.target.value)}
                placeholder="Enter your rank"
              />
            </div>
          ) : (
            <div className="w-full">
              <label className="font-bold block mb-2 text-center sm:text-left">
                Select the rank range:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                {[5000, 10000, 15000, 25000, 35000, 55000, 75000, 95000].map(
                  (value, index) => (
                    <label
                      key={index}
                      className={`block px-4 py-2 text-center rounded cursor-pointer transition-all duration-200 
          ${
            selectedRank === value
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-blue-400 text-black"
          }`}>
                      <input
                        type="radio"
                        name="rank"
                        value={value}
                        className="hidden peer"
                        checked={selectedRank === value}
                        onChange={() => setSelectedRank(value)}
                        required
                      />
                      {index === 0 ? "1K - 5K" : `${value - 5000} - ${value}`}
                    </label>
                  )
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {[
              {
                label: "Caste",
                id: "caste",
                value: selectCaste,
                options: ["GM", "SC", "ST", "OBC"],
                setter: setSelectCaste,
              },
              {
                label: "Degree",
                id: "degree",
                value: selectDegree,
                options: ["engineering", "veterinary", "agriculture"],
                setter: setSelectDegree,
              },
            ].map(({ label, id, value, options, setter }) => (
              <div key={id} className="flex flex-col">
                <label htmlFor={id} className="font-bold">
                  {label}:
                </label>
                <select
                  id={id}
                  name={id}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white text-black border border-gray-600 focus:ring-2 focus:ring-blue-500 w-full capitalize">
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {selectDegree === "engineering" && (
            <div className="flex flex-col w-full">
              <label htmlFor="branch" className="font-bold">
                Branch:
              </label>
              <select
                id="branch"
                name="branch"
                value={selectBranch}
                onChange={(e) => setSelectBranch(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white text-black border border-gray-600 focus:ring-2 focus:ring-blue-500 w-full">
                {[
                  "Artificial Intelligence and Machine Learning",
                  "CE Civil",
                  "CS Computers",
                  "EC Electronics",
                  "EE Electrical",
                  "ME Mechanical",
                ].map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 focus:ring-4 focus:ring-green-500 transition-all duration-200">
            Submit
          </button>
        </form>
      </section>
    </div>
  );
};

export default Dashboard;
