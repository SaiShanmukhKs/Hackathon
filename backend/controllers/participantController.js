// controllers/participantController.js
const Participant = require('../models/Participant');

// Get all participants
exports.getParticipants = async (req, res) => {
  try {
    // Add filtering capability
    const filter = {};
    
    // Add pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Add query parameters support
    if (req.query.tech_stack) {
      filter.tech_stack = { $in: req.query.tech_stack.split(',') };
    }
    
    if (req.query.degree) {
      filter.degree = req.query.degree;
    }
    
    if (req.query.year_of_study) {
      filter.year_of_study = req.query.year_of_study;
    }
    
    const total = await Participant.countDocuments(filter);
    const participants = await Participant.find(filter)
      .select('-__v')
      .skip(startIndex)
      .limit(limit)
      .sort({ registration_date: -1 });
    
    // Prepare pagination result
    const pagination = {};
    
    if (startIndex + participants.length < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: participants.length,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: total
      },
      data: participants
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Verify a participant's GitHub or LinkedIn profile
exports.verifyProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, status } = req.body;
    
    // Check if valid verification type and status
    if (!['github', 'linkedin'].includes(type) || 
        !['verified', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification parameters'
      });
    }
    
    const participant = await Participant.findById(id);
    
    if (!participant) {
      return res.status(404).json({
        success: false,
        error: 'Participant not found'
      });
    }
    
    // Update verification status
    participant.verification_status = status;
    await participant.save();
    
    res.status(200).json({
      success: true,
      data: participant
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get registration statistics
exports.getStats = async (req, res) => {
  try {
    const stats = {
      total: await Participant.countDocuments(),
      byTechStack: {},
      byDegree: {},
      byYear: {},
      dailyRegistrations: []
    };
    
    // Get tech stack distribution
    const techStackStats = await Participant.aggregate([
      { $unwind: '$tech_stack' },
      { $group: { _id: '$tech_stack', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    techStackStats.forEach(item => {
      stats.byTechStack[item._id] = item.count;
    });
    
    // Get degree distribution
    const degreeStats = await Participant.aggregate([
      { $group: { _id: '$degree', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    degreeStats.forEach(item => {
      stats.byDegree[item._id] = item.count;
    });
    
    // Get year of study distribution
    const yearStats = await Participant.aggregate([
      { $group: { _id: '$year_of_study', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    yearStats.forEach(item => {
      stats.byYear[item._id] = item.count;
    });
    
    // Get daily registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyStats = await Participant.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    stats.dailyRegistrations = dailyStats;
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};