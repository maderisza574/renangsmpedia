import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

export default function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  // Bottom padding ensures labels are NEVER cut off on ANY phone (with gesture bar or 3-button nav)
  const bottomInset = insets.bottom > 0 ? insets.bottom + 6 : (Platform.OS === 'android' ? 14 : 16);

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: bottomInset }]}>
      <View style={styles.tabBarContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const color = isFocused ? Colors.primary : Colors.textSecondary;

          const renderIcon = () => {
            if (route.name === 'Beranda' || route.name === 'Home') {
              return (
                <MaterialCommunityIcons
                  name={isFocused ? 'home' : 'home-outline'}
                  size={26}
                  color={color}
                />
              );
            } else if (route.name === 'Materi' || route.name === 'Education') {
              return (
                <MaterialCommunityIcons
                  name={isFocused ? 'book-open-variant' : 'book-open-page-variant-outline'}
                  size={24}
                  color={color}
                />
              );
            } else if (route.name === 'Progress') {
              return (
                <MaterialCommunityIcons
                  name={isFocused ? 'chart-box' : 'chart-box-outline'}
                  size={24}
                  color={color}
                />
              );
            } else if (route.name === 'Pengaturan' || route.name === 'Profile' || route.name === 'About') {
              return (
                <MaterialCommunityIcons
                  name={isFocused ? 'cog' : 'cog-outline'}
                  size={24}
                  color={color}
                />
              );
            }
            return null;
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              activeOpacity={0.7}
              style={styles.tabButton}
            >
              <View style={styles.iconContainer}>
                {renderIcon()}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color,
                    fontWeight: isFocused ? '700' : '500',
                  },
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
              {isFocused ? <View style={styles.activeIndicator} /> : <View style={styles.indicatorPlaceholder} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1.5,
    borderTopColor: Colors.border,
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 16,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    includeFontPadding: false, // Prevents Android font clipping
  },
  activeIndicator: {
    width: 28,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
  indicatorPlaceholder: {
    height: 3,
    marginTop: 4,
  },
});
