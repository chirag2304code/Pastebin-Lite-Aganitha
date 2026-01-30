const Paste = require('../models/Paste');
const escapeHtml = require('escape-html');

exports.viewPasteHtml = async (req, res) => {
  try {
    const { id } = req.params;
    let paste = await Paste.findById(id);

    if (!paste) {
      return res.status(404).send('<h1>404 Not Found</h1><p>Paste not found.</p>');
    }

    let currentTime;
    if (process.env.TEST_MODE === "1" && req.headers['x-test-now-ms']) {
      currentTime = new Date(parseInt(req.headers['x-test-now-ms'], 10));
    } else {
      currentTime = new Date();
    }

    // Check for expiry_at
    if (paste.expires_at && currentTime > paste.expires_at) {
      await Paste.deleteOne({ _id: id });
      return res.status(404).send('<h1>404 Not Found</h1><p>Paste expired.</p>');
    }

    // Check and decrement remaining_views
    if (paste.remaining_views !== null) {
      if (paste.remaining_views <= 0) {
        return res.status(404).send('<h1>404 Not Found</h1><p>View limit exceeded.</p>');
      }

      const updatedPaste = await Paste.findOneAndUpdate(
        { _id: id, remaining_views: { $gt: 0 } },
        { $inc: { remaining_views: -1 } },
        { new: true }
      );

      if (!updatedPaste) {
        return res.status(404).send('<h1>404 Not Found</h1><p>View limit exceeded or paste not found.</p>');
      }
      paste = updatedPaste; // Use the updated paste document
    }

    const escapedContent = escapeHtml(paste.content);

    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Paste - ${paste._id}</title>
        <style>
          body { font-family: monospace; white-space: pre-wrap; word-wrap: break-word; }
        </style>
      </head>
      <body>
        <h1>Paste Content</h1>
        <pre>${escapedContent}</pre>
        ${paste.expires_at ? `<p>Expires At: ${paste.expires_at.toLocaleString()}</p>` : ''}
        ${paste.remaining_views !== null ? `<p>Remaining Views: ${paste.remaining_views}</p>` : ''}
      </body>
      </html>
    `);

  } catch (error) {
    res.status(500).send(`<h1>500 Internal Server Error</h1><p>${escapeHtml(error.message)}</p>`);
  }
};
