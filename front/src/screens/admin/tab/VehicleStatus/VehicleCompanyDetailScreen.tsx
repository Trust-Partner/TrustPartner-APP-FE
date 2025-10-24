import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  LayoutAnimation,
  TextInput,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../../../constants/colors';
import AppHeader from '../../../../components/common/AppHeader';
import { vehicleCompanyDetailMock } from '../../../../mock/vehicleStatus/vehicleCompanyDetailMock';

export default function VehicleCompanyDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { companyId, companyName } = route.params as {
    companyId: number;
    companyName: string;
  };

  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [activeStatus, setActiveStatus] = useState<
    '전체' | '배차중' | '대기중' | '반납신청'
  >('전체');

  const company = vehicleCompanyDetailMock.find(c => c.companyId === companyId);
  const filteredVehicles =
    company?.vehicles
      ?.filter(v =>
        activeStatus === '전체' ? true : v.status === activeStatus,
      )
      ?.filter(v => {
        if (!query.trim()) return true;
        const lower = query.toLowerCase();
        return (
          v.name.toLowerCase().includes(lower) ||
          v.plateNumber.replace(/\s+/g, '').includes(lower)
        );
      }) ?? [];

  const handleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!company) {
    return (
      <View style={{ flex: 1 }}>
        <AppHeader
          centerContent={
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="차량번호를 검색하세요"
              placeholderTextColor={colors.GRAY_40}
              style={s.headerSearchInput}
            />
          }
        />
        <View style={s.subHeader}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={s.backButton}
          >
            <Image
              source={require('../../../../assets/admin-vehicle/left_arrow.png')}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
          <Text style={s.title}>{companyName}</Text>
        </View>

        <View style={[s.emptyContainer, { flex: 1 }]}>
          <Text style={s.emptyText}>데이터가 없습니다.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        centerContent={
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="차량번호를 검색하세요"
            placeholderTextColor={colors.GRAY_40}
            style={s.headerSearchInput}
          />
        }
      />

      {/* 헤더 */}
      <View style={s.subHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={s.backButton}
        >
          <Image
            source={require('../../../../assets/admin-vehicle/left_arrow.png')}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>

        <Text style={s.title}>{companyName}</Text>
      </View>

      <View style={s.container}>
        {/* 통계 */}
        <View style={s.summaryContainer}>
          {(
            [
              {
                label: '배차중',
                value: company.summary.dispatched,
                color: colors.YELLOW_50,
              },
              {
                label: '대기중',
                value: company.summary.waiting,
                color: colors.PRIMARY_50,
              },
              {
                label: '반납신청',
                value: company.summary.returning,
                color: colors.RED_50,
              },
              {
                label: '전체',
                value: company.summary.total,
                color: colors.GRAY_90,
              },
            ] as const
          ).map((box, idx) => {
            const isActive = activeStatus === box.label;
            return (
              <TouchableOpacity
                key={box.label}
                style={[s.summaryCell, idx !== 3 && s.rightDivider]}
                onPress={() => setActiveStatus(box.label)}
              >
                <Text style={[s.value, { color: box.color }]}>{box.value}</Text>
                <Text style={s.label}>{box.label}</Text>
                {isActive && <View style={[s.activeBorder]} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 리스트 */}
        <FlatList
          data={filteredVehicles}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isOpen = expanded[item.id];
            const isDispatched = item.status === '배차중';

            return (
              <View style={s.item}>
                {/* 상태바 */}
                <View
                  style={[
                    s.statusBar,
                    item.status === '배차중' && {
                      backgroundColor: colors.YELLOW_50,
                    },
                    item.status === '대기중' && {
                      backgroundColor: colors.PRIMARY_50,
                    },
                    item.status === '반납신청' && {
                      backgroundColor: colors.RED_50,
                    },
                  ]}
                />
                {/* 본문 */}
                <View style={s.itemBody}>
                  {/* 상단: 차량명 / 날짜·시간 / 화살표 */}
                  <View style={s.itemTop}>
                    <View style={s.carInfo}>
                      <Text style={s.carName}>{item.name}</Text>
                      <View style={s.plateBadge}>
                        <Text style={s.plate}>{item.plateNumber}</Text>
                      </View>
                    </View>

                    {/* 오른쪽: 날짜·시간 + 화살표 */}
                    <View style={s.rightWrap}>
                      <View style={{ alignItems: 'flex-end' }}>
                        <View style={s.row}>
                          <Image
                            source={require('../../../../assets/common/calendar.png')}
                            style={s.smallIcon}
                          />
                          <Text style={s.date}>{item.lastUpdate}</Text>
                        </View>
                        <View style={s.row}>
                          <Image
                            source={require('../../../../assets/common/clock.png')}
                            style={s.smallIcon}
                          />
                          <Text style={s.time}>{item.duration}</Text>
                        </View>
                      </View>
                      <Pressable
                        onPress={() => handleExpand(item.id)}
                        style={s.arrowWrap}
                      >
                        <Image
                          source={require('../../../../assets/common/down_arrow.png')}
                          style={[
                            s.arrowIcon,
                            {
                              transform: [
                                { rotate: isOpen ? '180deg' : '0deg' },
                              ],
                            },
                          ]}
                        />
                      </Pressable>
                    </View>
                  </View>

                  {/* 교체/회수 버튼 */}
                  {isOpen && (
                    <View style={s.buttonRow}>
                      {isDispatched && (
                        <Pressable style={[s.actionBtn, s.grayBtn]}>
                          <Text style={s.actionText}>교체하기</Text>
                        </Pressable>
                      )}
                      <Pressable style={[s.actionBtn, s.blueBtn]}>
                        <Text style={[s.actionText, { color: colors.WHITE }]}>
                          회수하기
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_00,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.GRAY_00,
  },
  emptyText: {
    fontSize: 15,
    color: colors.GRAY_40,
  },
  headerSearchInput: {
    width: 220,
    height: 36,
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    paddingHorizontal: 10,
    fontSize: 13,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: colors.GRAY_00,
  },
  backButton: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.GRAY_90,
    lineHeight: 22.4,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  summaryContainer: {
    flexDirection: 'row',
    borderWidth: 0,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 18,
    backgroundColor: colors.WHITE,
  },
  summaryCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: colors.WHITE,
    position: 'relative',
  },

  rightDivider: {
    borderRightWidth: 1,
    borderRightColor: colors.GRAY_00,
  },
  activeBorder: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: colors.GRAY_90,
    borderRadius: 4,
    zIndex: 1,
  },
  value: {
    fontSize: 20,
    fontWeight: '600',
  },
  label: {
    fontSize: 12,
    color: colors.GRAY_70,
    marginTop: 2,
  },
  item: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: colors.WHITE,
  },
  statusBar: {
    width: 2,
    marginLeft: 4,
    marginVertical: 4,
  },
  itemBody: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  carName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.GRAY_60,
    lineHeight: 16.8,
  },
  plateBadge: {
    backgroundColor: colors.PRIMARY_05,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  plate: {
    fontSize: 11,
    color: colors.GRAY_60,
    fontWeight: '400',
    lineHeight: 15.4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_50,
    lineHeight: 15.4,
  },
  time: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_50,
    lineHeight: 15.4,
  },
  smallIcon: {
    width: 12,
    height: 12,
  },
  arrowIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  rightWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowWrap: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 4,
  },
  grayBtn: {
    backgroundColor: colors.GRAY_60,
  },
  blueBtn: {
    backgroundColor: colors.PRIMARY_50,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.WHITE,
    lineHeight: 15.4,
  },
});
