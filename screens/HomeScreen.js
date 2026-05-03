import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { getInvoices, saveInvoices } from "../utils/storage";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen({ navigation }) {
  const [invoices, setInvoices] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadInvoices);
    return unsubscribe;
  }, [navigation]);

  const loadInvoices = async () => {
    const data = await getInvoices();
    setInvoices(data.length > 0 ? data : getDefaultInvoices());
  };

  const getDefaultInvoices = () => {
    return [
      {
        id: "1",
        client: "Acme Corp",
        description: "Website development project",
        amount: 5000,
        dueDate: "4/15/2026",
        status: "paid",
      },
      {
        id: "2",
        client: "Tech Startup Inc",
        description: "Mobile app design",
        amount: 3500,
        dueDate: "4/28/2026",
        status: "unpaid",
      },
      {
        id: "3",
        client: "Global Solutions",
        description: "Brand identity package",
        amount: 7200,
        dueDate: "3/10/2026",
        status: "paid",
      },
      {
        id: "4",
        client: "Local Business",
        description: "Logo design",
        amount: 1800,
        dueDate: "5/1/2026",
        status: "unpaid",
      },
    ];
  };

  const markAsPaid = async (id) => {
    const updated = invoices.map((inv) =>
      inv.id === id ? { ...inv, status: "paid" } : inv
    );
    setInvoices(updated);
    await saveInvoices(updated);
  };

  const deleteInvoice = async (id) => {
    Alert.alert("Delete Invoice", "Are you sure you want to delete this invoice?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          const updated = invoices.filter((inv) => inv.id !== id);
          setInvoices(updated);
          await saveInvoices(updated);
        },
      },
    ]);
  };

  const calculateStats = () => {
    const paidInvoices = invoices.filter((inv) => inv.status === "paid");
    const pendingInvoices = invoices.filter((inv) => inv.status === "unpaid");

    const totalEarnings = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    return {
      totalEarnings,
      totalInvoices: invoices.length,
      pendingAmount,
      activeCount: pendingInvoices.length,
      historyCount: paidInvoices.length,
    };
  };

  const getChartData = () => {
    const labels = ["4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];
    const data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, 5000];
    
    return {
      labels,
      datasets: [
        {
          data,
          color: () => "#1f77ff",
          strokeWidth: 2,
        },
      ],
    };
  };

  const getFilteredInvoices = () => {
    if (activeTab === "active") {
      return invoices.filter((inv) => inv.status === "unpaid");
    } else if (activeTab === "history") {
      return invoices.filter((inv) => inv.status === "paid");
    }
    return invoices;
  };

  const stats = calculateStats();
  const filteredInvoices = getFilteredInvoices();

  const renderStatCard = (label, value, icon) => (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 6,
      }}
    >
      <Text style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
        {label}
      </Text>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>
        {value}
      </Text>
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "#e8f0ff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 20 }}>{icon}</Text>
      </View>
    </View>
  );

  const renderInvoiceItem = (item) => (
    <View
      key={item.id}
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: "#eee",
      }}
    >
      <View style={{ marginBottom: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.client}</Text>
        <Text style={{ fontSize: 12, color: "#666" }}>
          {item.description}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            ${item.amount.toLocaleString()}
          </Text>
          <Text style={{ fontSize: 12, color: "#999" }}>{item.dueDate}</Text>
        </View>

        <View
          style={{
            backgroundColor: item.status === "paid" ? "#e8f5e9" : "#fff3e0",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: item.status === "paid" ? "#2e7d32" : "#f57c00",
              textTransform: "capitalize",
            }}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: 8,
        }}
      >
        {item.status === "unpaid" && (
          <TouchableOpacity
            onPress={() => markAsPaid(item.id)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#e8f5e9",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18 }}>✓</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate("Create", { invoice: item })}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#e3f2fd",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18 }}>✎</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => deleteInvoice(item.id)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#ffebee",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18 }}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={{ padding: 20, paddingTop: 30 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 4 }}>
          Invoice Manager
        </Text>
        <Text style={{ fontSize: 14, color: "#999" }}>
          Track and manage all your invoices
        </Text>
      </View>

      {/* Tabs */}
      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
          paddingHorizontal: 20,
        }}
      >
        {["home", "active", "history"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderBottomWidth: activeTab === tab ? 3 : 0,
              borderBottomColor: activeTab === tab ? "#1f77ff" : "transparent",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: activeTab === tab ? "600" : "400",
                color: activeTab === tab ? "#1f77ff" : "#999",
              }}
            >
              {tab === "home"
                ? "Home"
                : tab === "active"
                  ? `Active (${stats.activeCount})`
                  : `History (${stats.historyCount})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={{ padding: 20 }}>
        {activeTab === "home" && (
          <>
            {/* Stats Cards */}
            <View style={{ flexDirection: "row", marginBottom: 24 }}>
              {renderStatCard("Total Earnings", `$${stats.totalEarnings.toLocaleString()}`, "$")}
              {renderStatCard("Total Invoices", stats.totalInvoices, "📄")}
              {renderStatCard(
                "Pending Amount",
                `$${stats.pendingAmount.toLocaleString()}`,
                "⏱"
              )}
            </View>

            {/* Chart */}
            <View style={{ marginBottom: 24 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  Earnings Over Time
                </Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {["week", "month", "year"].map((range) => (
                    <TouchableOpacity
                      key={range}
                      onPress={() => setTimeRange(range)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        backgroundColor:
                          timeRange === range ? "#1f77ff" : "#f0f0f0",
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: timeRange === range ? "#fff" : "#666",
                          textTransform: "capitalize",
                        }}
                      >
                        {range}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <LineChart
                data={getChartData()}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 0,
                  color: () => "#ddd",
                  labelColor: () => "#999",
                  style: { borderRadius: 16 },
                  propsForDots: {
                    r: "4",
                    strokeWidth: "2",
                    stroke: "#1f77ff",
                  },
                }}
                bezier
                style={{ borderRadius: 12 }}
              />
            </View>

            {/* Recent Invoices */}
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  Recent Invoices
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Create")}
                  style={{
                    backgroundColor: "#1f77ff",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "600" }}>
                    + New Invoice
                  </Text>
                </TouchableOpacity>
              </View>

              {invoices.map(renderInvoiceItem)}
            </View>
          </>
        )}

        {activeTab === "active" && (
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 16,
              }}
            >
              Active Invoices
            </Text>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map(renderInvoiceItem)
            ) : (
              <Text style={{ color: "#999", textAlign: "center", marginTop: 20 }}>
                No active invoices
              </Text>
            )}
          </View>
        )}

        {activeTab === "history" && (
          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 16,
              }}
            >
              Invoice History
            </Text>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map(renderInvoiceItem)
            ) : (
              <Text style={{ color: "#999", textAlign: "center", marginTop: 20 }}>
                No invoice history
              </Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
