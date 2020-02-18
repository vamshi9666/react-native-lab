import { Platform } from "react-native";
import { DeviceWidth, DeviceHeight } from "./Device";
import {
  PURPLE,
  LIGHT_PURPLE,
  BLUE,
  YELLOW,
  GREEN,
  ORANGE,
  BRIGHT_RED,
  PINK,
  INDIGO,
  WHITE
} from "./Colors";

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export const INSTAGRAM_KEY = "ecfea307794b4be68dbcd856ec8a3e31";
export const INSTA_API_URL =
  "https://api.instagram.com/v1/users/self/media/recent/?access_token=";
export const subHeader = [
  { name: "New" },
  { name: "Favourites" },
  { name: "Created" }
];

export const appConstants = {
  RESPONSE_ACTIVE: "ACTIVE",
  RESPONSE_EXPIRED: "EXPIRED",
  POST_TO_PROFILE: "PROFILE",
  POST_TO_CHAT: "CHAT",
  POST_TO_CHAT_PROFILE: "CHAT_PROFILE",
  CONTENT_APPROVAL_PENDING: "PENDING",
  CONTENT_APPROVED: "APPROVED",
  CONTENT_REJECTED: "REJECTED",
  PENDING_FRIEND_REQUEST: "PENDING",
  BECAME_FRIEND: "FRIENDS",
  UNFRIENDED: "UNFRIENDED",
  BLOCKED_FRIEND: "BLOCKED"
};

export const msgTypes = {
  MESSAGE_CARD: "CARD",
  MESSAGE_TEXT: "TEXT",
  MESSAGE_GIF: "GIF",
  MESSAGE_STICKERS: "STICKER",
  MESSAGE_EMOTICONS: "EMOTICON",
  MESSAGE_CHAT_CARD: "CHAT_CARD",
  MESSAGE_SYSTEM_A: "SYSTEM_A",
  MESSAGE_SYSTEM_B: "SYSTEM_B",
  MESSAGE_SYSTEM_C: "SYSTEM_C",
  MESSAGE_QUESTION_CARD: "QUESTION_CARD",
  IMAGE: "IMAGE",
  TIMESTAMP: "TIMESTAMP",
  MESSAGE_SYSTEM_D: "SYSTEM_D",
  SPARK: "SPARK"
};

export const genders = ["Man", "Woman"];

export const educationLevels = [
  "High School",
  "In School",
  "College dropout",
  "Undergraduate",
  "Graduate",
  "Post Graduate",
  "Home Schooled"
];

export const zodiacs = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Saggitarius",
  "Capricorn",
  "Aquarius",
  "Pisces"
];
export const workouts = ["Active", "Sometimes", "Never"];
export const smoking = ["Frequently", "Socially", "Never"];
export const drinking = ["Frequently", "Socially", "Never"];
export const religions = ["Hindu", "Muslim", "Christian", "Atheist"];

export const BASIC_INFO_FIELDS = [
  "gender",
  "zodiac",
  "education_level",
  "living_in",
  "native_place"
];

export const NOT_SO_BASIC_INFO = [
  "height",
  "workout_preference",
  "drinking",
  "smoking"
];

export const UserAccountVerificationStatus = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE"
};

export const GamesWhichHasGreenRedResponses = [
  "GUESS_MY_TRAITS",
  "BLUFF_OR_TRUTH",
  "TWO_TRUTHS_AND_A_LIE",
  "GUESS_THE_CELEB"
];

// export const OTHER = ["SMT", "WYR", "NHIE", "HOT_TOPICS"];

// export const REST = ["GIF", "KMK", "MEME_IT"];

export const NOTIFICATION_TYPES = {
  RESPONSE: "RESPONSE",
  FRIEND_REQUEST: "FRIEND_REQUEST",
  MESSAGE: "FRIEND_REQUEST",
  SPARK: "SPARK"
};

