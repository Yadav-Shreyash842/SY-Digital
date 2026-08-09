const crypto = require("crypto");
const PageView = require("../models/PageView");

const trackPageView = async (req, res, next) => {
  try {
    const { path, sessionId, referrer, pageTitle } = req.body;

    if (!path || !sessionId) {
      return res.status(200).json({ success: true });
    }

    const ip = req.ip || req.connection?.remoteAddress || "";
    const ipHash = ip ? crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16) : "";

    await PageView.create({
      path,
      sessionId,
      ipHash,
      userAgent: (req.headers["user-agent"] || "").slice(0, 500),
      referrer: referrer || "",
      pageTitle: pageTitle || "",
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = { trackPageView };
