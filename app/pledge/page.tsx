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

  const [volunteerChoice, setVolunteerChoice] = useState<string | null>(null); 
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const [items, setItems] = useState([
    { qty: '', name: '' },
    { qty: '', name: '' },
    { qty: '', name: '' },
  ]);

  // --- VETTING STATES (For Volunteer Flow) ---
  const [checkboxes, setCheckboxes] = useState({
    background: false,
    documents: false,
    age: false,
  });

  // --- VALIDATION & MODAL STATES ---
  const [showErrors, setShowErrors] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const ustBuildings = [
    "UST Main Building",
    "UST Hospital",
    "Roque Ruaño Building",
    "St. Martin de Porres Building",
    "St. Pier Giorgio Frassati, O.P. Building",
    "Albertus Magnus Building",
    "Benavides Building",
    "St. Raymund de Peñafort Building"
  ];

  const timeSlots = [
    "Morning (8:00 AM - 12:00 PM)",
    "Afternoon (1:00 PM - 5:00 PM)",
    "Evening (5:00 PM - 8:00 PM)"
  ];

  const volunteerRoles = [
    { id: 'medic', title: 'Medic', desc: 'Primary medical care & triage. Valid Medical/Nursing License required. Basic first aid & CPR knowledge.', icon: '/medic_logo.png' },
    { id: 'logistics', title: 'Logistics', desc: "Manage supply distribution & transport. Valid Pro Driver's License required. Must lift 25+ lbs.", icon: '/logistics_logo.png' },
    { id: 'field', title: 'Field', desc: 'Manage crowd flow, community outreach & data entry. Strong communication skills needed.', icon: '/field_logo.png' }
  ];

  const addItem = () => setItems([...items, { qty: '', name: '' }]);
  const removeItem = (indexToRemove: number) => setItems(items.filter((_, index) => index !== indexToRemove));
  const updateItem = (index: number, field: 'qty' | 'name', value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const toggleCheckbox = (key: keyof typeof checkboxes) => {
    setCheckboxes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // --- VALIDATION LOGIC ---
  const isSiteValid = selectedSite !== 'Select Site Location';
  const isTimeValid = selectedTime !== 'Select Time Slot';
  const validItems = items.filter(item => item.qty.trim() !== '' && item.name.trim() !== '');
  const isItemsValid = validItems.length > 0;
  
  const isCheckboxesValid = checkboxes.background && checkboxes.documents && checkboxes.age;
  const isVolunteerValid = volunteerChoice === 'no' || (volunteerChoice === 'yes' && selectedRole !== null && isCheckboxesValid);

  const handleInitialSubmit = () => {
    if (isSiteValid && isTimeValid && isItemsValid && isVolunteerValid) {
      setIsConfirmed(false);
      setShowModal(true);
    } else {
      setShowErrors(true);
    }
  };

  const handleFinalConfirm = () => {
    if (isConfirmed) {
      if (volunteerChoice === 'yes') {
        router.push('/volunteer'); 
      } else {
        router.push('/'); 
      }
    }
  };

  return (
    <View style={styles.container}>
      
      {/* CONFIRMATION MODAL OVERLAY */}
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

              <Text style={styles.summaryLabel}>Volunteering:</Text>
              <Text style={styles.summaryValue}>
                {volunteerChoice === 'yes' ? `Yes (${volunteerRoles.find(r => r.id === selectedRole)?.title} Role)` : 'No'}
              </Text>
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
                <Text style={styles.confirmBtnText}>
                  {volunteerChoice === 'yes' ? 'Confirm & Proceed to Screening' : 'Confirm Donation'}
                </Text>
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
        <Image source={{ uri: '/hero-bg.png' }} style={styles.bgImage} resizeMode="cover" />
        <View style={styles.bgOverlay} />

        {/* LOCKED WHITE CARD (MAXIMIZED) */}
        <View style={styles.contentWrapper}>
          
          <View style={styles.headerBannerGreen}>
            <Text style={styles.bannerText}>Pledge Donation</Text>
          </View>

          {/* MASTER INNER SCROLLVIEW */}
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }} showsVerticalScrollIndicator={false}>
            
            <View style={styles.formGrid}>
              
              {/* LEFT COLUMN: Site & Time */}
              <View style={[styles.formColumn, { zIndex: 50 }]}>
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
                            style={(state: any) => [styles.dropdownItem, styles.animated, state.hovered && { backgroundColor: '#F3F4F6', paddingLeft: 20 }]} 
                            onPress={() => { setSelectedSite(building); setIsSiteDropdownOpen(false); if(showErrors) setShowErrors(false); }}
                          >
                            <Text style={styles.dropdownItemText}>{building}</Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                <Text style={[styles.fieldLabel, { marginTop: 40 }]}>Select Time Slot</Text>
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
                            style={(state: any) => [styles.dropdownItem, styles.animated, state.hovered && { backgroundColor: '#F3F4F6', paddingLeft: 20 }]} 
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

              {/* MIDDLE COLUMN: Items */}
              <View style={[styles.formColumn, { flex: 1.5, zIndex: 10, display: 'flex', flexDirection: 'column' }]}>
                <Text style={styles.fieldLabel}>Input Donation Item Details</Text>
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
                {showErrors && !isItemsValid && <Text style={styles.errorText}>● Input Details is required.</Text>}
                
                <Pressable 
                  style={(state: any) => [styles.addItemBtn, styles.animated, state.hovered && { backgroundColor: '#D1D5DB' }, state.pressed && { transform: [{ scale: 0.95 }] }]} 
                  onPress={addItem}
                >
                  <Text style={styles.addItemBtnText}>+ ADD ITEM</Text>
                </Pressable>
              </View>

              {/* RIGHT COLUMN: Volunteer Roles & Submit */}
              <View style={[styles.formColumn, { zIndex: 10, display: 'flex', flexDirection: 'column' }]}>
                
                {/* Fixed Top Section */}
                <View>
                  <Text style={styles.fieldLabel}>Do You Want to Volunteer?</Text>
                  <View style={styles.toggleRow}>
                    <Pressable 
                      style={(state: any) => [styles.toggleBtn, styles.animated, volunteerChoice === 'yes' && styles.toggleBtnActiveGreen, showErrors && volunteerChoice === null && styles.errorBorder, state.hovered && volunteerChoice !== 'yes' && { backgroundColor: '#D1D5DB' }]}
                      onPress={() => setVolunteerChoice('yes')}
                    >
                      <Text style={[styles.toggleText, volunteerChoice === 'yes' && styles.toggleTextActiveGreen]}>Yes, view roles</Text>
                    </Pressable>
                    
                    <Pressable 
                      style={(state: any) => [styles.toggleBtn, styles.animated, volunteerChoice === 'no' && styles.toggleBtnActiveGreen, showErrors && volunteerChoice === null && styles.errorBorder, state.hovered && volunteerChoice !== 'no' && { backgroundColor: '#D1D5DB' }]}
                      onPress={() => { setVolunteerChoice('no'); setSelectedRole(null); }}
                    >
                      <Text style={[styles.toggleText, volunteerChoice === 'no' && styles.toggleTextActiveGreen]}>No</Text>
                    </Pressable>
                  </View>
                  {showErrors && volunteerChoice === null && <Text style={styles.errorText}>● Please select an option.</Text>}
                </View>

                {/* DYNAMIC SCROLLABLE AREA */}
                <View style={{ flex: 1, marginTop: 15 }}>
                  {volunteerChoice === 'yes' && (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10, paddingRight: 10 }}>
                      
                      <View style={styles.rolesContainer}>
                        {volunteerRoles.map(role => (
                          <Pressable 
                            key={role.id}
                            style={(state: any) => [styles.roleCard, styles.animated, selectedRole === role.id && styles.roleCardActiveGreen, showErrors && volunteerChoice === 'yes' && selectedRole === null && styles.errorBorder, state.hovered && selectedRole !== role.id && styles.roleCardHoverGreen]}
                            onPress={() => setSelectedRole(role.id)}
                          >
                            <View style={styles.roleIconBox}>
                              <Image source={{ uri: role.icon }} style={styles.roleIcon} resizeMode="contain" />
                              <Text style={styles.roleIconLabel}>{role.title}</Text>
                            </View>
                            <View style={styles.roleTextContainer}>
                              <Text style={styles.roleTitle}>{role.title}</Text>
                              <Text style={styles.roleDesc}>{role.desc}</Text>
                            </View>
                          </Pressable>
                        ))}
                        {showErrors && volunteerChoice === 'yes' && selectedRole === null && (
                          <Text style={[styles.errorText, { marginTop: 0 }]}>● Please select a volunteer role.</Text>
                        )}
                      </View>

                      {/* DOCUMENT UPLOAD */}
                      {selectedRole !== null && (
                        <View style={{ marginTop: 15 }}>
                          <Text style={[styles.fieldLabel, { fontSize: 14, marginBottom: 5 }]}>Required Documents:</Text>
                          <View style={styles.documentsContainer}>
                            {selectedRole === 'medic' && (
                              <View style={styles.uploadRow}>
                                <View style={styles.uploadInfo}><Text style={styles.docIcon}>📄</Text><Text style={styles.uploadText}>Upload Medical License</Text></View>
                                <Pressable style={(state: any) => [styles.uploadBtnGreen, styles.animated, state.hovered && {backgroundColor: '#1E6545'}, state.pressed && styles.btnPress]}>
                                  <Text style={styles.uploadBtnText}>Upload</Text>
                                </Pressable>
                              </View>
                            )}
                            {selectedRole === 'logistics' && (
                              <View style={styles.uploadRow}>
                                <View style={styles.uploadInfo}><Text style={styles.docIcon}>📄</Text><Text style={styles.uploadText}>Upload Valid Driver's License</Text></View>
                                <Pressable style={(state: any) => [styles.uploadBtnGreen, styles.animated, state.hovered && {backgroundColor: '#1E6545'}, state.pressed && styles.btnPress]}>
                                  <Text style={styles.uploadBtnText}>Upload</Text>
                                </Pressable>
                              </View>
                            )}
                            {selectedRole === 'field' && (
                              <>
                                <View style={styles.uploadRow}>
                                  <View style={styles.uploadInfo}><Text style={styles.docIcon}>📄</Text><Text style={styles.uploadText}>Upload Photo ID</Text></View>
                                  <Pressable style={(state: any) => [styles.uploadBtnGreen, styles.animated, state.hovered && {backgroundColor: '#1E6545'}, state.pressed && styles.btnPress]}>
                                    <Text style={styles.uploadBtnText}>Upload</Text>
                                  </Pressable>
                                </View>
                                <View style={styles.uploadRow}>
                                  <View style={styles.uploadInfo}><Text style={styles.docIcon}>📄</Text><Text style={styles.uploadText}>Upload Background Check Auth.</Text></View>
                                  <Pressable style={(state: any) => [styles.uploadBtnGreen, styles.animated, state.hovered && {backgroundColor: '#1E6545'}, state.pressed && styles.btnPress]}>
                                    <Text style={styles.uploadBtnText}>Upload</Text>
                                  </Pressable>
                                </View>
                              </>
                            )}
                          </View>
                          
                          {/* VETTING CHECKBOXES */}
                          <Text style={[styles.fieldLabel, { fontSize: 14, marginTop: 15, marginBottom: 8 }]}>Checkbox for Vetting:</Text>
                          <View style={styles.checkboxGroup}>
                            <Pressable onPress={() => toggleCheckbox('background')}>
                              {({ hovered }: any) => (
                                <View style={[styles.checkboxRowSmall, styles.animated, hovered && { opacity: 0.8 }]}>
                                  <View style={[styles.checkboxSquareSmall, styles.animated, checkboxes.background && styles.checkboxSquareActive, showErrors && !checkboxes.background && styles.errorBorder, hovered && !checkboxes.background && { borderColor: '#2D8A61' }]}>
                                    {checkboxes.background && <Text style={styles.checkmarkSmall}>✓</Text>}
                                  </View>
                                  <Text style={[styles.checkboxLabelSmall, styles.animated, showErrors && !checkboxes.background && {color: '#E53E3E'}, hovered && !checkboxes.background && { color: '#2D8A61' }]}>I agree to a background check.</Text>
                                </View>
                              )}
                            </Pressable>

                            <Pressable onPress={() => toggleCheckbox('documents')}>
                              {({ hovered }: any) => (
                                <View style={[styles.checkboxRowSmall, styles.animated, hovered && { opacity: 0.8 }]}>
                                  <View style={[styles.checkboxSquareSmall, styles.animated, checkboxes.documents && styles.checkboxSquareActive, showErrors && !checkboxes.documents && styles.errorBorder, hovered && !checkboxes.documents && { borderColor: '#2D8A61' }]}>
                                    {checkboxes.documents && <Text style={styles.checkmarkSmall}>✓</Text>}
                                  </View>
                                  <Text style={[styles.checkboxLabelSmall, styles.animated, showErrors && !checkboxes.documents && {color: '#E53E3E'}, hovered && !checkboxes.documents && { color: '#2D8A61' }]}>I have uploaded all required documents.</Text>
                                </View>
                              )}
                            </Pressable>

                            <Pressable onPress={() => toggleCheckbox('age')}>
                              {({ hovered }: any) => (
                                <View style={[styles.checkboxRowSmall, styles.animated, hovered && { opacity: 0.8 }]}>
                                  <View style={[styles.checkboxSquareSmall, styles.animated, checkboxes.age && styles.checkboxSquareActive, showErrors && !checkboxes.age && styles.errorBorder, hovered && !checkboxes.age && { borderColor: '#2D8A61' }]}>
                                    {checkboxes.age && <Text style={styles.checkmarkSmall}>✓</Text>}
                                  </View>
                                  <Text style={[styles.checkboxLabelSmall, styles.animated, showErrors && !checkboxes.age && {color: '#E53E3E'}, hovered && !checkboxes.age && { color: '#2D8A61' }]}>I confirm I am over 18 years old.</Text>
                                </View>
                              )}
                            </Pressable>
                          </View>
                        </View>
                      )}

                    </ScrollView>
                  )}
                </View>

                {/* FIXED SUBMIT BUTTON AT BOTTOM */}
                <View style={{ paddingTop: 15 }}>
                  {showErrors && (!isSiteValid || !isTimeValid || !isItemsValid || !isVolunteerValid) && (
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
          </ScrollView>
        </View>
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

  pageBody: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden' } as any,
  bgImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  bgOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0F172A', opacity: 0.75 },

  contentWrapper: { backgroundColor: '#FFFFFF', borderRadius: 24, paddingHorizontal: 40, paddingTop: 40, width: '98%', maxWidth: 1600, height: '95%', minHeight: 650, maxHeight: 1000, display: 'flex', flexDirection: 'column', boxShadow: '0px 15px 45px rgba(0, 0, 0, 0.4)', zIndex: 2, overflow: 'hidden' } as any,
  headerBannerGreen: { backgroundColor: '#2D8A61', borderRadius: 12, paddingVertical: 18, alignItems: 'center', marginBottom: 15 },
  bannerText: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold', letterSpacing: 0.5 },

  errorBorder: { borderColor: '#E53E3E', borderWidth: 1, backgroundColor: '#FFF5F5' },
  errorText: { color: '#E53E3E', fontSize: 12, marginTop: 4, fontWeight: 'bold' },

  // ANIMATIONS
  animated: { transition: 'all 0.2s ease-in-out' } as any,
  btnHoverGreen: { transform: [{ scale: 1.02 }], opacity: 0.95, boxShadow: '0px 4px 15px rgba(45, 138, 97, 0.3)' } as any,
  btnPress: { transform: [{ scale: 0.98 }], opacity: 0.8 } as any,
  roleCardHoverGreen: { borderColor: '#2D8A61', backgroundColor: '#F0FDF4', transform: [{ translateY: -2 }], boxShadow: '0px 6px 15px rgba(0,0,0,0.06)' } as any,

  formGrid: { flexDirection: 'row', gap: 60, flex: 1 } as any,
  formColumn: { flex: 1 },
  fieldLabel: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#111' },

  pickerBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#E5E7EB', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#CCCCCC' } as any,
  pickerText: { fontSize: 15, color: '#111' },
  pickerArrow: { fontSize: 14, fontWeight: 'bold', color: '#555' },
  dropdownMenu: { position: 'absolute', top: 55, left: 0, right: 0, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#CCCCCC', overflow: 'hidden', zIndex: 1000, boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' } as any,
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#EEEEEE' },
  dropdownItemText: { fontSize: 14, color: '#333' },

  itemHeaders: { flexDirection: 'row', gap: 10, marginBottom: 5, paddingHorizontal: 5 } as any,
  qtyHeader: { width: 55, textAlign: 'center', fontSize: 13, fontWeight: 'bold', color: '#555' },
  nameHeader: { flex: 1, fontSize: 13, fontWeight: 'bold', color: '#555' },
  itemsOuterFrame: { flex: 1, borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 10, padding: 12, backgroundColor: '#FAFAFA' },
  itemsScroll: { flex: 1 },
  itemRow: { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'center' } as any,
  qtyBox: { width: 55, backgroundColor: '#E5E7EB', paddingVertical: 10, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: '#CCCCCC', textAlign: 'center', color: '#000', fontSize: 14 } as any,
  nameBox: { flex: 1, backgroundColor: '#E5E7EB', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, borderWidth: 1, borderColor: '#CCCCCC', color: '#000', fontSize: 14 } as any,
  
  removeBtn: { width: 35, height: 35, backgroundColor: '#FFEDED', borderRadius: 8, borderWidth: 1, borderColor: '#FFB3B3', alignItems: 'center', justifyContent: 'center' },
  removeBtnText: { color: '#CC0000', fontSize: 16, fontWeight: 'bold' },
  addItemBtn: { alignSelf: 'flex-start', marginTop: 5, backgroundColor: '#E5E7EB', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#CCCCCC' } as any,
  addItemBtnText: { fontSize: 12, fontWeight: 'bold', color: '#333' },

  toggleRow: { flexDirection: 'row', gap: 15 } as any,
  toggleBtn: { flex: 1, backgroundColor: '#E5E7EB', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#CCCCCC', alignItems: 'center' } as any,
  toggleBtnActiveGreen: { backgroundColor: '#D1E8D1', borderColor: '#2D8A61' },
  toggleText: { fontWeight: 'bold', fontSize: 14, color: '#444' },
  toggleTextActiveGreen: { color: '#2D8A61' },

  rolesContainer: { marginTop: 5 },
  roleCard: { flexDirection: 'row', backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#CCCCCC', padding: 10, borderRadius: 10, marginBottom: 8, alignItems: 'center' } as any,
  roleCardActiveGreen: { backgroundColor: '#D1E8D1', borderColor: '#2D8A61' },
  roleIconBox: { width: 50, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  roleIcon: { width: 28, height: 28, marginBottom: 4 },
  roleIconLabel: { fontSize: 10, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  roleTextContainer: { flex: 1 },
  roleTitle: { fontSize: 14, fontWeight: 'bold', color: '#111', marginBottom: 2 },
  roleDesc: { fontSize: 11, color: '#444', lineHeight: 14 },

  documentsContainer: { flexDirection: 'column', gap: 8 } as any,
  uploadRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#AAA', borderStyle: 'dashed', borderRadius: 8, padding: 8, backgroundColor: '#FAFAFA' } as any,
  uploadInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 } as any,
  docIcon: { fontSize: 16, marginRight: 8 },
  uploadText: { fontSize: 11, color: '#555', flex: 1 },
  uploadBtnGreen: { backgroundColor: '#2D8A61', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  uploadBtnText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },

  checkboxGroup: { flexDirection: 'column', gap: 8 },
  checkboxRowSmall: { flexDirection: 'row', alignItems: 'flex-start' } as any,
  checkboxSquareSmall: { width: 16, height: 16, borderWidth: 1, borderColor: '#111', marginRight: 10, alignItems: 'center', justifyContent: 'center', marginTop: 2, backgroundColor: '#FFF' },
  checkboxSquareActive: { backgroundColor: '#111' },
  checkmarkSmall: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  checkboxLabelSmall: { fontSize: 12, color: '#333', flex: 1, lineHeight: 18 },

  submitPledgeBtn: { backgroundColor: '#2D8A61', paddingVertical: 18, borderRadius: 12, alignItems: 'center' },
  submitBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },

  // =========================================
  // MODAL STYLES
  // =========================================
  modalOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)', justifyContent: 'center', alignItems: 'center', zIndex: 9999,
  } as any,
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 35, width: '90%', maxWidth: 550, boxShadow: '0px 10px 40px rgba(0,0,0,0.3)' } as any,
  modalTitle: { fontSize: 26, fontWeight: 'bold', color: '#111', marginBottom: 20, textAlign: 'center' },
  summaryBox: { backgroundColor: '#F7F7F7', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 25 },
  summaryLabel: { fontSize: 13, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase', marginTop: 15, marginBottom: 4 },
  summaryValue: { fontSize: 16, color: '#0F172A', fontWeight: '500' },
  checkboxRowModal: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, paddingHorizontal: 10 } as any,
  checkbox: { width: 24, height: 24, borderWidth: 2, borderColor: '#2D8A61', borderRadius: 6, marginRight: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  checkboxChecked: { backgroundColor: '#2D8A61' },
  checkmark: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  checkboxText: { flex: 1, fontSize: 14, color: '#334155', lineHeight: 20 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 } as any,
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#E2E8F0', alignItems: 'center' },
  cancelBtnText: { color: '#475569', fontSize: 16, fontWeight: 'bold' },
  confirmBtn: { flex: 2, paddingVertical: 14, borderRadius: 12, backgroundColor: '#2D8A61', alignItems: 'center' },
  confirmBtnDisabled: { backgroundColor: '#94A3B8' },
  confirmBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});