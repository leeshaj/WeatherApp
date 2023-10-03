const ClimateData = require('../model/climateData');

const addData = async(req, res) => {
    try {
      const { latitude, longitude, startDate, endDate, daily } = req.body;

      
      const climateData = new ClimateData({
        latitude,
        longitude,
        startDate,
        endDate,
        daily, // Make sure 'daily' is correctly structured
      });
  
        await climateData.save();
        res.status(201).json(climateData);
      } catch (error) {
        res
          .status(500)
          .json({ error: "An error occurred while saving climate data." });
      }
};

exports.addData = addData;