'use client';

import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* NAVIGATION BAR */}
      <View style={styles.navBar}>
        <View style={styles.navLeft}>
          <Image source={{ uri: '/logo_b.png' }} style={styles.logoImage} resizeMode="contain" />
          <View style={styles.navLinks}>
            <Pressable onPress={() => router.push('/')}>
              <Text style={styles.navLink}>Home</Text>
            </Pressable>
            <Pressable>
              <Text style={[styles.navLink, styles.activeLink]}>About Us</Text>
            </Pressable>
          </View>
        </View>

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

      {/* MAIN BODY AREA */}
      <View style={styles.pageBody}>
        <Image source={{ uri: '/hero-bg.png' }} style={styles.bgImage} resizeMode="cover" />
        <View style={styles.bgOverlay} />

        {/* White Content Card */}
        <View style={styles.contentCard}>
          
          <View style={styles.banner}>
            <Text style={styles.bannerText}>About Our Mission</Text>
          </View>

          {/* INTERNAL SCROLLABLE AREA - SINGLE COLUMN */}
          <View style={styles.scrollContainer}>
            <ScrollView 
              style={{ flex: 1 }} 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
            >
              <View style={styles.singleColumnContainer}>
                
                {/* Section 1 */}
                <View style={styles.section}>
                  <Text style={styles.sectionHeader}>Our Vision & Team</Text>
                  <Text style={styles.paragraphText}>
                    We believe every individual has the power to be a hero in their community. Our platform streamlines the process of giving whether you are donating essential goods or providing professional medical and logistical support.
                  </Text>
                </View>

                {/* Section 2 */}
                <View style={styles.section}>
                  <Text style={styles.sectionHeader}>Who We Are</Text>
                  <Text style={styles.paragraphText}>
                    We are a dedicated community response network designed to bridge the gap between urgent needs and available resources. From the site to sites across the region, we ensure that help is directed exactly where it is needed most.
                  </Text>
                </View>

                {/* Section 3 */}
                <View style={styles.section}>
                  <Text style={styles.rightMainHeader}>How We Work</Text>
                  
                  <Text style={styles.subHeader}>1. Professional Vetting</Text>
                  <Text style={styles.paragraphText}>
                    To maintain the highest standards of safety and service, all our professional volunteers undergo a thorough vetting process.
                  </Text>
                  
                  <View style={styles.bulletList}>
                    <View style={styles.bulletRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}><Text style={styles.boldText}>Medical Verification:</Text> We verify licenses for all on-site medical personnel to ensure professional-grade care.</Text>
                    </View>
                    <View style={styles.bulletRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}><Text style={styles.boldText}>Logistics Security:</Text> We confirm driver credentials and insurance to ensure the safe transport of donated goods.</Text>
                    </View>
                  </View>
                </View>

                {/* Section 4 */}
                <View style={styles.section}>
                  <Text style={styles.subHeader}>2. Real-Time Resource Management</Text>
                  <View style={styles.bulletList}>
                    <View style={styles.bulletRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}>Our system tracks site capacity and role requirements in real-time.</Text>
                    </View>
                    <View style={styles.bulletRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}>This allows us to identify High Need areas immediately.</Text>
                    </View>
                    <View style={styles.bulletRow}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}>Prevent over-saturation at specific sites to maintain efficiency.</Text>
                    </View>
                  </View>
                </View>

              </View>
            </ScrollView>
          </View>

          {/* FIXED FOOTER */}
          <View style={styles.cardFooter}>
            <Pressable style={styles.returnButton} onPress={() => router.push('/')}>
              <Text style={styles.returnButtonText}>Return to Dashboard</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', height: '100vh' } as any,
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 40, height: 100, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', zIndex: 10 } as any,
  navLeft: { flexDirection: 'row', alignItems: 'center', gap: 40 } as any,
  logoImage: { width: 65, height: 65 },
  navLinks: { flexDirection: 'row', gap: 40 } as any,
  navLink: { fontSize: 18, color: '#4B5563', fontWeight: '500' },
  activeLink: { color: '#111827', fontWeight: '600' },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 25 } as any,
  iconButton: { padding: 8 },
  navIcon: { width: 34, height: 34, opacity: 0.7 },
  userProfile: { flexDirection: 'row', alignItems: 'center', gap: 12 } as any,
  userName: { fontSize: 17, fontWeight: '600', color: '#111827' },
  userRole: { fontSize: 13, color: '#6B7280' },
  pageBody: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' } as any,
  bgImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  bgOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0F172A', opacity: 0.75 },
  contentCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 30, width: '90%', maxWidth: 900, height: '80%', boxShadow: '0px 15px 45px rgba(0, 0, 0, 0.4)', zIndex: 2 } as any,
  banner: { backgroundColor: '#4273B8', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginBottom: 20 },
  bannerText: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  scrollContainer: { flex: 1, marginBottom: 20 },
  scrollContent: { paddingRight: 15, paddingBottom: 20 },
  
  // --- SINGLE COLUMN STYLES ---
  singleColumnContainer: {
    flexDirection: 'column',
    gap: 35,
  } as any,
  section: {
    width: '100%',
  },
  sectionHeader: { fontSize: 24, fontWeight: 'bold', color: '#000000', marginBottom: 12 },
  rightMainHeader: { fontSize: 28, fontWeight: 'bold', color: '#000000', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 10 },
  subHeader: { fontSize: 20, fontWeight: 'bold', color: '#000000', marginBottom: 8, marginTop: 10 },
  paragraphText: { fontSize: 16, color: '#333333', lineHeight: 26 },
  boldText: { fontWeight: 'bold', color: '#000000' },
  bulletList: { marginTop: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  bulletPoint: { fontSize: 18, color: '#000000', marginRight: 10 },
  bulletText: { flex: 1, fontSize: 15, color: '#333333', lineHeight: 24 },
  cardFooter: { borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 15, alignItems: 'flex-end' },
  returnButton: { backgroundColor: '#4273B8', paddingVertical: 10, paddingHorizontal: 25, borderRadius: 8 },
  returnButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
});