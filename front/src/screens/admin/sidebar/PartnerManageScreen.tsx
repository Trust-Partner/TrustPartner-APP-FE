import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { colors } from '../../../constants/colors';
import { partnerList, partnerStats } from '../../../mock/partnerMock';
import ToastMessage from '../../../components/common/ToastMessage';

export default function PartnerManageScreen() {
  const [tab, setTab] = useState<'sales' | 'count'>('sales');
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [openYear, setOpenYear] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const [openStates, setOpenStates] = useState<{ [key: number]: boolean }>({});

  const yearOptions = [2025, 2024, 2023, 2022];
  const totalSales = partnerStats.reduce((sum, i) => sum + i.sales, 0);
  const totalCount = partnerStats.reduce((sum, i) => sum + i.count, 0);

  const toggleOpen = (id: number) => {
    setOpenStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredPartners = partnerList.filter(p =>
    search.trim() === ''
      ? true
      : p.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const handleCopy = (text: string, label: string) => {
    Clipboard.setString(text);
    setToastMsg(`${label}가 복사되었습니다.`);
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
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
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
              >
                <TouchableOpacity
                  style={s.iconBtn}
                  onPress={() => {
                    setOpenFilter(!openFilter);
                    setOpenYear(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Image
                    source={require('../../../assets/admin-partner/filter.png')}
                    style={{ width: 12, height: 12, tintColor: colors.GRAY_50 }}
                  />
                </TouchableOpacity>

                <View style={{ position: 'relative' }}>
                  <TouchableOpacity
                    style={s.selectBox}
                    onPress={() => {
                      setOpenYear(!openYear);
                      setOpenFilter(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={s.selectText}>{selectedYear}</Text>
                    <Image
                      source={require('../../../assets/common/down_arrow.png')}
                      style={s.arrow}
                    />
                  </TouchableOpacity>

                  {openYear && (
                    <View
                      style={[s.dropdown, { top: 30, right: 0, width: 80 }]}
                    >
                      {yearOptions.map(y => (
                        <TouchableOpacity
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
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>

            <View style={s.tabRow}>
              <Text style={s.unitLabel}>월</Text>
              <View style={s.tabGroup}>
                <TouchableOpacity
                  style={[s.tab, tab === 'count' && s.tabActive]}
                  onPress={() => setTab('count')}
                >
                  <Text style={[s.tabText, tab === 'count' && s.tabTextActive]}>
                    건수
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.tab, tab === 'sales' && s.tabActive]}
                  onPress={() => setTab('sales')}
                >
                  <Text style={[s.tabText, tab === 'sales' && s.tabTextActive]}>
                    매출
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={s.topDivider} />

            {partnerStats.map((item, idx) => (
              <View
                key={idx}
                style={[
                  s.row,
                  idx === partnerStats.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <Text style={s.cell}>{item.month}</Text>
                <Text style={s.cell}>
                  {tab === 'sales'
                    ? `₩ ${item.sales.toLocaleString('ko-KR')}`
                    : `${item.count}건`}
                </Text>
              </View>
            ))}

            <View style={[s.totalRow, s.footer]}>
              <Text style={[s.cell, s.boldMonth]}>합계</Text>
              <Text style={[s.cell, s.boldCell]}>
                {tab === 'sales'
                  ? `₩ ${totalSales.toLocaleString('ko-KR')}`
                  : `${totalCount}건`}
              </Text>
            </View>
          </View>

          <View style={{ margin: 8 }} />

          {/* 담당 거래처 */}
          <View style={s.card}>
            <View style={s.partnerHeader}>
              <Text style={s.title}>담당 거래처</Text>
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="거래처명 검색"
                style={s.searchInput}
                placeholderTextColor={colors.GRAY_50}
              />
            </View>

            <View style={[s.partnerListContainer, { marginTop: 8 }]}>
              <ScrollView
                style={{ maxHeight: 210 }}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                {filteredPartners.map(item => (
                  <View key={item.id} style={s.partnerBox}>
                    <TouchableOpacity
                      style={s.partnerTop}
                      onPress={() => toggleOpen(item.id)}
                      activeOpacity={0.8}
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
                        <Text style={s.partnerName}>{item.name}</Text>
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
                            {item.grade} | {item.share}%
                          </Text>
                        </View>
                        <Image
                          source={require('../../../assets/common/down_arrow.png')}
                          style={[
                            s.arrowSmall,
                            openStates[item.id] && {
                              transform: [{ rotate: '180deg' }],
                            },
                          ]}
                        />
                      </View>
                    </TouchableOpacity>

                    {openStates[item.id] && (
                      <View style={s.detailBox}>
                        {/* 연락처 */}
                        <View style={s.detailRow}>
                          <Image
                            source={require('../../../assets/admin-partner/phone.png')}
                            style={s.detailIcon}
                          />
                          <Text style={s.detailText}>연락처: {item.phone}</Text>
                          <TouchableOpacity
                            onPress={() => handleCopy(item.phone, '연락처')}
                            hitSlop={10}
                          >
                            <Image
                              source={require('../../../assets/common/copy.png')}
                              style={s.copyIcon}
                            />
                          </TouchableOpacity>
                        </View>

                        {/* 주소 */}
                        <View style={s.detailRow}>
                          <Image
                            source={require('../../../assets/admin-partner/location.png')}
                            style={s.detailIcon}
                          />
                          <Text style={s.detailText}>주소: {item.address}</Text>
                          <TouchableOpacity
                            onPress={() => handleCopy(item.address, '주소')}
                            hitSlop={10}
                          >
                            <Image
                              source={require('../../../assets/common/copy.png')}
                              style={s.copyIcon}
                            />
                          </TouchableOpacity>
                        </View>

                        {/* 담당자 */}
                        <View style={s.detailRow}>
                          <Image
                            source={require('../../../assets/admin-partner/person.png')}
                            style={s.detailIcon}
                          />
                          <Text style={s.detailText}>
                            담당자: {item.manager}
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
    padding: 16,
    backgroundColor: colors.GRAY_00,
  },
  card: {
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    fontSize: 12,
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
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
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
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  dropdownItemActive: { backgroundColor: colors.GRAY_05 },
  dropdownText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_60,
  },
  dropdownTextActive: { color: colors.PRIMARY_50 },
  unitLabel: {
    fontSize: 11,
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
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 100,
    marginLeft: 6,
    backgroundColor: colors.GRAY_10,
  },
  tabActive: { backgroundColor: colors.PRIMARY_10 },
  tabText: {
    fontSize: 11,
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: colors.GRAY_15,
  },
  lastRowDivider: {
    borderColor: colors.GRAY_40,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: colors.GRAY_40,
    marginTop: 2,
    paddingTop: 8,
  },
  cell: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_70,
  },
  boldMonth: {
    fontWeight: '500',
    color: colors.GRAY_80,
  },
  boldCell: {
    fontSize: 14,
    fontWeight: '600',
  },
  partnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.GRAY_20,
    borderRadius: 4,
    paddingVertical: Platform.OS === 'android' ? 0 : 4,
    paddingHorizontal: 8,
    fontSize: 11,
    fontWeight: '400',
    width: 104,
    color: colors.GRAY_80,
  },
  partnerListContainer: {
    backgroundColor: colors.GRAY_05,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    padding: 8,
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
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  partnerName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.GRAY_60,
    lineHeight: 16.8,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  gradeBadge: {
    backgroundColor: colors.PRIMARY_05,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  gradeText: {
    fontSize: 11,
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
    paddingHorizontal: 12,
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
    fontSize: 11,
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
