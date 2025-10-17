import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
} from 'react-native';
import { colors } from '../../../constants/colors';
import { adminMyInfoMock } from '../../../mock/adminMyInfoMock';
import AppHeader from '../../../components/common/AppHeader';

export default function MyInfoScreen() {
  const data = adminMyInfoMock;
  const [selectedGrade, setSelectedGrade] = useState<
    keyof typeof data.carRatesByGrade
  >(data.grade as keyof typeof data.carRatesByGrade);
  const [open, setOpen] = useState(false);

  const carRates = data.carRatesByGrade[selectedGrade];

  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        canGoBack
        centerContent={<Text style={s.header}>내 정보</Text>}
      />
      <ScrollView
        style={s.container}
        contentContainerStyle={{ paddingBottom: 16 }}
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
              <Text style={s.name}>{data.name}</Text>
              <Text style={s.badge}>{data.role}</Text>
            </View>
            <Text style={s.branch}>{data.branch}</Text>
          </View>
        </View>

        {/* 차량관리 금액표 */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <View style={s.cardTitleBox}>
              <Image
                source={require('../../../assets/admin-myinfo/money.png')}
                style={s.icon}
              />
              <Text style={s.cardTitle}>차량관리 금액표</Text>
            </View>

            {/* 등급 드롭다운 */}
            <View style={{ position: 'relative' }}>
              <TouchableOpacity
                style={s.selectBox}
                onPress={e => {
                  setOpen(!open);
                }}
                activeOpacity={0.8}
              >
                <Text style={s.selectText}>{selectedGrade}</Text>
                <Image
                  source={require('../../../assets/common/down_arrow.png')}
                  style={s.arrow}
                />
              </TouchableOpacity>

              {open && (
                <View style={s.dropdown}>
                  {Object.keys(data.carRatesByGrade).map(grade => (
                    <TouchableOpacity
                      key={grade}
                      style={[
                        s.dropdownItem,
                        grade === selectedGrade && s.dropdownItemActive,
                      ]}
                      onPress={e => {
                        setSelectedGrade(
                          grade as keyof typeof data.carRatesByGrade,
                        );
                        setOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          s.dropdownText,
                          grade === selectedGrade && s.dropdownTextActive,
                        ]}
                      >
                        {grade}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* 금액표 */}
          <FlatList
            data={carRates}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View style={s.tableRow}>
                <Text style={s.tableLeft}>{item.type}</Text>
                <Text style={s.tableRight}>{item.amount}</Text>
              </View>
            )}
          />
        </View>

        {/* 등급별 지급비율표 */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <View style={s.cardTitleBox}>
              <Image
                source={require('../../../assets/admin-myinfo/chart.png')}
                style={s.icon}
              />
              <Text style={s.cardTitle}>등급별 지급비율표</Text>
            </View>
          </View>

          {data.gradeRates.map((g, i) => (
            <View key={i} style={s.rateCard}>
              <View>
                <Text style={s.gradeLabel}>{g.grade}</Text>
                <Text style={s.gradeSub}>{g.name}</Text>
              </View>

              <View style={s.rateCardRight}>
                <Text style={s.rateText}>{g.rate}</Text>
                <Text style={s.rateDesc}>지급비율</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
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
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    marginBottom: 16,
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
  branch: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_80,
    lineHeight: 15.4,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitleBox: {
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
  /* 드롭다운 관련 */
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.GRAY_05,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  selectText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_60,
    lineHeight: 15.4,
    marginRight: 4,
  },
  arrow: {
    width: 12,
    height: 12,
    tintColor: colors.GRAY_50,
  },
  dropdown: {
    position: 'absolute',
    justifyContent: 'center',
    top: 30,
    right: 0,
    // width: '100%',
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    elevation: 3,
    zIndex: 99,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: 'center',
  },
  dropdownItemActive: {
    backgroundColor: colors.GRAY_05,
  },
  dropdownText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_60,
    lineHeight: 15.4,
  },
  dropdownTextActive: {
    color: colors.PRIMARY_50,
  },

  /* 금액 테이블 */
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_15,
  },
  tableLeft: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_70,
    lineHeight: 15.4,
  },
  tableRight: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_70,
    lineHeight: 15.4,
  },

  /* 지급비율 */
  rateCard: {
    backgroundColor: colors.GRAY_05,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.GRAY_10,
  },
  rateCardRight: {
    alignItems: 'flex-end',
  },
  gradeLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.GRAY_80,
  },
  gradeSub: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_50,
    marginTop: 4,
  },
  rateText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.PRIMARY_50,
  },
  rateDesc: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_50,
    marginTop: 4,
  },
});
