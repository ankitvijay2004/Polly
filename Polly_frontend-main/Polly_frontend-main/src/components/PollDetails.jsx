import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const PollDetails = () => {
  const [error, setError] = useState("");
  const [pollDetails, setPollDetails] = useState(null);
  const [copied, setCopied] = useState(false);
  const { pollId } = useParams();

  useEffect(() => {
    const fetchPollDetails = async () => {
      if (!pollId) {
        setError("Poll ID is missing");
        return;
      }

      try {
        const response = await axios.post(
          "https://polly-backend.onrender.com/api/poll/fetch",
          { pollId }
        );

        if (response.data) {
          setPollDetails(response.data);
        } else {
          setError("Poll not found");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Internal server error");
      }
    };

    fetchPollDetails();
  }, [pollId]);

  // Prepare data for the Pie Chart
  const chartData = pollDetails
    ? {
        labels: pollDetails.options.map((option) => option.option),
        datasets: [
          {
            data: pollDetails.options.map((option) => option.votes),
            backgroundColor: [
              "#ede8c3",
              "#81B29A",
              "#E07A5F",
              "#5E6472",
              "#9A8C98",
              "#8D99AE",
              "#886F68",
              "#726E97",
            ],
          },
        ],
      }
    : null;

  const handleCopy = () => {
    const url = `https://polly-ccc.netlify.app/vote/${pollId}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="min-h-screen bg-[var(--retro_bg_dark)] text-[var(--retro_blue)] p-8 overflow-hidden">
      {error ? (
        <div className="text-red-500 text-lg">{error}</div>
      ) : pollDetails ? (
        <div className="max-w-4xl mx-auto bg-[var(--retro_blue)] text-[var(--retro_bg_dark)] rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold">{pollDetails.title}</h1>
          <p className="text-lg mt-4">{pollDetails.description}</p>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Vote Distribution</h2>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="w-full lg:w-1/2">
                <Pie data={chartData} />
              </div>
              <div className="w-full lg:w-1/2">
                <ul className="space-y-4">
                  {pollDetails.options.map((option, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center p-4 bg-[var(--retro_bg_dark)] text-[var(--retro_blue)] rounded-lg"
                    >
                      <span className="text-lg font-medium">
                        {option.option}
                      </span>
                      <span className="text-lg font-semibold">
                        Votes: {option.votes}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-lg">
              <strong>Total Votes:</strong> {pollDetails.totalVotes}
            </p>
            <p className="text-lg">
              <strong>Status:</strong>{" "}
              {pollDetails.active ? (
                <span className="text-[var(--retro_green)] font-bold">
                  Active
                </span>
              ) : (
                <span className="text-[var(--retro_red)] font-bold">
                  Inactive
                </span>
              )}
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="w-full sm:w-1/2 lg:w-1/3 bg-[var(--retro_bg_light)] rounded-lg text-[var(--retro_blue)] cursor-pointer p-2 transition-all duration-300 hover:bg-opacity-80 active:scale-95"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      ) : (
        <div className="text-[var(--retro_blue)] text-center text-lg">
          Loading poll details...
        </div>
      )}
    </div>
  );
};

export default PollDetails;
