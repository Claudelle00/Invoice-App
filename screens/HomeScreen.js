import { View, Text, FlatList, Button } from "react-native";
import { useEffect, useState } from "react";
import { getInvoices, saveInvoices } from "../utils/storage";

export default function HomeScreen({ navigation }) {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadInvoices);
    return unsubscribe;
  }, [navigation]);

  const loadInvoices = async () => {
    const data = await getInvoices();
    setInvoices(data);
  };

  const markAsPaid = async (id) => {
    const updated = invoices.map((inv) =>
      inv.id === id ? { ...inv, status: "paid" } : inv
    );

    setInvoices(updated);
    await saveInvoices(updated);
  };

  return (
    <View style={{ padding: 20 }}>
      <Button
        title="Create Invoice"
        onPress={() => navigation.navigate("Create")}
      />

      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 15,
              marginTop: 10,
              backgroundColor: "#eee",
              borderRadius: 10,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.client}</Text>
            <Text>€{item.amount}</Text>
            <Text>Due: {item.dueDate}</Text>
            <Text>Status: {item.status}</Text>

            {item.status === "pending" && (
              <Button
                title="Mark as Paid"
                onPress={() => markAsPaid(item.id)}
              />
            )}
          </View>
        )}
      />
    </View>
  );
}
