var API_URL;
var STATIC_URL;
var CHAT_URL;
var SOCKET_URL;

// API_URL = "http://185.247.117.61:5001";
API_URL = "https://dev.api.closerapp.co";
STATIC_URL = "https://dev.static.closerapp.co/uploads";
CHAT_URL = "http://185.247.117.61:4000";
SOCKET_URL = "ws://185.247.117.61:4000/graphql";
// SOCKET_URL = "https://socket.closerapp.co";
// CHAT_URL = "https://socket.closerapp.co";

// API_URL = "http://185.247.117.61:8111";
// STATIC_URL = "https://static.closerapp.co/uploads";
// CHAT_URL = "http://185.247.117.61:4433";
// SOCKET_URL = "ws://185.247.117.61:4433/graphql";

// if (__DEV__) {
//   API_URL = "https://dev.api.closerapp.co";
//   STATIC_URL = "https://dev.static.closerapp.co/uploads";
// } else {
// API_URL = "https://api.closerapp.co";
// STATIC_URL = "https://static.closerapp.co/uploads";
// }

export { API_URL, STATIC_URL, CHAT_URL, SOCKET_URL };
