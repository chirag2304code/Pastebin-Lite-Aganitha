const Paste = require("../models/Paste");

exports.createPaste = async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content is required." });
    }

    if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return res.status(400).json({ message: "ttl_seconds must be an integer >= 1." });
    }

    if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
      return res.status(400).json({ message: "max_views must be an integer >= 1." });
    }

    const expires_at = ttl_seconds ? new Date(Date.now() + ttl_seconds * 1000) : null;

    const paste = await Paste.create({
      content,
      expires_at,
      remaining_views: max_views ?? null
    });

    // IMPORTANT: frontend expects /view/:id
    res.status(201).json({
      id: paste._id,
      url: `http://localhost:5173/view/${paste._id}`
    });

  } catch (error) {
    console.error("Create paste error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getPaste = async (req, res) => {
  try {
    const { id } = req.params;

    let paste = await Paste.findById(id);

    if (!paste) {
      return res.status(404).json({ message: "Paste not found." });
    }

    // Deterministic time support for tests
    const now =
      process.env.TEST_MODE === "1" && req.headers["x-test-now-ms"]
        ? new Date(Number(req.headers["x-test-now-ms"]))
        : new Date();

    // Expiry check
    if (paste.expires_at && now > paste.expires_at) {
      await Paste.deleteOne({ _id: id });
      return res.status(404).json({ message: "Paste expired." });
    }

    // Atomic view decrement
    if (paste.remaining_views !== null) {
      const updatedPaste = await Paste.findOneAndUpdate(
        { _id: id, remaining_views: { $gt: 0 } },
        { $inc: { remaining_views: -1 } },
        { new: true }
      );

      if (!updatedPaste) {
        return res.status(404).json({ message: "View limit exceeded." });
      }

      paste = updatedPaste;
    }

    res.status(200).json({
      content: paste.content,
      remaining_views: paste.remaining_views,
      expires_at: paste.expires_at
    });

  } catch (error) {
    console.error("Fetch paste error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
