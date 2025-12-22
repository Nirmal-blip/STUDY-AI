import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/axios';

interface Document {
  _id: string;
  title: string;
  type: 'pdf' | 'note';
  summary?: string;
  status: 'idle' | 'processing' | 'ready' | 'failed';
}

export default function ConsultationHistoryScreen() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await apiClient.get('/api/upload/documents');
      setDocuments(res.data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Study Sessions</Text>
      </View>

      {documents.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="document-outline" size={64} color="#9ca3af" />
          <Text style={styles.emptyText}>No documents yet</Text>
        </View>
      ) : (
        documents.map((doc) => (
          <View key={doc._id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="document-text" size={24} color="#6366f1" />
              <Text style={styles.cardTitle}>{doc.title}</Text>
            </View>
            {doc.status === 'ready' && doc.summary && (
              <Text style={styles.summary} numberOfLines={3}>
                {doc.summary}
              </Text>
            )}
            {doc.status === 'processing' && (
              <View style={styles.processing}>
                <ActivityIndicator size="small" color="#6366f1" />
                <Text style={styles.processingText}>Processing...</Text>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 16,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
    flex: 1,
  },
  summary: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginTop: 8,
  },
  processing: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  processingText: {
    fontSize: 14,
    color: '#6366f1',
    marginLeft: 8,
  },
});



