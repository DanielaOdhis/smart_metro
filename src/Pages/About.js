import React from "react";
import "./About.css";
import { Link } from "react-router-dom";


const About = () => {
  return (
    <div className="parent-div ">
      <div className="desktop--1-12 pos-abs">
        <section className="frame-2-13 pos-abs">
          <div className="smart-metro-14 pos-abs">
            <span className="smart-metro-14-0">{`SMART `}</span>
            <span className="smart-metro-14-1">{`METRO`}</span>
          </div>

          <div className="home-tracking-a-15 pos-abs">
          <span className="home-tracking-a-3539-0">
              <Link to="/" className="nav-link">Home</Link> &nbsp;&nbsp;
              <Link to="/" className="nav-link">Tracking</Link> &nbsp;&nbsp;
              <Link to="/about" className="nav-link">About</Link> &nbsp;&nbsp;
              <Link to="/feedback" className="nav-link">Feedback</Link>
          </span>
          </div>
        </section>
        <div className="smart-metro-is--92 pos-abs">
          <p className="smart-metro-is--92-0">Smart Metro is a real time passenger information system designed to improve the commuting experience on the Nairobi-Juja route</p>
        </div>
        <div className="image-4-118 pos-abs">
          <img
            src="./metro.jpeg"
            className="pos-abs image-div bg-no-repeat fill-parent bg-cover nodeBg-118 "
            alt="smart metro"
          />
        </div>
        <section className="frame-33-10164 pos-abs">
          <div className="mission-10166 pos-abs">
            <span className="mission-10166-0">{`Mission`}</span>
          </div>
        </section>

        <section className="frame-7-96 pos-abs">
          <div className="vision-10167 pos-abs">
            <span className="vision-10167-0">{`Vision`}</span>
          </div>

          <div className="to-expand-our-s-10170 pos-abs">
            <span className="to-expand-our-s-10170-0">{`To expand our system to other major routes in Kenya, transforming public transport nationwide`}</span>
          </div>
        </section>

        <div className="to-provide-accu-10169 pos-abs">
          <span className="to-provide-accurate-10169-0">{`To provide accurate, real-time bus information for the Nairobi-Juja Route, making commuting more efficient and relialbe`}</span>
        </div>
        <section className="frame-9-99 pos-abs">
          <img
            src="./bgg.jpg"
            className="pos-abs image-div bg-no-repeat fill-parent bg-cover nodeBg-99 "
            alt="metro"
          />

          <div className="future-plans-10140 pos-abs">
            <span className="future-plans-10140-0">{`Future Plans`}</span>
          </div>

          <div className="frame-43-10146 pos-abs">
            <div className="frame-45-10156 pos-abs">
              <div className="starburst-shape-10158 pos-abs">
                <img
                  src="./Starburst Shape.png"
                  className="pos-abs image-div bg-no-repeat fill-parent bg-contain nodeBg-10158 "
                  alt=""
                />
              </div>

              <div className="integrate-the-s-10157 pos-abs">
                <span className="integrate-the-s-10157-0">{`Integrate the system with other transport systems in Kenya`}</span>
              </div>
            </div>

            <div className="frame-44-10155 pos-abs">
              <div className="starburst-shape-10153 pos-abs">
                <img
                  src="./Starburst Shape.png"
                  className="pos-abs image-div bg-no-repeat fill-parent bg-contain nodeBg-10153 "
                  alt=""
                />
              </div>

              <div className="add-mobile-app--10154 pos-abs">
                <span className="add-mobile-app--10154-0">{`Add mobile app support for real time notifications`}</span>
              </div>
            </div>

            <div className="frame-44-10160 pos-abs">
              <div className="starburst-shape-10162 pos-abs">
                <img
                  src="./Starburst Shape.png"
                  className="pos-abs image-div bg-no-repeat fill-parent bg-contain nodeBg-10162 "
                  alt=""
                />
              </div>

              <div className="introduce-multi-10161 pos-abs">
                <span className="introduce-multi-10161-0">{`Introduce multiple language support i.e Swahili`}</span>
              </div>
            </div>
          </div>

        </section>

        <div className="meet-our-team-915 pos-abs">
          <span className="meet-our-team-915-0">{`Meet Our Team`}</span>
        </div>
        <section className="frame-28-1016 pos-abs">
          <div className="rectangle-7-10106 pos-abs">
            <img
              src="./davie.jpeg"
              className="pos-abs image-div bg-no-repeat fill-parent bg-cover nodeBg-10106 "
              alt="David Owino"
            />
          </div>

          <div className="frame-23-10103 pos-abs">
            <div className="frontend-develo-10104 pos-abs">
              <span className="frontend-develo-10104-0">{`FRONTEND DEVELOPER`}</span>
            </div>
          </div>

          <div className="line-2-10107 pos-abs"></div>

          <div className="david-owino-10109 pos-abs">
            <span className="david-owino-10109-0">{`David Owino`}</span>
          </div>
        </section>
        <section className="frame-30-1095 pos-abs">
          <div className="rectangle-7-10111 pos-abs">
            <img
              src="./prisc.jpeg"
              className="pos-abs image-div bg-no-repeat fill-parent bg-cover nodeBg-10111 "
              alt="Priscilla Mumo"
            />{" "}
          </div>

          <div className="frame-25-10113 pos-abs">
            <div className="backend-develop-10114 pos-abs">
              <span className="backend-develop-10114-0">{`BACKEND DEVELOPER`}</span>
            </div>
          </div>

          <div className="line-2-10116 pos-abs"></div>

          <div className="priscilla-mumo-10118 pos-abs">
            <span className="priscilla-mumo-10118-0">{`Priscilla Mumo`}</span>
          </div>
        </section>
        {/* Frame 311 */}
        <section className="frame-31-1099 pos-abs">
          <div className="rectangle-7-10120 pos-abs">
            <img
              src="./peppy.jpeg"
              className="pos-abs image-div bg-no-repeat fill-parent bg-cover nodeBg-10120 "
              alt="Boniface Mwololo"
            />
          </div>

          <div className="frame-23-10122 pos-abs">
            <div className="data-analyst-10123 pos-abs">
              <span className="data-analyst-10123-0">{`DATA ANALYST`}</span>
            </div>
          </div>

          <div className="line-2-10125 pos-abs"></div>

          <div className="boniface-mwolol-10127 pos-abs">
            <span className="boniface-mwolol-10127-0">{`Boniface Mwololo`}</span>
          </div>
        </section>
        {/* Frame 321 */}
        <section className="frame-32-10101 pos-abs">
          <div className="rectangle-7-10132 pos-abs">
            <img
              src="./daniela.jpeg"
              className="pos-abs image-div bg-no-repeat fill-parent bg-cover nodeBg-10132 "
              alt="Daniela Odhiambo"
            />{" "}
          </div>

          <div className="frame-25-10129 pos-abs">
            <div className="backend-develop-10130 pos-abs">
              <span className="backend-develop-10130-0">{`BACKEND DEVELOPER`}</span>
            </div>
          </div>

          <div className="line-2-10134 pos-abs"></div>

          <div className="daniela-odhiamb-10136 pos-abs">
            <span className="daniela-odhiamb-10136-0">{`Daniela Odhiambo`}</span>
          </div>
        </section>

        <div className="rectangle-6-1084 pos-abs"></div>

        <div className="track-your-bus--1093 pos-abs">
          <span className="track-your-bus--1093-0"><Link to="/BusTracking" className="nav-link">{`Track Buses Now`}</Link></span>
        </div>
        {/* Frame 291 */}
        <section className="frame-29-1085 pos-abs">

        </section>
      </div>
    </div>
  );
};

export default About;