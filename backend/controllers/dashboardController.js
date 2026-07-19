const Case = require("../models/Case");
const Evidence = require("../models/Evidence");
const Anomaly = require("../models/Anomaly");
const AuditLogEntry = require("../models/AuditLogEntry");

const getDashboard = async (req, res) => {
  try {
    // ==========================
    // Dashboard Statistics
    // ==========================

    const activeCases = await Case.countDocuments({
      status: { $ne: "closed" },
    });

    const totalEvidence = await Evidence.countDocuments();

    const verifiedEvidence = await Evidence.countDocuments({
      integrityStatus: "verified",
    });

    const criticalAnomalies = await Anomaly.countDocuments({
      severity: "critical",
    });

    // ==========================
    // Threat Distribution
    // ==========================

   const threatData = await Anomaly.aggregate([
  {
    $group: {
      _id: "$severity",
      count: { $sum: 1 },
    },
  },
]);

const threats = threatData.map(item => ({
  type: item._id,
  count: item.count,
}));

    // ==========================
    // Timeline
    // ==========================

const rawTimeline = await AuditLogEntry.find().sort({ timestamp: 1 });

const groupedTimeline = {};

rawTimeline.forEach((entry) => {
  const day = entry.timestamp.toLocaleDateString();

  if (!groupedTimeline[day]) {
    groupedTimeline[day] = 0;
  }

  groupedTimeline[day]++;
});

const timeline = Object.entries(groupedTimeline).map(([time, sessions]) => ({
  time,
  sessions,
}));
    // ==========================
    // Recent Activity
    // ==========================

 const rawActivity = await AuditLogEntry.find()
  .sort({ timestamp: -1 })
  .limit(8);

  const actionMap = {
  login_success: "logged in",
  case_created: "created a case",
  evidence_uploaded: "uploaded evidence",
  evidence_verified: "verified evidence",
  evidence_downloaded: "downloaded evidence",
  note_created: "added a note",
  anomaly_updated: "updated an anomaly",
};

const activity = rawActivity.map(item => ({
  _id: item._id,
 message: `${item.actorUsername} ${
  actionMap[item.action] || item.action.replace(/_/g, " ")
}`,
  time: item.timestamp.toLocaleString(),
}));

    // ==========================
    // Countries
    // (Placeholder until Geo-IP)
    // ==========================
const countries = [
  { country: "Unknown", value: totalEvidence },
];

    res.json({
      stats: {
        activeCases,
        totalEvidence,
        verifiedEvidence,
        criticalAnomalies,
      },

      timeline,

      threats,

      countries,

      activity,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to load dashboard.",
    });
  }
};

module.exports = {
  getDashboard,
};