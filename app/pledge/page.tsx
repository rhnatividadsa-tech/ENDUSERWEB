'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'next/navigation';

export default function PledgePage() {
  const router = useRouter();
  
  // --- NEW: Track if they came from the Volunteer page ---
  const [cameFromVolunteer, setCameFromVolunteer] = useState(false);

  useEffect(() => {
    // Check session storage when the page loads
    if (typeof window !== 'undefined' && sessionStorage.getItem('fromVolunteer') === 'true') {
      setCameFromVolunteer(true);
    }
  }, []);

  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState('Select Site Location');
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('Select Time Slot');
  const [items, setItems] = useState([{ qty: '', name: '' }, { qty: '', name: '' }, { qty: '', name: '' }]);

  const [showErrors, setShowErrors] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const [showVolunteerModal, setShowVolunteerModal] = useState(false); 
  const [showSimpleSuccessModal, setShowSimpleSuccessModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false); // NEW MODAL STATE
  const [isConfirmed, setIsConfirmed] = useState(false);

  const ustBuildings = ["UST Main Building", "UST Hospital", "Roque Ruaño Building", "St. Martin de Porres Building", "St. Pier Giorgio Frassati, O.P. Building", "Albertus Magnus Building", "Benavides Building", "St. Raymund de Peñafort Building"];
  const timeSlots = ["Morning (8:00 AM - 12:00 PM)", "Afternoon (1:00 PM - 5:00 PM)", "Evening (5:00 PM - 8:00 PM)"];

  const addItem = () => setItems([...items, { qty: '', name: '' }]);
  const removeItem = (indexToRemove: number) => setItems(items.filter((_, index) => index !== indexToRemove));
  const updateItem = (index: number, field: 'qty' | 'name', value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const isSiteValid = selectedSite !== 'Select Site Location';
  const isTimeValid = selectedTime !== 'Select Time Slot';
  const validItems = items.filter(item => item.qty.trim() !== '' && item.name.trim() !== '');
  const isItemsValid = validItems.length > 0;

  const handleInitialSubmit = () => {
    if (isSiteValid && isTimeValid && isItemsValid) {
      setIsConfirmed(false);
      setShowModal(true); setShowErrors(false);
    } else { setShowErrors(true); }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- NEW LOGIC: Route to the correct modal based on the flag ---
  const handleFinalConfirm = async () => {
    if (isConfirmed) { 
      try {
        setIsSubmitting(true);
        const response = await fetch('http://localhost:3001/api/v1/donations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            siteLocation: selectedSite,
            timeSlot: selectedTime,
            items: validItems,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit pledge');
        }

        setShowModal(false); 
        
        if (cameFromVolunteer) {
          setShowSimpleSuccessModal(true);
          // Clean up the flag so it doesn't trigger on future separate visits
          if (typeof window !== 'undefined') sessionStorage.removeItem('fromVolunteer');
        } else {
          setShowVolunteerModal(true); 
        }
      } catch (error) {
        alert('Failed to submit pledge. Please try again.');
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleVolunteerChoice = (choice: 'yes' | 'no') => {
    setShowVolunteerModal(false);
    if (choice === 'yes') { 
      // NEW: Set a flag before sending them to the Volunteer page
      if (typeof window !== 'undefined') sessionStorage.setItem('fromPledge', 'true');
      router.push('/volunteer'); 
    } else { 
      router.push('/'); 
    }
  };

  return (
    <View style={styles.container}>
      
      {/* 1. INITIAL CONFIRMATION MODAL */}
      {showModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Your Pledge</Text>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Location:</Text>
              <Text style={styles.summaryValue}>{selectedSite}</Text>
              <Text style={styles.summaryLabel}>Time Slot:</Text>
              <Text style={styles.summaryValue}>{selectedTime}</Text>
              <Text style={styles.summaryLabel}>Items to Donate:</Text>
              {validItems.map((item, idx) => <Text key={idx} style={styles.summaryValue}>• {item.qty} x {item.name}</Text>)}
            </View>
            <Pressable style={styles.checkboxRowModal} onPress={() => setIsConfirmed(!isConfirmed)}>
              {({ hovered }: any) => (
                <>
                  <View style={[styles.checkbox, styles.animated, isConfirmed && styles.checkboxChecked, hovered && !isConfirmed && { borderColor: '#10B981' }]}>
                    {isConfirmed && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={[styles.checkboxText, styles.animated, hovered && !isConfirmed && { color: '#10B981' }]}>I confirm that all details provided are correct and I commit to this pledge.</Text>
                </>
              )}
            </Pressable>
            <View style={styles.modalActions}>
              <Pressable style={(state: any) => [styles.cancelBtn, styles.animated, state.hovered && { backgroundColor: '#E5E7EB' }]} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelBtnText}>Back</Text>
              </Pressable>
              <Pressable style={(state: any) => [styles.confirmBtn, styles.animated, !isConfirmed && styles.confirmBtnDisabled, state.hovered && isConfirmed && { transform: [{ scale: 0.98 }] }]} onPress={handleFinalConfirm} disabled={!isConfirmed}>
                <Text style={styles.confirmBtnText}>Confirm Donation</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* 2. STANDARD SUCCESS MODAL (Asks if they want to Volunteer) */}
      {showVolunteerModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { alignItems: 'center', padding: 40 }]}>
            <View style={styles.checkmarkIconCircle}><Text style={styles.checkmarkIconText}>✓</Text></View>
            <Text style={styles.modalTitle}>Pledge Confirmed!</Text>
            <Text style={{ textAlign: 'center', fontSize: 15, color: '#4B5563', marginBottom: 30, lineHeight: 24 }}>Thank you for your generous donation. Would you also like to volunteer your time to help with the relief efforts?</Text>
            <View style={{ flexDirection: 'row', gap: 15, width: '100%' }}>
              <Pressable style={(state: any) => [styles.cancelBtn, styles.animated, { flex: 1 }, state.hovered && { backgroundColor: '#E5E7EB' }]} onPress={() => handleVolunteerChoice('no')}>
                <Text style={styles.cancelBtnText}>No</Text>
              </Pressable>
              <Pressable style={(state: any) => [styles.primaryBlueBtn, styles.animated, { flex: 1.5 }, state.hovered && { transform: [{ scale: 0.98 }] }]} onPress={() => handleVolunteerChoice('yes')}>
                <Text style={styles.primaryBlueBtnText}>Yes, view roles</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* 3. NEW SIMPLE SUCCESS MODAL (For users who already volunteered) */}
      {showSimpleSuccessModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { alignItems: 'center', padding: 40 }]}>
            <View style={styles.checkmarkIconCircle}><Text style={styles.checkmarkIconText}>✓</Text></View>
            <Text style={styles.modalTitle}>Pledge Confirmed!</Text>
            <Text style={{ textAlign: 'center', fontSize: 15, color: '#4B5563', marginBottom: 30, lineHeight: 24 }}>
              Thank you so much for your donation, and thank you again for volunteering! Your dedication makes a huge difference.
            </Text>
            <Pressable 
              style={(state: any) => [styles.primaryBlueBtn, styles.animated, { width: '100%' }, state.hovered && { transform: [{ scale: 0.98 }] }]} 
              onPress={() => router.push('/')}
            >
              <Text style={styles.primaryBlueBtnText}>Return to Homepage</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* NAVIGATION BAR */}
      <View style={styles.navBar}>
        <View style={styles.navLeft}>
          <Pressable onPress={() => router.push('/')} style={(state: any) => [styles.logoContainer, styles.animated, state.hovered && { transform: [{ scale: 1.02 }] }]}>
            <Image source={{ uri: '/logo_b.png' }} style={styles.logoImage} resizeMode="contain" />
            <Text style={styles.brandName}>BayaniHub</Text>
          </Pressable>
          <View style={styles.navLinks}>
            <Pressable onPress={() => router.push('/')}><Text style={styles.navLink}>Home</Text></Pressable>
            <Pressable onPress={() => router.push('/about')}><Text style={styles.navLink}>About Us</Text></Pressable>
          </View>
        </View>
        <View style={styles.navRight}>
          <Pressable style={styles.iconButton}><Image source={{ uri: '/icon-bell.png' }} style={styles.navIcon} resizeMode="contain" /></Pressable>
          <View style={{ position: 'relative' }}>
            <Pressable 
              style={styles.userProfile} 
              onPress={() => setShowUserMenu(!showUserMenu)}
            >
              <Image source={{ uri: '/icon-user.png' }} style={styles.navIcon} resizeMode="contain" />
              <View>
                <Text style={styles.userName}>User</Text>
                <Text style={styles.userRole}>Role</Text>
              </View>
            </Pressable>

            {showUserMenu && (
              <View style={[styles.userMenu, { position: 'absolute', top: 50, right: 0, backgroundColor: 'white', borderRadius: 8, padding: 5, zIndex: 1000, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 10, width: 150 }]}>
                <Pressable
                  onPress={() => {
                    setShowUserMenu(false);
                    router.push('/admin');
                  }}
                  style={({ hovered }: any) => [
                    { padding: 10, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
                    hovered && { backgroundColor: '#F3F4F6' }
                  ]}
                >
                  <Text style={{ color: '#4273B8', fontWeight: '500' }}>Admin Dashboard</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setShowUserMenu(false);
                    router.replace('/login');
                  }}
                  style={({ hovered }: any) => [
                    { padding: 10 },
                    hovered && { backgroundColor: '#F3F4F6' }
                  ]}
                >
                  <Text style={{ color: '#EF4444', fontWeight: '500' }}>Logout</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* PAGE BODY */}
      <ScrollView style={styles.pageBody} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          
          <View style={styles.leftColumnOutline}>
            <View style={styles.card}>
              <Text style={styles.pageTitle}>Make a Pledge Donation</Text>
              <Text style={styles.bodyText}>Every item counts. Fill out the details below to support our community and ensure resources go to where they are most needed.</Text>
            </View>

            <View style={[styles.card, { zIndex: 50 }]}>
              <Text style={styles.sectionHeaderTitle}>Drop-off Details</Text>
              
              <Text style={styles.inputLabel}>Select Site Location</Text>
              <View style={{ position: 'relative', zIndex: 100, marginBottom: 25 }}>
                <Pressable style={(state: any) => [styles.dropdownBox, styles.animated, showErrors && !isSiteValid && styles.errorBorder, state.hovered && { borderColor: '#10B981', backgroundColor: '#F0FDF4' }]} onPress={() => { setIsSiteDropdownOpen(!isSiteDropdownOpen); setIsTimeDropdownOpen(false); }}>
                  <Text style={[styles.dropdownBoxText, !isSiteValid && {color: '#9CA3AF'}]}>{selectedSite !== 'Select Site Location' ? selectedSite : '"Select Site Location"'}</Text>
                  <Text style={styles.dropdownBoxArrow}>∨</Text>
                </Pressable>
                {showErrors && !isSiteValid && <Text style={styles.errorText}>● Site Location is required.</Text>}
                {isSiteDropdownOpen && (
                  <View style={styles.dropdownMenuList}>
                    <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={true}>
                      {ustBuildings.map((building, index) => (
                        <Pressable key={index} style={(state: any) => [styles.dropdownMenuItem, styles.animated, state.hovered && { backgroundColor: '#F0FDF4', paddingLeft: 20 }]} onPress={() => { setSelectedSite(building); setIsSiteDropdownOpen(false); if(showErrors) setShowErrors(false); }}>
                          <Text style={styles.dropdownMenuItemText}>{building}</Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <Text style={styles.inputLabel}>Select Time Slot</Text>
              <View style={{ position: 'relative', zIndex: 90 }}>
                <Pressable style={(state: any) => [styles.dropdownBox, styles.animated, showErrors && !isTimeValid && styles.errorBorder, state.hovered && { borderColor: '#10B981', backgroundColor: '#F0FDF4' }]} onPress={() => { setIsTimeDropdownOpen(!isTimeDropdownOpen); setIsSiteDropdownOpen(false); }}>
                  <Text style={[styles.dropdownBoxText, !isTimeValid && {color: '#9CA3AF'}]}>{selectedTime !== 'Select Time Slot' ? selectedTime : '"Select Time Slot"'}</Text>
                  <Text style={styles.dropdownBoxArrow}>∨</Text>
                </Pressable>
                {showErrors && !isTimeValid && <Text style={styles.errorText}>● Time Slot is required.</Text>}
                {isTimeDropdownOpen && (
                  <View style={styles.dropdownMenuList}>
                    <ScrollView style={{ maxHeight: 150 }} showsVerticalScrollIndicator={true}>
                      {timeSlots.map((time, index) => (
                        <Pressable key={index} style={(state: any) => [styles.dropdownMenuItem, styles.animated, state.hovered && { backgroundColor: '#F0FDF4', paddingLeft: 20 }]} onPress={() => { setSelectedTime(time); setIsTimeDropdownOpen(false); }}>
                          <Text style={styles.dropdownMenuItemText}>{time}</Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            <View style={[styles.infoGreenBox, { zIndex: 1 }]}>
              <Text style={styles.infoBoxTitle}>Quick Guide</Text>
              <Text style={styles.infoBoxText}>1. Choose your preferred drop-off site and time.</Text>
              <Text style={styles.infoBoxText}>2. List the items you plan to donate (e.g. "Canned Goods", "Bottled Water").</Text>
              <Text style={styles.infoBoxText}>3. Submit your pledge and bring the items to the designated volunteer desk.</Text>
            </View>
          </View>

          <View style={styles.rightColumnOutline}>
            <View style={[styles.card, { flex: 1 }]}>
              <Text style={styles.sectionHeaderTitle}>Donation Items</Text>
              <View style={styles.itemHeaders}>
                <Text style={styles.qtyHeader}>Qty.</Text>
                <Text style={styles.nameHeader}>Item Name</Text>
                <View style={{ width: 40 }} />
              </View>

              <View style={styles.itemsOuterFrame}>
                <ScrollView style={styles.itemsScroll} showsVerticalScrollIndicator={true}>
                  {items.map((item, index) => {
                    const showInputError = showErrors && !isItemsValid && item.qty === '' && item.name === '';
                    return (
                      <View key={index} style={styles.itemRow}>
                        <TextInput style={[styles.qtyBox, styles.animated, showInputError && styles.errorBorder]} value={item.qty} onChangeText={(text) => updateItem(index, 'qty', text)} placeholder="No." placeholderTextColor="#9CA3AF" keyboardType="numeric" />
                        <TextInput style={[styles.nameBox, styles.animated, showInputError && styles.errorBorder]} value={item.name} onChangeText={(text) => updateItem(index, 'name', text)} placeholder='"Item Name"' placeholderTextColor="#9CA3AF" />
                        <Pressable style={(state: any) => [styles.removeBtn, styles.animated, state.hovered && { backgroundColor: '#FEE2E2' }, state.pressed && { transform: [{ scale: 0.9 }] }]} onPress={() => removeItem(index)}>
                          <Text style={styles.removeBtnText}>X</Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
              {showErrors && !isItemsValid && <Text style={[styles.errorText, {marginTop: 8}]}>● At least one valid item is required.</Text>}
              
              <Pressable style={(state: any) => [styles.addItemBtn, styles.animated, state.hovered && { backgroundColor: '#F3F4F6' }, state.pressed && { transform: [{ scale: 0.95 }] }]} onPress={addItem}>
                <Text style={styles.addItemBtnText}>+ ADD ANOTHER ITEM</Text>
              </Pressable>
            </View>

            <View style={styles.bottomAnchorBox}>
              {showErrors && (!isSiteValid || !isTimeValid || !isItemsValid) && <Text style={[styles.errorText, { textAlign: 'right', marginBottom: 12 }]}>● Please complete missing fields.</Text>}
              <Pressable style={(state: any) => [styles.submitPledgeBtn, styles.animated, state.hovered && styles.btnHover]} onPress={handleInitialSubmit}>
                <Text style={styles.submitBtnText}>Submit Pledge Donation</Text>
              </Pressable>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', height: '100vh', overflow: 'hidden' } as any,
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 40, height: 90, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', zIndex: 10 } as any,
  navLeft: { flexDirection: 'row', alignItems: 'center', gap: 40 } as any,
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 } as any,
  logoImage: { width: 45, height: 45 },
  brandName: { fontSize: 24, fontWeight: '400', color: '#111827', letterSpacing: -0.5 },
  navLinks: { flexDirection: 'row', gap: 40 } as any,
  navLink: { fontSize: 16, color: '#4B5563', fontWeight: '600' },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 25 } as any,
  iconButton: { padding: 8 },
  navIcon: { width: 28, height: 28, opacity: 0.7 },
  userProfile: { flexDirection: 'row', alignItems: 'center', gap: 12 } as any,
  userName: { fontSize: 15, fontWeight: '600', color: '#111827' },
  userRole: { fontSize: 12, color: '#6B7280' },
  pageBody: { flex: 1, backgroundColor: '#F9FAFB' } as any,
  scrollContent: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  gridContainer: { flexDirection: 'row', width: '100%', maxWidth: 1200, gap: 24 } as any,
  leftColumnOutline: { flex: 1.3, display: 'flex', flexDirection: 'column', gap: 24 },
  rightColumnOutline: { flex: 1, display: 'flex', flexDirection: 'column', gap: 24 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', padding: 32 } as any,
  bottomAnchorBox: { marginTop: 10, width: '100%' },
  errorBorder: { borderColor: '#EF4444', borderWidth: 1 },
  errorText: { color: '#EF4444', fontSize: 13, marginTop: 4, fontWeight: '600' },
  pageTitle: { fontSize: 24, fontWeight: '500', color: '#111827', marginBottom: 15 },
  sectionHeaderTitle: { fontSize: 17, fontWeight: '500', color: '#111827', marginBottom: 15 },
  bodyText: { fontSize: 14, color: '#374151', lineHeight: 22 },
  inputLabel: { fontSize: 14, fontWeight: '500', marginBottom: 10, color: '#111827' },
  dropdownBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB' } as any,
  dropdownBoxText: { fontSize: 14, color: '#111827' },
  dropdownBoxArrow: { fontSize: 14, fontWeight: 'bold', color: '#6B7280' },
  dropdownMenuList: { position: 'absolute', top: 55, left: 0, right: 0, backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', overflow: 'hidden', zIndex: 1000, boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' } as any,
  dropdownMenuItem: { paddingVertical: 14, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  dropdownMenuItemText: { fontSize: 14, color: '#374151' },
  infoGreenBox: { backgroundColor: '#EAF5EA', padding: 25, borderRadius: 12, marginTop: 5 },
  infoBoxTitle: { fontSize: 16, fontWeight: '700', color: '#166534', marginBottom: 10 },
  infoBoxText: { fontSize: 14, color: '#15803D', marginBottom: 8, lineHeight: 22 },
  itemHeaders: { flexDirection: 'row', gap: 10, marginBottom: 12, paddingHorizontal: 5 } as any,
  qtyHeader: { width: 70, textAlign: 'center', fontSize: 13, fontWeight: '700', color: '#6B7280' },
  nameHeader: { flex: 1, fontSize: 13, fontWeight: '700', color: '#6B7280' },
  itemsOuterFrame: { height: 300, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 15, backgroundColor: '#F9FAFB' },
  itemsScroll: { flex: 1 },
  itemRow: { flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'center' } as any,
  qtyBox: { width: 70, backgroundColor: '#FFFFFF', paddingVertical: 12, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', textAlign: 'center', color: '#111827', fontSize: 14 } as any,
  nameBox: { flex: 1, backgroundColor: '#FFFFFF', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', color: '#111827', fontSize: 14 } as any,
  removeBtn: { width: 40, height: 40, backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#FCA5A5', alignItems: 'center', justifyContent: 'center' },
  removeBtnText: { color: '#EF4444', fontSize: 14, fontWeight: 'bold' },
  addItemBtn: { alignSelf: 'flex-start', marginTop: 20, backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB' } as any,
  addItemBtnText: { fontSize: 13, fontWeight: '700', color: '#374151' },
  submitPledgeBtn: { backgroundColor: '#10B981', paddingVertical: 18, borderRadius: 8, alignItems: 'center', width: '100%' },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  primaryBlueBtn: { backgroundColor: '#4273B8', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  primaryBlueBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  animated: { transition: 'all 0.2s ease-in-out' } as any,
  btnHover: { opacity: 0.9, transform: [{scale: 0.99}] } as any,
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 9999 } as any,
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 40, width: '95%', maxWidth: 550, boxShadow: '0px 10px 40px rgba(0,0,0,0.1)' } as any,
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 20, textAlign: 'center' },
  summaryBox: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 25, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 25 },
  summaryLabel: { fontSize: 12, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', marginTop: 15, marginBottom: 4 },
  summaryValue: { fontSize: 15, color: '#111827', fontWeight: '600' },
  checkboxRowModal: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, paddingHorizontal: 10 } as any,
  checkbox: { width: 22, height: 22, borderWidth: 2, borderColor: '#D1D5DB', borderRadius: 6, marginRight: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  checkboxChecked: { backgroundColor: '#10B981', borderColor: '#10B981' },
  checkmark: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  checkboxText: { flex: 1, fontSize: 14, color: '#374151', lineHeight: 22 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 } as any,
  cancelBtn: { flex: 1, paddingVertical: 16, borderRadius: 8, backgroundColor: '#F3F4F6', alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB' },
  cancelBtnText: { color: '#374151', fontSize: 15, fontWeight: '700' },
  confirmBtn: { flex: 2, paddingVertical: 16, borderRadius: 8, backgroundColor: '#10B981', alignItems: 'center' },
  confirmBtnDisabled: { backgroundColor: '#9CA3AF' },
  confirmBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  checkmarkIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#EAF5EA', borderWidth: 2, borderColor: '#10B981', alignItems: 'center', justifyContent: 'center', marginBottom: 20 } as any,
  checkmarkIconText: { color: '#10B981', fontSize: 32, fontWeight: 'bold', marginTop: -2 },
});