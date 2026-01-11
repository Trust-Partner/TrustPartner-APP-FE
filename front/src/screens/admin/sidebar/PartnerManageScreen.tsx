import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { colors } from '../../../constants/colors';
import ToastMessage from '../../../components/common/ToastMessage';
import { HIT_SLOP } from '../../../constants/touch';
import AppHeader from '../../../components/common/AppHeader';
import PartnerFilterBox from '../../../components/partner/PartnerFilterBox';
import { useAllSimplePartners } from '../../../hooks/partners/useAllSimplePartners';
import { useMonthlyRevenueStatistics } from '../../../hooks/billings/useMonthlyRevenueStatistics';
import { useAvailableRevenueYears } from '../../../hooks/billings/useAvailableRevenueYears';
import { useStaffPartners } from '../../../hooks/partners/useStaffPartners';

export default function PartnerManageScreen() {
  const [tab, setTab] = useState<'sales' | 'count'>('sales');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [openYear, setOpenYear] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

  const { data: partners, isLoading } = useAllSimplePartners();
  const { data: years } = useAvailableRevenueYears();

  const [appliedPartnerIds, setAppliedPartnerIds] = useState<string[] | null>(
    null,
  );
  const yearOptions = years ?? [];

  useEffect(() => {
    if (years && years.length > 0 && selectedYear === null) {
      setSelectedYear(years[0]);
    }
  }, [years, selectedYear]);

  const { data: revenueData, isLoading: revenueLoading } =
    useMonthlyRevenueStatistics({
      year: selectedYear!,
      partnerIds: appliedPartnerIds,
    });

  const toggleOpen = (partnerId: string) => {
    setOpenStates(prev => ({
      ...prev,
      [partnerId]: !prev[partnerId],
    }));
  };

  const { data: staffPartners, isLoading: staffLoading } = useStaffPartners();

  const filteredPartners =
    staffPartners?.filter(p =>
      search.trim() === ''
        ? true
        : p.partnerName.toLowerCase().includes(search.trim().toLowerCase()),
    ) ?? [];

  const handleCopy = (text: string, label: string) => {
    Clipboard.setString(text);
    setToastMsg(`${label}가 복사되었습니다.`);
  };

  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        canGoBack
        centerContent={<Text style={s.header}>거래처 관리</Text>}
      />
      <ScrollView>
        <View style={s.container}>
          {/* 월별 통계 카드 */}
          <View style={s.card}>
            <View style={s.headerRow}>
              <View style={s.headerLeft}>
                <Image
                  source={require('../../../assets/admin-partner/chart.png')}
                  style={{ width: 16, height: 16, marginRight: 4 }}
                />
                <Text style={s.title}>월별 통계</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  position: 'relative',
                }}
              >
                <Pressable
                  style={s.iconBtn}
                  onPress={() => {
                    setOpenFilter(!openFilter);
                    setOpenYear(false);
                  }}
                >
                  <Image
                    source={require('../../../assets/admin-partner/filter.png')}
                    style={{ width: 12, height: 12, tintColor: colors.GRAY_50 }}
                  />
                </Pressable>

                {openFilter && partners && (
                  <View style={s.filterDropdown}>
                    <PartnerFilterBox
                      partners={partners}
                      initialSelectedIds={appliedPartnerIds}
                      onApply={ids => {
                        setAppliedPartnerIds(ids);
                        setOpenFilter(false);
                      }}
                    />
                  </View>
                )}

                <View style={{ position: 'relative' }}>
                  <Pressable
                    style={s.selectBox}
                    onPress={() => {
                      setOpenYear(!openYear);
                      setOpenFilter(false);
                    }}
                  >
                    <Text style={s.selectText}>{selectedYear}</Text>
                    <Image
                      source={require('../../../assets/common/down_arrow.png')}
                      style={s.arrow}
                    />
                  </Pressable>

                  {openYear && (
                    <View
                      style={[s.dropdown, { top: 30, right: 0, width: 80 }]}
                    >
                      {yearOptions.map(y => (
                        <Pressable
                          key={y}
                          style={[
                            s.dropdownItem,
                            y === selectedYear && s.dropdownItemActive,
                          ]}
                          onPress={() => {
                            setSelectedYear(y);
                            setOpenYear(false);
                          }}
                        >
                          <Text
                            style={[
                              s.dropdownText,
                              y === selectedYear && s.dropdownTextActive,
                            ]}
                          >
                            {y}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>

            <View style={s.tabRow}>
              <Text style={s.unitLabel}>월</Text>
              <View style={s.tabGroup}>
                <Pressable
                  style={[s.tab, tab === 'count' && s.tabActive]}
                  onPress={() => setTab('count')}
                >
                  <Text style={[s.tabText, tab === 'count' && s.tabTextActive]}>
                    건수
                  </Text>
                </Pressable>
                <Pressable
                  style={[s.tab, tab === 'sales' && s.tabActive]}
                  onPress={() => setTab('sales')}
                >
                  <Text style={[s.tabText, tab === 'sales' && s.tabTextActive]}>
                    매출
                  </Text>
                </Pressable>
              </View>
            </View>
            <View style={s.topDivider} />

            {revenueData?.statistics.map(item => (
              <View key={item.month} style={s.row}>
                <Text style={s.cell}>{item.month}</Text>
                <Text style={s.cell}>
                  {tab === 'sales'
                    ? `₩ ${item.revenue.toLocaleString('ko-KR')}`
                    : `${item.dispatchCount}건`}
                </Text>
              </View>
            ))}

            <View style={[s.totalRow, s.footer]}>
              <Text style={[s.cell, s.boldMonth]}>합계</Text>
              <Text style={[s.cell, s.boldCell]}>
                {tab === 'sales'
                  ? `₩ ${
                      revenueData?.total.revenue.toLocaleString('ko-KR') ?? 0
                    }`
                  : `${revenueData?.total.dispatchCount ?? 0}건`}
              </Text>
            </View>
          </View>

          <View style={{ margin: 8 }} />

          {/* 담당 거래처 */}
          <View style={s.card}>
            <View style={s.partnerHeader}>
              <View style={s.headerLeft}>
                <Image
                  source={require('../../../assets/common/building.png')}
                  style={{
                    width: 16,
                    height: 16,
                    marginRight: 4,
                  }}
                />
                <Text style={s.title}>담당 거래처</Text>
              </View>
              <View style={s.searchBox}>
                <Image
                  source={require('../../../assets/common/search.png')}
                  style={s.searchIcon}
                />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="거래처명 검색"
                  placeholderTextColor={colors.GRAY_50}
                  style={s.searchInput}
                />
              </View>
            </View>

            <View style={[s.partnerListContainer, { marginTop: 8 }]}>
              <ScrollView
                style={{ maxHeight: 210 }}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                {filteredPartners.map(item => (
                  <View key={item.partnerId} style={s.partnerBox}>
                    <Pressable
                      style={s.partnerTop}
                      onPress={() => toggleOpen(item.partnerId)}
                    >
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <Image
                          source={require('../../../assets/admin-partner/building.png')}
                          style={{
                            width: 16,
                            height: 16,
                            tintColor: colors.PRIMARY_50,
                            marginRight: 6,
                          }}
                        />
                        <Text style={s.partnerName}>{item.partnerName}</Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <View style={s.gradeBadge}>
                          <Text style={s.gradeText}>
                            {item.gradeInfo.gradeName} |{' '}
                            {item.gradeInfo.discountRate}%
                          </Text>
                        </View>
                        <Image
                          source={require('../../../assets/common/down_arrow.png')}
                          style={[
                            s.arrowSmall,
                            openStates[item.partnerId] && {
                              transform: [{ rotate: '180deg' }],
                            },
                          ]}
                        />
                      </View>
                    </Pressable>

                    {openStates[item.partnerId] && (
                      <View style={s.detailBox}>
                        {/* 연락처 */}
                        <View style={s.detailRow}>
                          <Image
                            source={require('../../../assets/admin-partner/phone.png')}
                            style={s.detailIcon}
                          />
                          <Text style={s.detailText}>
                            연락처: {item.phoneNumber}
                          </Text>
                          <Pressable
                            onPress={() =>
                              handleCopy(item.phoneNumber, '연락처')
                            }
                            hitSlop={HIT_SLOP.SAFE_VERTICAL}
                          >
                            <Image
                              source={require('../../../assets/common/copy.png')}
                              style={s.copyIcon}
                            />
                          </Pressable>
                        </View>

                        {/* 주소 */}
                        <View style={s.detailRow}>
                          <Image
                            source={require('../../../assets/admin-partner/location.png')}
                            style={s.detailIcon}
                          />
                          <Text style={s.detailText}>주소: {item.address}</Text>
                          <Pressable
                            onPress={() => handleCopy(item.address, '주소')}
                            hitSlop={HIT_SLOP.SAFE_VERTICAL}
                          >
                            <Image
                              source={require('../../../assets/common/copy.png')}
                              style={s.copyIcon}
                            />
                          </Pressable>
                        </View>

                        {/* 담당자 */}
                        <View style={s.detailRow}>
                          <Image
                            source={require('../../../assets/admin-partner/person.png')}
                            style={s.detailIcon}
                          />
                          <Text style={s.detailText}>
                            담당자: {item.teamLeaderName}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </ScrollView>

      {toastMsg ? (
        <ToastMessage message={toastMsg} onHide={() => setToastMsg('')} />
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.GRAY_00,
  },
  header: {
    fontSize: 20,
    color: colors.GRAY_90,
  },
  card: {
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.GRAY_80,
    lineHeight: 16.8,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  iconBtn: {
    backgroundColor: colors.GRAY_05,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  filterDropdown: {
    position: 'absolute',
    top: 32,
    right: 0,
    zIndex: 100,
    elevation: 5,
  },
  applyButton: {
    marginTop: 8,
    backgroundColor: colors.PRIMARY_50,
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },

  applyButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.WHITE,
  },
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
    fontWeight: '400',
    color: colors.GRAY_60,
    marginRight: 4,
  },
  arrow: {
    width: 12,
    height: 12,
    tintColor: colors.GRAY_50,
  },
  dropdown: {
    position: 'absolute',
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
  },
  dropdownItemActive: { backgroundColor: colors.GRAY_05 },
  dropdownText: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.GRAY_60,
  },
  dropdownTextActive: { color: colors.PRIMARY_50 },
  unitLabel: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.GRAY_80,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  tabGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 100,
    marginLeft: 6,
    backgroundColor: colors.GRAY_10,
  },
  tabActive: { backgroundColor: colors.PRIMARY_10 },
  tabText: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.GRAY_40,
    lineHeight: 15.4,
  },
  tabTextActive: { color: colors.PRIMARY_50 },
  topDivider: {
    height: 1,
    backgroundColor: colors.GRAY_15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.GRAY_15,
  },
  lastRowDivider: {
    borderColor: colors.GRAY_40,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: colors.GRAY_40,
    marginTop: 2,
    paddingTop: 8,
  },
  cell: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.GRAY_70,
  },
  boldMonth: {
    fontWeight: '500',
    color: colors.GRAY_80,
  },
  boldCell: {
    fontSize: 20,
    fontWeight: '600',
  },
  partnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.GRAY_20,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'android' ? 0 : 8,
  },
  searchIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    tintColor: colors.GRAY_60,
    marginRight: 6,
  },
  searchInput: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 15.4,
    color: colors.GRAY_50,
    paddingVertical: 0,
    marginTop: -1.5,
  },
  partnerListContainer: {
    backgroundColor: colors.GRAY_05,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    padding: 12,
  },
  partnerBox: {
    backgroundColor: colors.GRAY_05,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    marginBottom: 8,
  },
  partnerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.GRAY_60,
    lineHeight: 16.8,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  gradeBadge: {
    backgroundColor: colors.PRIMARY_05,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  gradeText: {
    fontSize: 17,
    color: colors.GRAY_60,
    lineHeight: 15.4,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  arrowSmall: {
    width: 16,
    height: 16,
    tintColor: colors.GRAY_50,
  },
  detailBox: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  detailIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  detailText: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.GRAY_60,
    flex: 1,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  copyIcon: {
    width: 14,
    height: 14,
  },
});
