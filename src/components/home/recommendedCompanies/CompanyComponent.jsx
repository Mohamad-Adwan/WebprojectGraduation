import "./CompanyComponent.Module.css";
import { Link } from "react-router-dom";
import { FaBuilding } from "react-icons/fa";

export default function CompanyComponent({ companyDetails }) {
  return (
    <Link className="CompanyComponent">
    <div className="icon">
      <FaBuilding style={{ fontSize: '3rem' }} />
    </div>
      <h3>{companyDetails.companyName}</h3>
      <p className={`${companyDetails.companyCatigory} companyCatigory`}>
        <h4>{companyDetails.companyCatigory}</h4>
      </p>
      <p className="companyDiscription">{companyDetails.companyDiscription}</p>
      
      <p className="jobsNumber">{companyDetails.companyJobsNum} Jobs</p>
      <h7>{companyDetails.size}</h7>
    </Link>
  );
}
