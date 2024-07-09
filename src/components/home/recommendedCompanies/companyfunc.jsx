import axios from "axios";

async function Company() {

  let companies = [];
  let error = "";

  try {
    const response = await axios.post("http://localhost:3002/Companys");

    

    if (response.data.results && response.data.results.length > 0) {
      companies = response.data.results.map((companyData) => ({
        name: companyData.username,
        email: companyData.email,
        isAdmin: companyData.isAdmin,
        isPaid: companyData.isPaid,
        Majored: companyData.Majored,
        Size: companyData.size// Check for case sensitivity
      }));
    } else {
      error = "No companies found.";
    }
  } catch (err) {
    error = "Network error, please try again later.";
    console.error("Company fetch error:", err);
  }

  return { companies, error };
}

export default Company;
