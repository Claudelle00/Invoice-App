import * as Notifications from "expo-notifications";


export const scheduleInvoiceReminder = async (invoice) => {
  const triggerDate = new Date(invoice.dueDate);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Invoice Due 📄",
      body: `${invoice.client}'s invoice is due today!`,
    },
    trigger: triggerDate,
  });
};