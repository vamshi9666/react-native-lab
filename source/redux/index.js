import userInfoReducer from "./reducers/user.info";
import roomsReducer from "./reducers/rooms";
import chatReducer from "./reducers/chat";
import profilesReducer from "./reducers/profiles";
import questionReducer from "./reducers/questions";
import appReducer from "./reducers/app";
import navReducer from "./reducers/nav";
import tutorialReducer from "./reducers/tutorials";
import contentReducer from "./reducers/content";
import userStateReducer from "./reducers/userstate";
import notificationReducer from "./reducers/notification";
import apClientReducer from "./reducers/apollo";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  info: userInfoReducer,
  rooms: roomsReducer,
  questions: questionReducer,
  profiles: profilesReducer,
  app: appReducer,
  chat: chatReducer,
  notification: notificationReducer,
  nav: navReducer,
  content: contentReducer,
  tutorial: tutorialReducer,
  apollo: apClientReducer,
  userstate: userStateReducer,
  lastAction
});

function lastAction(state = null, action) {
  return action;
}
export default (state, action) => {
  if (action.type === "RESET") {
    state = undefined;
  }
  return rootReducer(state, action);
};

// export default rootReducer;
