const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const ClimateDataController = require('./controller/clime-data-Controller');
const ClimateData = require('./model/climateData');

const app = express();

const url = 'mongodb+srv://climateData:ClimateData123@cluster0.hkszzdx.mongodb.net/climateData?retryWrites=true&w=majority';


app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
  next();
});

app.post('/api/climate-data', ClimateDataController.addData);

app.get('/api/climate-data', async (req, res) => {
  try {
    const sortBy = req.query.sort || '-createdAt'; // Sort by createdAt by default
    const climateData = await ClimateData.find().sort(sortBy);
    res.status(200).json(climateData);
  } catch (error) {
    console.error('Error fetching climate data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(5000, () => {
      console.log('Server is running on port 5000');
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));