import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import apiClient from '../../api/axios';
import SummaryModal from './SummaryModal';

type ItemType = 'video' | 'pdf';
type FilterType = 'all' | 'video' | 'pdf';

interface StudyItem {
  _id: string;
  title: string;
  summary?: string;
  status: 'idle' | 'processing' | 'ready' | 'failed';
  type: ItemType;
}

export default function VideoSummariesScreen() {
  const [items, setItems] = useState<StudyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalSummary, setModalSummary] = useState('');

  const scaleAnim = useState(new Animated.Value(1))[0];
  const opacityAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fetchAll();
    Animated.parallel([
      Animated.timing(opacityAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const fetchAll = async () => {
    try {
      const [videoRes, pdfRes] = await Promise.all([
        apiClient.get('/api/video'),
        apiClient.get('/api/upload/documents'),
      ]);

      const videos = (videoRes.data.videos || []).map((v: any) => ({
        _id: v._id,
        title: v.title,
        summary: v.summary,
        status: v.status || (v.summary ? 'ready' : 'idle'),
        type: 'video',
      }));

      const pdfs = (pdfRes.data.documents || []).map((d: any) => ({
        _id: d._id,
        title: d.title,
        summary: d.summary,
        status: d.status || (d.summary ? 'ready' : 'idle'),
        type: 'pdf',
      }));

      setItems([...videos, ...pdfs]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async (item: StudyItem) => {
    try {
      setLoadingId(item._id);
      if (item.type === 'video') {
        await apiClient.post(`/api/video/${item._id}/summary`);
      } else {
        await apiClient.post(`/api/upload/documents/${item._id}/summary`);
      }
      fetchAll();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  const filteredItems = filter === 'all' ? items : items.filter(i => i.type === filter);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.loadingGradient}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Crafting your summaries...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        {/* HERO HEADER */}
        <LinearGradient
          colors={['#6366f1', '#a78bfa']}
          style={styles.hero}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Your AI Study Assistant</Text>
            <Text style={styles.heroSubtitle}>
              Instant summaries of videos and PDFs
            </Text>
            <Ionicons name="sparkles" size={32} color="#fff" style={{ marginTop: 12 }} />
          </View>
        </LinearGradient>

        {/* FILTERS */}
        <View style={styles.filters}>
          {[
            { id: 'all', label: 'All', icon: 'grid-outline' },
            { id: 'video', label: 'Videos', icon: 'videocam-outline' },
            { id: 'pdf', label: 'PDFs', icon: 'document-text-outline' },
          ].map(({ id, label, icon }) => (
            <TouchableOpacity
              key={id}
              activeOpacity={0.8}
              onPress={() => setFilter(id as FilterType)}
            >
              <Animated.View
                style={[
                  styles.filterBubble,
                  filter === id && styles.filterBubbleActive,
                  { transform: [{ scale: filter === id ? 1.1 : 1 }] },
                ]}
              >
                <Ionicons
                  name={icon}
                  size={20}
                  color={filter === id ? '#6366f1' : '#fff'}
                />
                <Text
                  style={[
                    styles.filterText,
                    filter === id && styles.filterTextActive,
                  ]}
                >
                  {label}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>

        {/* LIST */}
        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5446/5446267.png' }}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyTitle}>Nothing here yet</Text>
            <Text style={styles.emptySubtitle}>
              Upload videos or PDFs to unlock AI-powered summaries!
            </Text>
          </View>
        ) : (
          filteredItems.map(item => (
            <Animated.View
              key={item._id}
              style={[
                styles.card,
                { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
              ]}
            >
              <LinearGradient
                colors={['#ffffff', '#f9fafb']}
                style={styles.cardGradient}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name={item.type === 'video' ? 'videocam' : 'document-text'}
                      size={28}
                      color="#fff"
                    />
                  </View>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                </View>

                {/* STATUS */}
                {item.status === 'processing' && (
                  <View style={styles.processingContainer}>
                    <ActivityIndicator size="small" color="#6366f1" />
                    <Text style={styles.processingText}>Generating summary...</Text>
                  </View>
                )}

                {item.status === 'failed' && (
                  <View style={styles.failedBadge}>
                    <Ionicons name="alert-circle" size={18} color="#ef4444" />
                    <Text style={styles.failedText}>Failed</Text>
                  </View>
                )}

                {/* ACTIONS */}
                {(item.status === 'idle' || item.status === 'failed') && (
                  <TouchableOpacity
                    style={styles.generateBtn}
                    onPress={() => generateSummary(item)}
                    disabled={loadingId === item._id}
                  >
                    {loadingId === item._id ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.btnText}>Generate Summary</Text>
                    )}
                  </TouchableOpacity>
                )}

                {item.status === 'ready' && item.summary && (
                  <TouchableOpacity
                    style={styles.viewBtn}
                    onPress={() => {
                      setModalTitle(item.title);
                      setModalSummary(item.summary || '');
                      setModalVisible(true);
                    }}
                  >
                    <Text style={styles.viewText}>View Summary</Text>
                    <Ionicons name="chevron-forward" size={20} color="#6366f1" />
                  </TouchableOpacity>
                )}
              </LinearGradient>
            </Animated.View>
          ))
        )}
      </ScrollView>

      <SummaryModal
        visible={modalVisible}
        title={modalTitle}
        summary={modalSummary}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },

  // Hero
  hero: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#e0e7ff',
    marginTop: 8,
  },

  // Filters (glassmorphism + glow)
  filters: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  filterBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 40,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    backdropFilter: 'blur(10px)',
  },
  filterBubbleActive: {
    backgroundColor: '#fff',
    borderColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  filterText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  filterTextActive: {
    color: '#6366f1',
  },

  // Card (glassmorphism + gradient)
  card: {
    marginHorizontal: 20,
    marginVertical: 12,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },

  // Processing
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  processingText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#6366f1',
  },

  // Failed
  failedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  failedText: {
    marginLeft: 8,
    color: '#ef4444',
    fontWeight: '600',
  },

  // Buttons
  generateBtn: {
    marginTop: 16,
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  viewBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 16,
  },
  viewText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    padding: 40,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },

  // Loading
  loadingContainer: { flex: 1 },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
    fontWeight: '600',
  },
});

