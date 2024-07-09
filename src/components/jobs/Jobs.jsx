import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faGripVertical,
  faBars,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import "./Jobs.Module.css";
import { Link, useLocation } from "react-router-dom";
import JobComponent from "../home/featuredJobs/jobcomponent";
import { UserContext } from '../../Contexts/User';

import jobimg from "../../assets/img/dropbox.svg"//نحذفها عند اضافة صور للداتابيس

export default function Jobs() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get("category");
  const { user, setUser } = useContext(UserContext);
  if (!user) {
    // إرجاع رسالة تعبيرية أو إعادة توجيه المستخدم إذا كانت القيمة غير متاحة
    return <div>Loading...</div>;
  }
  const [username, setUsername] = useState("");


  useEffect(() => {
    if (selectedCategory && categories[selectedCategory] !== undefined) {
      setCategories({
        ...categories,
        [selectedCategory]: true
      });
    }
  }, [selectedCategory]);



  const [jobs, setJobs] = useState([]);
  const [jobsCount, setJobsCount] = useState(0);
  const [selectedValue, setSelectedValue] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  /////////////////////////////

  const [Skill, setSkill] = useState("");

  // for filter list open and close
  const [filtersOpen, setFiltersOpen] = useState({
    employment: true,
    categories: true,
    jobLevel: true,
    salaryRange: true,
  });

  // Filters state
  const [categories, setCategories] = useState({
    Technology: false,
    Lawyer: false,
    HumanResources: false,
    Design: false,
    Sales: false,
    Business: false,
    Finance: false,
    Engineering: false,
    Marketing: false
    // Add more categories if needed
  });
  const [selectedLevel, setSelectedLevel] = useState({
    EntryLevel: false, // 3000
    MidLevel: false, // 2500 to 3000
    SeniorLevel: false, // 1500 to 2500
    Director: false, // 1000 to 1500
    VPorAbove: false
  });

  const [salaries, setSalaries] = useState({
    range1: false, // 3000
    range2: false, // 2500 to 3000
    range3: false, // 1500 to 2500
    range4: false, // 1000 to 1500
  });
  const [times, settimes] = useState({
    Full: false, // 3000
    Half: false, // 2500 to 3000
    Remote: false, // 1500 to 2500
    Internship: false, // 1000 to 1500
    Contract: false
  });
  /*useEffect(() => {
    axios.get('http://localhost:3002/online')
      .then(response => {
        setUsername(response.data.username);
        // Call handlloadall only after username is set
      })
      .catch(error => {
        console.error('Error fetching online status:', error);
      });
  }, []);*/
  useEffect(() => {
    setUsername(user.username);
    if (username) {
      handlloadall(); // Call handlloadall only when username is set
    }
  }, [username]);
  const [experiences, setExperiences] = useState([]);

  
  useEffect(() => {
   
      axios.get(`http://localhost:3002/experiences/${user.username}`)
        .then(response => {
          setExperiences(response.data.results);
          //console.log(experiences)
        })
        .catch(error => {
          console.error('Error fetching experiences:', error);
        });
   
  }, []);
  useEffect(() => {
    const fetchJobs = () => {
      axios.get('http://localhost:3002/jobs')
        .then(response => {
          // Sort jobs so that paid jobs appear first
          const sortedJobs = response.data.sort((a, b) => {
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
          setJobs(sortedJobs);
          setFilteredJobs(sortedJobs); // Set filtered jobs initially to sorted jobs
        })
        .catch(error => {
          console.error('Error fetching job data:', error);
        });
    };
    fetchJobs();
  }, []);

  const handlloadall = () => {

    // Make a GET request to the API endpoint
    axios.get(`http://localhost:3002/allinformation/${username}`)
      .then(response => {
        // Set the fetched job data to the state


        setSkill(response.data.results[0].Skills);

      }
      )
      .catch(error => {
        console.error('Error fetching all information:', error);
      });

  };

  // useEffect to filter jobs when filters change


  useEffect(() => {

    const filtered = jobs.filter(job => {
      // Filter by category
      if (
        !(
          categories.Technology ||
          categories.Lawyer ||
          categories.HumanResources ||
          categories.Design ||
          categories.Sales ||
          categories.Business ||
          categories.Finance ||
          categories.Engineering ||
          categories.Marketing ||
          times.Full ||
          times.Half ||
          times.Contract ||
          times.Internship ||
          times.Remote ||
          salaries.range1 ||
          salaries.range2 ||
          salaries.range3 ||
          salaries.range4 ||
          selectedLevel.EntryLevel ||
          selectedLevel.SeniorLevel ||
          selectedLevel.Director ||
          selectedLevel.MidLevel ||
          selectedLevel.VPorAbove

        )
      ) {
        return true;
      }

      if (

        (categories.Technology && job.Majored === 'Technology') ||
        (categories.Lawyer && job.Majored === 'Lawyer') ||
        (categories.HumanResources && job.Majored === 'Human Resources') ||
        (categories.Design && job.Majored === 'Design') ||
        (categories.Sales && job.Majored === 'Sales') ||
        (categories.Business && job.Majored === 'Business') ||
        (categories.Finance && job.Majored === 'Finance') ||
        (categories.Engineering && job.Majored === 'Engineering') ||
        (categories.Marketing && job.Majored === 'Marketing')

        // Add more conditions for other categories
      ) {
        return true;
      }

      // Filter by salary
      if (
        (salaries.range1 && job.salary >= 3000) ||
        (salaries.range2 && job.salary >= 1500 && job.salary <= 2000) ||
        (salaries.range3 && job.salary >= 1000 && job.salary < 1500) ||
        (salaries.range4 && job.salary >= 700 && job.salary < 1000)
        // Add more conditions for other salary ranges
      ) {
        return true;
      }

      // Filter by time
      if (
        (times.Full && job.jobtime === 'Full') ||
        (times.Half && job.jobtime === 'Half') ||
        (times.Remote && job.jobtime === 'Remote') ||
        (times.Internship && job.jobtime === 'Internship') ||
        (times.Contract && job.jobtime === 'Contract')

      ) {
        return true;
      }
      // Filter by job level
      if (
        (selectedLevel.EntryLevel && job.JobLevel === 'Entry Level') ||
        (selectedLevel.MidLevel && job.JobLevel === 'Mid Level') ||
        (selectedLevel.SeniorLevel && job.JobLevel === 'Senior Level') ||
        (selectedLevel.Director && job.JobLevel === 'Director') ||
        (selectedLevel.VPorAbove && job.JobLevel === 'VP or Above')
      ) {
        return true;
      }


      return false;
    });
    setFilteredJobs(filtered);
    setJobsCount(filtered.length);
  }, [jobs, categories, salaries, times, selectedLevel]);
  //
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter jobs based on the search query or show all if the query is empty
    let filtered = query === ""
      ? jobs // Show all jobs if the query is empty
      : jobs.filter(job =>
        job.JobLevel.toLowerCase().includes(query.toLowerCase()) ||
        job.Majored.toLowerCase().includes(query.toLowerCase()) ||
        job.jobtime.toLowerCase().includes(query.toLowerCase()) ||
        job.salary.toLowerCase().includes(query.toLowerCase()) ||
        job.Description.toLowerCase().includes(query.toLowerCase()) ||
        job.Nameofjobs.toLowerCase().includes(query.toLowerCase()) ||
        job.Location.toLowerCase().includes(query.toLowerCase()) ||
        job.CompanyName.toLowerCase().includes(query.toLowerCase())
      );

    setFilteredJobs(filtered);
    setJobsCount(filtered.length);

  };
  ///
  const [ispress, setispress] = useState(false); //how show the jobs
  useEffect(() => {

    if (ispress) {
      const combinedExperiencesName = experiences.map(exp => exp.name).join(',').replace(' ',',');
      const combinedExperiencesName1 = experiences.map(exp => exp.name).join(',').replace(' ',',');


        //const combinedExperiencesName = experiences.map(exp => exp.name).join(', ');
        //console.log(combinedExperiencesName)
        
        const experiencesArrayName = combinedExperiencesName.split(',');
        const experiencesArrayName1 = combinedExperiencesName1.split(',');
        const skillsArray = Skill.split(',');
        const skillsArray1 = Skill.split(',');
      
        const filtered = jobs.filter(job => {
          // Check if any experience name, description, or skill is present in the job description
          return experiencesArrayName.some(experience => 
              job.Description.toLowerCase().includes(experience.toLowerCase())) ||
              experiencesArrayName1.some(experience => 
                job.Description.toLowerCase().includes(experience.toLowerCase())) ||
            skillsArray.some(skill => 
              job.Description.toLowerCase().includes(skill.toLowerCase()))||
              skillsArray1.some(skill1 => 
                job.Nameofjobs.toLowerCase().includes(skill1.toLowerCase()))
    
                });
      
        // Set the filtered jobs and count
        setFilteredJobs(filtered);
        setJobsCount(filtered.length);
   
    }
    else
      setFilteredJobs(jobs);
    setJobsCount(jobs.length);
  }, [ispress]);
 
  
  // Functions to handle filter changes
  const toggleFilters = (filterName) => {
    setFiltersOpen({
      ...filtersOpen,
      [filterName]: !filtersOpen[filterName],
    });
  };


  const handlelevelChange = (range) => {
    setSelectedLevel(prevState => ({ ...prevState, [range]: !prevState[range] }));
  };
  const handleTimeChange = (range) => {
    settimes(prevState => ({ ...prevState, [range]: !prevState[range] }));
  };
  const handlecategoryChange = (range) => {
    setCategories(prevState => ({ ...prevState, [range]: !prevState[range] }));
  };
  const handleSelectionChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleSalaryChange = (range) => {
    setSalaries(prevState => ({ ...prevState, [range]: !prevState[range] }));
  };

  const [View, setView] = useState("grip"); //how show the jobs
  const toggleView = (newView) => {
    setView(newView);
  };

  const [selectOpen, setSelectOpen] = useState(false); //sorted by open close
  const handleSelectClick = () => {
    setSelectOpen(!selectOpen);
  };
  const handleCheckboxChange = () => {
    setispress(!ispress);
  };

  //pagenation 
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(filteredJobs.length / jobsPerPage); i++) {
    pageNumbers.push(i);
  }
  //end pagenation

  return (
    <div className="jobspage">
      <div className="searchdiv">
        <div className="jobslabel">
          <h1>
            Find your <span>dream job</span>
          </h1>
          <p>Find your next career at companies</p>
        </div>
        <div className="searchbar">
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
            <label>
              <input className="checkbox" type="checkbox" checked={ispress} onChange={handleCheckboxChange} />
              Advanced Search
            </label>

          </form>
        </div>
      </div>
      <div className="jobsdiv">
        <div className="filters">
          <div className="filterlist">
            <label onClick={() => toggleFilters("employment")}>
              Type of Employment
              <FontAwesomeIcon
                icon={faChevronUp}
                style={{
                  color: "#25324B",
                  background: "#FFF",
                  transform: filtersOpen.employment
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
            </label>
            <ol className={filtersOpen.employment ? "" : "hiddenlist"}>
              <li>
                <label>
                  <input type="checkbox" checked={times.Full} onChange={() => handleTimeChange('Full')} />
                  Full-time
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={times.Half} onChange={() => handleTimeChange('Half')} />
                  Part-Time
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={times.Remote} onChange={() => handleTimeChange('Remote')} />
                  Remote
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={times.Internship} onChange={() => handleTimeChange('Internship')} />
                  Internship
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={times.Contract} onChange={() => handleTimeChange('Contract')} />
                  Contract
                </label>
              </li>
            </ol>
          </div>
          <div className="filterlist">
            <label onClick={() => toggleFilters("categories")}>
              Categories
              <FontAwesomeIcon
                icon={faChevronUp}
                style={{
                  color: "#25324B",
                  background: "#FFF",
                  transform: filtersOpen.categories
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
            </label>
            <ol className={filtersOpen.categories ? "" : "hiddenlist"}>
              <li>
                <label>
                  <input id="Design" type="checkbox" onChange={() => handlecategoryChange('Design')} checked={categories.Design} />
                  Design
                </label>
              </li>
              <li>
                <label>
                  <input id="Sales" type="checkbox" onChange={() => handlecategoryChange('Sales')} checked={categories.Sales} />
                  Sales
                </label>
              </li>
              <li>
                <label>
                  <input id="Marketing" type="checkbox" onChange={() => handlecategoryChange('Marketing')} checked={categories.Marketing} />
                  Marketing
                </label>
              </li>
              <li>
                <label>
                  <input id="Business" type="checkbox" onChange={() => handlecategoryChange('Business')} checked={categories.Business} />
                  Business
                </label>
              </li>
              <li>
                <label>
                  <input id="HumanResource" type="checkbox" onChange={() => handlecategoryChange('Human Resources')} checked={categories.HumanResources} />
                  Human Resource
                </label>
              </li>
              <li>
                <label>
                  <input id="Finance" type="checkbox" onChange={() => handlecategoryChange('Finance')} checked={categories.Finance} />
                  Finance
                </label>
              </li>
              <li>
                <label>
                  <input id="Engineering" type="checkbox" onChange={() => handlecategoryChange('Engineering')} checked={categories.Engineering} />
                  Engineering
                </label>
              </li>
              <li>
                <label>
                  <input id="Technology" type="checkbox" onChange={() => handlecategoryChange('Technology')} checked={categories.Technology} />
                  Technology
                </label>
              </li>
            </ol>
          </div>
          <div className="filterlist">
            <label onClick={() => toggleFilters("jobLevel")}>
              Job Level
              <FontAwesomeIcon
                icon={faChevronUp}
                style={{
                  color: "#25324B",
                  background: "#FFF",
                  transform: filtersOpen.jobLevel
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
            </label>
            <ol className={filtersOpen.jobLevel ? "" : "hiddenlist"}>
              <li>
                <label>
                  <input type="checkbox" checked={selectedLevel.EntryLevel} onChange={() => handlelevelChange('EntryLevel')} />
                  Entry Level
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={selectedLevel.MidLevel} onChange={() => handlelevelChange('MidLevel')} />
                  Mid Level
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={selectedLevel.SeniorLevel} onChange={() => handlelevelChange('SeniorLevel')} />
                  Senior Level
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={selectedLevel.Director} onChange={() => handlelevelChange('Director')} />
                  Director
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={selectedLevel.VPorAbove} onChange={() => handlelevelChange('VPorAbove')} />
                  VP or Above
                </label>
              </li>
            </ol>
          </div>
          <div className="filterlist">
            <label onClick={() => toggleFilters("salaryRange")}>
              Salary Range
              <FontAwesomeIcon
                icon={faChevronUp}
                style={{
                  color: "#25324B",
                  background: "#FFF",
                  transform: filtersOpen.salaryRange
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              />
            </label>
            <ol className={filtersOpen.salaryRange ? "" : "hiddenlist"}>
              <li>
                <label>
                  <input type="checkbox" checked={salaries.range4}
                    onChange={() => handleSalaryChange("range4")} />
                  700$ - 1000$
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={salaries.range3}
                    onChange={() => handleSalaryChange("range3")} />
                  1000$ - 1500$
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={salaries.range2}
                    onChange={() => handleSalaryChange("range2")} />
                  1500$ - 2000$
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" checked={salaries.range1}
                    onChange={() => handleSalaryChange("range1")} />
                  3000$ or above
                </label>
              </li>
            </ol>
          </div>
        </div>
        <div className="alljobs">
          <div className="alljobsdiv">
            <div className="jobsheader">
              <div className="headerLeftSide">
                <h2>All Jobs</h2>
                <p>Showing {jobsCount} results</p>
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
                    <option value="Company">Company</option>
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
            <div className="showjobs">
              {/* Your jobs will be displayed here */}
              {currentJobs.map((job, index) => (
                
                <JobComponent key={index}
                  jobDetails={{
                    jobName: job.Nameofjobs,
                    jobTime: job.jobtime,
                    companyName: job.CompanyName,
                    jobLocation: job.Location,
                    jobDiscription: job.Discription,
                    jobCatigory: job.Majored,

                  }} isCompany={false} />

              ))}
            </div>
          </div>
          <div className="pagination">
            {pageNumbers.map(number => (
              <button key={number} onClick={() => paginate(number)}>
                {number}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
