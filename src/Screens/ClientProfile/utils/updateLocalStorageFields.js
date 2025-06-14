import AsyncStorage from "@react-native-async-storage/async-storage";

async function updateLocalStorageFields(key, updates) {
  let data = await AsyncStorage.getItem(key);

  if (data) {
    data = JSON.parse(data);

    for (const [field, value] of Object.entries(updates)) {
      data[field] = value;
    };

    await AsyncStorage.setItem(key, JSON.stringify(data));
  } else {
    console.log(`No data found in local storage under the key '${key}'.`);
  };
};

export default updateLocalStorageFields;