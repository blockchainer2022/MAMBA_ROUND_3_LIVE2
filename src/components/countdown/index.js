/* eslint-disable no-unused-vars */
import "./style.css";
import moment from "moment";
const Timer = ({ days, hours, minutes, seconds, startTime, endTime }) => {
  var s = new Date(Number(startTime * 1000)).toUTCString();
  var e = new Date(Number(endTime * 1000)).toUTCString();
  // console.log(+new moment(`${s} 00:00:00`).utc() > +new Date());
  const start = +new moment(`${s}`).utc() > +new Date();

  const end = +new moment(`${e}`).utc() < +new Date();

  return (
    <div className="border-2 border-primary py-2 w-full  rounded-lg dark:text-gray-50">
      <h6 className="text-center text-md relative pb-3">
        {/* {start ? "ICO Starts in" : end ? "ICO has ended" : "ICO ends in"} */}
        ICO Launch in
      </h6>
      <div className="mx-auto mt-3 text-base text-center text-black dark:text-gray-50 font-bold font-sans">
        <span>
          {`${days.toString().padStart(2, "0")}d`}{" "}
          <span className="mx-1">:</span>{" "}
        </span>
        <span>
          {`${hours.toString().padStart(2, "0")}h`}{" "}
          <span className="mx-1">:</span>{" "}
        </span>
        <span>
          {`${minutes.toString().padStart(2, "0")}m`}{" "}
          <span className="mx-1">:</span>{" "}
        </span>
        <span>{`${seconds.toString().padStart(2, "0")}s`} </span>
      </div>
    </div>
  );
};

export default Timer;
