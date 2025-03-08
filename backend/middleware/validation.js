// middleware/validation.js
const validateParticipant = (req, res, next) => {
    const {
      full_name,
      email,
      phone_number,
      college_name,
      degree,
      year_of_study,
      cgpa,
      tech_stack
    } = req.body;
    
    // Required field validation
    if (!full_name || !email || !phone_number || !college_name || 
        !degree || !year_of_study || !cgpa) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }
    
    // Email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email'
      });
    }
    
    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({
        success: false,
        error: 'Phone number must be 10 digits'
      });
    }
    
    // Tech stack validation
    let techStackArray;
    if (typeof tech_stack === 'string') {
      try {
        techStackArray = JSON.parse(tech_stack);
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: 'Invalid tech_stack format'
        });
      }
    } else {
      techStackArray = tech_stack;
    }
    
    if (!Array.isArray(techStackArray) || techStackArray.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please select at least one tech stack'
      });
    }
    
    // CGPA validation
    const cgpaValue = parseFloat(cgpa);
    if (isNaN(cgpaValue) || cgpaValue < 0 || cgpaValue > 10) {
      return res.status(400).json({
        success: false,
        error: 'CGPA must be between 0 and 10'
      });
    }
    
    next();
  };
  
  module.exports = { validateParticipant };