import './Companies.Module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faChevronUp,
  faGripVertical,
  faBars
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';
import CompanyCopmonent from "../home/recommendedCompanies/CompanyComponent";
import axios from 'axios';
export default function Companies() {

  // for filter list open and close
  const [filtersOpen, setFiltersOpen] = useState({
    Industry: true,
    CompanySize: true,
  });
  //////////////////
  const [companys, setCompany] = useState([]);
  const [companysCount, setcompanyCount] = useState(0);
  const [filteredCompany, setFilteredCompanys] = useState([]);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        console.log("fedfs")
        const response = await axios.get('http://localhost:3002/allCompany');
        console.log(response, "fedfs")
        // Sort jobs so that paid jobs appear first
        const sortedcompany = response.data.sort((a, b) => {
          const isPaidA = parseInt(a.isPaid);
          const isPaidB = parseInt(b.isPaid);

          if (isPaidA && !isPaidB) {
            return -1; // Paid jobs come before unpaid jobs
          } else if (!isPaidA && isPaidB) {
            return 1; // Unpaid jobs come after paid jobs
          } else {
            return 0; // Preserve the original order for jobs with the same paid status
          }
        });
        setCompany(sortedcompany);
        setFilteredCompanys(sortedcompany); // Set filtered jobs initially to sorted jobs
      } catch (error) {
        console.error('Error fetching job data:', error);
      }
    };
    fetchCompany();
  }, []);
  /////////////////////
  const [Industry, setIndustry] = useState({
    Advertising: false,
    BusinessService: false,
    Blockchain: false,
    Cloud: false,
    ConsumerTech: false,
    Education: false,
    Fintech: false,
    FoodBeverage: false,
    Healthcare: false,
    Hostinng: false,
    Media: false
    // Add more Industry if needed
  });
  const [CompanySize, setCompanySize] = useState({
    range1: false, // 3000
    range2: false, // 2500 to 3000
    range3: false, // 1500 to 2500
    range4: false,
    range5: false,
    range6: false // 1000 to 1500
  });
  /////////////
  useEffect(() => {

    const filtered = companys.filter(company => {
      // Filter by category
      if (
        !(
          Industry.Advertising ||
          Industry.Blockchain ||
          Industry.BusinessService ||
          Industry.Cloud ||
          Industry.ConsumerTech ||
          Industry.Education ||
          Industry.Fintech ||
          Industry.FoodBeverage ||
          Industry.Healthcare ||
          Industry.Hostinng ||
          Industry.Media ||
          CompanySize.range1 ||
          CompanySize.range2 ||
          CompanySize.range3 ||
          CompanySize.range4 ||
          CompanySize.range5 ||
          CompanySize.range6

        )
      ) {
        return true;
      }

      if (

        (Industry.Advertising && company.Majored === 'Advertising') ||
        (Industry.Blockchain && company.Majored === 'Blockchain') ||
        (Industry.BusinessService && company.Majored === 'Business Service') ||
        (Industry.Cloud && company.Majored === 'Cloud') ||
        (Industry.ConsumerTech && company.Majored === 'Consumer Tech') ||
        (Industry.Education && company.Majored === 'Education') ||
        (Industry.Fintech && company.Majored === 'Fintech') ||
        (Industry.FoodBeverage && company.Majored === 'FoodBeverage') ||
        (Industry.Healthcare && company.Majored === 'Healthcare') ||
        (Industry.Hostinng && company.Majored === 'Hostinng') ||
        (Industry.Media && company.Majored === 'Media')

        // Add more conditions for other categories
      ) {
        return true;
      }

      // Filter by salary
      if (
        (CompanySize.range1 && company.size >= 1001) ||
        (CompanySize.range2 && company.size >= 501 && company.size <= 1000) ||
        (CompanySize.range3 && company.size >= 251 && company.size < 500) ||
        (CompanySize.range4 && company.size >= 151 && company.size < 250) ||
        (CompanySize.range5 && company.size >= 51 && company.size < 150) ||
        (CompanySize.range6 && company.size >= 1 && company.size < 50)
        // Add more conditions for other salary ranges
      ) {
        return true;
      }

      // Filter by time

      // Filter by job level



      return false;
    });
    setFilteredCompanys(filtered);
    setcompanyCount(filtered.length);
  }, [companys, Industry, CompanySize]);
  //
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter jobs based on the search query or show all if the query is empty
    let filtered = query === ""
      ? companys // Show all jobs if the query is empty
      : companys.filter(company =>
        company.username.toLowerCase().includes(query.toLowerCase()) ||
        company.email.toLowerCase().includes(query.toLowerCase()) ||
        company.Majored.toLowerCase().includes(query.toLowerCase()) //||
        //company.size.toLowerCase().includes(query.toLowerCase()) 

      );

    setFilteredCompanys(filtered);
    setcompanyCount(filtered.length);

  };
  ///////////////////
  const handleIndustry = (range) => {
    setIndustry(prevState => ({ ...prevState, [range]: !prevState[range] }));
  };
  const handlecompanytsize = (range) => {
    setCompanySize(prevState => ({ ...prevState, [range]: !prevState[range] }));
  };

  // Functions to handle filter changes
  const toggleFilters = (filterName) => {
    setFiltersOpen({
      ...filtersOpen,
      [filterName]: !filtersOpen[filterName],
    });
  };

  const [selectedValue, setSelectedValue] = useState("");

  const handleSelectionChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const [View, setView] = useState("grip"); //how show the jobs
  const toggleView = (newView) => {
    setView(newView);
  };

  const [selectOpen, setSelectOpen] = useState(false); //sorted by open close
  const handleSelectClick = () => {
    setSelectOpen(!selectOpen);
  };

  //pagination
  const pageSize = 12; // عدد الشركات لكل صفحة

  const pageCount = Math.ceil(filteredCompany.length / pageSize);

  const [currentPage, setCurrentPage] = useState(1);

  const displayedCompanies = filteredCompany.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= pageCount) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="companiespage">
      <div className='searchdiv'>
        <div className='lebeldiv'>
          <h1>Find your <span>dream companies</span></h1>
          <p>Find your dream companies you dream work for</p>
        </div>
        <div className='search'>
          <form>
            <label>
              <FontAwesomeIcon
                className="searchIcon"
                icon={faMagnifyingGlass}
              />
            </label>
            <input className="searchtext"
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </form>
        </div>
      </div>
      <div className="companiesdiv">
        <div className="filters">
          <div className="filterlist">
            <label onClick={() => toggleFilters("Industry")}>
              Industry
              <FontAwesomeIcon
                icon={faChevronUp}
                style={{
                  color: "#25324B",
                  background: "#FFF",
                  transform: filtersOpen.Industry
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
            </label>
            <ol className={filtersOpen.Industry ? "" : "hiddenlist"}>
              <li>
                <label>
                  <input type="checkbox" checked={Industry.Advertising} onChange={() => handleIndustry('Advertising')} />
                  Advertising
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={Industry.BusinessService} onChange={() => handleIndustry('BusinessService')} />
                  Business Service
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={Industry.Blockchain} onChange={() => handleIndustry('Blockchain')} />
                  Blockchain
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={Industry.Cloud} onChange={() => handleIndustry('Cloud')} />
                  Cloud
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={Industry.ConsumerTech} onChange={() => handleIndustry('ConsumerTech')} />
                  Consumer Tech
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={Industry.Education} onChange={() => handleIndustry('Education')} />
                  Education
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={Industry.Fintech} onChange={() => handleIndustry('Fintech')} />
                  Fintech
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={Industry.Gaming} onChange={() => handleIndustry('Gaming')} />
                  Gaming
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={Industry.FoodBeverage} onChange={() => handleIndustry('FoodBeverage')} />
                  Food & Beverage
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={Industry.Healthcare} onChange={() => handleIndustry('Healthcare')} />
                  Healthcare
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={Industry.Hostinng} onChange={() => handleIndustry('Hostinng')} />
                  Hostinng
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={Industry.Media} onChange={() => handleIndustry('Media')} />
                  Media
                </label>
              </li>
            </ol>
          </div>
          <div className="filterlist">
            <label onClick={() => toggleFilters("CompanySize")}>
              Company Size {/*حسب عدد الموظفين*/}
              <FontAwesomeIcon
                icon={faChevronUp}
                style={{
                  color: "#25324B",
                  background: "#FFF",
                  transform: filtersOpen.CompanySize
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
            </label>
            <ol className={filtersOpen.CompanySize ? "" : "hiddenlist"}>
              <li>
                <label>
                  <input type="checkbox" checked={CompanySize.range6} onChange={() => handlecompanytsize("range6")} />
                  1-50
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={CompanySize.range5} onChange={() => handlecompanytsize("range5")} />
                  51-150
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={CompanySize.range4} onChange={() => handlecompanytsize("range4")} />
                  151-250
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={CompanySize.range3} onChange={() => handlecompanytsize("range3")} />
                  251-500
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={CompanySize.range2} onChange={() => handlecompanytsize("range2")} />
                  501-1000
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={CompanySize.range1} onChange={() => handlecompanytsize("range1")} />
                  1000 - above
                </label>
              </li>
            </ol>
          </div>
        </div>
        <div className="allcompanies">
          <div className="allcompaniesdiv">
            <div className="companiesheader">
              <div className="headerLeftSide">
                <h2>All Companies</h2>
                <p>Showing {companysCount} results</p>
              </div>
              <div className="headerRightSide">
                <label>Sort by:</label>
                <div className="selectdiv">
                  <select
                    value={selectedValue}
                    onClick={handleSelectClick}
                    onChange={handleSelectionChange}
                  >
                    <option value="MostRelevent">Most relevent</option>
                    <option value="Newest">Newest</option>
                    <option value="Company">Company Size</option>
                    <option value="Name">Name</option>
                  </select>
                  <FontAwesomeIcon
                    className="selectArrow"
                    icon={faChevronUp}
                    style={{
                      transform: selectOpen ? "rotate(180deg)" : "rotate(0deg)",
                      color: "#4640de",
                      background: "#FFF",
                    }}
                  />
                </div>
                <div className="viewButtons">
                  <button onClick={() => toggleView("grip")}>
                    <FontAwesomeIcon
                      className="buttonIcon"
                      icon={faGripVertical}
                      style={{ color: View === "grip" ? "#4640de" : "#515b6f" }}
                    />
                  </button>
                  <button onClick={() => toggleView("list")}>
                    <FontAwesomeIcon
                      className="buttonIcon"
                      icon={faBars}
                      style={{ color: View === "list" ? "#4640de" : "#515b6f" }}
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="showcompanies">
              {/* اعرض الشركات باستخدام <CompanyCopmonent/>*/}
              {filteredCompany.map((company, index) => (
                <CompanyCopmonent key={index}
                  companyDetails={{
                   
                    companyName: company.username,
                    companyCatigory: company.Majored,
                    companyDiscription: company.email,
                    size: company.size
                  }} />

              ))}

            </div>
          </div>
          <div className="pagination">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => changePage(page)}>
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
