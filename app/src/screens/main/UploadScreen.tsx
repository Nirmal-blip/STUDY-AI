import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Platform,
  Modal,
  TextInput,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import apiClient from '../../api/axios';

/* ================= TYPES ================= */

interface StudySource {
  _id: string;
  type: 'pdf' | 'note' | 'youtube';
  title: string;
  description?: string;
  uploadedAt: string;
  status: 'active' | 'inactive' | 'processing';
}

/* ================= HELPERS ================= */

// 🔥 markdown → clean single-line text
const toSingleLineText = (text = '') => {
  return text
    .replace(/[#*_>`-]/g, '') // remove markdown symbols
    .replace(/\n+/g, ' ')     // new lines → space
    .replace(/\s+/g, ' ')     // extra spaces
    .trim();
};

/* ================= COMPONENT ================= */

export default function UploadScreen() {
  const [documents, setDocuments] = useState<StudySource[]>([]);
  const [videos, setVideos] = useState<StudySource[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pdf' | 'youtube'>('all');

  const [videoModal, setVideoModal] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeTitle, setYoutubeTitle] = useState('');

  const scaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    fetchSources();
  }, []);

  /* ================= FETCH ================= */

  const fetchSources = async () => {
    try {
      setLoading(true);
      const [docsRes, videosRes] = await Promise.all([
        apiClient.get('/api/upload/documents'),
        apiClient.get('/api/video'),
      ]);

      const docs = (docsRes.data.documents || []).map((doc: any) => ({
        _id: doc._id,
        type: 'pdf',
        title: doc.title,
        description: doc.summary || `${doc.metadata?.pageCount || 0} pages`,
        uploadedAt: new Date(doc.createdAt).toLocaleDateString(),
        status: doc.isActive ? 'active' : 'inactive',
      }));

      const vids = (videosRes.data.videos || []).map((video: any) => ({
        _id: video._id,
        type: 'youtube',
        title: video.title,
        description:
          video.summary ||
          (video.status === 'processing'
            ? 'Processing video…'
            : 'YouTube video'),
        uploadedAt: new Date(video.createdAt).toLocaleDateString(),
        status: video.status || 'active',
      }));

      setDocuments(docs);
      setVideos(vids);
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to load sources' });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSources();
    setRefreshing(false);
  };

  /* ================= UPLOAD PDF ================= */

  const handlePDFUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (result.canceled) return;

      setUploadingPdf(true);
      const file = result.assets[0];
      const formData = new FormData();

      formData.append('file', {
        uri:
          Platform.OS === 'ios'
            ? file.uri.replace('file://', '')
            : file.uri,
        name: file.name,
        type: 'application/pdf',
      } as any);

      await apiClient.post('/api/upload/pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Toast.show({ type: 'success', text1: 'PDF uploaded' });
      fetchSources();
    } catch {
      Toast.show({ type: 'error', text1: 'Upload failed' });
    } finally {
      setUploadingPdf(false);
    }
  };

  /* ================= ADD VIDEO ================= */

  const handleVideoUpload = async () => {
    if (!youtubeUrl.trim()) {
      Toast.show({ type: 'error', text1: 'Enter YouTube URL' });
      return;
    }

    try {
      setUploadingVideo(true);
      await apiClient.post('/api/video/add', {
        youtubeUrl: youtubeUrl.trim(),
        title: youtubeTitle.trim() || undefined,
      });

      Toast.show({ type: 'success', text1: 'Video added' });
      setYoutubeUrl('');
      setYoutubeTitle('');
      setVideoModal(false);
      fetchSources();
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to add video' });
    } finally {
      setUploadingVideo(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = (id: string, type: string) => {
    Alert.alert('Delete Source', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const url =
              type === 'youtube'
                ? `/api/video/${id}`
                : `/api/upload/documents/${id}`;
            await apiClient.delete(url);
            Toast.show({ type: 'success', text1: 'Deleted' });
            fetchSources();
          } catch {
            Toast.show({ type: 'error', text1: 'Delete failed' });
          }
        },
      },
    ]);
  };

  const data =
    filter === 'all'
      ? [...documents, ...videos]
      : filter === 'pdf'
      ? documents
      : videos;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* HEADER */}
        <LinearGradient colors={['#4f46e5', '#7c3aed']} style={styles.header}>
          <Text style={styles.title}>Your Study Library</Text>
          <Text style={styles.subtitle}>
            Upload PDFs or YouTube videos
          </Text>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.fab, { backgroundColor: '#10b981' }]}
              onPress={handlePDFUpload}
            >
              {uploadingPdf ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="document-text" size={22} color="#fff" />
                  <Text style={styles.fabText}>Upload PDF</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.fab, { backgroundColor: '#ef4444' }]}
              onPress={() => setVideoModal(true)}
            >
              <Ionicons name="logo-youtube" size={22} color="#fff" />
              <Text style={styles.fabText}>Add Video</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* FILTERS */}
        <View style={styles.filters}>
          {['all', 'pdf', 'youtube'].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f as any)}
              style={[
                styles.filterPill,
                filter === f && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}
              >
                {f === 'all' ? 'All' : f === 'pdf' ? 'Documents' : 'Videos'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* LIST */}
        <View style={styles.list}>
          {data.map((item) => (
            <Animated.View key={item._id} style={styles.card}>
              <Animated.View style={styles.cardInner}>
                <LinearGradient
                  colors={
                    item.type === 'youtube'
                      ? ['#ff0000', '#cc0000']
                      : ['#4f46e5', '#7c3aed']
                  }
                  style={styles.cardIconContainer}
                >
                  <Ionicons
                    name={
                      item.type === 'youtube'
                        ? 'logo-youtube'
                        : 'document-text'
                    }
                    size={30}
                    color="#fff"
                  />
                </LinearGradient>

                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>

                  {/* ✅ SINGLE LINE – NEVER CUT */}
                  <Text
                    style={styles.cardDesc}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {toSingleLineText(item.description || '')}
                  </Text>

                  <Text style={styles.cardDate}>{item.uploadedAt}</Text>
                </View>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item._id, item.type)}
                >
                  <Ionicons name="trash-outline" size={22} color="#ef4444" />
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* VIDEO MODAL */}
      <Modal transparent visible={videoModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add YouTube Video</Text>

            <TextInput
              placeholder="YouTube URL"
              value={youtubeUrl}
              onChangeText={setYoutubeUrl}
              style={styles.input}
            />

            <TextInput
              placeholder="Custom title (optional)"
              value={youtubeTitle}
              onChangeText={setYoutubeTitle}
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setVideoModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addButton}
                onPress={handleVideoUpload}
              >
                {uploadingVideo ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.addButtonText}>Add</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', marginTop: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderRadius: 32,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.85)' },

  headerActions: { flexDirection: 'row', gap: 16, marginTop: 24 },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 18,
  },
  fabText: { color: '#fff', fontWeight: '700' },

  filters: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 20,
  },
  filterPill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: '#e5e7eb',
  },
  filterPillActive: { backgroundColor: '#4f46e5' },
  filterText: { fontWeight: '700', color: '#374151' },
  filterTextActive: { color: '#fff' },

  list: { paddingHorizontal: 20, paddingBottom: 120 },
  card: { marginBottom: 16 },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
  },
  cardIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  cardDesc: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18, // ✅ safe
  },
  cardDate: { fontSize: 12, color: '#9ca3af', marginTop: 6 },

  deleteBtn: { padding: 8 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
  },
  modalTitle: { fontSize: 22, fontWeight: '800', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  cancelText: { fontSize: 16, color: '#6b7280' },
  addButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 14,
  },
  addButtonText: { color: '#fff', fontWeight: '700' },
});