export const FIELDS_CONFIG = {
  MY_EDUCATION_AND_WORK: {
    children: [
      {
        field_display_name: "Work",
        data_key: "organization",
        index: 0,
        styles: {}
      },
      {
        field_display_name: "College",
        data_key: "education",
        index: 1,
        styles: {}
      }
    ]
  },
  MY_BASIC_INFO: {
    children: [
      {
        field_display_name: "Gender",
        data_key: "gender",
        index: 2,
        styles: {}
      },
      {
        field_display_name: "Zodiac",
        data_key: "zodiac",
        index: 3,
        styles: {}
      },
      {
        field_display_name: "Education Level",
        data_key: "education_level",
        index: 4,
        styles: {}
      },
      {
        field_display_name: "I live in",
        data_key: "living_in",
        index: 5,
        styles: {}
      },
      {
        field_display_name: "I am from",
        data_key: "native_place",
        index: 6,
        styles: {}
      }
    ]
  },
  NOT_SO_BASIC_INFO: {
    children: [
      {
        field_display_name: "Height",
        data_key: "height",
        index: 7,
        styles: {}
      },
      {
        field_display_name: "Workout",
        data_key: "workout_preference",
        index: 8,
        styles: {}
      },
      {
        field_display_name: "Drinking",
        data_key: "drinking",
        index: 9,
        styles: {}
      },
      {
        field_display_name: "Smoking",
        data_key: "smoking",
        index: 10,
        styles: {}
      }
    ]
  }
};

export const ALL_INPUTS = [
  {
    displayName: "Work",

    children: [
      { placeholderText: "Job Title", data_key: "jobTitle" },
      { placeholderText: "Company", data_key: "organization" }
    ],
    iconPath: require("../assets/svgs/MyProfile/work.svg")
  },
  {
    displayName: "College",
    children: [
      { placeholderText: "Institution", data_key: "education" },
      {
        placeholderText: "Graduation Year",
        data_key: "graduatedYear"
      }
    ],
    iconPath: require("../assets/svgs/MyProfile/education.svg")
  },
  {
    displayName: "Gender",
    data_key: "gender",
    helperText: "Select Your Gender",
    options: [{ value: "Man" }, { value: "Woman" }],
    iconPath: require("../assets/svgs/MyProfile/gender.svg")
  },
  {
    displayName: "Zodiac",
    data_key: "zodiac",
    helperText: "Select Your Zodiac sign",
    options: [
      { value: "Aries" },
      { value: "Leo" },
      { value: "Cancer" },
      { value: "Pisces" },
      { value: "Scorpio" },
      { value: "Taurus" },
      { value: "Sagittarius" },
      { value: "Gemini" },
      { value: "Virgo" },
      { value: "Libra" },
      { value: "Capricorn" },
      { value: "Aquarius" }
    ],
    iconPath: require("../assets/svgs/MyProfile/zodiac.svg")
  },
  {
    displayName: "Education",
    data_key: "education_level",
    helperText: "Select Your Education Level",
    options: [
      { value: "Graduate" },
      { value: "High School" },
      { value: "College Dropout" },
      { value: "Undergraduate" },
      { value: "Post Graduate" },
      { value: "Home Schooled" }
    ],
    iconPath: require("../assets/svgs/MyProfile/educationLevel.svg")
  },
  {
    displayName: "I Live in",
    data_key: "living_in",
    helperText: "Select Your current city",
    options: [
      { value: "Hyderabad" },
      { value: "Banglore" },
      { value: "Pune" },
      { value: "Delhi" },
      { value: "Vizag" },
      { value: "Chennai" },
      { value: "Kerala" }
    ],
    iconPath: require("../assets/svgs/MyProfile/iLivein.svg")
  },
  {
    displayName: "Native Place",
    data_key: "native_place",
    helperText: "Select Your Native Place",
    options: [
      { value: "Hyderabad" },
      { value: "Banglore" },
      { value: "Pune" },
      { value: "Delhi" },
      { value: "Vizag" },
      { value: "Chennai" },
      { value: "Kerala" }
    ],
    iconPath: require("../assets/svgs/MyProfile/iamFrom.svg")
  },
  {
    data_key: "height",
    iconPath: require("../assets/svgs/MyProfile/height.svg")
  },
  {
    data_key: "workout_preference",
    displayName: "Workout",
    options: [{ value: "Active" }, { value: "Sometimes" }, { value: "Never" }],
    iconPath: require("../assets/svgs/MyProfile/workout.svg")
  },
  {
    displayName: "Drinking",
    data_key: "drinking",
    options: [
      { value: "Occasionally" },
      { value: "Frequently" },
      { value: "Never" }
    ],
    iconPath: require("../assets/svgs/MyProfile/drinking.svg")
  },
  {
    displayName: "Smoking",
    data_key: "smoking",
    options: [{ value: "Active" }, { value: "Sometimes" }, { value: "Never" }],
    iconPath: require("../assets/svgs/MyProfile/smoking.svg")
  }
];

