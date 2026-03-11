'use client';

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'next/navigation';

export default function VolunteerPage() {
  const router = useRouter();

  // --- STEP STATE ---
  const [step, setStep] = useState(1); // 1 = Reading, 2 = Form

  // --- FORM STATES (Step 2) ---
  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState('Select Site Location');

  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('Select Time Slot');

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isDonor, setIsDonor] = useState<boolean | null>(null);

  const [checkboxes, setCheckboxes] = useState({
    background: false,
    documents: false,
    age: false,
  });

  const [showErrors, setShowErrors] = useState(false);

  // --- DATA ---
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

  // --- VALIDATION LOGIC ---
  const isSiteValid = selectedSite !== 'Select Site Location';
  const isTimeValid = selectedTime !== 'Select Time Slot';
  const isRoleValid = selectedRole !== null;
  const isDonorValid = isDonor !== null;
  const isCheckboxesValid = checkboxes.background && checkboxes.documents && checkboxes.age;

  const handleNextStep = () => {
    if (isSiteValid && isTimeValid && isRoleValid && isDonorValid && isCheckboxesValid) {
      router.push('/');
    } else {
      setShowErrors(true);
    }
  };

  const toggleCheckbox = (key: keyof typeof checkboxes) => {
    setCheckboxes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={styles.container}>
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

      {/* MASTER PAGE SCROLL */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        
        {/* MAIN BODY AREA WITH IMAGE BACKGROUND */}
        <View style={styles.pageBody}>
          <Image source={{ uri: '/hero-bg.png' }} style={styles.bgImage} resizeMode="cover" />
          <View style={styles.bgOverlay} />

          <View style={styles.contentWrapper}>
            
            <View style={styles.headerBanner}>
              <Text style={styles.bannerText}>Volunteer Registration</Text>
            </View>

            <View style={{ flex: 1 }}>
              
              {/* ========================================================= */}
              {/* STEP 1: DETAILED ROLE REQUIREMENTS                        */}
              {/* ========================================================= */}
              {step === 1 && (
                <View style={styles.mainGrid}>
                  <View style={styles.leftColumn}>
                    <View style={{ flex: 1 }} /> 
                    <Pressable style={styles.doneBtn} onPress={() => setStep(2)}>
                      <Text style={styles.doneBtnText}>Done Reading</Text>
                    </Pressable>
                  </View>

                  <View style={styles.rightColumn}>
                    <View style={styles.cardOutline}>
                      <Text style={styles.cardTitle}>Registration Status Tracker</Text>
                      <View style={styles.progressRow}>
                        <View style={[styles.progressBar, styles.progressActive]} />
                        <View style={styles.progressBar} />
                        <View style={styles.progressBar} />
                        <View style={styles.progressBar} />
                      </View>
                      <View style={styles.progressLabelsRow}>
                        <Text style={[styles.progressLabel, styles.labelActive]}>[1] Personal Info & Role Selection:{'\n'}(Current Step)</Text>
                        <Text style={styles.progressLabel}>[2] Document Upload:{'\n'}(Upcoming)</Text>
                        <Text style={styles.progressLabel}>[3] General Screening Questionnaire:{'\n'}(Upcoming)</Text>
                        <Text style={styles.progressLabel}>[4] Admin Review & Badge Issuance:{'\n'}(Upcoming)</Text>
                      </View>
                    </View>

                    <View style={styles.cardOutline}>
                      <Text style={styles.cardTitle}>Detailed Role Requirements</Text>
                      <Text style={styles.subTitle}>1. Common Requirements for All Roles</Text>
                      <Text style={styles.descText}>General Screening and on-site briefing are mandatory before your first shift. Final documentation will be verified on-site.</Text>
                      <View style={styles.bulletList}>
                        <Text style={styles.bulletItem}>• Complete online General Screening</Text>
                        <Text style={styles.bulletItem}>• Mandatory on-site volunteer briefing</Text>
                      </View>

                      <Text style={[styles.subTitle, { marginTop: 25 }]}>2. Specific Role Requirements</Text>
                      <View style={styles.roleList}>
                        <View style={styles.roleRow}>
                          <View style={styles.roleIconBox}><Image source={{ uri: '/icon-medic.png' }} style={styles.roleIcon} resizeMode="contain" /><Text style={styles.roleIconLabel}>Medic</Text></View>
                          <View style={styles.roleTextContent}><Text style={styles.roleName}>Medic</Text><Text style={styles.descText}>Provide primary medical care, triage, and support to disaster-affected individuals. Valid Medical or Nursing License (mandatory) - please upload this document with your profile during registration. Knowledge of basic first aid, CPR. Bring personal stethoscope/BP cuff if available.</Text></View>
                        </View>
                        <View style={styles.roleRow}>
                          <View style={styles.roleIconBox}><Image source={{ uri: '/icon-logistics.png' }} style={styles.roleIcon} resizeMode="contain" /><Text style={styles.roleIconLabel}>Logistics</Text></View>
                          <View style={styles.roleTextContent}><Text style={styles.roleName}>Logistics</Text><Text style={styles.descText}>Manage and track supply distribution, move resources, support transport. Valid Professional Driver's License (mandatory for vehicle operators). Physically capable of lifting 25+ lbs. Complete a logistics safety briefing.</Text></View>
                        </View>
                        <View style={styles.roleRow}>
                          <View style={styles.roleIconBox}><Image source={{ uri: '/icon-field.png' }} style={styles.roleIcon} resizeMode="contain" /><Text style={styles.roleIconLabel}>Field</Text></View>
                          <View style={styles.roleTextContent}><Text style={styles.roleName}>Field</Text><Text style={styles.descText}>Manage crowd flow, assist with group needs, coordinate community outreach, perform data entry. Strong communication and interpersonal skills. Ability to handle large groups. Basic computer literacy for data roles. Complete a volunteer safety briefing.</Text></View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* ========================================================= */}
              {/* STEP 2: REGISTRATION FORM                                   */}
              {/* ========================================================= */}
              {step === 2 && (
                <View style={styles.mainGridStep2}>
                  
                  {/* LEFT COLUMN: Form Inputs */}
                  <View style={[styles.leftColumnStep2, { zIndex: 50 }]}>
                    
                    {/* SITE DROPDOWN */}
                    <Text style={styles.fieldLabel}>Select Site Location</Text>
                    <View style={{ position: 'relative', zIndex: 100, marginBottom: 25 }}>
                      <Pressable 
                        style={[styles.pickerBox, showErrors && !isSiteValid && styles.errorBorder]} 
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
                              <Pressable key={index} style={styles.dropdownItem} onPress={() => { setSelectedSite(building); setIsSiteDropdownOpen(false); }}>
                                <Text style={styles.dropdownItemText}>{building}</Text>
                              </Pressable>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>

                    {/* TIME SLOT DROPDOWN */}
                    <Text style={styles.fieldLabel}>Select Time Slot</Text>
                    <View style={{ position: 'relative', zIndex: 90, marginBottom: 25 }}>
                      <Pressable 
                        style={[styles.pickerBox, showErrors && !isTimeValid && styles.errorBorder]} 
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
                              <Pressable key={index} style={styles.dropdownItem} onPress={() => { setSelectedTime(time); setIsTimeDropdownOpen(false); }}>
                                <Text style={styles.dropdownItemText}>{time}</Text>
                              </Pressable>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>

                    {/* ROLE SELECTION */}
                    <Text style={styles.fieldLabel}>Select Your Role</Text>
                    <View style={styles.roleSelectionRow}>
                      <Pressable style={[styles.roleSelectCard, selectedRole === 'medic' && styles.roleSelectActive, showErrors && !isRoleValid && styles.errorBorder]} onPress={() => setSelectedRole('medic')}>
                        <Image source={{ uri: '/icon-medic.png' }} style={styles.roleSelectIcon} resizeMode="contain" />
                        <Text style={[styles.roleSelectText, selectedRole === 'medic' && styles.roleSelectTextActive]}>Medic</Text>
                      </Pressable>
                      <Pressable style={[styles.roleSelectCard, selectedRole === 'logistics' && styles.roleSelectActive, showErrors && !isRoleValid && styles.errorBorder]} onPress={() => setSelectedRole('logistics')}>
                        <Image source={{ uri: '/icon-logistics.png' }} style={styles.roleSelectIcon} resizeMode="contain" />
                        <Text style={[styles.roleSelectText, selectedRole === 'logistics' && styles.roleSelectTextActive]}>Logistics</Text>
                      </Pressable>
                      <Pressable style={[styles.roleSelectCard, selectedRole === 'field' && styles.roleSelectActive, showErrors && !isRoleValid && styles.errorBorder]} onPress={() => setSelectedRole('field')}>
                        <Image source={{ uri: '/icon-field.png' }} style={styles.roleSelectIcon} resizeMode="contain" />
                        <Text style={[styles.roleSelectText, selectedRole === 'field' && styles.roleSelectTextActive]}>Field</Text>
                      </Pressable>
                    </View>
                    {showErrors && !isRoleValid && <Text style={[styles.errorText, {marginTop: 0, marginBottom: 15}]}>● Role selection is required.</Text>}

                    {/* DYNAMIC DOCUMENTS */}
                    <Text style={[styles.fieldLabel, { marginTop: 10 }]}>Required Document:</Text>
                    <View style={styles.documentsContainer}>
                      {selectedRole === null && (
                         <Text style={{color: '#888', fontStyle: 'italic', fontSize: 13}}>Please select a role above to view required documents.</Text>
                      )}
                      {selectedRole === 'medic' && (
                        <>
                          <View style={styles.uploadRow}>
                            <View style={styles.uploadInfo}><Text style={styles.docIcon}>📄</Text><Text style={styles.uploadText}>Upload Medical License (e.g., MD, RN)</Text></View>
                            <Pressable style={styles.uploadBtn}><Text style={styles.uploadBtnText}>Upload</Text></Pressable>
                          </View>
                          <View style={styles.uploadRow}>
                            <View style={styles.uploadInfo}><Text style={styles.docIcon}>📄</Text><Text style={styles.uploadText}>Upload BLS/CPR Certification</Text></View>
                            <Pressable style={styles.uploadBtn}><Text style={styles.uploadBtnText}>Upload</Text></Pressable>
                          </View>
                        </>
                      )}
                      {selectedRole === 'logistics' && (
                        <View style={styles.uploadRow}>
                          <View style={styles.uploadInfo}><Text style={styles.docIcon}>📄</Text><Text style={styles.uploadText}>Upload Valid Driver's License</Text></View>
                          <Pressable style={styles.uploadBtn}><Text style={styles.uploadBtnText}>Upload</Text></Pressable>
                        </View>
                      )}
                      {selectedRole === 'field' && (
                        <>
                          <View style={styles.uploadRow}>
                            <View style={styles.uploadInfo}><Text style={styles.docIcon}>📄</Text><Text style={styles.uploadText}>Upload Photo ID (For badge Creation)</Text></View>
                            <Pressable style={styles.uploadBtn}><Text style={styles.uploadBtnText}>Upload</Text></Pressable>
                          </View>
                          <View style={styles.uploadRow}>
                            <View style={styles.uploadInfo}><Text style={styles.docIcon}>📄</Text><Text style={styles.uploadText}>Upload Background Check Auth.</Text></View>
                            <Pressable style={styles.uploadBtn}><Text style={styles.uploadBtnText}>Upload</Text></Pressable>
                          </View>
                        </>
                      )}
                    </View>

                  </View>

                  {/* RIGHT COLUMN: Checkers & Vetting */}
                  <View style={[styles.rightColumnStep2, { zIndex: 10 }]}>
                    
                    {/* TRACKER */}
                    <View style={[styles.cardOutline, { marginBottom: 20 }]}>
                      <Text style={styles.cardTitle}>Registration Status Tracker</Text>
                      <View style={styles.progressRow}>
                        <View style={[styles.progressBar, styles.progressCompleted]} />
                        <View style={[styles.progressBar, styles.progressActive]} />
                        <View style={styles.progressBar} />
                        <View style={styles.progressBar} />
                      </View>
                      <View style={styles.progressLabelsRow}>
                        <Text style={styles.progressLabel}>[1] View Detailed Role Requirements:{'\n'}(Completed)</Text>
                        <Text style={[styles.progressLabel, styles.labelActive]}>[2] Role Selection & Document Upload:{'\n'}(Current Step)</Text>
                        <Text style={styles.progressLabel}>[3] General Screening Questionnaire:{'\n'}(Upcoming)</Text>
                        <Text style={styles.progressLabel}>[4] Admin Review & Badge Issuance:{'\n'}(Upcoming)</Text>
                      </View>
                    </View>

                    {/* VETTING CARD */}
                    <View style={styles.cardOutline}>
                      
                      {/* Fixed Layout: Title on the left, Legend absolute positioned on the right */}
                      <Text style={[styles.cardTitle, { marginBottom: 15 }]}>Donor and Capacity Checker</Text>
                      
                      <View style={styles.statusLegendBox}>
                        <Text style={styles.legendTitle}>Statuses:</Text>
                        <View style={styles.legendRow}><View style={[styles.badge, styles.badgeHigh]}><Text style={styles.badgeText}>High</Text></View><Text style={styles.legendDesc}>Urgent for Volunteers</Text></View>
                        <View style={styles.legendRow}><View style={[styles.badge, styles.badgeModerate]}><Text style={styles.badgeText}>Moderate</Text></View><Text style={styles.legendDesc}>Fair but not at capacity</Text></View>
                        <View style={styles.legendRow}><View style={[styles.badge, styles.badgeClosed]}><Text style={styles.badgeText}>Closed</Text></View><Text style={styles.legendDesc}>At full capacity</Text></View>
                      </View>

                      <View style={styles.donorQuestions}>
                        <View style={styles.donorToggleRow}>
                          <Text style={styles.donorLabel}>Are You a Donor?</Text>
                          <View style={[styles.pillToggle, showErrors && !isDonorValid && styles.errorBorder]}>
                            <Pressable style={[styles.pillOption, isDonor === true && styles.pillOptionActive]} onPress={() => setIsDonor(true)}><Text style={[styles.pillText, isDonor === true && styles.pillTextActive]}>YES</Text></Pressable>
                            <Pressable style={[styles.pillOption, isDonor === false && styles.pillOptionActive]} onPress={() => setIsDonor(false)}><Text style={[styles.pillText, isDonor === false && styles.pillTextActive]}>NO</Text></Pressable>
                          </View>
                        </View>

                        <View style={styles.capacityRow}>
                          <Text style={styles.donorLabel}>Real-Time Capacity:</Text>
                          <View style={styles.siteBadge}><Text style={styles.siteBadgeText}>{selectedSite !== 'Select Site Location' ? selectedSite : 'Site A: Frassati Building'}</Text></View>
                          <Text style={{marginHorizontal: 8}}>-</Text>
                          <View style={[styles.badge, styles.badgeModerate]}><Text style={styles.badgeText}>Moderate</Text></View>
                        </View>
                      </View>

                      {/* Checkboxes */}
                      <Text style={[styles.cardTitle, { fontSize: 18, marginTop: 30, marginBottom: 15 }]}>Checkbox for Vetting</Text>
                      <View style={styles.checkboxGroup}>
                        <Pressable style={styles.checkboxRow} onPress={() => toggleCheckbox('background')}>
                          <View style={[styles.checkboxSquare, checkboxes.background && styles.checkboxSquareActive, showErrors && !checkboxes.background && styles.errorBorder]}>
                            {checkboxes.background && <Text style={styles.checkmark}>✓</Text>}
                          </View>
                          <Text style={[styles.checkboxLabel, showErrors && !checkboxes.background && {color: '#E53E3E'}]}>I agree to a background check (required for Selected roles).</Text>
                        </Pressable>

                        <Pressable style={styles.checkboxRow} onPress={() => toggleCheckbox('documents')}>
                          <View style={[styles.checkboxSquare, checkboxes.documents && styles.checkboxSquareActive, showErrors && !checkboxes.documents && styles.errorBorder]}>
                            {checkboxes.documents && <Text style={styles.checkmark}>✓</Text>}
                          </View>
                          <Text style={[styles.checkboxLabel, showErrors && !checkboxes.documents && {color: '#E53E3E'}]}>I have uploaded all required documents for my selected role.</Text>
                        </Pressable>

                        <Pressable style={styles.checkboxRow} onPress={() => toggleCheckbox('age')}>
                          <View style={[styles.checkboxSquare, checkboxes.age && styles.checkboxSquareActive, showErrors && !checkboxes.age && styles.errorBorder]}>
                            {checkboxes.age && <Text style={styles.checkmark}>✓</Text>}
                          </View>
                          <Text style={[styles.checkboxLabel, showErrors && !checkboxes.age && {color: '#E53E3E'}]}>I confirm I am over 18 years old.</Text>
                        </Pressable>
                      </View>
                      
                      {showErrors && (!isSiteValid || !isTimeValid || !isRoleValid || !isDonorValid || !isCheckboxesValid) && (
                        <Text style={[styles.errorText, {marginTop: 20}]}>● Please address all required fields highlighted in red.</Text>
                      )}
                    </View>

                    {/* NEXT STEP BUTTON */}
                    <Pressable style={styles.nextStepCard} onPress={handleNextStep}>
                      <View>
                        <Text style={styles.nextStepTitle}>Next Step: General Screening</Text>
                        <Text style={styles.nextStepSub}>A brief screen is required for new volunteers.</Text>
                      </View>
                      <View style={styles.nextStepIcon}><Text style={{color: '#FFF', fontSize: 24, fontWeight: 'bold'}}>➔</Text></View>
                    </Pressable>

                  </View>

                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' } as any,
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

  pageBody: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40, paddingHorizontal: 20, position: 'relative', minHeight: 'calc(100vh - 100px)' } as any,
  bgImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  bgOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#0F172A', opacity: 0.75 },

  contentWrapper: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 30, width: '100%', maxWidth: 1300, minHeight: '80%', display: 'flex', flexDirection: 'column', boxShadow: '0px 15px 45px rgba(0, 0, 0, 0.4)', zIndex: 2 } as any,
  headerBanner: { backgroundColor: '#4273B8', borderRadius: 12, paddingVertical: 18, alignItems: 'center', marginBottom: 25 },
  bannerText: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold', letterSpacing: 0.5 },

  errorBorder: { borderColor: '#E53E3E', borderWidth: 1, backgroundColor: '#FFF5F5' },
  errorText: { color: '#E53E3E', fontSize: 12, marginTop: 4, fontWeight: 'bold' },

  mainGrid: { flexDirection: 'row', gap: 30, flex: 1 } as any,
  leftColumn: { flex: 1, paddingBottom: 10 },
  rightColumn: { flex: 2.2, flexDirection: 'column', gap: 20 },
  doneBtn: { backgroundColor: '#4273B8', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  doneBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },

  mainGridStep2: { flexDirection: 'row', gap: 40, flex: 1 } as any,
  leftColumnStep2: { flex: 1 },
  rightColumnStep2: { flex: 1.8, flexDirection: 'column' },

  // Added position: 'relative' to the card so the absolute legend stays inside it
  cardOutline: { position: 'relative', backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 12, padding: 25 } as any,
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#111', marginBottom: 15 },
  progressRow: { flexDirection: 'row', gap: 10, marginBottom: 10 } as any,
  progressBar: { flex: 1, height: 8, backgroundColor: '#E5E7EB', borderRadius: 4 },
  progressActive: { backgroundColor: '#4273B8' },
  progressCompleted: { backgroundColor: '#2D8A61' },
  progressLabelsRow: { flexDirection: 'row', gap: 10, justifyContent: 'space-between' } as any,
  progressLabel: { flex: 1, fontSize: 10, color: '#888', lineHeight: 14 },
  labelActive: { color: '#111', fontWeight: 'bold' },

  subTitle: { fontSize: 16, fontWeight: 'bold', color: '#111', marginBottom: 5 },
  descText: { fontSize: 13, color: '#444', lineHeight: 20 },
  bulletList: { paddingLeft: 15, marginTop: 5 },
  bulletItem: { fontSize: 13, color: '#444', lineHeight: 20 },
  roleList: { marginTop: 15, flexDirection: 'column', gap: 20 } as any,
  roleRow: { flexDirection: 'row', gap: 15, alignItems: 'flex-start' } as any,
  roleIconBox: { width: 60, alignItems: 'center' },
  roleIcon: { width: 35, height: 35, marginBottom: 5 },
  roleIconLabel: { fontSize: 11, fontWeight: 'bold', color: '#333' },
  roleTextContent: { flex: 1 },
  roleName: { fontSize: 15, fontWeight: 'bold', color: '#111', marginBottom: 2 },

  fieldLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#111' },
  pickerBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#E5E7EB', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#CCCCCC' } as any,
  pickerText: { fontSize: 15, color: '#111' },
  pickerArrow: { fontSize: 14, fontWeight: 'bold', color: '#555' },
  dropdownMenu: { position: 'absolute', top: 55, left: 0, right: 0, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#CCCCCC', overflow: 'hidden', zIndex: 1000, boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' } as any,
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#EEEEEE' },
  dropdownItemText: { fontSize: 14, color: '#333' },

  roleSelectionRow: { flexDirection: 'row', gap: 15, marginBottom: 15 } as any,
  roleSelectCard: { flex: 1, backgroundColor: '#F0F0F0', borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 12, padding: 15, alignItems: 'center' },
  roleSelectActive: { borderColor: '#4273B8', backgroundColor: '#EBF3FF' },
  roleSelectIcon: { width: 40, height: 40, marginBottom: 8 },
  roleSelectText: { fontSize: 14, fontWeight: 'bold', color: '#555' },
  roleSelectTextActive: { color: '#4273B8' },

  documentsContainer: { flexDirection: 'column', gap: 10 } as any,
  uploadRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#AAA', borderStyle: 'dashed', borderRadius: 10, padding: 12, backgroundColor: '#FAFAFA' } as any,
  uploadInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 } as any,
  docIcon: { fontSize: 18, marginRight: 10 },
  uploadText: { fontSize: 12, color: '#555', flex: 1 },
  uploadBtn: { backgroundColor: '#4273B8', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  uploadBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },

  // Updated to absolute position to free up space underneath the title
  statusLegendBox: { position: 'absolute', top: 25, right: 25, zIndex: 10, flexDirection: 'column', gap: 4 } as any,
  legendTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 } as any,
  legendDesc: { fontSize: 10, color: '#666' },
  
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeHigh: { backgroundColor: '#E53E3E' },
  badgeModerate: { backgroundColor: '#38A169' },
  badgeClosed: { backgroundColor: '#A0AEC0' },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

  donorQuestions: { marginBottom: 10 },
  donorToggleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 } as any,
  donorLabel: { fontSize: 16, fontWeight: 'bold', color: '#111', width: 180 },
  pillToggle: { flexDirection: 'row', backgroundColor: '#2B4A77', borderRadius: 20, overflow: 'hidden' } as any,
  pillOption: { paddingVertical: 4, paddingHorizontal: 15 },
  pillOptionActive: { backgroundColor: '#D9D9D9' },
  pillText: { fontSize: 12, fontWeight: 'bold', color: '#FFF' },
  pillTextActive: { color: '#2B4A77' },

  capacityRow: { flexDirection: 'row', alignItems: 'center' } as any,
  siteBadge: { backgroundColor: '#D9D9D9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  siteBadgeText: { fontSize: 12, color: '#333', fontWeight: 'bold' },

  checkboxGroup: { flexDirection: 'column', gap: 12 } as any,
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start' } as any,
  checkboxSquare: { width: 18, height: 18, borderWidth: 1, borderColor: '#111', marginRight: 10, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  checkboxSquareActive: { backgroundColor: '#111' },
  checkmark: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  checkboxLabel: { fontSize: 13, color: '#333', flex: 1, lineHeight: 20 },

  nextStepCard: { marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 12, padding: 20 } as any,
  nextStepTitle: { fontSize: 18, fontWeight: 'bold', color: '#111', marginBottom: 4 },
  nextStepSub: { fontSize: 13, color: '#666' },
  nextStepIcon: { backgroundColor: '#3FA9F5', width: 40, height: 40, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
});