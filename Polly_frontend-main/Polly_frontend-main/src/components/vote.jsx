import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../App.css";

const VotePage = () => {
  const { pollId } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [voterIP, setVoterIP] = useState("");
  const [popup, setPopup] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPollDetails = async () => {
      try {
        const response = await axios.post(
          "https://polly-backend.onrender.com/api/poll/fetch",
          { pollId }
        );
        console.log(response.data);
        setPoll(response.data);
      } catch (error) {
        showPopup(
          error.response?.data?.message || "Failed to fetch poll details.",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPollDetails();
  }, [pollId]);

  useEffect(() => {
    const fetchVoterIP = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        setVoterIP(response.data.ip);
      } catch {
        setVoterIP("unknown");
      }
    };

    fetchVoterIP();
  }, []);

  const showPopup = (message, type) => {
    setPopup({ message, type });
    setTimeout(() => setPopup({ message: "", type: "" }), 3000);
  };

  const handleVoteSubmit = async () => {
    if (selectedOptionIndex === null) {
      showPopup("Please select an option before voting.", "error");
      return;
    }

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URI + "/api/poll/vote",
        { pollId, optionNumber: selectedOptionIndex, voterIP }
      );
      showPopup(response.data.message, "success");
    } catch (error) {
      showPopup(
        error.response?.data?.message || "Failed to submit your vote.",
        "error"
      );
    }
  };

  if (isLoading) {
    return <div className="text-center text-cyan-100">Loading...</div>;
  }

  if (poll && !poll.active) {
    return (
      <div className="text-center text-red-500 font-bold">
        This poll is not accepting responses.
      </div>
    );
  }

  return (
    <div className="bg-[url(/vote_bg.svg)] w-screen h-screen bg-fixed flex justify-center items-center p-4">
      {popup.message && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-5 py-3 rounded-lg text-[var(--retro_bg_light)] ${
            popup.type === "success"
              ? "bg-[var(--retro_green)]"
              : "bg-[var(--retro_red)]"
          }`}
        >
          {popup.message}
        </div>
      )}
      <div className="bg-[var(--retro_bg_dark)] w-full max-w-4xl sm:w-[80%] rounded-3xl flex flex-col sm:px-4 p-5 shadow-lg">
        <div className="w-full text-2xl font-bold text-[var(--retro_bg_light)] text-center bg-[var(--retro_blue)] p-5 rounded-t-3xl sticky top-0 z-10">
          {poll.title}
        </div>
        <div className="w-full text-[1rem] text-[var(--retro_blue)] text-center px-5 sticky top-[4.5rem] bg-[var(--retro_bg_dark)] z-10 py-3">
          {poll.description}
        </div>
        <div className="flex-1 overflow-y-auto mt-2 px-5 space-y-4 max-h-[50vh] scrollbar-thin scrollbar-thumb-[var(--retro_red)] scrollbar-track-[var(--retro_bg_light)]">
          {poll.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="radio"
                id={`option-${index}`}
                name="pollOption"
                value={index}
                onChange={() => setSelectedOptionIndex(index)}
                className="peer hidden"
              />
              <div className="w-5 h-5 border-2 border-[var(--retro_red)] rounded-full flex items-center justify-center peer-checked:bg-[var(--retro_red)] transition-colors duration-200">
                <div className="w-2.5 h-2.5 bg-transparent rounded-full peer-checked:bg-[var(--retro_bg_light)]"></div>
              </div>
              <label
                htmlFor={`option-${index}`}
                className="text-lg text-[var(--retro_blue)] font-bold cursor-pointer"
              >
                {option.option}
              </label>
            </div>
          ))}
        </div>
        <div className="px-5 mt-4 sticky bottom-0 bg-[var(--retro_bg_dark)] py-4">
          <button
            onClick={handleVoteSubmit}
            className="py-3 w-full bg-[var(--retro_blue)] text-[var(--retro_bg_light)] rounded-lg cursor-pointer"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default VotePage;
