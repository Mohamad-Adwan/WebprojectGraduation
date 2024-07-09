import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import CompanyComponent from "./CompanyComponent";
import Companyimg from "../../../assets/img/dropbox.svg";
import "./RecommendedCompanies.Module.css";
import Company from "./companyfunc"; // Assuming the function is exported as default
import { useState, useEffect } from "react";

export default function RecommendedCompanies() {
  const [companyResult, setCompanyResult] = useState([]);
  const [img, setImg] = useState(Companyimg);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { companies, error } = await Company(); // Call Company function to fetch data
        if (error) {
          console.error("Error fetching companies:", error);
          return;
        }
        setCompanyResult(companies);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="recommendedCompanies">
      <div className="RCompaniesLabel">
        <h2>
          Recommended <span>Companies</span>
        </h2>
        <Link className="jobsLink" to="/Companies">
          Show All Companies <FontAwesomeIcon icon={faArrowRight} />
        </Link>
      </div>
      <div className="CompaniesComponent">
        {companyResult.map((company, index) => (
          <CompanyComponent
            key={index}
            companyDetails={{
              img: Companyimg,
              companyJobsNum: company.isAdmin,
              companyName: company.name,
              companyDiscription: company.email,
              companyCatigory: company.Majored,
              size: company.Size // Corrected typo in property name
            }}
          />
        ))}
      </div>
    </div>
  );
}
