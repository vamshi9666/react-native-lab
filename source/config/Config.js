export function screenConfig(name) {
  return {
    screen: name,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  };
}

export const firebase = require("react-native-firebase").analytics();
