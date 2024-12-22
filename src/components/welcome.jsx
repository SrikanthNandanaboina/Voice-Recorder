import "../styles/welcome.css";
import { experiences } from "../utils/constants";

const Welcome = () => {
  return (
    <>
      {experiences.map((ele) => (
        <div className="experience" key={ele.companyName}>
          <h2>
            {ele.title} | {ele.companyName}
          </h2>
          <p className="job-title">
            {ele.startDate} - {ele.endDate}
          </p>
          <div className="contributions">
            <ul>
              {ele.content.map((data) => (
                <li key={data} className="contribution-text">{data}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </>
  );
};

export default Welcome;
