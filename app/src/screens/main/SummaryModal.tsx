import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';

interface Props {
  visible: boolean;
  title: string;
  summary: string;
  onClose: () => void;
}

export default function SummaryModal({
  visible,
  title,
  summary,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* BODY */}
          <ScrollView style={styles.body}>
            <Markdown style={markdownStyles}>
              {summary}
            </Markdown>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  header: {
    backgroundColor: '#6366f1',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 10,
  },
  body: {
    padding: 16,
  },
});

/* ================= MARKDOWN STYLES ================= */

const markdownStyles = {
  body: {
    color: '#374151',
    fontSize: 15,
    lineHeight: 22,
  },
  heading1: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    color: '#111827',
  },
  heading2: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
    color: '#1f2937',
  },
  heading3: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6,
  },
  paragraph: {
    marginBottom: 8,
  },
  bullet_list: {
    marginVertical: 6,
  },
  list_item: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bullet_list_icon: {
    marginRight: 6,
  },
};
