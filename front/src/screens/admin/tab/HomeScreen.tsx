import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AppScreenLayout from '../../../components/layout/AppScreenLayout';

export default function HomeScreen() {
  return (
    <AppScreenLayout withTabBar>
      <View style={s.container}>
        <Text style={s.title}>홈</Text>
      </View>
    </AppScreenLayout>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
});
