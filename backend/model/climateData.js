const mongoose = require('mongoose');

const climateDataSchema = new mongoose.Schema({
    latitude: Number, 
    longitude: Number,
    startDate: Date,
    endDate: Date,
    createdAt: {type: Date, default: Date.now },
    daily: {
        time: [String],
        temperature_2m_max_CMCC_CM2_VHR4: [Number],
        temperature_2m_max_FGOALS_f3_H: [Number],
        temperature_2m_max_HiRAM_SIT_HR: [Number],
        temperature_2m_max_MRI_AGCM3_2_S: [Number],
        temperature_2m_max_EC_Earth3P_HR: [Number],
        temperature_2m_max_MPI_ESM1_2_XR: [Number],
        temperature_2m_max_NICAM16_8S: [Number],
      },
});
 
module.exports = mongoose.model('ClimateData', climateDataSchema);