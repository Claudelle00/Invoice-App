import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "INVOICES";

export const getInvoices = async () => {
  try {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log("Error loading invoices", error);
    return [];
  }
};

export const saveInvoices = async (invoices) => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(invoices));
  } catch (error) {
    console.log("Error saving invoices", error);
  }
};
