import moment from "moment";
import { round } from "lodash";
export const giveTimeDiff = then => {
  var now = moment(new Date()); //todays date
  var end = moment(parseInt(then)).format(); // another date
  console.log("formatted time ", end);

  var duration = moment.duration(now.diff(moment(end)));
  var days = duration.asHours();
  console.log(days);
  return days;
};

export const namify = name => {
  return name[0].toUpperCase() + name.substring(1, name.length).toLowerCase();
};

export const validateEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const prefixZero = num => {
  return num > 9 ? num : `0${num}`;
};

export const userNamify = userObj => {
  if (userObj && userObj.name) {
    if (userObj.showName) {
      return userObj.name[0].toUpperCase();
    } else {
      return namify(userObj.name);
    }
  } else {
    return "";
  }
};

export const appendQuoteForUserName = name => {
  return name.length === 1 ? `'${name}'` : name;
};

export const feetToCm = ft => {
  return Math.round(ft * 304.8) / 10;
};

export const getTimeStamp = () => {
  return Math.round(Date.now() / 1000);
};

export const checkNullAndUndefined = content => {
  return content !== null && content !== undefined && content !== "";
};

export const getDistanceText = (distance, place) => {
  if (!distance) {
    return null;
  }
  const floatDistance = round(distance, 1);
  // console.log(" distance is ", floatDistance, distance);
  let distanceText;
  if (floatDistance <= 1.0) {
    distanceText = "Within 1 km";
  } else if (floatDistance <= 5) {
    const distanceToBeShown = floatDistance;
    distanceText = `${distanceToBeShown} km away`;
  } else if (floatDistance <= 20) {
    const distanceToBeShown = round(distance, 0);
    distanceText = `${distanceToBeShown} km away`;
  } else if (floatDistance <= 50) {
    const intDistance = round(floatDistance);
    const distanceToBeShown = Math.round(intDistance / 5) * 5;
    distanceText = `${distanceToBeShown} km away`;
  } else if (floatDistance <= 100) {
    const intDistance = round(floatDistance);
    const distanceToBeShown = Math.round(intDistance / 10) * 10;
    distanceText = `${distanceToBeShown} km away`;
  } else {
    distanceText = place;
  }
  return namify(distanceText);
};

export const getStartOfDay = () => {
  return moment()
    .startOf("day")
    .unix();
};

export const getDatePhrase = d => {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};
