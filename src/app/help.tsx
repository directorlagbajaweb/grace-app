import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

import HelplineList from '@/components/HelplineList';
import { COLORS } from '@/constants/theme';

export default function HelpScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>You matter</Text>
        <Text style={styles.subtitle}>
          Real people, any hour. Check each line for call charges.
        </Text>

        <HelplineList />

        <Text style={styles.footer}>112 is toll free and works without airtime.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.secondary,
    marginBottom: 12,
  },
  footer: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.secondary,
    textAlign: 'center',
  },
});
