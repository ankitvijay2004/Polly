import Poll from "../models/poll.model.js";

const togglePoll = async (req, res) => {
  const { pollId } = req.body;
  try {
    const poll = await Poll.findById(pollId);
    // if (!poll) {
    //   return res.status(404).json({ message: "Poll not found" });
    // }
    poll.active = !poll.active;
    await poll.save();
    res.status(200).json({ message: "toggle successful" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "internal server error", error: err || err.message });
  }
};
export default togglePoll;
