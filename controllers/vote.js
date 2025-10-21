import Poll from "../models/poll.model.js";

const Vote = async (req, res) => {
  const { pollId, optionNumber, voterIP } = req.body;
  try {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(410).json({ message: "poll not found" });
    }
    if (!poll.active) {
      return res.status(411).json({ message: "poll not accepting responses" });
    }
    if (poll.voters.includes(voterIP)) {
      return res
        .status(413)
        .json({ message: "you have already voted in the poll" });
    }
    if (poll.options.length <= optionNumber) {
      return res.status(412).json({ message: "option not found" });
    }

    if (!poll.options[optionNumber].votes) {
      poll.options[optionNumber].votes = 0;
    }
    poll.options[optionNumber].votes += 1;
    poll.voters.push(voterIP);
    await poll.save();

    res
      .status(200)
      .json({ message: "vote successful", option: poll.options[optionNumber] });
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
};

export default Vote;
