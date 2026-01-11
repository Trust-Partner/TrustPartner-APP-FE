import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { colors } from '../../../constants/colors';
import AppHeader from '../../../components/common/AppHeader';
import { useAuthStore } from '../../../states/useAuthStore';
import { useCarFees } from '../../../hooks/mypage/useCarFees';
import { usePartnerGrades } from '../../../hooks/mypage/usePartnerGrades';
import { useStaffMe } from '../../../hooks/mypage/useStaffMe';

export default function MyInfoScreen() {
  const user = useAuthStore(state => state.user);

  // 관리자만 금액표 접근 가능
  const canAccessFee = user?.role.code !== 'MANAGER';

  // --- 관리자 정보 ---
  const { data: myInfo } = useStaffMe();

  // --- 등급 리스트 ---
  const { data: grades = [] } = usePartnerGrades();

  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  useEffect(() => {
    if (grades.length > 0 && selectedGrade === null) {
      setSelectedGrade(grades[0].gradeId);
    }
  }, [grades, selectedGrade]);

  const [open, setOpen] = useState(false);

  // --- 차량 관리 금액표 ---
  const { data: carFeeData } = useCarFees(selectedGrade ?? undefined);
  const carFees = carFeeData?.grades ?? [];

  if (!myInfo) return null;

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
        {/* --------- 프로필 카드 --------- */}
        <View style={s.profileCard}>
          <View style={s.profileCircle}>
            <Image
              source={require('../../../assets/admin-myinfo/default_profile.png')}
              style={s.profileIcon}
            />
          </View>

          <View>
            <View style={s.row}>
              <Text style={s.name}>{myInfo.staffName}</Text>
              <Text style={s.badge}>{myInfo.staffRole.description}</Text>
            </View>
            <Text style={s.branch}>{myInfo.branch}</Text>
          </View>
        </View>

        {/* --------- 차량관리 금액표 --------- */}
        {canAccessFee && (
          <View style={s.card}>
            <View style={s.cardHeader}>
              <View style={s.cardTitleBox}>
                <Image
                  source={require('../../../assets/admin-myinfo/money.png')}
                  style={s.icon}
                />
                <Text style={s.cardTitle}>차량관리 금액표</Text>
              </View>

              {/* 드롭다운 */}
              <View style={{ position: 'relative' }}>
                <Pressable style={s.selectBox} onPress={() => setOpen(!open)}>
                  <Text style={s.selectText}>
                    {grades.find(g => g.gradeId === selectedGrade)?.gradeName ??
                      '등급 선택'}
                  </Text>
                  <Image
                    source={require('../../../assets/common/down_arrow.png')}
                    style={s.arrow}
                  />
                </Pressable>

                {open && (
                  <View style={s.dropdown}>
                    {grades.map(grade => (
                      <Pressable
                        key={grade.gradeId}
                        style={[
                          s.dropdownItem,
                          grade.gradeId === selectedGrade &&
                            s.dropdownItemActive,
                        ]}
                        onPress={() => {
                          setSelectedGrade(grade.gradeId);
                          setOpen(false);
                        }}
                      >
                        <Text
                          style={[
                            s.dropdownText,
                            grade.gradeId === selectedGrade &&
                              s.dropdownTextActive,
                          ]}
                        >
                          {grade.gradeName}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* 금액표 Row */}
            {carFees.map((item, i) => (
              <View key={i} style={s.tableRow}>
                <Text style={s.tableLeft}>{item.gradeName}</Text>
                <Text style={s.tableRight}>{item.managementFee}</Text>
              </View>
            ))}
          </View>
        )}

        {/* --------- 지급비율표 --------- */}
        {canAccessFee && (
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

            {grades.map((g, i) => (
              <View key={i} style={s.rateCard}>
                <View>
                  <Text style={s.gradeLabel}>{g.gradeName}</Text>
                  <Text style={s.gradeSub}>{g.description}</Text>
                </View>

                <View style={s.rateCardRight}>
                  <Text style={s.rateText}>{g.discountRate}%</Text>
                  <Text style={s.rateDesc}>지급비율</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_00,
    padding: 20,
  },
  header: {
    fontSize: 20,
    color: colors.GRAY_90,
  },
  profileCard: {
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    marginBottom: 16,
  },
  profileCircle: {
    padding: 16,
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
    fontSize: 22,
    fontWeight: '700',
    color: colors.GRAY_80,
    lineHeight: 31,
  },
  badge: {
    backgroundColor: colors.PRIMARY_10,
    color: colors.PRIMARY_50,
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 25,
    marginLeft: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
  },
  branch: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_80,
    lineHeight: 25,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    paddingVertical: 16,
    paddingHorizontal: 20,
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
    fontSize: 18,
    fontWeight: '600',
    color: colors.GRAY_80,
    lineHeight: 28,
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
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selectText: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_60,
    lineHeight: 25,
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
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    elevation: 3,
    zIndex: 99,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignSelf: 'center',
  },
  dropdownItemActive: {
    backgroundColor: colors.GRAY_05,
  },
  dropdownText: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_60,
    lineHeight: 25,
  },
  dropdownTextActive: {
    color: colors.PRIMARY_50,
  },

  /* 금액 테이블 */
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_15,
  },
  tableLeft: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_70,
    lineHeight: 25,
  },
  tableRight: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_70,
    lineHeight: 25,
  },

  /* 지급비율 */
  rateCard: {
    backgroundColor: colors.GRAY_05,
    borderRadius: 4,
    padding: 12,
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
    fontSize: 18,
    fontWeight: '500',
    color: colors.GRAY_80,
  },
  gradeSub: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_50,
    marginTop: 4,
  },
  rateText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.PRIMARY_50,
  },
  rateDesc: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_50,
    marginTop: 4,
  },
});
