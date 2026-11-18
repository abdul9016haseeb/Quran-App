import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/PreferencesProvider';
import { AppText } from '../../../components/ui/AppText';

interface CompassProps {
  /** Degrees clockwise from true north. */
  bearing: number;
  size?: number;
}

/**
 * Static Qibla compass illustration. The bearing is supplied by the caller;
 * no magnetometer or location sensor is connected in this milestone.
 */
export function Compass({ bearing, size = 270 }: CompassProps) {
  const theme = useAppTheme();
  const radius = size / 2 - 12;
  const ticks = Array.from({ length: 72 }, (_, index) => index * 5);

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={`கிப்லா திசைகாட்டி, ${bearing.toFixed(1)} டிகிரி`}
      style={{ width: size, height: size }}
    >
      <View
        style={[
          styles.face,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.gold,
          },
        ]}
      >
        <View
          style={[
            styles.innerRing,
            {
              top: 20,
              bottom: 20,
              left: 20,
              right: 20,
              borderRadius: (size - 40) / 2,
              borderColor: theme.colors.border,
            },
          ]}
        />
        <View
          style={[
            styles.innerRing,
            {
              top: 42,
              bottom: 42,
              left: 42,
              right: 42,
              borderRadius: (size - 84) / 2,
              borderColor: theme.colors.divider,
            },
          ]}
        />

        {ticks.map((angle) => {
          const radians = (angle * Math.PI) / 180;
          const isMajor = angle % 45 === 0;
          const isMedium = angle % 15 === 0;

          return (
            <View
              key={angle}
              style={{
                position: 'absolute',
                left: size / 2 + radius * Math.sin(radians) - 1,
                top:
                  size / 2 -
                  radius * Math.cos(radians) -
                  (isMajor ? 6 : isMedium ? 4 : 2.5),
                width: isMajor ? 2.5 : 1.5,
                height: isMajor ? 12 : isMedium ? 8 : 5,
                borderRadius: 1,
                backgroundColor: isMajor
                  ? theme.colors.gold
                  : theme.colors.borderStrong,
                transform: [{ rotate: `${angle}deg` }],
              }}
            />
          );
        })}

        <AppText
          variant="label"
          color={theme.colors.goldText}
          style={[styles.cardinal, { top: 30, left: 0, right: 0 }]}
        >
          N
        </AppText>
        <AppText
          variant="label"
          color={theme.colors.textMuted}
          style={[styles.cardinal, { top: size / 2 - 8, right: 28 }]}
        >
          E
        </AppText>
        <AppText
          variant="label"
          color={theme.colors.textMuted}
          style={[styles.cardinal, { bottom: 30, left: 0, right: 0 }]}
        >
          S
        </AppText>
        <AppText
          variant="label"
          color={theme.colors.textMuted}
          style={[styles.cardinal, { top: size / 2 - 8, left: 28 }]}
        >
          W
        </AppText>

        <View
          style={{
            position: 'absolute',
            width: size,
            height: size,
            transform: [{ rotate: `${bearing}deg` }],
          }}
          pointerEvents="none"
        >
          <View
            style={{
              position: 'absolute',
              top: size * 0.17,
              left: size / 2 - 7,
              width: 0,
              height: 0,
              borderLeftWidth: 7,
              borderRightWidth: 7,
              borderBottomWidth: 14,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: theme.colors.gold,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: size * 0.17 + 10,
              left: size / 2 - 1.5,
              width: 3,
              height: size * 0.33,
              borderRadius: 2,
              backgroundColor: theme.colors.primary,
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: size / 2 - 5,
              left: size / 2 - 5,
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: theme.colors.gold,
              borderWidth: 2,
              borderColor: theme.colors.surface,
            }}
          />
        </View>

        <View
          style={{
            position: 'absolute',
            top: size / 2 - 18,
            left: size / 2 - 18,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: theme.colors.goldSoft,
            borderWidth: 1,
            borderColor: theme.colors.gold,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 2,
              backgroundColor: theme.colors.headerDeep,
              borderWidth: 1,
              borderColor: theme.colors.gold,
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  face: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRing: {
    position: 'absolute',
    borderWidth: StyleSheet.hairlineWidth,
  },
  cardinal: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: 12,
  },
});
