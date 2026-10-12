import { useState, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { COLORS } from '@/constants/theme';
import { useOnboarding } from '@/context/OnboardingContext';

const SERIF = Platform.select({ ios: 'Georgia', default: 'serif' });

const stroke = {
  stroke: COLORS.primary,
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  fill: 'none',
};

// A: an unsettled line coming to rest, with a stone set down on it.
const PutItDown = () => (
  <Svg width={220} height={160} viewBox="0 0 220 160">
    <Path {...stroke} d="M10 60 C 40 20, 60 100, 90 60 S 130 40, 150 110" />
    <Path {...stroke} d="M30 130 H 190" />
    <Circle {...stroke} cx={160} cy={118} r={12} />
  </Svg>
);

// B: an open, unclosed circle sheltering a single small dot.
const NoName = () => (
  <Svg width={220} height={160} viewBox="0 0 220 160">
    <Path {...stroke} d="M150 50 A 50 50 0 1 0 156 110" />
    <Path {...stroke} d="M134 64 A 30 30 0 1 0 138 100" />
    <Circle cx={110} cy={80} r={5} fill={COLORS.primary} />
  </Svg>
);

// C: two lines reaching toward each other, almost touching.
const OneTapAway = () => (
  <Svg width={220} height={160} viewBox="0 0 220 160">
    <Path {...stroke} d="M20 130 C 50 130, 70 80, 100 78" />
    <Path {...stroke} d="M200 30 C 170 30, 150 76, 120 78" />
    <Circle cx={100} cy={78} r={4} fill={COLORS.primary} />
    <Circle cx={120} cy={78} r={4} fill={COLORS.primary} />
  </Svg>
);

type Step = { heading: string; body: string; illustration: ReactNode };

const STEPS: Step[] = [
  {
    heading: 'A place to put it down.',
    body: 'However heavy the day was, you can say it here.',
    illustration: <PutItDown />,
  },
  {
    heading: 'Nothing here has your name on it.',
    body: 'No account, no email, no sign-up. What you write is saved only on your phone.',
    illustration: <NoName />,
  },
  {
    heading: 'And if it gets too heavy.',
    body: 'Real people are one tap away, any hour.',
    illustration: <OneTapAway />,
  },
];

export default function OnboardingScreen() {
  const { completeOnboarding } = useOnboarding();
  const [index, setIndex] = useState(0);
  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;

  const next = () => (isLast ? completeOnboarding() : setIndex(index + 1));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.body}>
        <View style={styles.illustration}>{step.illustration}</View>
        <Text style={styles.heading} accessibilityRole="header">
          {step.heading}
        </Text>
        <Text style={styles.text}>{step.body}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots} accessibilityLabel={`Step ${index + 1} of ${STEPS.length}`}>
          {STEPS.map((s, i) => (
            <View key={s.heading} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>

        <Pressable
          onPress={next}
          accessibilityRole="button"
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        >
          <Text style={styles.buttonLabel}>{isLast ? 'Begin' : 'Next'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  illustration: {
    marginBottom: 40,
  },
  heading: {
    fontFamily: SERIF,
    fontSize: 30,
    lineHeight: 38,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  text: {
    fontSize: 17,
    lineHeight: 25,
    color: COLORS.secondary,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.surface,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
