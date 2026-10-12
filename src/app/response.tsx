import { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import HelpButton from '@/components/HelpButton';
import HelplineList from '@/components/HelplineList';
import { COLORS } from '@/constants/theme';
import { generateResponse, type AIResponse } from '@/services/ai';
import { checkRisk } from '@/utils/riskCheck';

const SERIF = Platform.select({ ios: 'Georgia', default: 'serif' });

export default function ResponseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ text?: string | string[] }>();
  const text = Array.isArray(params.text) ? params.text.join(' ') : params.text ?? '';

  // Synchronous and on-device, so the risk card is ready on the first frame.
  const riskLevel = useMemo(() => checkRisk(text), [text]);
  const [response, setResponse] = useState<AIResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    setResponse(null);
    generateResponse(text).then((result) => {
      if (!cancelled) setResponse(result);
    });
    return () => {
      cancelled = true;
    };
  }, [text]);

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
          {riskLevel === 'immediate' && (
            <View style={styles.immediateCard}>
              <Text style={styles.riskMessage}>
                You don't have to carry this alone. Real people are ready to listen right
                now.
              </Text>
              <HelplineList />
            </View>
          )}

          {riskLevel !== 'immediate' && (
            <Text style={styles.acknowledgement}>
              You carried that alone. You don't have to.
            </Text>
          )}

          {riskLevel === 'elevated' && (
            <View style={styles.elevatedCard}>
              <Text style={styles.riskMessage}>
                Whatever you're carrying, you don't have to carry it alone. Someone is ready
                to listen if you need them.
              </Text>
              <Pressable
                onPress={() => router.push('/help')}
                accessibilityRole="link"
                hitSlop={8}
              >
                <Text style={styles.talkLink}>Talk to someone →</Text>
              </Pressable>
            </View>
          )}

          {response === null ? (
            <Text style={styles.loadingText}>Finding words for this moment...</Text>
          ) : (
            <>
              <View style={styles.scriptureCard}>
                <Text style={styles.scripture}>{response.scripture}</Text>
                <Text style={styles.reference}>{response.reference}</Text>
              </View>

              <View style={styles.prayerCard}>
                <Text style={styles.prayerLabel}>A prayer for today</Text>
                <Text style={styles.prayer}>{response.prayer}</Text>
              </View>
            </>
          )}
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
  loadingText: {
    fontFamily: SERIF,
    fontSize: 18,
    color: COLORS.secondary,
    textAlign: 'center',
    paddingVertical: 32,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    // Clears the fixed HelpButton (label + padding + home indicator inset)
    paddingBottom: 120,
    gap: 20,
  },
  acknowledgement: {
    fontFamily: SERIF,
    fontSize: 24,
    lineHeight: 32,
    color: COLORS.text,
  },
  immediateCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E24B4A',
    backgroundColor: '#FEF2F2',
    gap: 16,
  },
  elevatedCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
    gap: 12,
  },
  riskMessage: {
    fontFamily: SERIF,
    fontSize: 17,
    lineHeight: 25,
    color: COLORS.text,
  },
  talkLink: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  scriptureCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    gap: 12,
  },
  scripture: {
    fontFamily: SERIF,
    fontSize: 18,
    lineHeight: 27,
    color: COLORS.text,
  },
  reference: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  prayerCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.surface,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  prayerLabel: {
    fontSize: 12,
    color: COLORS.secondary,
  },
  prayer: {
    fontFamily: SERIF,
    fontSize: 17,
    lineHeight: 26,
    color: COLORS.text,
  },
});
