'use client';

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'next/navigation';

export default function PledgePage() {
  const router = useRouter();
  
  // --- FORM STATES ---
  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState('Select Site Location');

  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('Select Time Slot');

  const [items, setItems] = useState([
    { qty: '', name: '' },
    { qty: '', name: '' },
    { qty: '', name: '' },
  ]);

  // --- VALIDATION & MODAL STATES ---
  const [showErrors, setShowErrors] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const [showVolunteerModal, setShowVolunteerModal] = useState(false); 
  const [isConfirmed, setIsConfirmed] = useState(false);

  const ustBuildings = [
    "UST Main Building", "UST Hospital", "Roque Ruaño Building",
    "St. Martin de Porres Building", "St. Pier Giorgio Frassati, O.P. Building",
    "Albertus Magnus Building", "Benavides Building", "St. Raymund de Peñafort Building"
  ];

  const timeSlots = [
    "Morning (8:00 AM - 12:00 PM)", "Afternoon (1:00 PM - 5:00 PM)", "Evening (5:00 PM - 8:00 PM)"
  ];

  const addItem = () => setItems([...items, { qty: '', name: '' }]);
  const removeItem = (indexToRemove: number) => setItems(items.filter((_, index) => index !== indexToRemove));
  const updateItem = (index: number, field: 'qty' | 'name', value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // --- VALIDATION LOGIC ---
  const isSiteValid = selectedSite !== 'Select Site Location';
  const isTimeValid = selectedTime !== 'Select Time Slot';
  const validItems = items.filter(item => item.qty.trim() !== '' && item.name.trim() !== '');
  const isItemsValid = validItems.length > 0;

  const handleInitialSubmit = () => {
    if (isSiteValid && isTimeValid && isItemsValid) {
      setIsConfirmed(false);
      setShowModal(true); 
      setShowErrors(false);
    } else {
      setShowErrors(true);
    }
  };

  const handleFinalConfirm = () => {
    if (isConfirmed) {
      setShowModal(false); 
      setShowVolunteerModal(true); 
    }
  };

  const handleVolunteerChoice = (choice: 'yes' | 'no') => {
    setShowVolunteerModal(false);
    if (choice === 'yes') {
      router.push('/volunteer'); 
    } else {
      router.push('/'); 
    }
  };

  return (
    <View style={styles.container}>
      
      {/* ========================================================= */}
      {/* MODAL 1: PLEDGE CONFIRMATION                              */}
      {/* ========================================================= */}
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
              {validItems.map((item, idx) => (
                <Text key={idx} style={styles.summaryValue}>• {item.qty} x {item.name}</Text>
              ))}
            </View>

            <Pressable style={styles.checkboxRowModal} onPress={() => setIsConfirmed(!isConfirmed)}>
              {({ hovered }: any) => (
                <>
                  <View style={[styles.checkbox, styles.animated, isConfirmed && styles.checkboxChecked, hovered && !isConfirmed && { borderColor: '#2D8A61' }]}>
                    {isConfirmed && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={[styles.checkboxText, styles.animated, hovered && !isConfirmed && { color: '#2D8A61' }]}>I confirm that all details provided are correct and I commit to this pledge.</Text>
                </>
              )}
            </Pressable>

            <View style={styles.modalActions}>
              <Pressable style={(state: any) => [styles.cancelBtn, styles.animated, state.hovered && { backgroundColor: '#CBD5E1' }]} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelBtnText}>Back</Text>
              </Pressable>
              <Pressable 
                style={(state: any) => [styles.confirmBtn, styles.animated, !isConfirmed && styles.confirmBtnDisabled, state.hovered && isConfirmed && { transform: [{ scale: 1.02 }], boxShadow: '0px 4px 12px rgba(45, 138, 97, 0.3)' }, state.pressed && isConfirmed && { transform: [{ scale: 0.98 }] }]} 
                onPress={handleFinalConfirm}
                disabled={!isConfirmed}
              >
                <Text style={styles.confirmBtnText}>Confirm Donation</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: VOLUNTEER PROMPT (WITH CHECKMARK)                */}
      {/* ========================================================= */}
      {showVolunteerModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { alignItems: 'center', padding: 40 }]}>
            <View style={styles.checkmarkIconCircle}>
              <Text style={styles.checkmarkIconText}>✓</Text>
            </View>

            <Text style={styles.modalTitle}>Pledge Confirmed!</Text>
            <Text style={{ textAlign: 'center', fontSize: 16, color: '#444', marginBottom: 30, lineHeight: 22 }}>
              Thank you for your generous donation. Would you also like to volunteer your time to help with the relief efforts?
            </Text>

            <View style={{ flexDirection: 'row', gap: 15, width: '100%' }}>
              <Pressable 
                style={(state: any) => [styles.cancelBtn, styles.animated, { flex: 1 }, state.hovered && { backgroundColor: '#CBD5E1' }]} 
                onPress={() => handleVolunteerChoice('no')}
              >
                <Text style={styles.cancelBtnText}>No</Text>
              </Pressable>
              <Pressable 
                style={(state: any) => [styles.confirmBtn, styles.animated, { flex: 1.5, backgroundColor: '#4273B8' }, state.hovered && { transform: [{ scale: 1.02 }], boxShadow: '0px 4px 12px rgba(66, 115, 184, 0.3)' }, state.pressed && { transform: [{ scale: 0.98 }] }]} 
                onPress={() => handleVolunteerChoice('yes')}
              >
                <Text style={styles.confirmBtnText}>Yes, view roles</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* NAVIGATION BAR */}
      <View style={styles.navBar}>
        <View style={styles.navLeft}>
          <Pressable onPress={() => router.push('/')} style={({ hovered }: any) => [styles.animated, hovered && { transform: [{ scale: 1.05 }] }]}>
            <Image source={{ uri: '/logo_b.png' }} style={styles.logoImage} resizeMode="contain" />
          </Pressable>
          <View style={styles.navLinks}>
            <Pressable onPress={() => router.push('/')}>
              {({ hovered }: any) => <Text style={[styles.navLink, styles.animated, hovered && { color: '#4273B8' }]}>Home</Text>}
            </Pressable>
            <Pressable onPress={() => router.push('/about')}>
              {({ hovered }: any) => <Text style={[styles.navLink, styles.animated, hovered && { color: '#4273B8' }]}>About Us</Text>}
            </Pressable>
          </View>
        </View>

        <View style={styles.navRight}>
          <Pressable style={({ hovered }: any) => [styles.iconButton, styles.animated, hovered && { transform: [{ scale: 1.1 }] }]}>
            <Image source={{ uri: '/icon-bell.png' }} style={styles.navIcon} resizeMode="contain" />
          </Pressable>
          <Pressable style={({ hovered }: any) => [styles.userProfile, styles.animated, hovered && { opacity: 0.7 }]}>
            <Image source={{ uri: '/icon-user.png' }} style={styles.navIcon} resizeMode="contain" />
            <View>
              <Text style={styles.userName}>User</Text>
              <Text style={styles.userRole}>Role</Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* PAGE BODY */}
      <View style={styles.pageBody}>
        {/* FIXED BACKGROUND LAYER */}
        <Image source={{ uri: '/hero-bg.png' }} style={styles.bgImage} resizeMode="cover" />
        <View style={styles.bgOverlay} />

        {/* SCROLLING FOREGROUND LAYER */}
        <ScrollView 
          style={{ flex: 1, zIndex: 2, width: '100%' }} 
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 60, paddingTop: 30 }} 
          showsVerticalScrollIndicator={false}
        >
          {/* ENHANCED DYNAMIC CARD */}
          <View style={styles.contentWrapper}>
            
            <View style={styles.headerBannerGreen}>
              <Text style={styles.bannerText}>Make a Pledge Donation</Text>
              <Text style={styles.bannerSubText}>Every item counts. Fill out the details below to support our community.</Text>
            </View>

            <View style={styles.formGrid}>
              
              {/* LEFT COLUMN: Site & Time */}
              <View style={[styles.formColumn, { zIndex: 50 }]}>
                
                <View style={styles.cardSection}>
                  <Text style={styles.sectionHeader}>Drop-off Details</Text>
                  
                  <Text style={styles.fieldLabel}>Select Site Location</Text>
                  <View style={{ position: 'relative', zIndex: 100 }}>
                    <Pressable 
                      style={(state: any) => [styles.pickerBox, styles.animated, showErrors && !isSiteValid && styles.errorBorder, state.hovered && { borderColor: '#2D8A61', backgroundColor: '#F0FDF4' }]} 
                      onPress={() => { setIsSiteDropdownOpen(!isSiteDropdownOpen); setIsTimeDropdownOpen(false); }}
                    >
                      <Text style={[styles.pickerText, !isSiteValid && {color: '#888'}]}>"{selectedSite}"</Text>
                      <Text style={[styles.pickerArrow, showErrors && !isSiteValid && {color: '#E53E3E'}]}>∨</Text>
                    </Pressable>
                    {showErrors && !isSiteValid && <Text style={styles.errorText}>● Site Location is required.</Text>}

                    {isSiteDropdownOpen && (
                      <View style={styles.dropdownMenu}>
                        <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={true}>
                          {ustBuildings.map((building, index) => (
                            <Pressable 
                              key={index} 
                              style={(state: any) => [styles.dropdownItem, styles.animated, state.hovered && { backgroundColor: '#F0FDF4', paddingLeft: 20 }]} 
                              onPress={() => { setSelectedSite(building); setIsSiteDropdownOpen(false); if(showErrors) setShowErrors(false); }}
                            >
                              <Text style={styles.dropdownItemText}>{building}</Text>
                            </Pressable>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </View>

                  <Text style={[styles.fieldLabel, { marginTop: 25 }]}>Select Time Slot</Text>
                  <View style={{ position: 'relative', zIndex: 90 }}>
                    <Pressable 
                      style={(state: any) => [styles.pickerBox, styles.animated, showErrors && !isTimeValid && styles.errorBorder, state.hovered && { borderColor: '#2D8A61', backgroundColor: '#F0FDF4' }]} 
                      onPress={() => { setIsTimeDropdownOpen(!isTimeDropdownOpen); setIsSiteDropdownOpen(false); }}
                    >
                      <Text style={[styles.pickerText, !isTimeValid && {color: '#888'}]}>"{selectedTime}"</Text>
                      <Text style={[styles.pickerArrow, showErrors && !isTimeValid && {color: '#E53E3E'}]}>∨</Text>
                    </Pressable>
                    {showErrors && !isTimeValid && <Text style={styles.errorText}>● Time Slot is required.</Text>}

                    {isTimeDropdownOpen && (
                      <View style={styles.dropdownMenu}>
                        <ScrollView style={{ maxHeight: 150 }} showsVerticalScrollIndicator={true}>
                          {timeSlots.map((time, index) => (
                            <Pressable 
                              key={index} 
                              style={(state: any) => [styles.dropdownItem, styles.animated, state.hovered && { backgroundColor: '#F0FDF4', paddingLeft: 20 }]} 
                              onPress={() => { setSelectedTime(time); setIsTimeDropdownOpen(false); }}
                            >
                              <Text style={styles.dropdownItemText}>{time}</Text>
                            </Pressable>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                </View>

                {/* INFO BOX TO FILL WHITESPACE */}
                <View style={styles.infoBox}>
                  <Text style={styles.infoBoxTitle}>Quick Guide</Text>
                  <Text style={styles.infoBoxText}>1. Choose your preferred drop-off site and time.</Text>
                  <Text style={styles.infoBoxText}>2. List the items you plan to donate (e.g. "Canned Goods", "Bottled Water").</Text>
                  <Text style={styles.infoBoxText}>3. Submit your pledge and bring the items to the designated volunteer desk.</Text>
                </View>

              </View>

              {/* RIGHT COLUMN: Items & Submit */}
              <View style={[styles.formColumn, { zIndex: 10, display: 'flex', flexDirection: 'column' }]}>
                
                <View style={[styles.cardSection, { flex: 1 }]}>
                  <Text style={styles.sectionHeader}>Donation Items</Text>
                  
                  <View style={styles.itemHeaders}>
                    <Text style={styles.qtyHeader}>Qty.</Text>
                    <Text style={styles.nameHeader}>Item Name</Text>
                    <View style={{ width: 35 }} />
                  </View>

                  <View style={styles.itemsOuterFrame}>
                    <ScrollView style={styles.itemsScroll} showsVerticalScrollIndicator={true}>
                      {items.map((item, index) => {
                        const showInputError = showErrors && !isItemsValid && item.qty === '' && item.name === '';
                        return (
                          <View key={index} style={styles.itemRow}>
                            <TextInput 
                              style={[styles.qtyBox, styles.animated, showInputError && styles.errorBorder]} 
                              value={item.qty} 
                              onChangeText={(text) => updateItem(index, 'qty', text)}
                              placeholder="No."
                              placeholderTextColor="#999"
                              keyboardType="numeric"
                            />
                            <TextInput 
                              style={[styles.nameBox, styles.animated, showInputError && styles.errorBorder]} 
                              value={item.name} 
                              onChangeText={(text) => updateItem(index, 'name', text)}
                              placeholder='"Item Name"'
                              placeholderTextColor="#999"
                            />
                            <Pressable 
                              style={(state: any) => [styles.removeBtn, styles.animated, state.hovered && { backgroundColor: '#FFCaca' }, state.pressed && { transform: [{ scale: 0.9 }] }]} 
                              onPress={() => removeItem(index)}
                            >
                              <Text style={styles.removeBtnText}>✕</Text>
                            </Pressable>
                          </View>
                        );
                      })}
                    </ScrollView>
                  </View>
                  {showErrors && !isItemsValid && <Text style={styles.errorText}>● At least one valid item is required.</Text>}
                  
                  <Pressable 
                    style={(state: any) => [styles.addItemBtn, styles.animated, state.hovered && { backgroundColor: '#D1D5DB' }, state.pressed && { transform: [{ scale: 0.95 }] }]} 
                    onPress={addItem}
                  >
                    <Text style={styles.addItemBtnText}>+ ADD ANOTHER ITEM</Text>
                  </Pressable>
                </View>

                {/* SUBMIT BUTTON */}
                <View style={{ marginTop: 25 }}>
                  {showErrors && (!isSiteValid || !isTimeValid || !isItemsValid) && (
                    <Text style={[styles.errorText, { textAlign: 'center', marginBottom: 10, fontSize: 13 }]}>
                      ● Please address all required fields highlighted above.
                    </Text>
                  )}
                  <Pressable 
                    style={(state: any) => [styles.submitPledgeBtn, styles.animated, state.hovered && styles.btnHoverGreen, state.pressed && styles.btnPress]} 
                    onPress={handleInitialSubmit}
                  >
                    <Text style={styles.submitBtnText}>Submit Pledge Donation</Text>
                  </Pressable>
                </View>

              </View>

            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', height: '100vh', overflow: 'hidden' } as any,
  
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 40, height: 100, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', zIndex: 10 } as any,
  navLeft: { flexDirection: 'row', alignItems: 'center', gap: 40 } as any,
  logoImage: { width: 65, height: 65 },
  navLinks: { flexDirection: 'row', gap: 40 } as any,
  navLink: { fontSize: 18, color: '#4B5563', fontWeight: '500' },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 25 } as any,
  iconButton: { padding: 8 },
  navIcon: { width: 34, height: 34, opacity: 0.7 },
  userProfile: { flexDirection: 'row', alignItems: 'center', gap: 12 } as any,
  userName: { fontSize: 17, fontWeight: '600', color: '#111827' },
  userRole: { fontSize: 13, color: '#6B7280' },

  pageBody: { flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' } as any,
  bgImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', zIndex: 0 },
  bgOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0F172A', opacity: 0.75, zIndex: 1 },

  contentWrapper: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 24, 
    padding: 40, 
    width: '95%', 
    maxWidth: 1200, 
    minHeight: 'auto', 
    display: 'flex', 
    flexDirection: 'column', 
    boxShadow: '0px 20px 50px rgba(0, 0, 0, 0.3)', 
    marginTop: 20
  } as any,

  headerBannerGreen: { backgroundColor: '#2D8A61', borderRadius: 16, paddingVertical: 25, alignItems: 'center', marginBottom: 30 },
  bannerText: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold', letterSpacing: 0.5, marginBottom: 5 },
  bannerSubText: { color: '#E8F5E9', fontSize: 15, fontWeight: '500' },

  errorBorder: { borderColor: '#E53E3E', borderWidth: 1, backgroundColor: '#FFF5F5' },
  errorText: { color: '#E53E3E', fontSize: 13, marginTop: 6, fontWeight: 'bold' },

  animated: { transition: 'all 0.2s ease-in-out' } as any,
  btnHoverGreen: { transform: [{ scale: 1.02 }], opacity: 0.95, boxShadow: '0px 8px 25px rgba(45, 138, 97, 0.35)' } as any,
  btnPress: { transform: [{ scale: 0.98 }], opacity: 0.8 } as any,

  formGrid: { flexDirection: 'row', gap: 40, flex: 1 } as any,
  formColumn: { flex: 1 },
  
  cardSection: { backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, padding: 30 },
  sectionHeader: { fontSize: 20, fontWeight: 'bold', color: '#2D8A61', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 12 },
  
  fieldLabel: { fontSize: 15, fontWeight: 'bold', marginBottom: 8, color: '#334155' },

  pickerBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1' } as any,
  pickerText: { fontSize: 15, color: '#111' },
  pickerArrow: { fontSize: 14, fontWeight: 'bold', color: '#64748B' },
  dropdownMenu: { position: 'absolute', top: 58, left: 0, right: 0, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1', overflow: 'hidden', zIndex: 1000, boxShadow: '0px 10px 25px rgba(0,0,0,0.1)' } as any,
  dropdownItem: { paddingVertical: 14, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  dropdownItemText: { fontSize: 14, color: '#334155', fontWeight: '500' },

  infoBox: { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0', borderRadius: 12, padding: 20, marginTop: 25 },
  infoBoxTitle: { fontSize: 16, fontWeight: 'bold', color: '#166534', marginBottom: 10 },
  infoBoxText: { fontSize: 13, color: '#15803D', marginBottom: 6, lineHeight: 20 },

  itemHeaders: { flexDirection: 'row', gap: 10, marginBottom: 10, paddingHorizontal: 5 } as any,
  qtyHeader: { width: 65, textAlign: 'center', fontSize: 13, fontWeight: 'bold', color: '#64748B' },
  nameHeader: { flex: 1, fontSize: 13, fontWeight: 'bold', color: '#64748B' },
  
  // CHANGED: Fixed height applied here so items container scrolls internally without expanding the page
  itemsOuterFrame: { height: 260, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, padding: 15, backgroundColor: '#FFFFFF' },
  itemsScroll: { flex: 1 },
  
  itemRow: { flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'center' } as any,
  qtyBox: { width: 65, backgroundColor: '#F8FAFC', paddingVertical: 12, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: '#CBD5E1', textAlign: 'center', color: '#0F172A', fontSize: 15, fontWeight: '500' } as any,
  nameBox: { flex: 1, backgroundColor: '#F8FAFC', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 10, borderWidth: 1, borderColor: '#CBD5E1', color: '#0F172A', fontSize: 15, fontWeight: '500' } as any,
  
  removeBtn: { width: 40, height: 40, backgroundColor: '#FEF2F2', borderRadius: 10, borderWidth: 1, borderColor: '#FECACA', alignItems: 'center', justifyContent: 'center' },
  removeBtnText: { color: '#EF4444', fontSize: 16, fontWeight: 'bold' },
  addItemBtn: { alignSelf: 'flex-start', marginTop: 15, backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#CBD5E1', borderStyle: 'dashed' } as any,
  addItemBtnText: { fontSize: 13, fontWeight: 'bold', color: '#475569' },

  submitPledgeBtn: { backgroundColor: '#2D8A61', paddingVertical: 20, borderRadius: 16, alignItems: 'center' },
  submitBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', letterSpacing: 0.5 },

  modalOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)', justifyContent: 'center', alignItems: 'center', zIndex: 9999,
  } as any,
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 40, width: '90%', maxWidth: 550, boxShadow: '0px 10px 40px rgba(0,0,0,0.3)' } as any,
  modalTitle: { fontSize: 26, fontWeight: 'bold', color: '#111', marginBottom: 20, textAlign: 'center' },
  summaryBox: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 25, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 25 },
  summaryLabel: { fontSize: 13, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase', marginTop: 15, marginBottom: 4 },
  summaryValue: { fontSize: 16, color: '#0F172A', fontWeight: '600' },
  
  checkboxRowModal: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, paddingHorizontal: 10 } as any,
  checkbox: { width: 26, height: 26, borderWidth: 2, borderColor: '#2D8A61', borderRadius: 8, marginRight: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  checkboxChecked: { backgroundColor: '#2D8A61' },
  checkmark: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  checkboxText: { flex: 1, fontSize: 15, color: '#334155', lineHeight: 22 },
  
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 } as any,
  cancelBtn: { flex: 1, paddingVertical: 16, borderRadius: 14, backgroundColor: '#F1F5F9', alignItems: 'center' },
  cancelBtnText: { color: '#475569', fontSize: 16, fontWeight: 'bold' },
  confirmBtn: { flex: 2, paddingVertical: 16, borderRadius: 14, backgroundColor: '#2D8A61', alignItems: 'center' },
  confirmBtnDisabled: { backgroundColor: '#94A3B8' },
  confirmBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },

  checkmarkIconCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#F0FDF4', borderWidth: 3, borderColor: '#2D8A61',
    alignItems: 'center', justifyContent: 'center', marginBottom: 25, boxShadow: '0px 4px 15px rgba(0,0,0,0.05)'
  } as any,
  checkmarkIconText: { color: '#2D8A61', fontSize: 40, fontWeight: 'bold', marginTop: -3 },
});