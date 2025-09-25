import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppScreenLayout from '../components/layout/AppScreenLayout';

export default function DispatchRequestsScreen() {
  return (
    <AppScreenLayout withTabBar>
      <View style={s.container}>
        <Text style={s.title}>배차요청건</Text>
      </View>
    </AppScreenLayout>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '600' },
});
