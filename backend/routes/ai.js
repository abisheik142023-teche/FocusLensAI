const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const authenticate = require('../middleware/auth');
const Performance = require('../models/Performance');

// Call external AI engine, save result
router.post('/predict-performance', authenticate, async (req, res) => {
  try {
    const { appUsage, activityPattern, historicalMetrics, sentimentScore, workPatterns, appNames } = req.body;
    if (!appUsage || !activityPattern || !appNames) {
      return res.status(400).json({ error: 'Missing required arrays' });
    }

    const aiUrl = `${process.env.AI_ENGINE_URL}/predict`;
    const aiResponse = await fetch(aiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AI_ENGINE_TOKEN}`
      },
      body: JSON.stringify({
        app_usage: appUsage,
        activity_pattern: activityPattern,
        historical_metrics: historicalMetrics,
        sentiment_score: sentimentScore,
        work_patterns: workPatterns
      })
    });

    if (!aiResponse.ok) {
      const text = await aiResponse.text();
      throw new Error(`AI Engine error: ${aiResponse.status} ${text}`);
    }

    const prediction = await aiResponse.json();
    const record = new Performance({
      employeeId: req.user._id,
      productiveHours: (prediction.productivity_score || 0) * 8,
      focusPercentage: (prediction.focus_score || 0) * 100,
      burnoutRisk: (prediction.burnout_risk || 0) * 100,
      activityBreakdown: {
        focus: activityPattern[0] || 0,
        meetings: activityPattern[1] || 0,
        communication: activityPattern[2] || 0,
        breaks: activityPattern[3] || 0,
        distracted: activityPattern[4] || 0
      },
      appUsage: appUsage.map((u, i) => ({ appName: (appNames[i] || `App ${i+1}`), usagePercentage: u })),
      aiInsights: prediction.insights || {}
    });

    await record.save();

    res.json({
      productivity: prediction.productivity_score,
      burnoutRisk: prediction.burnout_risk,
      focusScore: prediction.focus_score,
      insights: prediction.insights,
      timestamp: prediction.timestamp || new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI health check
router.get('/ai-health', async (req, res) => {
  try {
    const aiUrl = `${process.env.AI_ENGINE_URL}/health`;
    const r = await fetch(aiUrl);
    res.json({ aiEngineStatus: r.ok ? 'healthy' : 'unhealthy', lastChecked: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ aiEngineStatus: 'unavailable', error: err.message });
  }
});

module.exports = router;
