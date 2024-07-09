import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCompassDrafting,
  faBullhorn,
  faMoneyBills,
  faChartLine,
  faDesktop,
  faCode,
  faBriefcase,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./Catigory.Module.css";

export default function Catigory() {
  const [counts, setCounts] = useState({
    Design: 0,
    Sales: 0,
    Marketing: 0,
    Finance: 0,
    Technology: 0,
    Engineering: 0,
    Business: 0,
    HR: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const categories = [
          "Design",
          "Sales",
          "Marketing",
          "Finance",
          "Technology",
          "Engineering",
          "Business",
          "Human Resources",
        ];

        const newCounts = {};
        for (const category of categories) {
          const response = await fetch(`http://localhost:3002/count/${category}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch count for ${category}`);
          }
          const data = await response.json();
          newCounts[category] = data.count;
        }

        setCounts(newCounts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="catigoryContainer">
      <div className="catigoryLabel">
        <h2>
          Explore by <span>category</span>
        </h2>
        <Link className="jobsLink" to="/Jobs">
          Show All Jobs <FontAwesomeIcon icon={faArrowRight} />
        </Link>
      </div>
      <div className="catigories">
        {Object.entries(counts).map(([category, count]) => (
          <div className="catigorycomponent" key={category}>
            {getIcon(category)}
            <div>
              <h3>{category}</h3>
              <Link
                className="tojobs"
                to={{
                  pathname: "/Jobs",
                  search: `?category=${encodeURIComponent(category)}`, // Include category as query parameter
                }}
              >
                {count} Jobs available{" "}
                <FontAwesomeIcon className="arrowimg" icon={faArrowRight} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Function to get icon based on category
function getIcon(category) {
  switch (category) {
    case "Design":
      return <FontAwesomeIcon className="catigoryicon" icon={faCompassDrafting} />;
    case "Sales":
      return <FontAwesomeIcon className="catigoryicon" icon={faChartLine} />;
    case "Marketing":
      return <FontAwesomeIcon className="catigoryicon" icon={faBullhorn} />;
    case "Finance":
      return <FontAwesomeIcon className="catigoryicon" icon={faMoneyBills} />;
    case "Technology":
      return <FontAwesomeIcon className="catigoryicon" icon={faDesktop} />;
    case "Engineering":
      return <FontAwesomeIcon className="catigoryicon" icon={faCode} />;
    case "Business":
      return <FontAwesomeIcon className="catigoryicon" icon={faBriefcase} />;
    case "Human Resources":
      return <FontAwesomeIcon className="catigoryicon" icon={faUsers} />;
    default:
      return null;
  }
}
