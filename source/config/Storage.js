import AsyncStorage from "@react-native-community/async-storage";

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log("Error while storing...", error);
  }
};

const retrieveData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // console.log(value);
      return value;
    }
  } catch (error) {
    console.log("Error while fetching data", error);
  }
};

const mergeData = async (key, value) => {
  try {
    await AsyncStorage.mergeItem(key, value);
  } catch (error) {
    console.log("Error while storing...", error);
  }
};

const setMultiple = async arr => {
  try {
    await AsyncStorage.multiSet(arr);
  } catch (error) {
    console.log("Error while storing...", error);
  }
};

const getMultiple = async arr => {
  try {
    return AsyncStorage.multiGet(arr);
  } catch (error) {
    console.log(" error while getting multiple keys ");
  }
};
const deleteData = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log("Error while deleting data", error);
  }
};

const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (err) {
    console.log(" error while clearing all async storage");
  }
};

export {
  storeData,
  retrieveData,
  mergeData,
  deleteData,
  clearAsyncStorage,
  setMultiple,
  getMultiple
};
