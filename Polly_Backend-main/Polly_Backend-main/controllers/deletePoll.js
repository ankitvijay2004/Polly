import Poll from "../models/poll.model.js";
import User from "../models/user.model.js";

const deletePoll = async (req, res) => {
  const { pollId, userId } = req.body;

  try {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    await Poll.findByIdAndDelete(pollId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.polls = user.polls.filter((id) => id.toString() !== pollId.toString());
    await user.save();

    res.status(200).json({ message: "Poll deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message || "An unknown error occurred",
    });
  }
};

export default deletePoll;
