import { useMemo } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';

import HelpButton from '@/components/HelpButton';
import { SCRIPTURES } from '@/constants/scriptures';
import { COLORS } from '@/constants/theme';

const SERIF = Platform.select({ ios: 'Georgia', default: 'serif' });

const DAILY_VERSES = SCRIPTURES.filter((s) => s.dailyVerse);

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// e.g. "Monday, 7 October"
const formatDate = (date: Date) =>
  `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;

// 1 for 1 January. Uses UTC maths on the local calendar date to avoid DST shifts.
const dayOfYear = (date: Date) =>
  (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
    Date.UTC(date.getFullYear(), 0, 0)) /
  86_400_000;

export default function TodayScreen() {
  const router = useRouter();

  const { dateLabel, verse } = useMemo(() => {
    const today = new Date();
    return {
      dateLabel: formatDate(today),
      verse: DAILY_VERSES[dayOfYear(today) % DAILY_VERSES.length],
    };
  }, []);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={12}
          >
            <Text style={styles.back}>←</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.date}>{dateLabel}</Text>

          <Text style={styles.scripture}>{verse.text}</Text>
          <Text style={styles.reference}>{verse.reference}</Text>

          <Pressable
            onPress={() => router.dismissTo('/')}
            accessibilityRole="link"
            hitSlop={8}
          >
            <Text style={styles.writeLink}>Write about this →</Text>
          </Pressable>
        </ScrollView>

        <HelpButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  back: {
    fontSize: 26,
    color: COLORS.text,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 16,
    // Clears the fixed HelpButton (label + padding + home indicator inset)
    paddingBottom: 120,
  },
  date: {
    fontSize: 14,
    color: COLORS.secondary,
    marginBottom: 48,
  },
  scripture: {
    fontFamily: SERIF,
    fontSize: 26,
    lineHeight: 40,
    color: COLORS.text,
    textAlign: 'center',
  },
  reference: {
    marginTop: 24,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
  writeLink: {
    marginTop: 48,
    fontSize: 15,
    color: COLORS.primary,
  },
});
