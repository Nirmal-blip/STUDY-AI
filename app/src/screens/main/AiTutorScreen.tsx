import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  Alert,
  Keyboard,
  Modal,
} from "react-native";
import * as Speech from "expo-speech";
import Markdown from "react-native-markdown-display";
import { Ionicons } from "@expo/vector-icons";
import apiClient from "../../api/axios";

/* ===================== TYPES ===================== */
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Document {
  _id: string;
  title: string;
}

interface Video {
  _id: string;
  title: string;
  status: string;
}

/* ===================== COMPONENT ===================== */
export default function AiTutorScreenV2() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);

  const [sourceType, setSourceType] =
    useState<"document" | "video">("document");

  const [selectedDocId, setSelectedDocId] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState("");

  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  /* ===================== PULSE ===================== */
  useEffect(() => {
    if (isSpeaking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isSpeaking]);

  /* ===================== FETCH SOURCES ===================== */
  useEffect(() => {
    apiClient
      .get("/api/upload/documents")
      .then((res) => setDocuments(res.data.documents || []))
      .catch(() => setDocuments([]));

    apiClient
      .get("/api/video")
      .then((res) => setVideos(res.data.videos || []))
      .catch(() => setVideos([]));
  }, []);

  /* ===================== SESSION ===================== */
  const createSession = async () => {
    if (sourceType === "document" && !selectedDocId) {
      Alert.alert("Select PDF", "Please select a PDF first");
      throw new Error();
    }

    if (sourceType === "video") {
      const v = videos.find((v) => v._id === selectedVideoId);
      if (!v || v.status !== "ready") {
        Alert.alert("Video not ready", "Please wait for processing");
        throw new Error();
      }
    }

    const payload =
      sourceType === "document"
        ? { documentId: selectedDocId }
        : { videoId: selectedVideoId };

    const res = await apiClient.post("/api/chat/session", payload);
    setSessionId(res.data.sessionId);
    return res.data.sessionId;
  };

  const stopSpeech = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  /* ===================== SEND MESSAGE ===================== */
  const sendMessage = async () => {
    if (!input.trim() || loading) return;
  
    // 🚨 NEW CHECK (MOST IMPORTANT)
    if (
      (sourceType === "document" && !selectedDocId) ||
      (sourceType === "video" && !selectedVideoId)
    ) {
      Alert.alert(
        "Select Source",
        "Please select a PDF or Video you uploaded before asking a question."
      );
      return;
    }
  
    Keyboard.dismiss();
  
    let sid = sessionId;
    if (!sid) sid = await createSession();
  
    const text = input.trim();
  
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: text },
    ]);
  
    setInput("");
    setLoading(true);
  
    const loadingId = "thinking";
    setMessages((prev) => [
      ...prev,
      { id: loadingId, role: "assistant", content: "AI is thinking..." },
    ]);
  
    try {
      const res = await apiClient.post("/api/chat/messages", {
        sessionId: sid,
        content: text,
      });
  
      const aiText = res.data.aiMessage.content;
  
      setMessages((prev) =>
        prev.filter((m) => m.id !== loadingId).concat({
          id: Date.now().toString(),
          role: "assistant",
          content: aiText,
        })
      );
  
      Speech.speak(aiText, {
        onStart: () => setIsSpeaking(true),
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
      });
    } catch {
      setIsSpeaking(false);
    } finally {
      setLoading(false);
    }
  };
  
  const selectedSourceTitle =
    sourceType === "document"
      ? documents.find((d) => d._id === selectedDocId)?.title
      : videos.find((v) => v._id === selectedVideoId)?.title;

  /* ===================== UI ===================== */
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* AVATAR */}
      <View style={styles.avatarBox}>
        <Animated.View
          style={[styles.avatarPulse, { transform: [{ scale: pulseAnim }] }]}
        />

        <View style={styles.avatarFrame}>
          <View style={styles.avatarClipper}>
            <Image
              source={
                isSpeaking
                  ? require("../../../assets/ai-talking.gif")
                  : require("../../../assets/idle-ai.png")
              }
              style={styles.avatar}
            />
          </View>
        </View>

        {isSpeaking && (
          <TouchableOpacity style={styles.stopBtn} onPress={stopSpeech}>
            <Ionicons name="stop" size={18} color="#fff" />
            <Text style={styles.stopText}>Stop</Text>
          </TouchableOpacity>
        )}

        {/* TABS */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => {
              setSourceType("document");
              setShowPdfModal(true);
            }}
          >
            <Text style={styles.tabText}>Select PDFs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => {
              setSourceType("video");
              setShowVideoModal(true);
            }}
          >
            <Text style={styles.tabText}>Select Videos</Text>
          </TouchableOpacity>
        </View>

        {selectedSourceTitle && (
          <View style={styles.sourceLabel}>
            <Ionicons
              name={sourceType === "document" ? "document-text" : "videocam"}
              size={16}
              color="#6366f1"
            />
            <Text style={styles.sourceText} numberOfLines={1}>
              {selectedSourceTitle}
            </Text>
          </View>
        )}
      </View>

      {/* WHITE CHAT AREA */}
      <View style={styles.chatContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.role === "user"
                  ? styles.userBubble
                  : styles.aiBubble,
              ]}
            >
              <Markdown>{item.content}</Markdown>
            </View>
          )}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* INPUT */}
        <View style={styles.inputBar}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask something..."
            style={styles.input}
            multiline
          />
          <TouchableOpacity
  onPress={sendMessage}
  style={[
    styles.sendBtn,
    (!selectedDocId && !selectedVideoId) && { opacity: 0.5 },
  ]}
