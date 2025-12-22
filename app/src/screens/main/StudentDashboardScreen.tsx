import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/AuthContext";

export default function StudentDashboardScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ================= HERO ================= */}
      <LinearGradient
        colors={["#4f46e5", "#7c3aed", "#9333ea"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        {/* Decorative orbs */}
        <View style={styles.orbOne} />
        <View style={styles.orbTwo} />

        <View style={styles.heroContent}>
          <Text style={styles.heroGreeting}>Welcome back</Text>
          <Text style={styles.heroName}>
            {user?.fullname || "Student"} ✨
          </Text>

          <Text style={styles.heroSubtitle}>
            Your personal AI study companion
          </Text>

          <TouchableOpacity
            style={styles.glassCTA}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("AI Tutor" as never)}
          >
            <Ionicons name="sparkles" size={18} color="#fff" />
            <Text style={styles.glassCTAText}>Start Studying</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imageFrame}>
        <Image
          source={require("../../../assets/girl.png")}
          style={styles.heroImage}
          resizeMode="contain"
        />
        </View>
      </LinearGradient>
      

      {/* ================= QUICK ACTIONS ================= */}
      <View style={styles.actions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        {/* Upload */}
        <TouchableOpacity
          style={styles.glassCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Upload" as never)}
        >
          <View style={styles.cardIcon}>
            <Ionicons name="cloud-upload" size={26} color="#6366f1" />
          </View>

          <View style={styles.cardTextWrap}>
            <Text style={styles.cardTitle}>Upload Study Material</Text>
            <Text style={styles.cardDesc}>
              Upload PDFs for AI learning
            </Text>
          </View>

          <Ionicons name="arrow-forward" size={18} color="#9ca3af" />
        </TouchableOpacity>

        {/* AI Tutor */}
        <TouchableOpacity
          style={styles.glassCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("AI Tutor" as never)}
        >
          <View
            style={[
              styles.cardIcon,
              { backgroundColor: "#ecfeff" },
            ]}
          >
            <Ionicons name="chatbubbles" size={26} color="#06b6d4" />
          </View>

          <View style={styles.cardTextWrap}>
            <Text style={styles.cardTitle}>Ask AI Tutor</Text>
            <Text style={styles.cardDesc}>
              Clear doubts instantly
            </Text>
          </View>

          <Ionicons name="arrow-forward" size={18} color="#9ca3af" />
        </TouchableOpacity>

         {/* Upload */}
         <TouchableOpacity
          style={styles.glassCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Summaries" as never)}
        >
          <View style={styles.cardIcon}>
            <Ionicons name="document-text" size={26} color="#6366f1" />
          </View>

          <View style={styles.cardTextWrap}>
            <Text style={styles.cardTitle}>View Summaries</Text>
            <Text style={styles.cardDesc}>
              View PDFs and Video Summary
            </Text>
          </View>

          <Ionicons name="arrow-forward" size={18} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ===================== STYLES ===================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    marginTop:20,
    borderRadius:80,
  },

  /* HERO */
  hero: {
    borderRadius: 36,
    padding: 26,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },

  orbOne: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.15)",
    top: -80,
    left: -60,
  },

  orbTwo: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.12)",
    bottom: -60,
    right: -40,
  },

  heroContent: {
    flex: 1,
    zIndex: 2,
  },

  heroGreeting: {
    color: "#e0e7ff",
    fontSize: 15,
  },

  heroName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginTop: 4,
  },

  heroSubtitle: {
    marginTop: 10,
    fontSize: 15,
    color: "#e0e7ff",
    lineHeight: 22,
  },

  glassCTA: {
    marginTop: 20,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },

  glassCTAText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  heroImage: {
    width: 150,
    height: 150,
    zIndex: 2,
  },

  /* ACTIONS */
  actions: {
    padding: 20,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 16,
  },

  glassCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    marginBottom: 16,
    borderRadius: 22,

    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },

  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#eef2ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  cardTextWrap: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  cardDesc: {
    marginTop: 4,
    fontSize: 14,
    color: "#6b7280",
  },

  imageFrame: {
    width: 180,
    height: 180,
    borderRadius: 90, // perfect circle
  
    // Clean white background (like input box)
    backgroundColor: "#f2f0f5",
  
    // Very subtle border (optional but premium)
    borderWidth: 1,
    borderColor: "#4b3270",
  
    // Center image
    justifyContent: "center",
    alignItems: "center",
  
    // Soft 3D shadow (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  
    // Android elevation
    elevation: 8,
  
    zIndex: 2,
  },
  
  

  heroImage: {
    width: 170,
    height: 170,
  
    // Make image feel softer & premium
    borderRadius: 20,
  
    // Avoid pixel stretching
    resizeMode: "contain",
  },
  
  
});


