import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function AppHeader() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/icon.png")} // 👈 your website logo
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>StudyAI</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
});
