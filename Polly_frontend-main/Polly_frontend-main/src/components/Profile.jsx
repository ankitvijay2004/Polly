import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    setLoading(true);
    const id = localStorage.getItem("id");
    if (!id) {
      showPopup("User ID is missing from local storage", "error");
      setLoading(false);
      return;
    }

    try {
      const result = await axios.post(
        import.meta.env.VITE_API_URI + "/api/poll/fetchall",
        { userId: id }
      );
      if (result.data.polls) {
        setPolls(result.data.polls);
      } else {
        showPopup("No polls found for this user", "error");
      }
    } catch (err) {
      console.error(err);
      showPopup(
        err.response?.data?.message || "Failed to fetch polls",
        "error"
      );
    }
    setLoading(false);
  };

  const showPopup = (message, type) => {
    setPopup({ message, type });
    setTimeout(() => setPopup({ message: "", type: "" }), 3000);
  };

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/signin");
  };

  const handleNew = () => {
    navigate("/newpoll");
  };

  const toggleActive = async (pollId) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URI + "/api/poll/toggle",
        { pollId }
      );
      if (response.status === 200) {
        fetchPolls();
        showPopup("Poll status toggled successfully", "success");
      }
    } catch (err) {
      console.error(err);
      showPopup("Failed to toggle poll status", "error");
    }
  };

  const editPoll = (pollId) => {
    navigate(`/details/${pollId}`);
  };

  const deletePoll = async (pollId) => {
    try {
      await axios.delete(import.meta.env.VITE_API_URI + "/api/poll/delete", {
        data: { pollId, userId: localStorage.getItem("id") },
      });
      fetchPolls();
      showPopup("Poll deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showPopup("Failed to delete poll", "error");
    }
  };

  return (
    <div className="bg-[var(--retro_bg_light)] min-h-screen w-screen">
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
      <div className="bg-[var(--retro_red)] h-1/3 w-screen p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col h-full justify-center mb-5 sm:mb-0">
          <div className="text-[var(--retro_bg_light)] text-4xl sm:text-6xl font-bold">
            Hi There, {localStorage.getItem("username")}
          </div>
          <div className="text-[var(--retro_bg_dark)] text-xl sm:text-3xl">
            Create Connect Change
          </div>
        </div>
        <button
          className="sm:mr-10 bg-[var(--retro_bg_light)] text-[var(--retro_red)] px-7 py-2 rounded-lg cursor-pointer font-semibold"
          onClick={handleLogOut}
        >
          Log Out
        </button>
      </div>

      <div className="w-full py-12 px-8 sm:px-24">
        <div className="flex w-full justify-between mb-8">
          <div className="text-[var(--retro_blue)] text-2xl sm:text-3xl font-bold">
            My Polls
          </div>
          <button
            className="bg-[var(--retro_blue)] text-[var(--retro_bg_light)] px-7 py-2 rounded-lg cursor-pointer font-semibold"
            onClick={handleNew}
          >
            New Poll
          </button>
        </div>
        {loading ? (
          <div className="text-center text-2xl font-bold">Loading polls...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.length > 0 ? (
              polls.map((poll) => (
                <div
                  key={poll._id}
                  className="w-full bg-[var(--retro_bg_dark)] rounded-2xl p-5 shadow-lg"
                >
                  <div className="text-[var(--retro_blue)] font-semibold text-xl sm:text-2xl text-center truncate">
                    {poll.title}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between mt-4 gap-2">
                    <button
                      className="bg-[var(--retro_green)] text-white py-2 rounded-lg flex justify-center items-center shadow-md hover:bg-[#4EBA85] transition duration-300 cursor-pointer w-full sm:w-auto mb-2 sm:mb-0 flex-1"
                      onClick={() => toggleActive(poll.id)}
                    >
                      {poll.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      className="bg-[var(--retro_blue)] text-white py-2 rounded-lg flex justify-center items-center shadow-md hover:bg-[#39418D] transition duration-300 cursor-pointer w-full sm:w-auto mb-2 sm:mb-0 flex-1"
                      onClick={() => editPoll(poll.id)}
                    >
                      Details
                    </button>
                    <button
                      className="bg-[var(--retro_red)] text-white py-2 rounded-lg flex justify-center items-center shadow-md hover:bg-[#E75D39] transition duration-300 cursor-pointer w-full sm:w-auto flex-1"
                      onClick={() => deletePoll(poll.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center font-black text-4xl sm:text-5xl mt-24">
                No Polls Available
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
