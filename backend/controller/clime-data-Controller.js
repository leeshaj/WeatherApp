const ClimateData = require('../model/climateData');

const addData = async(req, res) => {
  const { latitude, longitude, startDate, endDate, daily } = req.body;

  if (
    isNaN(latitude) ||
    isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return res.status(400).json({ error: 'Invalid data provided' });
  }


  if (!latitude || !longitude || !daily || !startDate || !endDate || startDate > endDate) {
    return res.status(400).json({ error: 'Invalid data format' });
  }
  if (
    !daily ||
    !daily.time ||
    !Array.isArray(daily.time) ||
    !daily.temperature_2m_max_CMCC_CM2_VHR4 ||
    !Array.isArray(daily.temperature_2m_max_CMCC_CM2_VHR4) ||
    !daily.temperature_2m_max_FGOALS_f3_H ||
    !Array.isArray(daily.temperature_2m_max_FGOALS_f3_H) ||
    !daily.temperature_2m_max_HiRAM_SIT_HR ||
    !Array.isArray(daily.temperature_2m_max_HiRAM_SIT_HR) ||
    !daily.temperature_2m_max_MRI_AGCM3_2_S ||
    !Array.isArray(daily.temperature_2m_max_MRI_AGCM3_2_S) ||
    !daily.temperature_2m_max_EC_Earth3P_HR ||
    !Array.isArray(daily.temperature_2m_max_EC_Earth3P_HR) ||
    !daily.temperature_2m_max_MPI_ESM1_2_XR ||
    !Array.isArray(daily.temperature_2m_max_MPI_ESM1_2_XR) ||
    !daily.temperature_2m_max_NICAM16_8S ||
    !Array.isArray(daily.temperature_2m_max_NICAM16_8S) 
    
  ) {
    return res.status(400).json({ error: 'Invalid daily data structure' });
  }

  
      
    try {
      

      const climateData = new ClimateData({
        latitude,
        longitude,
        startDate,
        endDate,
        daily, 
      });
      
        await climateData.save();
        const sortedClimateData = await ClimateData.find().sort('-createdAt');
        res.status(201).json(sortedClimateData);
      } catch (error) {
        res
          .status(500)
          .json({ error: "An error occurred while saving climate data." });
      }
};


exports.addData = addData;