export const PLACE_OPTIONS = [
  { value: "Hyderabad, India" },
  { value: "Banglore, India" },
  { value: "Pune, India" },
  { value: "Delhi, India" },
  { value: "Vizag, India" },
  { value: "Chennai, India" },
  { value: "Kerala, India" }
];

export const gemPlanColors = {
  StepBack: [PURPLE, WHITE, WHITE],
  Extensions: [YELLOW, WHITE, WHITE],
  Sparks: [GREEN, WHITE, WHITE],
  Boosts: [PURPLE, BRIGHT_RED, WHITE],
  MoreContent: [ORANGE, WHITE, WHITE],
  MoreProfiles: [BLUE, WHITE, WHITE],
  MissedRequests: [INDIGO, WHITE, WHITE],
  ReactionsReceived: [PINK, WHITE, WHITE],
  ReactionsSent: [BRIGHT_RED, WHITE, WHITE]
};

export const gemsPrices = [
  { gemCount: 20, cost: "₹158" },
  { gemCount: 50, cost: "₹369" },
  { gemCount: 160, cost: "₹1199" },
  { gemCount: 250, cost: "₹1849" },
  { gemCount: 420, cost: "₹3099" },
  { gemCount: 1250, cost: "₹6200" }
];

export const TOP_BAR_WIDTH = Platform.OS === "android" ? 0 : 20;
export const LEFT_MARGIN = DeviceWidth * 0.05;

export const CARD_WIDTH = DeviceWidth * 0.86;
export const IMAGE_HEIGHT = DeviceHeight * 0.6;

export const softDeletionStatuses = {
  SOFT_DELETED: "SOFT_DELETED",
  HEALTHY: "HEALTHY"
};

export const IMAGE_UPLOADING_STATUS = {
  UPLOADING: "UPLOADING",
  FAILED: "FAILED",
  SUCCESS: "SUCCESS"
};

export const LEVELS_INTERVAL_IN_MINUTES = 5;
export const LEVEL_THREE_THRESHOLD = 5;
export const EXPENSE_THRESHOLD_COUNT = 2;

export const STACK_TYPES = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  RELEASED: "RELEASED"
};

export const STACK_RELEASE_PROCESSES = {
  PAYMENT: "PAYMENT",
  SPARK: "SPARK"
};
export const Emojis = [
  require("../assets/svgs/Response/like.svg"),
  require("../assets/svgs/Response/heart.svg"),
  require("../assets/svgs/Response/laughing.svg"),
  require("../assets/svgs/Response/sunflower.svg"),
  require("../assets/svgs/Response/happy.svg"),
  require("../assets/svgs/Response/shocked.svg"),
  require("../assets/svgs/Response/sweat.svg"),
  require("../assets/svgs/Response/angry.svg")
];

