import Poll from "../models/poll.model.js";
const getPoll = async (req, res) => {
  const { pollId } = req.body;
  try {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "poll not found" });
    }
    res.status(200).json({
      message: "poll fetched successful",
      title: poll.title,
      description: poll.description,
      options: poll.options,
      active: poll.active,
      updated: poll.updatedAt,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "internal server error", error: err || err.message });
  }
};
export default getPoll;
