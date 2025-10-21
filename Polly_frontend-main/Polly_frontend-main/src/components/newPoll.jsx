import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewPoll = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [userId, setUserId] = useState("");
  const [popup, setPopup] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError("User not logged in. Please log in first.");
    }
  }, []);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const deleteOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const showPopup = (message, type) => {
    setPopup({ message, type });
    setTimeout(() => setPopup({ message: "", type: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      showPopup("User ID is missing. Please log in.", "error");
      return;
    }

    const pollData = {
      title,
      description,
      options: options
        .filter((opt) => opt.trim() !== "")
        .map((opt) => ({ option: opt, votes: 0 })),
      id: userId,
    };

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URI + "/api/poll/new",
        pollData
      );
      showPopup("Poll created successfully!", "success");
      setTitle("");
      setDescription("");
      setOptions(["", ""]);
      navigate("/uri/" + response.data.id);
    } catch (err) {
      showPopup(
        err.response?.data?.message || "Failed to create the poll.",
        "error"
      );
    }
  };

  return (
    <div className="bg-[var(--retro_bg_light)] min-h-screen flex items-center">
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

      {/* Desktop View - Old Layout */}
      <div className="hidden lg:flex w-full h-screen">
        <div className="bg-[var(--retro_red)] h-full w-[30%] flex flex-col justify-between fixed">
          <div className="text-[9rem] text-[var(--retro_bg_light)] leading-32 font-bold m-5">
            New
            <br /> Poll
          </div>
          <img src="/new_form.svg" />
        </div>
        <form
          className="w-[70%] ml-[30%] flex flex-col items-center gap-4 mt-12"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Enter Poll title"
            className="p-3 w-[70%] placeholder:text-[var(--retro_border)] outline-none bg-[var(--retro_bg_med)] border-2 border-[var(--retro_border)] focus:border-[var(--retro_green)] rounded-lg text-[var(--retro_red)]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            type="text"
            placeholder="Enter Poll description (optional)"
            className="p-3 w-[70%] placeholder:text-[var(--retro_border)] outline-none bg-[var(--retro_bg_med)] border-2 border-[var(--retro_border)] focus:border-[var(--retro_green)] rounded-lg text-[var(--retro_red)]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex flex-col w-[70%] gap-4 max-h-[300px] overflow-y-auto">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-4 w-full">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="p-3 w-[70%] placeholder:text-[var(--retro_border)] outline-none bg-[var(--retro_bg_med)] border-2 border-[var(--retro_border)] focus:border-[var(--retro_green)] rounded-lg text-[var(--retro_red)]"
                />
                <button
                  type="button"
                  onClick={() => deleteOption(index)}
                  className="text-white bg-[var(--retro_red)] px-4 py-3 rounded-lg hover:bg-[#E75D39]"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div className="hidden lg:flex w-[70%] justify-end">
            <button
              type="button"
              onClick={addOption}
              className="bg-[var(--retro_green)] text-[var(--retro_bg_light)] px-6 py-3 rounded-lg hover:bg-[#4EBA85] cursor-pointer"
            >
              + Add Option
            </button>
          </div>

          <button
            type="submit"
            className="w-[70%] bg-[var(--retro_blue)] py-3 text-[var(--retro_bg_light)] rounded-lg cursor-pointer"
          >
            Create Poll
          </button>
        </form>
      </div>

      {/* Mobile View - New Layout */}
      <div className="lg:hidden flex flex-col w-full p-6">
        <h1 className="text-3xl text-[var(--retro_red)] font-bold text-center mb-6">
          Create a New Poll
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter Poll title"
            className="p-3 w-full bg-[var(--retro_bg_med)] border-2 border-[var(--retro_border)] focus:border-[var(--retro_green)] rounded-lg text-[var(--retro_red)] text-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Enter Poll description (optional)"
            className="p-3 w-full bg-[var(--retro_bg_med)] border-2 border-[var(--retro_border)] focus:border-[var(--retro_green)] rounded-lg text-[var(--retro_red)] text-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-4 w-full">
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="p-3 w-full bg-[var(--retro_bg_med)] border-2 border-[var(--retro_border)] focus:border-[var(--retro_green)] rounded-lg text-[var(--retro_red)] text-lg"
              />
              <button
                type="button"
                onClick={() => deleteOption(index)}
                className="text-white bg-[var(--retro_red)] px-4 py-2 rounded-lg hover:bg-[#E75D39]"
              >
                Delete
              </button>
            </div>
          ))}
          <div className="lg:hidden flex justify-end w-full">
            <button
              type="button"
              onClick={addOption}
              className="bg-[var(--retro_green)] text-white px-6 py-3 rounded-lg hover:bg-[#4EBA85] cursor-pointer text-lg"
            >
              + Add Option
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--retro_blue)] py-3 text-white rounded-lg cursor-pointer text-lg"
          >
            Create Poll
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPoll;
