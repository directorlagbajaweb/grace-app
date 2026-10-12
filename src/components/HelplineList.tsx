import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { HELPLINES, type Helpline } from '@/constants/helplines';
import { COLORS } from '@/constants/theme';

const EMERGENCY_PHONE = '112';

export default function HelplineList() {
  const [failedPhones, setFailedPhones] = useState<string[]>([]);

  const contact = async ({ phone, contactMethod }: Helpline) => {
    const url =
      contactMethod === 'whatsapp'
        ? 'https://wa.me/234' + phone.replace(/^0/, '')
        : 'tel:' + phone;
    try {
      await Linking.openURL(url);
    } catch {
      setFailedPhones((prev) => (prev.includes(phone) ? prev : [...prev, phone]));
    }
  };

  return (
    <View style={styles.list}>
      {HELPLINES.map((line) => {
        const isEmergency = line.phone === EMERGENCY_PHONE;
        const accent = isEmergency ? COLORS.danger : COLORS.primary;
        const failed = failedPhones.includes(line.phone);
        const isWhatsApp = line.contactMethod === 'whatsapp';

        return (
          <Pressable
            key={line.phone}
            onPress={() => contact(line)}
            accessibilityRole="button"
            accessibilityLabel={
              isWhatsApp
                ? `Message ${line.name} on WhatsApp, ${line.phone}`
                : `Call ${line.name}, ${line.phone}`
            }
            style={({ pressed }) => [
              styles.row,
              isEmergency && styles.emergencyRow,
              pressed && styles.rowPressed,
            ]}
          >
            <View style={styles.rowText}>
              <Text style={styles.name}>{line.name}</Text>
              <View style={styles.descriptorRow}>
                <Text style={styles.descriptor}>{line.descriptor}</Text>
                {line.tollFree && <Text style={styles.tollFree}>Toll free</Text>}
              </View>
              {failed && (
                <Text style={styles.fallback} selectable>
                  {isWhatsApp
                    ? `Couldn't open WhatsApp. Message ${line.phone}`
                    : `Couldn't start the call. Dial ${line.phone}`}
                </Text>
              )}
            </View>
            {isWhatsApp ? (
              <Text style={[styles.waLabel, { color: accent }]}>WA</Text>
            ) : (
              <Text style={[styles.icon, { color: accent }]}>✆</Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.surface,
    backgroundColor: COLORS.surface,
  },
  emergencyRow: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.bg,
  },
  rowPressed: {
    opacity: 0.7,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  descriptorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  descriptor: {
    fontSize: 14,
    color: COLORS.secondary,
  },
  tollFree: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  fallback: {
    marginTop: 6,
    fontSize: 15,
    color: COLORS.text,
  },
  icon: {
    fontSize: 26,
    marginLeft: 12,
  },
  waLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 12,
  },
});
