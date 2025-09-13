const Consultancy = require('../models/Consultancy');

exports.getConsultancies = async (req, res) => { 
  
  const consultancies = await Consultancy.find();
  res.json(consultancies);
};

exports.createConsultancy = async (req, res) => {
  const consultancy = new Consultancy(req.body);
  await consultancy.save();
  res.status(201).json(consultancy);
}; 