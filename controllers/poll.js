import Poll from "../models/poll.model.js";
import User from "../models/user.model.js";

const createPoll = async (req, res) => {
  const { title, description, options, id } = req.body;

  try {
    if (!title || !options || !(options.length >= 2)) {
      return res
        .status(405)
        .json({ message: "title and atleast 2 optios are needed" });
    }
    const poll = new Poll({
      title: title,
      description: description,
      options: options,
      createdBy: id,
    });
    await poll.save();
    const user = await User.findById(id);
    user.polls.push(poll._id);
    await user.save();
    res.status(200).json({
      message: "Poll created successfully",
      title,
      description,
      options,
      id: poll._id,
    });
  } catch (err) {
    // Handle errors and return the error message with more details
    return res.status(500).json({
      message: "Internal server error",
      error: err.message || err, // Send the error message in the response for debugging
    });
  }
};

export default createPoll;
