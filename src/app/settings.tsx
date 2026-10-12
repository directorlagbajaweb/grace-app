import { useEffect, useState, type ReactNode } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HelpButton from '@/components/HelpButton';
import { COLORS } from '@/constants/theme';
import { clearAllEntries } from '@/services/storage';

const DAILY_REMINDER_KEY = 'settings.dailyReminder';

type RowProps = {
  label: string;
  danger?: boolean;
  last?: boolean;
  onPress?: () => void;
  right?: ReactNode;
};

function Row({ label, danger, last, onPress, right }: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => [
        styles.row,
        !last && styles.divider,
        pressed && styles.rowPressed,
      ]}
    >
      <Text style={[styles.rowLabel, danger && styles.danger]}>{label}</Text>
      {right}
    </Pressable>
  );
}

const Chevron = () => <Text style={styles.chevron}>›</Text>;

export default function SettingsScreen() {
  const router = useRouter();
  const [dailyReminder, setDailyReminder] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(DAILY_REMINDER_KEY)
      .then((value) => setDailyReminder(value === 'true'))
      .catch(() => {});
  }, []);

  const toggleDailyReminder = (value: boolean) => {
    setDailyReminder(value);
    AsyncStorage.setItem(DAILY_REMINDER_KEY, String(value)).catch(() => {});
  };

  const confirmClear = () =>
    Alert.alert(
      "Clear everything I've written",
      "This will permanently delete everything you've written. This cannot be undone.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            clearAllEntries().catch(() =>
              Alert.alert('Something went wrong', 'Your entries could not be cleared. Please try again.')
            );
          },
        },
      ]
    );

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
          <Text style={styles.heading}>Settings</Text>

          <View style={styles.list}>
            <Row
              label="Daily reminder"
              right={
                <Switch
                  value={dailyReminder}
                  onValueChange={toggleDailyReminder}
                  trackColor={{ true: COLORS.primary }}
                  accessibilityLabel="Daily reminder"
                />
              }
            />
            <Row
              label="Reminder time"
              onPress={() => console.log('reminder time tapped')}
              right={<Text style={styles.value}>8:00 AM</Text>}
            />
            <Row label="Clear everything I've written" danger onPress={confirmClear} />
            <Row
              label="About this app"
              onPress={() => console.log('about tapped')}
              right={<Chevron />}
            />
            <Row
              label="Crisis lines"
              onPress={() => router.push('/help')}
              right={<Chevron />}
              last
            />
          </View>

          <Text style={styles.footer}>
            Your words are saved only on this phone, encrypted, and deleted after 30 days. They
            are sent privately to generate your response.
          </Text>
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
    paddingHorizontal: 24,
    // Clears the fixed HelpButton (label + padding + home indicator inset)
    paddingBottom: 120,
  },
  heading: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  list: {
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingVertical: 12,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.secondary,
  },
  rowPressed: {
    opacity: 0.6,
  },
  rowLabel: {
    flexShrink: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  danger: {
    color: COLORS.danger,
  },
  value: {
    fontSize: 16,
    color: COLORS.secondary,
  },
  chevron: {
    fontSize: 22,
    color: COLORS.secondary,
  },
  footer: {
    marginTop: 'auto',
    fontSize: 13,
    color: COLORS.secondary,
    textAlign: 'center',
  },
});
