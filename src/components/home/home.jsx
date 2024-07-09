import "./Home.Module.css";
import Catigory from "./catigory/catigory";
import FeaturedJobs from "./featuredJobs/FeaturedJobs";
import RecommendedCompanies from "./recommendedCompanies/RecommendedCompanies";
export default function home() {
  return (
    <div className="homepage">
      <Catigory />
      <hr />
      <FeaturedJobs />
      <hr />
      <RecommendedCompanies />
    </div>
  );
}
