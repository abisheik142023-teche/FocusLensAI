const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, default: Date.now },
  productiveHours: { type: Number, required: true, default: 0, min: 0, max: 24 },
  focusPercentage: { type: Number, required: true, default: 0, min: 0, max: 100 },
  burnoutRisk: { type: Number, required: true, default: 0, min: 0, max: 100 },
  activityBreakdown: {
    focus: { type: Number, default: 0 },
    meetings: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    breaks: { type: Number, default: 0 },
    distracted: { type: Number, default: 0 }
  },
  appUsage: [{
    appName: { type: String, trim: true },
    usagePercentage: { type: Number, default: 0, min: 0, max: 100 }
  }],
  aiInsights: {
    strengths: { type: [String], default: [] },
    improvementAreas: { type: [String], default: [] },
    recommendations: { type: [String], default: [] }
  }
}, { timestamps: true });

performanceSchema.index({ employeeId: 1, date: -1 });
performanceSchema.index({ date: 1 });

module.exports = mongoose.model('Performance', performanceSchema);
