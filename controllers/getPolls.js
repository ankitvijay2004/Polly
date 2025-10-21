import User from "../models/user.model.js";
import Poll from "../models/poll.model.js";

const getPolls = async (req, res) => {
  const { userId } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch polls for the user
    const polls = await Promise.all(
      user.polls.map(async (id) => {
        const poll = await Poll.findById(id);
        if (poll) {
          return {
            title: poll.title,
            description: poll.description,
            options: poll.options,
            id: poll._id,
            active: poll.active,
            createdAt: poll.createdAt,
            totalVotes: poll.options.reduce(
              (sum, option) => sum + option.votes,
              0
            ), // Calculate total votes
          };
        }
        return null; // Handle case where poll might not exist
      })
    );

    // Filter out any `null` values if polls were missing
    const validPolls = polls.filter((poll) => poll !== null);

    // Respond with the fetched polls
    res
      .status(200)
      .json({ message: "Polls fetched successfully", polls: validPolls });
  } catch (err) {
    // Handle any errors
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message || err });
  }
};

export default getPolls;
