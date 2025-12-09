import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../../constants/colors';
import AppHeader from '../../../components/common/AppHeader';
import { usePartnerMe } from '../../../hooks/mypage/usePartnerMe';

export default function MyInfoScreen() {
  const { data, isLoading, isError } = usePartnerMe();

  if (isLoading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={colors.PRIMARY_50} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={s.center}>
        <Text>정보를 불러오지 못했습니다.</Text>
      </View>
    );
  }

  const info = data;

  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        canGoBack
        centerContent={<Text style={s.header}>내 정보</Text>}
      />

      <ScrollView
        style={s.container}
        contentContainerStyle={{ paddingBottom: 16 }}
        bounces={false}
      >
        {/* 프로필 카드 */}
        <View style={s.profileCard}>
          <View style={s.profileCircle}>
            <Image
              source={require('../../../assets/admin-myinfo/default_profile.png')}
              style={s.profileIcon}
            />
          </View>

          <View>
            <View style={s.row}>
              <Text style={s.name}>{info.partnerName}</Text>
              <Text style={s.badge}>{info.partnerRole.description}</Text>
            </View>
          </View>
        </View>

        {/* 기본 정보 카드 */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Image
              source={require('../../../assets/common/building.png')}
              style={s.icon}
            />
            <Text style={s.cardTitle}>기본정보</Text>
          </View>

          <View style={s.infoRow}>
            <Text style={s.label}>소속 공업사</Text>
            <Text style={s.value}>{info.branch}</Text>
          </View>

          <View style={s.infoRow}>
            <Text style={s.label}>주소</Text>
            <Text style={s.value}>{info.address}</Text>
          </View>

          <View style={s.infoRow}>
            <Text style={s.label}>휴대폰 번호</Text>
            <Text style={s.value}>{info.phoneNumber}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_00,
    padding: 16,
  },
  header: {
    fontSize: 14,
    color: colors.GRAY_90,
  },
  profileCard: {
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    marginBottom: 8,
  },
  profileCircle: {
    padding: 12,
    borderRadius: 100,
    backgroundColor: colors.PRIMARY_05,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  profileIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.GRAY_80,
    lineHeight: 22.4,
  },
  badge: {
    backgroundColor: colors.PRIMARY_10,
    color: colors.PRIMARY_50,
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15.4,
    marginLeft: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
  card: {
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 4,
    resizeMode: 'contain',
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.GRAY_80,
    lineHeight: 16.8,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  infoRow: {
    marginTop: 8,
  },
  label: {
    fontSize: 12,
    color: colors.GRAY_70,
    marginBottom: 4,
  },
  value: {
    fontSize: 12,
    color: colors.GRAY_90,
    lineHeight: 16.8,
  },
});
