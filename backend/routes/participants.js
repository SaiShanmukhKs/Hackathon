// routes/participants.js
const express = require('express');
const router = express.Router();
const Participant = require('../models/Participant');
const { validateParticipant } = require('../middleware/validation');

// Get all participants
router.get('/', async (req, res) => {
  try {
    const participants = await Participant.find().select('-__v');
    res.status(200).json({
      success: true,
      count: participants.length,
      data: participants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Get a single participant
router.get('/:id', async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id).select('-__v');
    
    if (!participant) {
      return res.status(404).json({
        success: false,
        error: 'Participant not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: participant
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid participant ID'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Create a new participant
router.post('/', validateParticipant, async (req, res) => {
  try {
    // Check if participant with same email already exists
    const existingParticipant = await Participant.findOne({ email: req.body.email });
    
    if (existingParticipant) {
      return res.status(400).json({
        success: false,
        error: 'A participant with this email already exists'
      });
    }
    
    // Process tech_stack array if it comes as a string
    if (typeof req.body.tech_stack === 'string') {
      try {
        req.body.tech_stack = JSON.parse(req.body.tech_stack);
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: 'Invalid tech_stack format'
        });
      }
    }
    
    const participant = await Participant.create(req.body);
    
    res.status(201).json({
      success: true,
      data: participant
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Update participant
router.put('/:id', async (req, res) => {
  try {
    // Process tech_stack array if it comes as a string
    if (typeof req.body.tech_stack === 'string') {
      try {
        req.body.tech_stack = JSON.parse(req.body.tech_stack);
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: 'Invalid tech_stack format'
        });
      }
    }
    
    const participant = await Participant.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { 
        new: true, 
        runValidators: true 
      }
    );
    
    if (!participant) {
      return res.status(404).json({
        success: false,
        error: 'Participant not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: participant
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid participant ID'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Delete participant
router.delete('/:id', async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    
    if (!participant) {
      return res.status(404).json({
        success: false,
        error: 'Participant not found'
      });
    }
    
    await participant.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid participant ID'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

module.exports = router;