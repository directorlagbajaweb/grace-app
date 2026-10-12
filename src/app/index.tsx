import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';

import HelpButton from '@/components/HelpButton';
import { COLORS } from '@/constants/theme';
import { saveEntry } from '@/services/storage';

const SERIF = Platform.select({ ios: 'Georgia', default: 'serif' });

export default function VentScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [releasing, setReleasing] = useState(false);

  const release = async () => {
    if (!text.trim() || releasing) return;
    setReleasing(true);
    try {
      await saveEntry(text);
    } catch {
      // A failed save must never stop someone getting their response.
    }
    setReleasing(false);
    router.push({ pathname: '/response', params: { text } });
  };
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.topBar}>
            <Pressable
              onPress={() => router.push('/today')}
              accessibilityRole="button"
              accessibilityLabel="Today's verse"
              hitSlop={12}
            >
              <Text style={styles.topIcon}>📖</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/settings')}
              accessibilityRole="button"
              accessibilityLabel="Settings"
              hitSlop={12}
            >
              <Text style={styles.topIcon}>⚙️</Text>
            </Pressable>
          </View>

          <Text style={styles.heading}>What's on your heart today?</Text>

          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Take your time. No one sees this but you."
            placeholderTextColor={COLORS.secondary}
            multiline
            textAlignVertical="top"
          />
          <View style={styles.footerRow}>
            <Text style={styles.privacy}>🔒 Saved on this phone only. Sent privately to generate your response.</Text>
            <Pressable
              onPress={release}
              accessibilityRole="button"
              style={({ pressed }) => [styles.release, pressed && styles.pressed]}
            >
              <Text style={styles.releaseLabel}>Release</Text>
            </Pressable>
          </View>
        </View>
        <HelpButton />
      </KeyboardAvoidingView>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    // Clears the fixed HelpButton (label + padding + home indicator inset)
    paddingBottom: 100,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  topIcon: {
    fontSize: 22,
  },
  heading: {
    fontFamily: SERIF,
    fontSize: 30,
    lineHeight: 38,
    color: COLORS.text,
    marginTop: 8,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    fontSize: 17,
    lineHeight: 24,
    color: COLORS.text,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  privacy: {
    flexShrink: 1,
    marginRight: 12,
    fontSize: 14,
    color: COLORS.secondary,
  },
  release: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  releaseLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
