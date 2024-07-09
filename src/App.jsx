import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Root from "./components/root/root";
import Home from "./components/home/home";
import Jobs from "./components/jobs/Jobs";
import Companies from "./components/companies/Companies";
import LoginSignup from "./components/loginSignup/loginSignupPage";
import About from "./components/about/about";
import Contact from "./components/contact/contact";
import NotFound from "./components/NotFound";
import AdminControl from "./components/users/admin/AdminControl";
import UserPage from "./components/users/user/UserPage";
import UserDashboard from "./components/users/user/components/userDashboard"
import UserProfile from "./components/users/user/components/UserProfile"
import MyApplications from "./components/users/user/components/MyApplications"
import Interviwsuser from "./components/users/user/components/Interviwsuser"


import UserContextProvider from "./Contexts/User";
import EditUsers from "./components/users/admin/components/editUsers";
import AddCompany from "./components/users/admin/components/addCompany";
import AddJob from "./components/users/admin/components/AddJob";
import EditUserData from "./components/users/admin/components/editUserData";
import Charts from "./components/users/admin/components/Charts";
import ControlofEdit from "./components/users/admin/components/ControlofEdit";

import CompanyPage from "./components/users/Company/companyPage";
import UploadNewJob from "./components/users/Company/companyComponent/UploadNewJob";
import EditJobs from "./components/users/Company/companyComponent/editJobs";
import CompanyProfile from "./components/users/Company/companyComponent/CompanyProfile";
import JobManage from "./components/users/Company/companyComponent/jobManage";
import ShowProfile from "./components/users/user/components/showProfile"
import ShowCompanyProfile from "./components/users/Company/companyComponent/showCompanyProfile";
import Interviews from "./components/users/Company/companyComponent/Interviews";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/Jobs",
        element: <Jobs />,
      },
      {
        path: "/Companies",
        element: <Companies />,
      },
      {
        path: "/loginSignup",
        element: <LoginSignup />,
      },
      {
        path: "/About",
        element: <About />,
      },
      {
        path: "/Contact",
        element: <Contact />,
      },
      {
        path: "/User/:username",
        element: <ShowProfile />,
      },
      {
        path: "/Company/:companyname",
        element: <ShowCompanyProfile />,
      },
      {
        path: "/UserPage",
        element: <UserPage />,
        children: [
          {
            path: "",
            element: <UserDashboard />,
          },
          {
            path: "Profile",
            element: <UserProfile />,
          },
          {
            path: "MyApplications",
            element: <MyApplications />,
          },
          {
            path: "Interview",
            element: <Interviwsuser />,
          },
        ],
      },
      {
        path: "/AdminControl",
        element: <AdminControl />,
        children: [
          {
            path: "AddUser",
            element: <EditUsers />
          },
          {
            path: "AddCompany",
            element: <AddCompany />
          },
          {
            path: "AddJob",
            element: <AddJob />
          },
          {
            path: "EditUser/:username",
            element: <EditUserData />
          },
          {
            path: "Charts",
            element: <Charts/>
          },
          {
            path: "ControlofEdit",
            element: <ControlofEdit/>
          },
        ],
      },
      {
        path: "/Company",
        element: <CompanyPage />,
        children: [
          {
            path: "Jobs",
            element: <EditJobs />
          },
          {
            path: "Jobs/Job/:id/:Nameofjobs/:Description/:Location",
            element: <JobManage />
          },
          {
            path: "Profile",
            element: <CompanyProfile />
          },
           {
             path: "/Company/AddJob",
             element: <UploadNewJob />
           },
           {
            path: "/Company/Interviews",
            element: <Interviews />
          },
          // {
          //   path: "/AdminControl/EditUser/:username",
          //   element: <EditUserData />
          // },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default function App() {
  return (
    <>
      <UserContextProvider>
        <RouterProvider router={Router} />
      </UserContextProvider>
      
      <ToastContainer />
    </>
  );
}
