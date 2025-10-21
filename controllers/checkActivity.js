import Poll from "../models/poll.model.js";

const Check = async (req, res) => {
  const { pollId } = req.body;
  try {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "poll not found" });
    }
    const activity = poll.active;
    res.status(200).json({ message: "request successful", activity });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export default Check;
