import { View, TextInput, Button, Alert } from "react-native";
import { useState } from "react";
import { getInvoices, saveInvoices } from "../utils/storage";

export default function CreateScreen({ navigation }) {
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const createInvoice = async () => {
    if (!client || !amount || !dueDate) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const newInvoice = {
      id: Date.now().toString(),
      client,
      amount: Number(amount),
      dueDate,
      status: "pending",
    };

    const existing = await getInvoices();
    const updated = [...existing, newInvoice];

    await saveInvoices(updated);

    navigation.navigate("Home");
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Client name"
        value={client}
        onChangeText={setClient}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TextInput
        placeholder="Amount (€)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TextInput
        placeholder="Due date (e.g. 2026-05-10)"
        value={dueDate}
        onChangeText={setDueDate}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <Button title="Save Invoice" onPress={createInvoice} />
    </View>
  );
}
