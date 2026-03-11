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
    { id: 'medic', title: 'Medic', desc: 'Primary medical care & triage. Valid Medical/Nursing License required. Basic first aid & CPR knowledge.', icon: '/icon-medic.png' },
    { id: 'logistics', title: 'Logistics', desc: "Manage supply distribution & transport. Valid Pro Driver's License required. Must lift 25+ lbs.", icon: '/icon-logistics.png' },
    { id: 'field', title: 'Field', desc: 'Manage crowd flow, community outreach & data entry. Strong communication skills needed.', icon: '/icon-field.png' }
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
  const isVolunteerValid = volunteerChoice === 'no' || (volunteerChoice === 'yes' && selectedRole !== null);

  // Triggered when "Submit Pledge Donation" is clicked
  const handleInitialSubmit = () => {
    if (isSiteValid && isTimeValid && isItemsValid && isVolunteerValid) {
      setIsConfirmed(false); // Reset checkbox
      setShowModal(true);    // Open confirmation modal
    } else {
      setShowErrors(true);   // Show red borders
    }
  };

  // Triggered when "Confirm Donation" inside the modal is clicked
  const handleFinalConfirm = () => {
    if (isConfirmed) {
      router.push('/'); // Or route to a success/thank you page
    }
  };

  return (
    <View style={styles.container}>
      
      {/* ========================================= */}
      {/* CONFIRMATION MODAL OVERLAY                  */}
      {/* ========================================= */}
      {showModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Your Pledge</Text>
            
            {/* Details Summary Box */}
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
                {volunteerChoice === 'yes' 
                  ? `Yes (${volunteerRoles.find(r => r.id === selectedRole)?.title} Role)` 
                  : 'No'}
              </Text>
            </View>

            {/* Confirmation Checkbox */}
            <Pressable style={styles.checkboxRow} onPress={() => setIsConfirmed(!isConfirmed)}>
              <View style={[styles.checkbox, isConfirmed && styles.checkboxChecked]}>
                {isConfirmed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxText}>I confirm that all details provided are correct and I commit to this pledge.</Text>
            </Pressable>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelBtnText}>Back</Text>
              </Pressable>
              <Pressable 
                style={[styles.confirmBtn, !isConfirmed && styles.confirmBtnDisabled]} 
                onPress={handleFinalConfirm}
                disabled={!isConfirmed}
              >
                <Text style={styles.confirmBtnText}>Confirm Donation</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}


      {/* NAVIGATION BAR */}
      <View style={styles.navBar}>
        <View style={styles.navLeft}>
          <Image source={{ uri: '/logo_b.png' }} style={styles.logoImage} resizeMode="contain" />
          <View style={styles.navLinks}>
            <Pressable onPress={() => router.push('/')}><Text style={styles.navLink}>Home</Text></Pressable>
            <Pressable onPress={() => router.push('/about')}><Text style={styles.navLink}>About Us</Text></Pressable>
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
          <View style={styles.headerBanner}>
            <Text style={styles.bannerText}>Pledge Donation</Text>
          </View>

          <View style={styles.formGrid}>
            
            {/* LEFT COLUMN: Site & Time */}
            <View style={[styles.formColumn, { zIndex: 50 }]}>
              <Text style={styles.fieldLabel}>Select Site Location</Text>
              <View style={{ position: 'relative', zIndex: 100 }}>
                <Pressable 
                  style={[styles.pickerBox, showErrors && !isSiteValid && styles.errorBorder]} 
                  onPress={() => {
                    setIsSiteDropdownOpen(!isSiteDropdownOpen);
                    setIsTimeDropdownOpen(false);
                  }}
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
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedSite(building);
                            setIsSiteDropdownOpen(false);
                            if(showErrors) setShowErrors(false);
                          }}
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
                  style={[styles.pickerBox, showErrors && !isTimeValid && styles.errorBorder]} 
                  onPress={() => {
                    setIsTimeDropdownOpen(!isTimeDropdownOpen);
                    setIsSiteDropdownOpen(false);
                  }}
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
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedTime(time);
                            setIsTimeDropdownOpen(false);
                          }}
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
            <View style={[styles.formColumn, { flex: 1.5, zIndex: 10 }]}>
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
                          style={[styles.qtyBox, showInputError && styles.errorBorder]} 
                          value={item.qty} 
                          onChangeText={(text) => updateItem(index, 'qty', text)}
                          placeholder="No."
                          placeholderTextColor="#999"
                          keyboardType="numeric"
                        />
                        <TextInput 
                          style={[styles.nameBox, showInputError && styles.errorBorder]} 
                          value={item.name} 
                          onChangeText={(text) => updateItem(index, 'name', text)}
                          placeholder='"Item Name"'
                          placeholderTextColor="#999"
                        />
                        <Pressable style={styles.removeBtn} onPress={() => removeItem(index)}>
                          <Text style={styles.removeBtnText}>✕</Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
              {showErrors && !isItemsValid && <Text style={styles.errorText}>● Input Details is required.</Text>}
              <Pressable style={styles.addItemBtn} onPress={addItem}><Text style={styles.addItemBtnText}>+ ADD ITEM</Text></Pressable>
            </View>

            {/* RIGHT COLUMN: Volunteer Roles & Submit */}
            <View style={[styles.formColumn, { zIndex: 10, display: 'flex', flexDirection: 'column' }]}>
              <Text style={styles.fieldLabel}>Do You Want to Volunteer ?</Text>
              <View style={styles.toggleRow}>
                <Pressable 
                  style={[styles.toggleBtn, volunteerChoice === 'yes' && styles.toggleBtnActive, showErrors && volunteerChoice === null && styles.errorBorder]}
                  onPress={() => setVolunteerChoice('yes')}
                >
                  <Text style={[styles.toggleText, volunteerChoice === 'yes' && styles.toggleTextActive]}>Yes, view roles</Text>
                </Pressable>
                
                <Pressable 
                  style={[styles.toggleBtn, volunteerChoice === 'no' && styles.toggleBtnActive, showErrors && volunteerChoice === null && styles.errorBorder]}
                  onPress={() => {
                    setVolunteerChoice('no');
                    setSelectedRole(null);
                  }}
                >
                  <Text style={[styles.toggleText, volunteerChoice === 'no' && styles.toggleTextActive]}>No</Text>
                </Pressable>
              </View>
              {showErrors && volunteerChoice === null && <Text style={styles.errorText}>● Please select an option.</Text>}

              {/* DYNAMIC ROLES SECTION */}
              {volunteerChoice === 'yes' && (
                <View style={styles.rolesContainer}>
                  {volunteerRoles.map(role => (
                    <Pressable 
                      key={role.id}
                      style={[styles.roleCard, selectedRole === role.id && styles.roleCardActive, showErrors && volunteerChoice === 'yes' && selectedRole === null && styles.errorBorder]}
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
              )}

              <View style={{ flex: 1 }} />

              {showErrors && (!isSiteValid || !isTimeValid || !isItemsValid || !isVolunteerValid) && (
                <Text style={[styles.errorText, { textAlign: 'center', marginBottom: 10, fontSize: 13 }]}>
                  ● Please address the required fields highlighted above.
                </Text>
              )}

              <Pressable style={styles.submitPledgeBtn} onPress={handleInitialSubmit}>
                <Text style={styles.submitBtnText}>Submit Pledge Donation</Text>
              </Pressable>
            </View>

          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', height: '100vh', position: 'relative' } as any,
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

  pageBody: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' } as any,
  bgImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  bgOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0F172A', opacity: 0.75 },

  contentCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 30, width: '95%', maxWidth: 1250, minHeight: '80%', boxShadow: '0px 15px 45px rgba(0, 0, 0, 0.4)', zIndex: 2 } as any,
  headerBanner: { backgroundColor: '#2D8A61', borderRadius: 15, paddingVertical: 15, alignItems: 'center', marginBottom: 30 },
  bannerText: { color: '#FFFFFF', fontSize: 32, fontWeight: 'bold' },

  formGrid: { flexDirection: 'row', gap: 40, flex: 1 } as any,
  formColumn: { flex: 1 },
  fieldLabel: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#111' },

  errorBorder: { borderColor: '#E53E3E', borderWidth: 1, backgroundColor: '#FFF5F5' },
  errorText: { color: '#E53E3E', fontSize: 12, marginTop: 6, fontWeight: '500' },
  
  pickerBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#E5E7EB', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#CCCCCC' } as any,
  pickerText: { fontSize: 15, color: '#111' },
  pickerArrow: { fontSize: 14, fontWeight: 'bold', color: '#555' },
  dropdownMenu: { position: 'absolute', top: 55, left: 0, right: 0, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#CCCCCC', overflow: 'hidden', zIndex: 1000, boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' } as any,
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#EEEEEE' },
  dropdownItemText: { fontSize: 14, color: '#333' },

  itemHeaders: { flexDirection: 'row', gap: 10, marginBottom: 5, paddingHorizontal: 5 } as any,
  qtyHeader: { width: 55, textAlign: 'center', fontSize: 13, fontWeight: 'bold', color: '#555' },
  nameHeader: { flex: 1, fontSize: 13, fontWeight: 'bold', color: '#555' },
  itemsOuterFrame: { flex: 1, maxHeight: 350, borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 10, padding: 10, backgroundColor: '#FAFAFA' },
  itemsScroll: { flex: 1 },
  itemRow: { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'center' } as any,
  qtyBox: { width: 55, backgroundColor: '#E5E7EB', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#CCCCCC', textAlign: 'center', color: '#000' } as any,
  nameBox: { flex: 1, backgroundColor: '#E5E7EB', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#CCCCCC', color: '#000' } as any,
  
  removeBtn: { width: 35, height: 35, backgroundColor: '#FFEDED', borderRadius: 8, borderWidth: 1, borderColor: '#FFB3B3', alignItems: 'center', justifyContent: 'center' },
  removeBtnText: { color: '#CC0000', fontSize: 16, fontWeight: 'bold' },
  addItemBtn: { alignSelf: 'flex-end', marginTop: 10, backgroundColor: '#E5E7EB', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#CCCCCC' } as any,
  addItemBtnText: { fontSize: 12, fontWeight: 'bold', color: '#333' },

  toggleRow: { flexDirection: 'row', gap: 15 } as any,
  toggleBtn: { flex: 1, backgroundColor: '#E5E7EB', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#CCCCCC', alignItems: 'center' } as any,
  toggleBtnActive: { backgroundColor: '#D1E8D1', borderColor: '#2D8A61' },
  toggleText: { fontWeight: 'bold', fontSize: 14, color: '#444' },
  toggleTextActive: { color: '#2D8A61' },

  rolesContainer: { marginTop: 15 },
  roleCard: { flexDirection: 'row', backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#CCCCCC', padding: 12, borderRadius: 10, marginBottom: 10, alignItems: 'center' } as any,
  roleCardActive: { backgroundColor: '#D1E8D1', borderColor: '#2D8A61' },
  roleIconBox: { width: 55, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  roleIcon: { width: 32, height: 32, marginBottom: 4 },
  roleIconLabel: { fontSize: 11, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  roleTextContainer: { flex: 1 },
  roleTitle: { fontSize: 15, fontWeight: 'bold', color: '#111', marginBottom: 2 },
  roleDesc: { fontSize: 12, color: '#444', lineHeight: 16 },

  submitPledgeBtn: { backgroundColor: '#2D8A61', paddingVertical: 15, borderRadius: 15, alignItems: 'center', marginTop: 15 },
  submitBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },

  // =========================================
  // MODAL STYLES
  // =========================================
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Extremely high z-index to cover everything including navbar
  } as any,
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 35,
    width: '90%',
    maxWidth: 550,
    boxShadow: '0px 10px 40px rgba(0,0,0,0.3)',
  } as any,
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryBox: {
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 25,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
    marginTop: 15,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  } as any,
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#2D8A61',
    borderRadius: 6,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#2D8A61',
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  } as any,
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#2D8A61',
    alignItems: 'center',
  },
  confirmBtnDisabled: {
    backgroundColor: '#94A3B8', // Greyed out when not confirmed
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});