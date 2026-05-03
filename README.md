# Invoice Manager

A mobile invoice management app built with Expo and React Native. The app allows users to track invoices, view active and historical records, and create or edit invoices with due date selection.

## Technologies Used

- **Expo**: App framework for building React Native applications.
- **React Native**: UI and mobile app components.
- **React Navigation**: App screen navigation and stack management.
- **Async Storage**: Local storage for saving invoices persistently.
- **Expo Notifications**: Scheduling local reminders for invoice due dates.
- **React Native Chart Kit**: Displaying earnings chart data.
- **React Native SVG**: Required dependency for chart rendering.
- **@react-native-community/datetimepicker**: Inline date picker for selecting invoice due dates.

## Project Structure

- `App.js` - Navigation and notification permission handling.
- `screens/HomeScreen.js` - Main dashboard and invoice lists.
- `screens/CreateScreen.js` - Invoice creation and editing screen.
- `utils/storage.js` - Helper functions for invoice storage.
- `utils/notifications.js` - Reminder scheduling logic.

## Running the App

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Expo development server:
   ```bash
   npm start
   ```
3. Launch on a simulator or device using Expo Go.
