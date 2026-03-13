'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'next/navigation';

export default function VolunteerPage() {
  const router = useRouter();

  // --- STEP STATE ---
  const [step, setStep] = useState(1); // 1 = Reading, 2 = Form, 3 = Assessment, 4 = Success

  // --- FORM STATES (Step 2) ---
  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState('Select Site Location');

  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('Select Time Slot');

  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const [checkboxes, setCheckboxes] = useState({
    background: false,
    documents: false,
    age: false,
  });

  // --- AUTO-CHECK LOGIC FOR FIELD ROLE ---
  useEffect(() => {
    if (selectedRole === 'field') {
      setCheckboxes(prev => ({ ...prev, documents: true }));
    }
  }, [selectedRole]);

  // --- FORM STATES (Step 3: Questionnaire) ---
  const [qDisaster, setQDisaster] = useState<boolean | null>(null);
  const [qRugged, setQRugged] = useState<boolean | null>(null);
  const [qMedical, setQMedical] = useState<boolean | null>(null);
  const [qVaccines, setQVaccines] = useState<boolean | null>(null);
  const [qLift, setQLift] = useState<boolean | null>(null);
  const [qTransport, setQTransport] = useState<boolean | null>(null);
  const [transportMode, setTransportMode] = useState('');
  
  const [conductChecks, setConductChecks] = useState({
    conduct: false,
    confidential: false,
    safety: false,
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
  const isCheckboxesValid = checkboxes.background && checkboxes.documents && checkboxes.age;
  
  const handleNextToStep3 = () => {
    if (isSiteValid && isTimeValid && isRoleValid && isCheckboxesValid) {
      setShowErrors(false);
      setStep(3);
    } else {
      setShowErrors(true);
    }
  };

  const isStep3Valid = 
    qDisaster !== null && qRugged !== null && qMedical !== null && 
    qVaccines !== null && qLift !== null && qTransport !== null && 
    transportMode.trim() !== '' && 
    conductChecks.conduct && conductChecks.confidential && conductChecks.safety;

  const handleSubmitFinal = () => {
    if (isStep3Valid) {
      setShowErrors(false);
      setStep(4);
    } else {
      setShowErrors(true);
    }
  };

  const toggleCheckbox = (key: keyof typeof checkboxes) => {
    setCheckboxes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleConductCheck = (key: keyof typeof conductChecks) => {
    setConductChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={styles.container}>
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

        <View style={styles.contentWrapper}>
          
          <View style={styles.headerBanner}>
            <Text style={styles.bannerText}>Volunteer Registration</Text>
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }} showsVerticalScrollIndicator={false}>
            
            {/* ========================================================= */}
            {/* STEP 1: DETAILED ROLE REQUIREMENTS                        */}
            {/* ========================================================= */}
            {step === 1 && (
              <View style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                <View style={[styles.cardOutline, { width: '90%', maxWidth: 1000, marginBottom: 20 }]}>
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

                <View style={[styles.cardOutline, { width: '90%', maxWidth: 1000, flex: 1, padding: 0, marginBottom: 25 }]}>
                  <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 30 }} showsVerticalScrollIndicator={true}>
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
                        <View style={styles.roleIconBox}><Image source={{ uri: '/medic_logo.png' }} style={styles.roleIcon} resizeMode="contain" /><Text style={styles.roleIconLabel}>Medic</Text></View>
                        <View style={styles.roleTextContent}><Text style={styles.roleName}>Medic</Text><Text style={styles.descText}>Provide primary medical care, triage, and support to disaster-affected individuals. Valid Medical or Nursing License (mandatory) - please upload this document with your profile during registration. Knowledge of basic first aid, CPR. Bring personal stethoscope/BP cuff if available.</Text></View>
                      </View>
                      <View style={styles.roleRow}>
                        <View style={styles.roleIconBox}><Image source={{ uri: '/logistics_logo.png' }} style={styles.roleIcon} resizeMode="contain" /><Text style={styles.roleIconLabel}>Logistics</Text></View>
                        <View style={styles.roleTextContent}><Text style={styles.roleName}>Logistics</Text><Text style={styles.descText}>Manage and track supply distribution, move resources, support transport. Valid Professional Driver's License (mandatory for vehicle operators). Physically capable of lifting 25+ lbs. Complete a logistics safety briefing.</Text></View>
                      </View>
                      <View style={styles.roleRow}>
                        <View style={styles.roleIconBox}><Image source={{ uri: '/field_logo.png' }} style={styles.roleIcon} resizeMode="contain" /><Text style={styles.roleIconLabel}>Field</Text></View>
                        <View style={styles.roleTextContent}><Text style={styles.roleName}>Field</Text><Text style={styles.descText}>Manage crowd flow, assist with group needs, coordinate community outreach, perform data entry. Strong communication and interpersonal skills. Ability to handle large groups. Basic computer literacy for data roles. Complete a volunteer safety briefing.</Text></View>
                      </View>
                    </View>
                  </ScrollView>
                </View>

                <Pressable 
                  style={(state: any) => [styles.doneBtn, styles.animated, state.hovered && styles.btnHover, state.pressed && styles.btnPress]} 
                  onPress={() => setStep(2)}
                >
                  <Text style={styles.doneBtnText}>Done Reading</Text>
                </Pressable>

              </View>
            )}

            {/* ========================================================= */}
            {/* STEP 2: REGISTRATION FORM                                 */}
            {/* ========================================================= */}
            {step === 2 && (
              <View style={styles.mainGridStep2}>
                
                {/* LEFT COLUMN */}
                <View style={[styles.leftColumnStep2, { zIndex: 50 }]}>
                  
                  <Text style={styles.fieldLabel}>Select Site Location</Text>
                  <View style={{ position: 'relative', zIndex: 100, marginBottom: 20 }}>
                    <Pressable 
                      style={(state: any) => [styles.pickerBox, styles.animated, showErrors && !isSiteValid && styles.errorBorder, state.hovered && { borderColor: '#4273B8', backgroundColor: '#F8FAFC' }]} 
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
                              onPress={() => { setSelectedSite(building); setIsSiteDropdownOpen(false); }}
                            >
                              <Text style={styles.dropdownItemText}>{building}</Text>
                            </Pressable>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </View>

                  <Text style={styles.fieldLabel}>Select Time Slot</Text>
                  <View style={{ position: 'relative', zIndex: 90, marginBottom: 25 }}>
                    <Pressable 
                      style={(state: any) => [styles.pickerBox, styles.animated, showErrors && !isTimeValid && styles.errorBorder, state.hovered && { borderColor: '#4273B8', backgroundColor: '#F8FAFC' }]} 
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

                  {/* DYNAMIC SCROLLING ROLES & DOCUMENTS */}
                  <ScrollView style={{ flex: 1, zIndex: 10 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10, paddingTop: 10 }}>
                    <Text style={styles.fieldLabel}>Select Your Role</Text>
                    <View style={styles.roleSelectionRow}>
                      <Pressable 
                        style={(state: any) => [styles.roleSelectCard, styles.animated, selectedRole === 'medic' && styles.roleSelectActive, showErrors && !isRoleValid && styles.errorBorder, state.hovered && selectedRole !== 'medic' && styles.roleCardHover]} 
                        onPress={() => setSelectedRole('medic')}
                      >
                        <Image source={{ uri: '/medic_logo.png' }} style={styles.roleSelectIcon} resizeMode="contain" />
                        <Text style={[styles.roleSelectText, selectedRole === 'medic' && styles.roleSelectTextActive]}>Medic</Text>
                      </Pressable>

                      <Pressable 
                        style={(state: any) => [styles.roleSelectCard, styles.animated, selectedRole === 'logistics' && styles.roleSelectActive, showErrors && !isRoleValid && styles.errorBorder, state.hovered && selectedRole !== 'logistics' && styles.roleCardHover]} 
                        onPress={() => setSelectedRole('logistics')}
                      >
                        <Image source={{ uri: '/logistics_logo.png' }} style={styles.roleSelectIcon} resizeMode="contain" />
                        <Text style={[styles.roleSelectText, selectedRole === 'logistics' && styles.roleSelectTextActive]}>Logistics</Text>
                      </Pressable>

                      <Pressable 
                        style={(state: any) => [styles.roleSelectCard, styles.animated, selectedRole === 'field' && styles.roleSelectActive, showErrors && !isRoleValid && styles.errorBorder, state.hovered && selectedRole !== 'field' && styles.roleCardHover]} 
                        onPress={() => setSelectedRole('field')}
                      >
                        <Image source={{ uri: '/field_logo.png' }} style={styles.roleSelectIcon} resizeMode="contain" />
                        <Text style={[styles.roleSelectText, selectedRole === 'field' && styles.roleSelectTextActive]}>Field</Text>
                      </Pressable>
                    </View>
                    {showErrors && !isRoleValid && <Text style={[styles.errorText, {marginTop: 0, marginBottom: 10}]}>● Role selection is required.</Text>}

                    <Text style={[styles.fieldLabel, { marginTop: 5 }]}>Required Document:</Text>
                    <View style={styles.documentsContainer}>
                      {selectedRole === null && (
                         <Text style={{color: '#888', fontStyle: 'italic', fontSize: 13}}>Please select a role above to view required documents.</Text>
                      )}
                      {selectedRole === 'medic' && (
                        <View style={styles.uploadRow}>
                          <View style={styles.uploadInfo}><Text style={styles.docIcon}>📄</Text><Text style={styles.uploadText}>Upload Medical License (e.g., MD, RN)</Text></View>
                          <Pressable style={(state: any) => [styles.uploadBtn, styles.animated, state.hovered && {backgroundColor: '#335C94'}, state.pressed && styles.btnPress]}>
                            <Text style={styles.uploadBtnText}>Upload</Text>
                          </Pressable>
                        </View>
                      )}
                      {selectedRole === 'logistics' && (
                        <View style={styles.uploadRow}>
                          <View style={styles.uploadInfo}><Text style={styles.docIcon}>📄</Text><Text style={styles.uploadText}>Upload Valid Driver's License</Text></View>
                          <Pressable style={(state: any) => [styles.uploadBtn, styles.animated, state.hovered && {backgroundColor: '#335C94'}, state.pressed && styles.btnPress]}>
                            <Text style={styles.uploadBtnText}>Upload</Text>
                          </Pressable>
                        </View>
                      )}
                      {selectedRole === 'field' && (
                        <View style={[styles.uploadRow, { borderStyle: 'solid', borderColor: '#38A169', backgroundColor: '#F0FDF4' }]}>
                          <View style={styles.uploadInfo}>
                            <Text style={styles.docIcon}>✅</Text>
                            <Text style={[styles.uploadText, { color: '#2D8A61', fontWeight: 'bold' }]}>No additional documents required for Field role.</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </ScrollView>

                  <View style={{ paddingTop: 10 }}>
                    <Pressable 
                      style={(state: any) => [styles.backBtn, styles.animated, state.hovered && {backgroundColor: '#E5E7EB'}, state.pressed && styles.btnPress]} 
                      onPress={() => setStep(1)}
                    >
                      <Text style={styles.backBtnText}>← Back to Requirements</Text>
                    </Pressable>
                  </View>

                </View>

                {/* RIGHT COLUMN */}
                <View style={[styles.rightColumnStep2, { zIndex: 10, display: 'flex', flexDirection: 'column' }]}>
                  
                  <View style={styles.cardOutline}>
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

                  <View style={[styles.cardOutline, { flex: 1, padding: 0, overflow: 'hidden' }]}>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 25 }} showsVerticalScrollIndicator={false}>
                      
                      <View style={styles.donorHeaderRow}>
                        <Text style={[styles.cardTitle, { marginBottom: 0 }]}>Capacity Checker</Text>
                        
                        <View style={styles.statusLegendBox}>
                          <Text style={styles.legendTitle}>Statuses:</Text>
                          <View style={styles.legendRow}><View style={[styles.badge, styles.badgeHigh]}><Text style={styles.badgeText}>High</Text></View><Text style={styles.legendDesc}>Urgent for Volunteers</Text></View>
                          <View style={styles.legendRow}><View style={[styles.badge, styles.badgeModerate]}><Text style={styles.badgeText}>Moderate</Text></View><Text style={styles.legendDesc}>Fair but not at capacity</Text></View>
                          <View style={styles.legendRow}><View style={[styles.badge, styles.badgeClosed]}><Text style={styles.badgeText}>Closed</Text></View><Text style={styles.legendDesc}>At full capacity</Text></View>
                        </View>
                      </View>

                      <View style={styles.capacityRow}>
                        <Text style={styles.donorLabel}>Real-Time Capacity:</Text>
                        <View style={styles.siteBadge}><Text style={styles.siteBadgeText}>{selectedSite !== 'Select Site Location' ? selectedSite : ''}</Text></View>
                        <Text style={{marginHorizontal: 8}}>-</Text>
                        <View style={[styles.badge, styles.badgeModerate]}><Text style={styles.badgeText}>Moderate</Text></View>
                      </View>

                      {/* Checkboxes */}
                      <Text style={[styles.cardTitle, { fontSize: 18, marginTop: 20, marginBottom: 12 }]}>Checkbox for Vetting</Text>
                      <View style={styles.checkboxGroup}>
                        <Pressable onPress={() => toggleCheckbox('background')}>
                          {({ hovered }: any) => (
                            <View style={[styles.checkboxRow, styles.animated, hovered && { opacity: 0.8 }]}>
                              <View style={[styles.checkboxSquare, styles.animated, checkboxes.background && styles.checkboxSquareActive, showErrors && !checkboxes.background && styles.errorBorder, hovered && !checkboxes.background && { borderColor: '#4273B8' }]}>
                                {checkboxes.background && <Text style={styles.checkmark}>✓</Text>}
                              </View>
                              <Text style={[styles.checkboxLabel, styles.animated, showErrors && !checkboxes.background && {color: '#E53E3E'}, hovered && !checkboxes.background && { color: '#4273B8' }]}>I agree to a background check (required for Selected roles).</Text>
                            </View>
                          )}
                        </Pressable>

                        <Pressable onPress={() => toggleCheckbox('documents')}>
                          {({ hovered }: any) => (
                            <View style={[styles.checkboxRow, styles.animated, hovered && { opacity: 0.8 }]}>
                              <View style={[styles.checkboxSquare, styles.animated, checkboxes.documents && styles.checkboxSquareActive, showErrors && !checkboxes.documents && styles.errorBorder, hovered && !checkboxes.documents && { borderColor: '#4273B8' }]}>
                                {checkboxes.documents && <Text style={styles.checkmark}>✓</Text>}
                              </View>
                              <Text style={[styles.checkboxLabel, styles.animated, showErrors && !checkboxes.documents && {color: '#E53E3E'}, hovered && !checkboxes.documents && { color: '#4273B8' }]}>
                                {selectedRole === 'field' ? 'I acknowledge the requirements for my selected role.' : 'I have uploaded all required documents for my selected role.'}
                              </Text>
                            </View>
                          )}
                        </Pressable>

                        <Pressable onPress={() => toggleCheckbox('age')}>
                          {({ hovered }: any) => (
                            <View style={[styles.checkboxRow, styles.animated, hovered && { opacity: 0.8 }]}>
                              <View style={[styles.checkboxSquare, styles.animated, checkboxes.age && styles.checkboxSquareActive, showErrors && !checkboxes.age && styles.errorBorder, hovered && !checkboxes.age && { borderColor: '#4273B8' }]}>
                                {checkboxes.age && <Text style={styles.checkmark}>✓</Text>}
                              </View>
                              <Text style={[styles.checkboxLabel, styles.animated, showErrors && !checkboxes.age && {color: '#E53E3E'}, hovered && !checkboxes.age && { color: '#4273B8' }]}>I confirm I am over 18 years old.</Text>
                            </View>
                          )}
                        </Pressable>
                      </View>
                      
                      {showErrors && (!isSiteValid || !isTimeValid || !isRoleValid || !isCheckboxesValid) && (
                        <Text style={[styles.errorText, {marginTop: 10}]}>● Please address all required fields highlighted in red.</Text>
                      )}

                    </ScrollView>
                  </View>

                  {/* NEXT STEP BUTTON */}
                  <View style={{ paddingTop: 15 }}>
                    <Pressable onPress={handleNextToStep3}>
                      {({ hovered, pressed }: any) => (
                        <View style={[styles.nextStepCard, styles.animated, hovered && styles.shiftRightHover, pressed && styles.btnPress]}>
                          <View>
                            <Text style={[styles.nextStepTitle, styles.animated, hovered && { color: '#4273B8' }]}>Next Step: General Screening</Text>
                            <Text style={styles.nextStepSub}>A brief screen is required for new volunteers.</Text>
                          </View>
                          <View style={[styles.nextStepIcon, styles.animated, hovered && { backgroundColor: '#335C94' }]}>
                            <Text style={{color: '#FFF', fontSize: 24, fontWeight: 'bold'}}>➔</Text>
                          </View>
                        </View>
                      )}
                    </Pressable>
                  </View>

                </View>

              </View>
            )}

            {/* ========================================================= */}
            {/* STEP 3: SELF-ASSESSMENT QUESTIONNAIRE                     */}
            {/* ========================================================= */}
            {step === 3 && (
              <View style={styles.mainGridStep2}>
                
                {/* LEFT COLUMN: Basic Background, Health, & Availability */}
                <View style={[styles.cardOutline, { flex: 1.1 }]}>
                  <Text style={[styles.cardTitle, { marginBottom: 25 }]}>Self-Assessment Questionnaire</Text>

                  <View style={{ paddingHorizontal: 20 }}>
                    {/* SECTION 1: Basic Background */}
                    <Text style={styles.qSectionTitle}>Basic Background</Text>
                    <View style={styles.qQuestionRow}>
                      <Text style={styles.qQuestionText}>Have you previously volunteered in disaster response?</Text>
                      <View style={[styles.pillToggle, showErrors && qDisaster === null && styles.errorBorder]}>
                        <Pressable 
                          style={(state: any) => [styles.pillOption, styles.animated, qDisaster === true && styles.pillOptionActive, state.hovered && qDisaster !== true && { backgroundColor: '#D1D5DB' }]} 
                          onPress={() => setQDisaster(true)}
                        >
                          <Text style={[styles.pillText, qDisaster === true && styles.pillTextActive]}>YES</Text>
                        </Pressable>
                        <Pressable 
                          style={(state: any) => [styles.pillOption, styles.animated, qDisaster === false && styles.pillOptionActive, state.hovered && qDisaster !== false && { backgroundColor: '#D1D5DB' }]} 
                          onPress={() => setQDisaster(false)}
                        >
                          <Text style={[styles.pillText, qDisaster === false && styles.pillTextActive]}>NO</Text>
                        </Pressable>
                      </View>
                    </View>

                    <View style={styles.qQuestionRow}>
                      <Text style={styles.qQuestionText}>Are you comfortable working in rugged or stressful environments?</Text>
                      <View style={[styles.pillToggle, showErrors && qRugged === null && styles.errorBorder]}>
                        <Pressable style={(state: any) => [styles.pillOption, styles.animated, qRugged === true && styles.pillOptionActive, state.hovered && qRugged !== true && { backgroundColor: '#D1D5DB' }]} onPress={() => setQRugged(true)}><Text style={[styles.pillText, qRugged === true && styles.pillTextActive]}>YES</Text></Pressable>
                        <Pressable style={(state: any) => [styles.pillOption, styles.animated, qRugged === false && styles.pillOptionActive, state.hovered && qRugged !== false && { backgroundColor: '#D1D5DB' }]} onPress={() => setQRugged(false)}><Text style={[styles.pillText, qRugged === false && styles.pillTextActive]}>NO</Text></Pressable>
                      </View>
                    </View>
                  </View>

                  {/* SECTION 2: Health & Safety Banner */}
                  <View style={styles.healthBannerClean}>
                    <Text style={styles.qSectionTitle}>Health & Safety Self-Assessment</Text>
                    <Text style={styles.healthDesc}>This section helps us match you to appropriate roles. All responses are confidential.</Text>
                    
                    <View style={styles.qQuestionRow}>
                      <Text style={styles.qQuestionText}>Do you have any <Text style={{fontWeight:'bold'}}>medical conditions requiring immediate attention or physical restrictions?</Text></Text>
                      <View style={[styles.pillToggle, showErrors && qMedical === null && styles.errorBorder]}>
                        <Pressable style={(state: any) => [styles.pillOption, styles.animated, qMedical === true && styles.pillOptionActive, state.hovered && qMedical !== true && { backgroundColor: '#D1D5DB' }]} onPress={() => setQMedical(true)}><Text style={[styles.pillText, qMedical === true && styles.pillTextActive]}>YES</Text></Pressable>
                        <Pressable style={(state: any) => [styles.pillOption, styles.animated, qMedical === false && styles.pillOptionActive, state.hovered && qMedical !== false && { backgroundColor: '#D1D5DB' }]} onPress={() => setQMedical(false)}><Text style={[styles.pillText, qMedical === false && styles.pillTextActive]}>NO</Text></Pressable>
                      </View>
                    </View>

                    <View style={styles.qQuestionRow}>
                      <Text style={styles.qQuestionText}>Are you up-to-date on essential <Text style={{fontWeight:'bold'}}>vaccinations</Text> (e.g., Flu)?</Text>
                      <View style={[styles.pillToggle, showErrors && qVaccines === null && styles.errorBorder]}>
                        <Pressable style={(state: any) => [styles.pillOption, styles.animated, qVaccines === true && styles.pillOptionActive, state.hovered && qVaccines !== true && { backgroundColor: '#D1D5DB' }]} onPress={() => setQVaccines(true)}><Text style={[styles.pillText, qVaccines === true && styles.pillTextActive]}>YES</Text></Pressable>
                        <Pressable style={(state: any) => [styles.pillOption, styles.animated, qVaccines === false && styles.pillOptionActive, state.hovered && qVaccines !== false && { backgroundColor: '#D1D5DB' }]} onPress={() => setQVaccines(false)}><Text style={[styles.pillText, qVaccines === false && styles.pillTextActive]}>NO</Text></Pressable>
                      </View>
                    </View>

                    <View style={styles.qQuestionRow}>
                      <Text style={styles.qQuestionText}>Are you physically able to lift and carry items up to 25 lbs (11 kg)?</Text>
                      <View style={[styles.pillToggle, showErrors && qLift === null && styles.errorBorder]}>
                        <Pressable style={(state: any) => [styles.pillOption, styles.animated, qLift === true && styles.pillOptionActive, state.hovered && qLift !== true && { backgroundColor: '#D1D5DB' }]} onPress={() => setQLift(true)}><Text style={[styles.pillText, qLift === true && styles.pillTextActive]}>YES</Text></Pressable>
                        <Pressable style={(state: any) => [styles.pillOption, styles.animated, qLift === false && styles.pillOptionActive, state.hovered && qLift !== false && { backgroundColor: '#D1D5DB' }]} onPress={() => setQLift(false)}><Text style={[styles.pillText, qLift === false && styles.pillTextActive]}>NO</Text></Pressable>
                      </View>
                    </View>
                  </View>

                  <View style={{ paddingHorizontal: 20 }}>
                    {/* SECTION 3: Availability & Logistics */}
                    <Text style={[styles.qSectionTitle, { marginTop: 15 }]}>Availability & Logistics</Text>
                    
                    <View style={styles.qQuestionRow}>
                      <Text style={styles.qQuestionText}>Do you have <Text style={{fontWeight:'bold'}}>personal transportation</Text> to a disaster site?</Text>
                      <View style={[styles.pillToggle, showErrors && qTransport === null && styles.errorBorder]}>
                        <Pressable style={(state: any) => [styles.pillOption, styles.animated, qTransport === true && styles.pillOptionActive, state.hovered && qTransport !== true && { backgroundColor: '#D1D5DB' }]} onPress={() => setQTransport(true)}><Text style={[styles.pillText, qTransport === true && styles.pillTextActive]}>YES</Text></Pressable>
                        <Pressable style={(state: any) => [styles.pillOption, styles.animated, qTransport === false && styles.pillOptionActive, state.hovered && qTransport !== false && { backgroundColor: '#D1D5DB' }]} onPress={() => setQTransport(false)}><Text style={[styles.pillText, qTransport === false && styles.pillTextActive]}>NO</Text></Pressable>
                      </View>
                    </View>
                    
                    <Text style={[styles.qQuestionText, {marginBottom: 8}]}>What is your typical mode of transportation? (Personal Vehicle, Public Transpo, etc.)</Text>
                    <TextInput 
                      style={[styles.transpoInput, styles.animated, showErrors && transportMode.trim() === '' && styles.errorBorder]}
                      placeholder='"Type of Transportation"'
                      placeholderTextColor="#999"
                      value={transportMode}
                      onChangeText={setTransportMode}
                    />
                  </View>
                </View>

                {/* RIGHT COLUMN: Tracker, Conduct & Buttons */}
                <View style={{ flex: 1.1, flexDirection: 'column' }}>
                  
                  {/* TRACKER */}
                  <View style={styles.cardOutline}>
                    <Text style={styles.cardTitle}>Registration Status Tracker</Text>
                    <View style={styles.progressRow}>
                      <View style={[styles.progressBar, styles.progressCompleted]} />
                      <View style={[styles.progressBar, styles.progressCompleted]} />
                      <View style={[styles.progressBar, styles.progressActive]} />
                      <View style={styles.progressBar} />
                    </View>
                    <View style={styles.progressLabelsRow}>
                      <Text style={styles.progressLabel}>[1] View Detailed Role Requirements:{'\n'}(Completed)</Text>
                      <Text style={styles.progressLabel}>[2] Role Selection & Document Upload:{'\n'}(Completed)</Text>
                      <Text style={[styles.progressLabel, styles.labelActive]}>[3] General Screening Questionnaire:{'\n'}(Current Step)</Text>
                      <Text style={styles.progressLabel}>[4] Admin Review & Badge Issuance:{'\n'}(Upcoming)</Text>
                    </View>
                  </View>

                  {/* QUESTIONNAIRE PART 2 (CONDUCT CARDS) */}
                  <View style={[styles.cardOutline, { flex: 1, marginTop: 20, display: 'flex', flexDirection: 'column' }]}>
                    
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <Text style={styles.qSectionTitle}>Volunteer Conduct & Confidentiality</Text>
                      
                      <View style={styles.conductChecksContainer}>
                        <Pressable onPress={() => toggleConductCheck('conduct')}>
                          {({ hovered }: any) => (
                            <View style={[styles.conductCheckCard, styles.animated, conductChecks.conduct && styles.conductCheckCardActive, showErrors && !conductChecks.conduct && styles.errorBorder, hovered && !conductChecks.conduct && styles.conductHover]}>
                              <View style={[styles.conductCheckboxSquare, styles.animated, conductChecks.conduct && styles.conductCheckboxActive, showErrors && !conductChecks.conduct && styles.errorBorder, hovered && !conductChecks.conduct && { borderColor: '#4273B8' }]}>
                                {conductChecks.conduct && <Text style={styles.conductCheckmark}>✓</Text>}
                              </View>
                              <Text style={[styles.conductCheckLabel, styles.animated, showErrors && !conductChecks.conduct && {color: '#E53E3E'}, hovered && !conductChecks.conduct && {color: '#111'}]}>Do you agree to abide by the BayaniHub Volunteer Code of Conduct and treat aid recipients with dignity? (Mandatory)</Text>
                            </View>
                          )}
                        </Pressable>

                        <Pressable onPress={() => toggleConductCheck('confidential')}>
                          {({ hovered }: any) => (
                            <View style={[styles.conductCheckCard, styles.animated, conductChecks.confidential && styles.conductCheckCardActive, showErrors && !conductChecks.confidential && styles.errorBorder, hovered && !conductChecks.confidential && styles.conductHover]}>
                              <View style={[styles.conductCheckboxSquare, styles.animated, conductChecks.confidential && styles.conductCheckboxActive, showErrors && !conductChecks.confidential && styles.errorBorder, hovered && !conductChecks.confidential && { borderColor: '#4273B8' }]}>
                                {conductChecks.confidential && <Text style={styles.conductCheckmark}>✓</Text>}
                              </View>
                              <Text style={[styles.conductCheckLabel, styles.animated, showErrors && !conductChecks.confidential && {color: '#E53E3E'}, hovered && !conductChecks.confidential && {color: '#111'}]}>Do you agree to maintain the strict confidentiality of all private information you access? (Mandatory)</Text>
                            </View>
                          )}
                        </Pressable>

                        <Pressable onPress={() => toggleConductCheck('safety')}>
                          {({ hovered }: any) => (
                            <View style={[styles.conductCheckCard, styles.animated, conductChecks.safety && styles.conductCheckCardActive, showErrors && !conductChecks.safety && styles.errorBorder, hovered && !conductChecks.safety && styles.conductHover]}>
                              <View style={[styles.conductCheckboxSquare, styles.animated, conductChecks.safety && styles.conductCheckboxActive, showErrors && !conductChecks.safety && styles.errorBorder, hovered && !conductChecks.safety && { borderColor: '#4273B8' }]}>
                                {conductChecks.safety && <Text style={styles.conductCheckmark}>✓</Text>}
                              </View>
                              <Text style={[styles.conductCheckLabel, styles.animated, showErrors && !conductChecks.safety && {color: '#E53E3E'}, hovered && !conductChecks.safety && {color: '#111'}]}>Do you understand and agree to follow all safety protocols and guidelines provided for each site? (Mandatory)</Text>
                            </View>
                          )}
                        </Pressable>
                      </View>
                    </View>

                    {/* ACTION BUTTONS */}
                    <View style={{ marginTop: 20 }}>
                      <Text style={styles.warningText}>Your contribution is valuable. Please complete all fields.</Text>
                      <View style={styles.step3ActionRow}>
                        <Pressable 
                          style={(state: any) => [styles.backBtnStep3, styles.animated, state.hovered && {backgroundColor: '#E5E7EB'}, state.pressed && styles.btnPress]} 
                          onPress={() => setStep(2)}
                        >
                          <Text style={styles.backBtnTextStep3}>Back</Text>
                        </Pressable>
                        <Pressable 
                          style={(state: any) => [styles.submitBtnStep3, styles.animated, state.hovered && styles.btnHover, state.pressed && styles.btnPress]} 
                          onPress={handleSubmitFinal}
                        >
                          <Text style={styles.submitBtnTextStep3}>Submit Assessment</Text>
                        </Pressable>
                      </View>
                      {showErrors && !isStep3Valid && (
                        <Text style={[styles.errorText, {marginTop: 10, textAlign: 'center'}]}>● Please complete all required fields highlighted above.</Text>
                      )}
                    </View>

                  </View>
                </View>

              </View>
            )}

            {/* ========================================================= */}
            {/* STEP 4: SUCCESS CONFIRMATION                              */}
            {/* ========================================================= */}
            {step === 4 && (
              <View style={styles.step4Container}>
                
                {/* FULL WIDTH TRACKER */}
                <View style={[styles.cardOutline, { alignSelf: 'center', width: '80%', maxWidth: 1000, marginBottom: 20 }]}>
                  <Text style={styles.cardTitle}>Registration Status Tracker</Text>
                  <View style={styles.progressRow}>
                    <View style={[styles.progressBar, styles.progressActive]} />
                    <View style={[styles.progressBar, styles.progressActive]} />
                    <View style={[styles.progressBar, styles.progressActive]} />
                    <View style={[styles.progressBar, styles.progressActive]} />
                  </View>
                  <View style={styles.progressLabelsRow}>
                    <Text style={styles.progressLabel}>[1] View Detailed Role Requirements:{'\n'}(Completed)</Text>
                    <Text style={styles.progressLabel}>[2] Role Selection & Document Upload:{'\n'}(Completed)</Text>
                    <Text style={styles.progressLabel}>[3] General Screening Questionnaire:{'\n'}(Completed)</Text>
                    <Text style={[styles.progressLabel, styles.labelActive]}>[4] Admin Review & Badge Issuance:{'\n'}(Current Step)</Text>
                  </View>
                </View>

                {/* SUCCESS CARD */}
                <View style={styles.successCard}>
                  <View style={styles.successHeaderRow}>
                    <Text style={styles.successHeaderText}>Application Successfully Received!</Text>
                  </View>
                  
                  <View style={styles.successBody}>
                    
                    {/* NEW STYLED CHECKMARK ICON */}
                    <View style={styles.checkmarkIconCircle}>
                      <Text style={styles.checkmarkIconText}>✓</Text>
                    </View>
                    
                    <Text style={styles.thankYouTitle}>Thank You, Hero!</Text>
                    <Text style={styles.successDescText}>
                      Your Volunteer Application has been successfully routed to our Admin Team for final processing and document verification.
                    </Text>

                    {/* VISUAL PIPELINE TRACKER */}
                    <View style={styles.pipelineContainer}>
                      
                      <View style={styles.pipelineStep}>
                        <View style={[styles.pipelineCircle, {backgroundColor: '#48BB78', borderColor: '#48BB78'}]}>
                          <Text style={{color: '#FFF', fontSize: 24, fontWeight: 'bold'}}>✓</Text>
                        </View>
                        <Text style={styles.pipelineStepTitle}>Submitted</Text>
                        <Text style={styles.pipelineStepSub}>(Application)</Text>
                      </View>

                      <View style={[styles.pipelineLine, {backgroundColor: '#4273B8'}]} />

                      <View style={styles.pipelineStep}>
                        <View style={[styles.pipelineCircle, {backgroundColor: '#EBF3FF', borderColor: '#4273B8'}]}>
                          <Text style={{fontSize: 22}}>📄</Text>
                        </View>
                        <Text style={styles.pipelineStepTitle}>Credential Verification</Text>
                        <Text style={styles.pipelineStepSub}>(Routing for Review)</Text>
                      </View>

                      <View style={[styles.pipelineLine, {backgroundColor: '#D1D5DB'}]} />

                      <View style={styles.pipelineStep}>
                        <View style={[styles.pipelineCircle, {backgroundColor: '#F3F4F6', borderColor: '#D1D5DB'}]}>
                          <Text style={{fontSize: 22}}>🏅</Text>
                        </View>
                        <Text style={[styles.pipelineStepTitle, {color: '#6B7280'}]}>Final Status</Text>
                        <Text style={styles.pipelineStepSub}>(Pending)</Text>
                      </View>

                    </View>

                    {/* DYNAMIC DETAILS */}
                    <Text style={styles.successDetailText}>
                      <Text style={{fontWeight: 'bold'}}>Next Steps: </Text> Document Verification. Please allow 24-48 hours for final review and verification. Check your email for status updates.
                    </Text>
                    
                    <Text style={styles.successDetailText}>
                      Your status is currently: <Text style={{fontWeight: 'bold'}}>[Document Processing]</Text>
                    </Text>
                    
                    <Text style={styles.successDetailText}>
                      <Text style={{fontWeight: 'bold'}}>Summary:</Text> {selectedRole ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) : ''} Role ({selectedTime})
                    </Text>

                    {/* NEW CROSS-SELL DONOR PROMPT */}
                    <View style={{ marginTop: 40, width: '100%', alignItems: 'center', borderTopWidth: 1, borderColor: '#EEE', paddingTop: 30 }}>
                      <Text style={styles.donorPromptText}>Do you want to be a Donor?</Text>
                      
                      <View style={{ flexDirection: 'row', gap: 15, marginTop: 20 }}>
                        <Pressable 
                          style={(state: any) => [styles.yesDonorBtn, styles.animated, state.hovered && styles.btnHover, state.pressed && styles.btnPress]} 
                          onPress={() => router.push('/pledge')}
                        >
                          <Text style={styles.yesDonorBtnText}>Yes, I want to be a donor</Text>
                        </Pressable>
                        
                        <Pressable 
                          style={(state: any) => [styles.noDonorBtn, styles.animated, state.hovered && { backgroundColor: '#F3F4F6' }, state.pressed && styles.btnPress]} 
                          onPress={() => router.push('/')}
                        >
                          <Text style={styles.noDonorBtnText}>No, Return to Homepage</Text>
                        </Pressable>
                      </View>
                    </View>

                  </View>
                </View>

              </View>
            )}

          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', height: '100vh', overflow: 'hidden' } as any,
  
  // ORIGINAL SIZED NAVBAR RESTORED
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
  headerBanner: { backgroundColor: '#4273B8', borderRadius: 12, paddingVertical: 18, alignItems: 'center', marginBottom: 15 },
  bannerText: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold', letterSpacing: 0.5 },

  errorBorder: { borderColor: '#E53E3E', borderWidth: 1, backgroundColor: '#FFF5F5' },
  errorText: { color: '#E53E3E', fontSize: 12, marginTop: 4, fontWeight: 'bold' },

  // =========================================
  // HOVER ANIMATION CLASSES
  // =========================================
  animated: { transition: 'all 0.2s ease-in-out' } as any,
  btnHover: { transform: [{ scale: 1.02 }], opacity: 0.95, boxShadow: '0px 4px 15px rgba(66, 115, 184, 0.3)' } as any,
  btnPress: { transform: [{ scale: 0.98 }], opacity: 0.8 } as any,
  roleCardHover: { borderColor: '#4273B8', backgroundColor: '#FAFCFF', transform: [{ translateY: -2 }], boxShadow: '0px 6px 15px rgba(0,0,0,0.06)' } as any,
  shiftRightHover: { transform: [{ translateX: 5 }], borderColor: '#4273B8', boxShadow: '0px 4px 15px rgba(66, 115, 184, 0.15)' } as any,
  conductHover: { borderColor: '#4273B8', backgroundColor: '#FAFCFF', transform: [{ translateY: -1 }], boxShadow: '0px 4px 12px rgba(66,115,184,0.08)' } as any,

  // STEP 1 LAYOUT
  mainGrid: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 10 } as any,
  doneBtn: { backgroundColor: '#4273B8', paddingVertical: 18, paddingHorizontal: 40, borderRadius: 12, alignItems: 'center', width: '100%', maxWidth: 300 },
  doneBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },

  // STEP 2 & 3 LAYOUT
  mainGridStep2: { flexDirection: 'row', gap: 60 } as any,
  leftColumnStep2: { flex: 1, display: 'flex', flexDirection: 'column' },
  rightColumnStep2: { flex: 1.8, flexDirection: 'column', gap: 20 },

  backBtn: { backgroundColor: '#F3F4F6', paddingVertical: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB' },
  backBtnText: { color: '#4B5563', fontSize: 15, fontWeight: 'bold' },

  cardOutline: { position: 'relative', backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 12, padding: 25 } as any,
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#111', marginBottom: 15 },
  progressRow: { flexDirection: 'row', gap: 10, marginBottom: 10 } as any,
  progressBar: { flex: 1, height: 8, backgroundColor: '#E5E7EB', borderRadius: 4 },
  progressActive: { backgroundColor: '#4273B8' },
  progressCompleted: { backgroundColor: '#4273B8' },
  progressLabelsRow: { flexDirection: 'row', gap: 10, justifyContent: 'space-between' } as any,
  progressLabel: { flex: 1, fontSize: 10, color: '#888', lineHeight: 14 },
  labelActive: { color: '#111', fontWeight: 'bold' },

  subTitle: { fontSize: 16, fontWeight: 'bold', color: '#111', marginBottom: 5 },
  descText: { fontSize: 13, color: '#444', lineHeight: 18 },
  bulletList: { paddingLeft: 15, marginTop: 5 },
  bulletItem: { fontSize: 13, color: '#444', lineHeight: 18 },
  roleList: { marginTop: 10, flexDirection: 'column', gap: 12 } as any,
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
  uploadRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#AAA', borderStyle: 'dashed', borderRadius: 10, padding: 10, backgroundColor: '#FAFAFA' } as any,
  uploadInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 } as any,
  docIcon: { fontSize: 18, marginRight: 10 },
  uploadText: { fontSize: 12, color: '#555', flex: 1 },
  uploadBtn: { backgroundColor: '#4273B8', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  uploadBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },

  donorHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 } as any,
  
  statusLegendBox: { position: 'absolute', top: 30, right: 30, zIndex: 10, flexDirection: 'column', gap: 10 } as any,
  legendTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 12 } as any,
  legendDesc: { fontSize: 14, color: '#555' },
  
  badge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, minWidth: 85, alignItems: 'center', justifyContent: 'center' },
  badgeHigh: { backgroundColor: '#E53E3E' },
  badgeModerate: { backgroundColor: '#38A169' },
  badgeClosed: { backgroundColor: '#A0AEC0' },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold', letterSpacing: 0.5 },

  capacityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 15 } as any,
  donorLabel: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  siteBadge: { backgroundColor: '#D9D9D9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, marginLeft: 15 },
  siteBadgeText: { fontSize: 12, color: '#333', fontWeight: 'bold' },

  checkboxGroup: { flexDirection: 'column', gap: 10 } as any,
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start' } as any,
  checkboxSquare: { width: 18, height: 18, borderWidth: 1, borderColor: '#111', marginRight: 10, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  checkboxSquareActive: { backgroundColor: '#111' },
  checkmark: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  checkboxLabel: { fontSize: 13, color: '#333', flex: 1, lineHeight: 18 },

  nextStepCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 12, padding: 15 } as any,
  nextStepTitle: { fontSize: 18, fontWeight: 'bold', color: '#111', marginBottom: 4 },
  nextStepSub: { fontSize: 13, color: '#666' },
  nextStepIcon: { backgroundColor: '#3FA9F5', width: 40, height: 40, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },

  // ==========================================
  // STEP 3 STYLES 
  // ==========================================
  qSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111', marginBottom: 15 },
  
  qQuestionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 } as any,
  qQuestionText: { fontSize: 13, color: '#111', flex: 1, paddingRight: 20, lineHeight: 20 },
  
  pillToggle: { flexDirection: 'row', gap: 10 } as any,
  pillOption: { paddingVertical: 6, paddingHorizontal: 20, backgroundColor: '#E5E7EB', borderRadius: 20, borderWidth: 1, borderColor: '#D1D5DB' },
  pillOptionActive: { backgroundColor: '#4273B8', borderColor: '#4273B8' },
  pillText: { fontSize: 12, fontWeight: 'bold', color: '#4B5563' },
  pillTextActive: { color: '#FFFFFF' },

  healthBannerClean: { backgroundColor: '#E3F2E3', paddingVertical: 25, paddingHorizontal: 20, borderRadius: 12, marginTop: 10, marginBottom: 10 },
  healthDesc: { fontSize: 12, color: '#22543D', marginBottom: 20, fontStyle: 'italic' },
  
  transpoInput: { backgroundColor: '#E5E7EB', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, borderWidth: 1, borderColor: '#CCCCCC', fontSize: 13, color: '#111', marginBottom: 10, maxWidth: 400 },

  conductChecksContainer: { flexDirection: 'column', gap: 15 },
  conductCheckCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 20 } as any,
  conductCheckCardActive: { borderColor: '#4273B8', backgroundColor: '#F4F8FF' },
  conductCheckboxSquare: { width: 22, height: 22, borderWidth: 1.5, borderColor: '#111', marginRight: 15, alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: '#FFF' },
  conductCheckboxActive: { backgroundColor: '#4273B8', borderColor: '#4273B8' },
  conductCheckmark: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  conductCheckLabel: { fontSize: 13, color: '#333', flex: 1, lineHeight: 20 },

  warningText: { fontSize: 11, color: '#111', marginBottom: 10, textAlign: 'left' },
  step3ActionRow: { flexDirection: 'row', gap: 15 } as any,
  backBtnStep3: { flex: 1, backgroundColor: '#E5E7EB', paddingVertical: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB' },
  backBtnTextStep3: { color: '#111', fontSize: 15, fontWeight: 'bold' },
  submitBtnStep3: { flex: 2, backgroundColor: '#4273B8', paddingVertical: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#2B4A77' },
  submitBtnTextStep3: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },

  // ==========================================
  // STEP 4 (SUCCESS SCREEN) STYLES
  // ==========================================
  step4Container: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10 },
  
  successCard: { alignSelf: 'center', width: '80%', maxWidth: 900, backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 12, overflow: 'hidden' } as any,
  successHeaderRow: { backgroundColor: '#4273B8', paddingVertical: 18, alignItems: 'center' },
  successHeaderText: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  
  successBody: { padding: 40, alignItems: 'center', flexDirection: 'column' } as any,

  // NEW STYLED CHECKMARK ICON
  checkmarkIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0FDF4',
    borderWidth: 3,
    borderColor: '#2D8A61',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    boxShadow: '0px 2px 10px rgba(0,0,0,0.05)'
  } as any,
  checkmarkIconText: {
    color: '#2D8A61',
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: -3,
  },

  thankYouTitle: { fontSize: 26, fontWeight: 'bold', color: '#111', marginBottom: 15 },
  successDescText: { fontSize: 14, color: '#444', textAlign: 'center', lineHeight: 22, maxWidth: 650, marginBottom: 30 },

  pipelineContainer: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', width: '100%', maxWidth: 500, marginBottom: 30 } as any,
  pipelineStep: { alignItems: 'center', width: 120 },
  pipelineCircle: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  pipelineStepTitle: { fontSize: 12, fontWeight: 'bold', color: '#111', textAlign: 'center' },
  pipelineStepSub: { fontSize: 10, color: '#666', textAlign: 'center' },
  pipelineLine: { flex: 1, height: 4, marginTop: 23, marginHorizontal: -10, borderRadius: 2 }, 

  successDetailText: { fontSize: 14, color: '#333', textAlign: 'center', marginBottom: 8, lineHeight: 20 },
  
  // NEW DONOR PROMPT STYLES
  donorPromptText: { fontSize: 20, fontWeight: 'bold', color: '#111', textAlign: 'center' },
  yesDonorBtn: { backgroundColor: '#2D8A61', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12, alignItems: 'center' },
  yesDonorBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  noDonorBtn: { backgroundColor: '#FFFFFF', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#CCC' },
  noDonorBtnText: { color: '#444', fontSize: 16, fontWeight: 'bold' },

});