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