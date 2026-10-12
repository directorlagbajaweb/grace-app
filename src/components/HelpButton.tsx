import { Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { COLORS } from '@/constants/theme';

export default function HelpButton() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={() => router.push('/help')}
      accessibilityRole="button"
      accessibilityLabel="Talk to someone"
      style={({ pressed }) => [
        styles.button,
        { paddingBottom: 16 + insets.bottom },
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.label}>📞 Talk to someone</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    alignItems: 'center',
    backgroundColor: COLORS.danger,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
