import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Modal, Dimensions } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { useAppContext } from '@/components/AppContext';
import { Colors } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

type OnboardingTourProps = {
  visible: boolean;
  onClose: () => void;
};

type TourStep = {
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  pointerStyle: any;
  arrowDirection: 'up' | 'down' | 'none';
  arrowStyle?: any;
};

export function OnboardingTour({ visible, onClose }: OnboardingTourProps) {
  const { theme, user } = useAppContext();
  const colors = Colors[theme];
  const [currentStep, setCurrentStep] = useState(0);

  const steps: TourStep[] = [
    {
      title: 'Camp Finder Map',
      description: 'Explore Sri Lanka\'s premium campsites. Zoom in and out to inspect location pins safely, now powered by Google Maps.',
      icon: 'map',
      iconColor: colors.tint,
      arrowDirection: 'none',
      pointerStyle: {
        top: height * 0.22,
        alignSelf: 'center',
      },
    },
    {
      title: 'Campsite Previews',
      description: 'Swipe through this bottom cards carousel to get a quick summary. Tap any card to open its detailed safety information.',
      icon: 'view-carousel',
      iconColor: '#f97316',
      arrowDirection: 'down',
      arrowStyle: { alignSelf: 'center' },
      pointerStyle: {
        bottom: 210,
        alignSelf: 'center',
      },
    },
    {
      title: 'Survival Utilities',
      description: 'Tap this mountain button in the center to access survival tools: live Compass, Survival Guide, Weather Report, and SOS emergency calls.',
      icon: 'terrain',
      iconColor: colors.tint,
      arrowDirection: 'down',
      arrowStyle: { alignSelf: 'center' },
      pointerStyle: {
        bottom: 85,
        alignSelf: 'center',
      },
    },
    {
      title: 'Camper-AI Assistant',
      description: 'Tap the chat bubble to converse with your AI outdoor assistant. Ask about wilderness routes, packing, or wildlife safety.',
      icon: 'chat-bubble-outline',
      iconColor: '#10b981',
      arrowDirection: 'down',
      arrowStyle: { alignSelf: 'flex-start', marginLeft: width * 0.24 },
      pointerStyle: {
        bottom: 85,
        left: width * 0.06,
      },
    },
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await finishTour();
    }
  };

  const handleSkip = async () => {
    await finishTour();
  };

  const finishTour = async () => {
    try {
      if (user?.id !== 'guest') {
        await AsyncStorage.setItem('has_seen_onboarding_tour', 'true');
      }
    } catch (e) {
      console.error(e);
    }
    setCurrentStep(0);
    onClose();
  };

  if (!visible) return null;

  const step = steps[currentStep];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        {/* Pointer indicator pointing to the feature */}
        <View style={[styles.pointerContainer, step.pointerStyle]}>
          {step.arrowDirection === 'up' && (
            <MaterialIcons name="arrow-upward" size={32} color={colors.tint} style={[styles.arrow, step.arrowStyle]} />
          )}
          
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.header}>
              <View style={[styles.iconWrapper, { backgroundColor: theme === 'dark' ? '#1c2230' : '#f1f5f9' }]}>
                <MaterialIcons name={step.icon as any} size={26} color={step.iconColor} />
              </View>
              <View style={styles.titleWrapper}>
                <ThemedText style={[styles.stepText, { color: colors.mutedText }]}>
                  STEP {currentStep + 1} OF {steps.length}
                </ThemedText>
                <ThemedText type="subtitle" style={[styles.title, { color: colors.text }]}>
                  {step.title}
                </ThemedText>
              </View>
            </View>

            <ThemedText style={[styles.description, { color: colors.mutedText }]}>
              {step.description}
            </ThemedText>

            {/* Step Indicators */}
            <View style={styles.indicatorContainer}>
              {steps.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.indicator,
                    { backgroundColor: idx === currentStep ? colors.tint : theme === 'dark' ? '#334155' : '#cbd5e1' },
                  ]}
                />
              ))}
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Pressable style={styles.skipBtn} onPress={handleSkip}>
                <ThemedText style={[styles.skipText, { color: colors.mutedText }]}>Skip</ThemedText>
              </Pressable>
              
              <Pressable style={[styles.nextBtn, { backgroundColor: colors.tint }]} onPress={handleNext}>
                <ThemedText style={styles.nextText}>
                  {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                </ThemedText>
                <MaterialIcons
                  name={currentStep === steps.length - 1 ? 'check' : 'arrow-forward'}
                  size={16}
                  color="#030712"
                />
              </Pressable>
            </View>
          </View>

          {step.arrowDirection === 'down' && (
            <MaterialIcons name="arrow-downward" size={32} color={colors.tint} style={[styles.arrow, step.arrowStyle]} />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3,7,18,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointerContainer: {
    position: 'absolute',
    width: width * 0.88,
    alignItems: 'center',
    gap: 8,
  },
  arrow: {
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 20,
    gap: 16,
    elevation: 24,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleWrapper: {
    flex: 1,
    gap: 2,
  },
  stepText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  indicatorContainer: {
    flexDirection: 'row',
    gap: 6,
    alignSelf: 'flex-start',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  skipBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    fontWeight: '600',
    fontSize: 14,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  nextText: {
    color: '#030712',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