export const PICKER_TEXT_STATES = {
  SHOW_PICK_TEXT: "SHOW_PICK_TEXT",
  DO_NOT_SHOW_ANY_TEXT: "DO_NOT_SHOW_ANY_TEXT",
  SHOW_TUTORIAL: "DO_NOT_SHOW_ANY_TEXT"
};

export const BASIC_INFO_ICONS = {
  TRANSGENDER: require("../assets/svgs/Surfing/transgender.svg"),
  SMOKING: require("../assets/svgs/Surfing/smoking.svg"),
  DRINKING: require("../assets/svgs/Surfing/cheers1.svg"),
  EDUCATION_LEVEL: require("../assets/svgs/Surfing/educationLevel.svg"),
  WORKOUT_PREFERENCE: require("../assets/svgs/Surfing/workout.svg"),
  ZODIAC: require("../assets/svgs/Surfing/zodiac.svg"),
  HEIGHT: require("../assets/svgs/Surfing/height.svg"),
  MAN: require("../assets/svgs/Surfing/man.svg"),
  WOMAN: require("../assets/svgs/Surfing/woman.svg")
};

export const GAME_LOGOS = {
  BLUFF_OR_TRUTH: require("../assets/svgs/GameLogo/botcolor.svg"),
  GUESS_MY_TRAITS: require("../assets/svgs/GameLogo/guessmytraits.svg"),
  NEVER_HAVE_I_EVER: require("../assets/svgs/GameLogo/neverhaveiever.svg"),
  SIMILARITIES: require("../assets/svgs/GameLogo/similarities.svg"),
  WOULD_YOU_RATHER: require("../assets/svgs/GameLogo/wouldyourather.svg"),
  KISS_MARRY_KILL: require("../assets/svgs/GameLogo/kissmarrykill.svg"),
  TWO_TRUTHS_AND_A_LIE: require("../assets/svgs/GameLogo/twotruthandlie.svg"),
  GUESS_THE_CELEB: require("../assets/svgs/GameLogo/guesstheceleb.svg"),
  THE_PERFECT_GIF: require("../assets/svgs/GameLogo/gif.svg"),
  VIBE: require("../assets/svgs/GameLogo/vibe.svg"),
  HOT_TOPICS: require("../assets/svgs/GameLogo/hottopics.svg"),
  MEME_IT: require("../assets/svgs/GameLogo/memeitcolor.svg"),
  CONFESSIONS: require("../assets/svgs/GameLogo/confessions.svg")
};

// gif

export const GAME_LOGOS_COLORFUL = {
  BLUFF_OR_TRUTH: require("../assets/svgs/GameLogo/botcolor.svg"),
  GUESS_MY_TRAITS: require("../assets/svgs/GameLogo/gmtcolor.svg"),
  NEVER_HAVE_I_EVER: require("../assets/svgs/GameLogo/nhiecolor.svg"),
  SIMILARITIES: require("../assets/svgs/GameLogo/similarities.svg"),
  WOULD_YOU_RATHER: require("../assets/svgs/GameLogo/wyrcolor.svg"),
  KISS_MARRY_KILL: require("../assets/svgs/GameLogo/kissmarrykill.svg"),
  TWO_TRUTHS_AND_A_LIE: require("../assets/svgs/GameLogo/ttalcolor.svg"),
  GUESS_THE_CELEB: require("../assets/svgs/GameLogo/guesstheceleb.svg"),
  THE_PERFECT_GIF: require("../assets/svgs/GameLogo/gifcolor.svg"),
  VIBE: require("../assets/svgs/GameLogo/vibecolor.svg"),
  HOT_TOPICS: require("../assets/svgs/GameLogo/hottopicscolor.svg"),
  MEME_IT: require("../assets/svgs/GameLogo/memeitcolor.svg"),
  CONFESSIONS: require("../assets/svgs/GameLogo/confessions.svg")
};

