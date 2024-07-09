import './Footer.Module.css';
import Logo from '../../assets/img/Logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import Facebook from '../../assets/img/facebook.svg';
import Tweeter from '../../assets/img/tweeter.svg';
import Linkedin from '../../assets/img/linkedin.svg';
import Phone from '../../assets/img/phone.svg';
import Email from '../../assets/img/mail.svg';
import Location from '../../assets/img/location.svg';

export default function footer() {
  return (
    <>
      <div className='footers'>
        <div className="contaner">
          <div className="waves">
            <div className="wave" id="wave1"></div>
            <div className="wave" id="wave2"></div>
            <div className="wave" id="wave3"></div>
            <div className="wave" id="wave4"></div>
          </div>
          <div className="content">
            <div className="leftside">
              <img className="logo" src={Logo} />
              <div className="communication">
                <div>
                  <img src={Email} alt="mail" />
                  <p>hello@skillbridge.com</p>
                </div>
                <div>
                  <img src={Phone} alt="phone" />
                  <p>+91 91813 23 2309</p>
                </div>
                <div>
                  <img src={Location} alt="location" />
                  <p>Somewhere in the World</p>
                </div>
              </div>
            </div>
            <div className="rightside">
              <ol>
                <li>About us</li>
                <li>Company</li>
                <li>Achievements</li>
                <li>Our Goals</li>
              </ol>
              <div className="socialprofiles">
                <h3>Social Profiles</h3>
                <div className="social">
                  <a href="#"><img src={Facebook} alt="facebook" /></a>
                  <a href="#"><img src={Tweeter} alt="tweeter" /></a>
                  <a href="#"><img src={Linkedin} alt="linkedin" /></a>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <p className="rights">© 2024 Hire me. All rights reserved.</p>
        </div>
      </div>
    </>
  )
}
