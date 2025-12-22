import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const logo = require('../../assets/girl.png');

export default function SplashScreen() {
  return (
    <LinearGradient
      colors={['#4f46e5', '#2563eb']}
      style={styles.container}
    >
      {/* MAIN FRAME */}
      <View style={styles.frame}>

        {/* LOGO FRAME */}
        <View style={styles.logoFrame}>
          <Image
            source={logo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Study AI</Text>
        <Text style={styles.subtitle}>Personalized AI Notebook</Text>

        <ActivityIndicator
          size="large"
          color="#4f46e5"
          style={{ marginTop: 24 }}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* MAIN FRAME */
  frame: {
    width: '85%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 28,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 16,
  },

  /* LOGO FRAME */
  logoFrame: {
    width: 130,
    height: 130,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,

    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },

  logo: {
    width: 120,
    height: 120,
  },

  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1f2937',
    letterSpacing: 1,
  },

  subtitle: {
    fontSize: 16,
    color: '#4f46e5',
    marginTop: 6,
    fontWeight: '600',
  },
});
