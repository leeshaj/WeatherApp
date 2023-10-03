import React, { useEffect, useState } from "react";

import ClimateTable from "./ClimateTable";
import "./ClimateForm.css";

const ClimateForm = () => {
  const initialFormData = {
    latitude: "",
    longitude: "",
    startDate: "",
    endDate: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const [climateData, setClimateData] = useState([]);

  const [errors, setErrors] = useState(initialFormData);

  useEffect(() => {
    const fetchClimateData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/climate-data?sort=-createdAt" // Sort by createdAt in descending order
        );
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            console.log("Fetched data from API:", data);
            setClimateData(data);
          }
        } else {
          console.error("Failed to fetch climate data.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchClimateData(); // Fetch climate data when the component mounts
  }, []);

  

  const handleChange = (e) => {
    const { name, value } = e.target;

    let errorMessage = "";

    if (name === "latitude") {
      if (value === "") {
        errorMessage = "Latitude is required";
      } else if (value < -90 || value > 90) {
        errorMessage = "Latitude must be between -90 and 90";
      }
    } else if (name === "longitude") {
      if (value === "") {
        errorMessage = "Longitude is required";
      } else if (value < -180 || value > 180) {
        errorMessage = "Longitude must be between -180 and 180";
      }
    } else if (name === "startDate") {
      if (value === "") {
        errorMessage = "Start date is required";
      } else {
        const { endDate } = formData;
        if (endDate && new Date(value) > new Date(endDate)) {
          errorMessage = "Start date cannot be greater than end date";
        }
      }
    } else if (name === "endDate") {
      if (value === "") {
        errorMessage = "End date is required";
      } else {
        const { startDate } = formData;
        if (startDate && new Date(startDate) > new Date(value)) {
          errorMessage = "End date cannot be earlier than start date";
        }
      }
    }
    setErrors({ ...errors, [name]: errorMessage });

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { latitude, longitude, startDate, endDate } = formData;

    // Check latitude
    if (latitude === "") {
      setErrors({ ...errors, latitude: "Latitude is required" });
      return;
    } else if (latitude < -90 || latitude > 90) {
      setErrors({ ...errors, latitude: "Latitude must be between -90 and 90" });
      return;
    }

    // Check longitude
    if (longitude === "") {
      setErrors({ ...errors, longitude: "Longitude is required" });
      return;
    } else if (longitude < -180 || longitude > 180) {
      setErrors({
        ...errors,
        longitude: "Longitude must be between -180 and 180",
      });
      return;
    }

    setErrors("");
    // Check startdate and endDate
    if (startDate === "") {
      setErrors({ ...errors, startDate: "Start date is required" });
      return;
    }

    if (endDate === "") {
      setErrors({ ...errors, endDate: "End date is required" });
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      setErrors({
        ...errors,
        endDate: "End date cannot be earlier than start date",
      });
      return;
    }
    setErrors("");

    try {
      const url = `https://climate-api.open-meteo.com/v1/climate?latitude=${formData.latitude}&longitude=${formData.longitude}&start_date=${formData.startDate}&end_date=${formData.endDate}&models=CMCC_CM2_VHR4,FGOALS_f3_H,HiRAM_SIT_HR,MRI_AGCM3_2_S,EC_Earth3P_HR,MPI_ESM1_2_XR,NICAM16_8S&daily=temperature_2m_max`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched data:", data);

        // Save the data to your database
        const saveResponse = await fetch("http://localhost:5000/api/climate-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude,
            longitude,
            startDate,
            endDate,
            daily: data.daily,
          }),
        });

        if (saveResponse.ok) {
          setFormData(initialFormData);
          setClimateData(data);
          
        } else {
          console.error("Failed to save climate data.");
        }
      } else {
        console.error("Failed to fetch climate data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      <h2>Climate Data Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group col-sm-5">
          <label>Latitude:</label>
          <input
            className="form-control form-control-lg"
            type="number"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
          />
          <p className="error-message">{errors.latitude}</p>
        </div>
        <div className="form-group col-sm-5">
          <label>Longitude:</label>
          <input
            className="form-control form-control-lg"
            type="number"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
          />
          <p className="error-message">{errors.longitude}</p>
        </div>
        <div className="form-group col-sm-5">
          <label>Start Date:</label>
          <input
            className="form-control form-control-lg"
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
          <p className="error-message">{errors.startDate}</p>
        </div>
        <div className="form-group col-sm-5">
          <label>End Date:</label>
          <input
            className="form-control form-control-lg"
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
          <p className="error-message">{errors.endDate}</p>
        </div>
        <div className="form-group col-sm-10">
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </div>
      </form>
      {climateData && (
        <div class="form-group-cont col-sm-10">
          <h2>Climate Data</h2>
          <p>Latitude: {climateData.latitude}</p>
          <p>Longitude: {climateData.longitude}</p>
          <p>generationtime_ms: {climateData.generationtime_ms}</p>
          <p>utc_offset_seconds: {climateData.utc_offset_seconds}</p>
          <p>timezone: {climateData.timezone}</p>
          <p>timezone_abbreviation: {climateData.timezone_abbreviation}</p>
          <p>elevation: {climateData.elevation}</p>
        </div>
      )}

      {climateData && <ClimateTable data={climateData} />}
    </div>
  );
};

export default ClimateForm;
