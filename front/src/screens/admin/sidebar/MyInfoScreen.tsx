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
import {
  getMyInfo,
  getPartnerGrades,
  getCarFeesByGrade,
} from '../../../api/mypage';
import { useAuthStore } from '../../../states/useAuthStore';

export default function MyInfoScreen() {
  const user = useAuthStore(state => state.user);

  const [myInfo, setMyInfo] = useState<any>(null);

  const [grades, setGrades] = useState<any[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const [carFees, setCarFees] = useState<any[]>([]);
  const [gradeRates, setGradeRates] = useState<any[]>([]);

  const canAccessFee = user?.roleCode !== 'MANAGER';

  useEffect(() => {
    (async () => {
      try {
        const info = await getMyInfo();

        const userData = info.data.data;
        setMyInfo(userData);

        const gradeRes = await getPartnerGrades();
        const gradeList = gradeRes.data.data ?? [];

        setGrades(gradeList);
        setGradeRates(gradeList);

        if (gradeList.length > 0) {
          setSelectedGrade(gradeList[0].gradeId);
        }
      } catch (e) {
        console.log('MyInfo load error:', e);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedGrade) return;

    (async () => {
      try {
        const res = await getCarFeesByGrade(selectedGrade);

        const feeList = res.data.data.grades ?? [];
        setCarFees(feeList);
      } catch (e) {
        console.log('CarFee load error:', e);
      }
    })();
  }, [selectedGrade]);

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

            {gradeRates.map((g, i) => (
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