export const MONETIZATION_ICONS = {
  EXTENSIONS: require("../assets/svgs/GemsFlow/extension.svg"),
  STEP_BACK: require("../assets/svgs/GemsFlow/stepback.svg"),
  MORE_CONTENT: require("../assets/svgs/GemsFlow/refresh.svg"),
  MORE_PROFILES: require("../assets/svgs/GemsFlow/moreProfilesSmall.svg"),
  REACTIONS_RECEIVED: require("../assets/svgs/GemsFlow/received.svg"),
  SPARK: require("../assets/svgs/ProfileModal/activeSpark.svg"),
  REACTIONS_SENT: require("../assets/svgs/GemsFlow/sentRocket.svg"),
  // REACTIONS_SENT: require("../assets/svgs/GemsFlow/received.svg"),
  MISSED_REQUESTS: require("../assets/svgs/GemsFlow/missedprofiles.svg"),
  BOOST: require("../assets/svgs/GemsFlow/extension.svg"),
  GEMS: require("../assets/svgs/MyProfile/Gem.svg")
};

export const REFRESH_ICONS = {
  BLUFF_OR_TRUTH: require("../assets/svgs/MyProfile/Refresh/bluffortruth.svg"),
  GUESS_MY_TRAITS: require("../assets/svgs/MyProfile/Refresh/guessmytraits.svg"),
  NEVER_HAVE_I_EVER: require("../assets/svgs/MyProfile/Refresh/neverhaveiever.svg"),
  SIMILARITIES: require("../assets/svgs/MyProfile/Refresh/similarities.svg"),
  WOULD_YOU_RATHER: require("../assets/svgs/MyProfile/Refresh/wouldyourather.svg"),
  VIBE: require("../assets/svgs/MyProfile/Refresh/vibe.svg"),
  CONFESSIONS: require("../assets/svgs/MyProfile/Refresh/confessions.svg"),
  HOT_TOPICS: require("../assets/svgs/MyProfile/Refresh/bluffortruth.svg")
};

export const USER_STATES = {
  ALL_TUTORIALS_SEEN: "ALL_TUTORIALS_SEEN",
  NEW_USER: "NEW_USER",
  OLD_USER: "OLD_USER",
  TUTORIALS_STAGE: "TUTORIALS_STAGE",
  ALL_CRONS_DONE: "ALL_CRONS_DONE",
  CRONS_STAGE: "CRONS_STAGE"
};

export const CRON_TASKS = {
  SEND_REQUESTS: "SEND_REQUESTS",
  RESPOND_TO_PROFILE_CARD: "RESPOND_TO_PROFILE_CARD",
  SCHEDULE_RESPOND_TO_PROFILE_CARD: "SCHEDULE_RESPOND_TO_PROFILE_CARD",
  RESPOND_TO_CHAT_CARD: "RESPOND_TO_CHAT_CARD",
  SEND_CARD: "SEND_CARD",
  SEND_GIF: "SEND_GIF",
  SEND_EMOTICON: "SEND_EMOTICON",
  SCHEDULE_CHAT_JOB: "SCHEDULE_CHAT_JOB",
  SEND_PREPARED_MESSAGE: "SEND_PREPARED_MESSAGE"
};

export const MONETIZATION_ITEMS = {
  SPARK: "SPARK",
  MORE_CONTENT: "MORE_CONTENT",
  EXTENSIONS: "EXTENSIONS",
  RELEASE_SENT_ROOM: "RELEASE_SENT_ROOM",
  RELEASE_RECEIVED_ROOM: "RELEASE_RECEIVED_ROOM",
  RELEASE_ALL_STACK_ROOMS: "RELEASE_ALL_STACK_ROOMS",
  STEP_BACK: "STEP_BACK",
  MORE_PROFILES: "MORE_PROFILES",
  MISSED_REQUESTS: "MISSED_REQUESTS"
};

export const RAZOR_PAY_KEY = "rzp_test_5YWV9Sxip2UDck";

export const VIBRATION_DURATION = 400;
