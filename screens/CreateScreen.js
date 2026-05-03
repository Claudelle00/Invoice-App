import { View, TextInput, Button, Alert, TouchableOpacity, Text, ScrollView, Modal, Platform } from "react-native";
import { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getInvoices, saveInvoices } from "../utils/storage";
import { scheduleInvoiceReminder } from "../utils/notifications";

export default function CreateScreen({ navigation, route }) {
  const [client, setClient] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [invoiceId, setInvoiceId] = useState(null);

  useEffect(() => {
    if (route.params?.invoice) {
      const invoice = route.params.invoice;
      setInvoiceId(invoice.id);
      setClient(invoice.client);
      setDescription(invoice.description || "");
      setAmount(invoice.amount.toString());
      setDueDate(invoice.dueDate);
      setIsEditing(true);
      
      // Parse the date for the picker
      const parts = invoice.dueDate.split("/");
      const parsedDate = new Date(parts[2], parts[0] - 1, parts[1]);
      setSelectedDate(parsedDate);
    }
  }, [route.params?.invoice]);

  const handleDateChange = (event, date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      const formattedDate = `${month}/${day}/${year}`;
      setDueDate(formattedDate);

      if (Platform.OS === "android") {
        setShowDatePicker(false);
      }
    }
  };

  const handleDateConfirm = () => {
    setShowDatePicker(false);
  };

  const createInvoice = async () => {
    if (!client || !amount || !dueDate) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    const invoice = {
      id: isEditing ? invoiceId : Date.now().toString(),
      client,
      description,
      amount: Number(amount),
      dueDate,
      status: isEditing ? "pending" : "pending",
    };

    const existing = await getInvoices();
    let updated;

    if (isEditing) {
      updated = existing.map((inv) => (inv.id === invoiceId ? invoice : inv));
      Alert.alert("Success", "Invoice updated successfully");
    } else {
      updated = [...existing, invoice];
      await scheduleInvoiceReminder(invoice);
      Alert.alert("Success", "Invoice created successfully");
    }

    await saveInvoices(updated);
    navigation.navigate("Home");
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24, marginTop: 20 }}>
        {isEditing ? "Edit Invoice" : "Create Invoice"}
      </Text>

      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 8, color: "#333" }}>
          Client Name *
        </Text>
        <TextInput
          placeholder="e.g., Acme Corp"
          value={client}
          onChangeText={setClient}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            marginBottom: 10,
            padding: 12,
            borderRadius: 8,
            fontSize: 14,
          }}
        />
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 8, color: "#333" }}>
          Description
        </Text>
        <TextInput
          placeholder="e.g., Website development project"
          value={description}
          onChangeText={setDescription}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            marginBottom: 10,
            padding: 12,
            borderRadius: 8,
            fontSize: 14,
          }}
        />
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 8, color: "#333" }}>
          Amount ($) *
        </Text>
        <TextInput
          placeholder="0.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            marginBottom: 10,
            padding: 12,
            borderRadius: 8,
            fontSize: 14,
          }}
        />
      </View>

      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 8, color: "#333" }}>
          Due Date *
        </Text>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <TextInput
            placeholder="MM/DD/YYYY"
            value={dueDate}
            onChangeText={setDueDate}
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ddd",
              padding: 12,
              borderRadius: 8,
              fontSize: 14,
            }}
          />
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{
              backgroundColor: "#f0f0f0",
              paddingHorizontal: 14,
              paddingVertical: 12,
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18 }}>📅</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showDatePicker && (
        <View style={{ marginBottom: 24, backgroundColor: "#f5f5f5", borderRadius: 12, padding: 12 }}>
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            textColor="#000"
          />
          {Platform.OS === "ios" && (
            <TouchableOpacity
              onPress={handleDateConfirm}
              style={{
                backgroundColor: "#1f77ff",
                padding: 12,
                borderRadius: 8,
                alignItems: "center",
                marginTop: 12,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                Done
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <TouchableOpacity
        onPress={createInvoice}
        style={{
          backgroundColor: "#1f77ff",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          {isEditing ? "Update Invoice" : "Save Invoice"}
        </Text>
      </TouchableOpacity>

      {isEditing && (
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={{
            backgroundColor: "#f0f0f0",
            padding: 14,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#333", fontSize: 16, fontWeight: "600" }}>
            Cancel
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
