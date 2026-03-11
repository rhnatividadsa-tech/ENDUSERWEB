'use client';

import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      
      {/* ========================================= */}
      {/* NAVIGATION BAR                            */}
      {/* ========================================= */}
      <View style={styles.navBar}>
        {/* Left: Logo & Links */}
        <View style={styles.navLeft}>
          <Image 
            source={{ uri: '/logo_b.png' }} 
            style={styles.logoImage} 
            resizeMode="contain" 
          />
          
          <View style={styles.navLinks}>
            <Pressable>
              <Text style={[styles.navLink, styles.activeLink]}>Home</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/about')}>
              <Text style={styles.navLink}>About Us</Text>
            </Pressable>
          </View>
        </View>

        {/* Right: User Icons */}
        <View style={styles.navRight}>
          <Pressable style={styles.iconButton}>
            <Image source={{ uri: '/icon-bell.png' }} style={styles.navIcon} resizeMode="contain" />
          </Pressable>
          
          <View style={styles.userProfile}>
            <Image source={{ uri: '/icon-user.png' }} style={styles.navIcon} resizeMode="contain" />
            <View>
              <Text style={styles.userName}>User</Text>
              <Text style={styles.userRole}>Role</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ========================================= */}
      {/* HERO SECTION                              */}
      {/* ========================================= */}
      <View style={styles.heroSection}>
        <Image source={{ uri: '/hero-bg.png' }} style={styles.heroBg} resizeMode="cover" />
        <View style={styles.heroOverlay} />

        <View style={styles.heroContent}>
          <Text style={styles.welcomeText}>
            Welcome To <Text style={styles.brandText}>BayaniHub</Text>
          </Text>
          <Text style={styles.headlineText}>
            Right People. Right Resources. Right Now.
          </Text>
          <Text style={styles.subHeadlineText}>
            BayaniHub is a unified platform managing both volunteers and material aid. We empower modern-day heroes to forecast needs and deploy relief efficiently.
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Image source={{ uri: '/icon-box.png' }} style={styles.cardIconImage} resizeMode="contain" />
              <Text style={styles.cardTitle}>Pledge Goods</Text>
              <View style={styles.subtitleWrapper}>
                <Text style={styles.cardSubtitle}>Review dynamic site needs. Donate supplies.</Text>
              </View>
            </View>
            <Pressable 
  style={[styles.cardButton, { backgroundColor: '#2E8B57' }]}
  onPress={() => router.push('/pledge')} // <--- ADD THIS LINE
>
  <Text style={styles.cardButtonText}>Pledge Now</Text>
</Pressable>
          </View>

          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Image source={{ uri: '/icon-handshake.png' }} style={styles.cardIconImage} resizeMode="contain" />
              <Text style={styles.cardTitle}>Volunteer Your Time</Text>
              <View style={styles.subtitleWrapper}>
                <Text style={styles.cardSubtitle}>Discover Medic, Logistics, & Field roles.</Text>
              </View>
            </View>
            <Pressable 
              style={[styles.cardButton, { backgroundColor: '#3B71CA' }]}
              onPress={() => router.push('/volunteer')} // <--- ADD THIS LINE
              >
              <Text style={styles.cardButtonText}>Volunteer Now</Text>
            </Pressable>
          </View>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // --- NAVIGATION BAR ---
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40, 
    height: 100,           // Back to original standard height
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 10,
  } as any,
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,               
  } as any,
  logoImage: {
    width: 65,
    height: 65,
  },
  navLinks: {
    flexDirection: 'row',
    gap: 40,               // Spread Home and About Us out more
  } as any,
  navLink: {
    fontSize: 18,          // Bigger text
    color: '#4B5563',
    fontWeight: '500',
    letterSpacing: 0.3,    // Subtly utilizes the white space
  },
  activeLink: {
    color: '#111827',
    fontWeight: '600',
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 25,               // More space between Icons
  } as any,
  iconButton: {
    padding: 8,
  },
  navIcon: {
    width: 34,             // Scaled up slightly to match the 18px font
    height: 34,
    opacity: 0.7, 
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  } as any,
  userName: {
    fontSize: 17,          // Bigger user name
    fontWeight: '600',
    color: '#111827',
  },
  userRole: {
    fontSize: 13,
    color: '#6B7280',
  },

  // --- HERO SECTION (Keeping your alignment fixes) ---
  heroSection: {
    position: 'relative',
    minHeight: 'calc(100vh - 100px)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  } as any,
  heroBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width: '100%', height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#0F172A',
    opacity: 0.65, 
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 900,
    zIndex: 2,
    marginBottom: 50,
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  brandText: {
    color: '#60A5FA', 
  },
  headlineText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  subHeadlineText: {
    fontSize: 18,
    color: '#E5E7EB',
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 750,
  },

  // --- CARDS SECTION (Keeping your alignment fixes) ---
  cardsContainer: {
    flexDirection: 'row',
    gap: 30,
    zIndex: 2,
    flexWrap: 'wrap', 
    justifyContent: 'center',
    alignItems: 'stretch',
  } as any,
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 40,
    width: 340,
    boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.15)', 
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', 
  } as any,
  cardTop: {
    alignItems: 'center',
  },
  cardIconImage: {
    width: 55,
    height: 55,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitleWrapper: {
    minHeight: 60, 
    justifyContent: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
  },
  cardButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  } as any,
  cardButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});