>

            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* PDF MODAL */}
      <Modal transparent visible={showPdfModal} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select PDF</Text>

            <FlatList
              data={documents}
              keyExtractor={(i) => i._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedDocId(item._id);
                    setShowPdfModal(false);
                    setSessionId(null);
                  }}
                >
                  <Ionicons name="document-text" size={18} color="#6366f1" />
                  <Text style={styles.modalItemText}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowPdfModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* VIDEO MODAL */}
      <Modal transparent visible={showVideoModal} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Video</Text>

            <FlatList
              data={videos}
              keyExtractor={(i) => i._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedVideoId(item._id);
                    setShowVideoModal(false);
                    setSessionId(null);
                  }}
                >
                  <Ionicons name="videocam" size={18} color="#6366f1" />
                  <Text style={styles.modalItemText}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowVideoModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

/* ===================== STYLES ===================== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2b2f9e" },

  avatarBox: { alignItems: "center", marginVertical: 16 },

  avatarFrame: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarClipper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
  },
  avatar: { width: "100%", height: "100%" },

  avatarPulse: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(79,70,229,0.25)",
    top: -10,
  },

  stopBtn: {
    marginTop: 12,
    flexDirection: "row",
    gap: 6,
    backgroundColor: "#ef4444",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  stopText: { color: "#fff", fontWeight: "600" },

  tabs: { flexDirection: "row", gap: 12, marginTop: 12 },
  tab: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabText: { color: "#fff", fontWeight: "600" },

  sourceLabel: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#eef2ff",
    flexDirection: "row",
    gap: 6,
  },
  sourceText: { fontWeight: "600", color: "#3730a3" },

  chatContainer: {
    flex: 1,
    backgroundColor: "#dcddfc",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: 16,
  },

  bubble: {
    margin: 8,
    padding: 12,
    borderRadius: 16,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: "#64f5a5",
    alignSelf: "flex-end",
  
    // Shape
    borderRadius: 18,
    borderBottomRightRadius: 4, // chat-style tail feel
  
    // Shadow (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  
    // Shadow (Android)
    elevation: 8,
  
    // Extra polish
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  aiBubble: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
  
    // Shape
    borderRadius: 18,
    borderBottomLeftRadius: 4, // chat-style tail feel
  
    // Shadow (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  
    // Shadow (Android)
    elevation: 8,
  
    // Extra polish
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  inputBar: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#2b2f9e",
  },

  input: {
    flex: 1,
  
    // Size & shape
    minHeight: 44,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
  
    // Glass-soft background
    backgroundColor: "#ffffffee",
  
    // Subtle border
    borderWidth: 1,
    borderColor: "rgba(209, 213, 219, 0.6)",
  
    // iOS soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  
    // Android soft elevation
    elevation: 4,
  
    // Text
    fontSize: 15,
    color: "#111827",
  },
  
  sendBtn: {
    backgroundColor: "#6366f1",
    marginLeft: 8,
    padding: 12,
    borderRadius: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  modalItem: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  modalItemText: { fontSize: 16, flex: 1 },
  modalClose: { marginTop: 12, alignSelf: "center" },
  modalCloseText: { color: "#6366f1", fontWeight: "600" },
});
