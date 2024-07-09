import axios from "axios";

async function Jobspaid() {

  let Jobs = [];
  let error = "";

  try {
    const response = await axios.post("http://localhost:3002/jobspaid");

    if (response.data.results && response.data.results.length > 0) {
      Jobs = response.data.results.map((jobData) => ({
        id: jobData.ID,
        name: jobData.Nameofjobs, // Assuming this is the username of the company
        location: jobData.Location, // Assuming this is the email of the company
        jobtime: jobData.jobtime, // Assuming this property exists in jobData
        Majord: jobData.Majored, // Assuming this property exists in jobData
        Companyname: jobData.CompanyName,
        Description: jobData.Description // Assuming this property exists in jobData
      }));
    } else {
      error = "No companies found.";
    }
  } catch (err) {
    error = "Network error, please try again later.";
    console.error("Company fetch error:", err);
  }

  return { Jobs, error };
}

export default Jobspaid;
