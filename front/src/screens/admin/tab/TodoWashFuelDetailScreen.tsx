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
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../../constants/colors';
import { washFuelCompanyDetailMock } from '../../../mock/todoWashFuelDetailMock';
import CommonModal from '../../../components/common/CommonModal';

export default function TodoWashFuelDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { companyId, companyName } = route.params as {
    companyId: number;
    companyName: string;
  };

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [modal, setModal] = useState<{
    visible: boolean;
    type: 'wash' | 'fuel' | null;
  }>({ visible: false, type: null });

  const toggleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(prev => (prev === id ? null : id));
  };

  const openModal = (type: 'wash' | 'fuel') =>
    setModal({ visible: true, type });

  const closeModal = () => setModal({ visible: false, type: null });

  const handleConfirm = () => {
    setModal({ visible: false, type: null });
  };

  const company = washFuelCompanyDetailMock.find(
    c => c.companyId === companyId,
  );
  const data = company?.vehicles ?? [];

  const getStatusColor = (item: any) => {
    if (item.hasWash) return colors.PRIMARY_50;
    if (item.hasFuel) return colors.RED_50;
  };

  return (
    <View style={s.container}>
      {/* 상단 헤더 */}
      <View style={s.subHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Image
            source={require('../../../assets/admin-vehicle/left_arrow.png')}
            style={s.backIcon}
          />
        </TouchableOpacity>
        <Text style={s.title}>{companyName} 세차/주유 차량</Text>
      </View>

      {/* 리스트 */}
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const expanded = expandedId === item.id;
          return (
            <View style={s.item}>
              {/* 좌측 상태바 */}
              <View
                style={[s.statusBar, { backgroundColor: getStatusColor(item) }]}
              />

              <View style={s.itemBody}>
                {/* 상단 영역 */}
                <View style={s.itemTop}>
                  <View style={s.carInfo}>
                    <Text style={s.carName}>{item.name}</Text>

                    <View style={s.iconRow}>
                      {item.hasWash && (
                        <Image
                          source={require('../../../assets/admin-todo/wash.png')}
                          style={s.washIcon}
                        />
                      )}
                      {item.hasFuel && (
                        <Image
                          source={require('../../../assets/admin-todo/fuel.png')}
                          style={s.fuelIcon}
                        />
                      )}
                    </View>

                    <View style={s.plateBadge}>
                      <Text style={s.plate}>{item.plateNumber}</Text>
                    </View>
                  </View>

                  {/* 날짜 + 시간 + 화살표 */}
                  <View style={s.rightWrap}>
                    <View style={{ alignItems: 'flex-end' }}>
                      <View style={s.row}>
                        <Image
                          source={require('../../../assets/common/calendar.png')}
                          style={s.smallIcon}
                        />
                        <Text style={s.date}>{item.lastUpdate}</Text>
                      </View>
                      <View style={s.row}>
                        <Image
                          source={require('../../../assets/common/clock.png')}
                          style={s.smallIcon}
                        />
                        <Text style={s.time}>{item.duration}</Text>
                      </View>
                    </View>
                    <Pressable
                      onPress={() => toggleExpand(item.id)}
                      style={s.arrowWrap}
                    >
                      <Image
                        source={require('../../../assets/common/down_arrow.png')}
                        style={[
                          s.arrowIcon,
                          {
                            transform: [
                              { rotate: expanded ? '180deg' : '0deg' },
                            ],
                          },
                        ]}
                      />
                    </Pressable>
                  </View>
                </View>

                {/* 하단 버튼 */}
                {expanded && (
                  <View style={s.buttonRow}>
                    {item.hasWash && (
                      <Pressable
                        style={[s.actionBtn, s.blueBorderBtn]}
                        onPress={() => openModal('wash')}
                      >
                        <Text
                          style={[s.actionText, { color: colors.PRIMARY_50 }]}
                        >
                          세차완료
                        </Text>
                      </Pressable>
                    )}

                    {item.hasFuel && (
                      <Pressable
                        style={[s.actionBtn, s.redBorderBtn]}
                        onPress={() => openModal('fuel')}
                      >
                        <Text style={[s.actionText, { color: colors.RED_50 }]}>
                          주유완료
                        </Text>
                      </Pressable>
                    )}
                  </View>
                )}
              </View>
            </View>
          );
        }}
      />

      {/* 공용 모달 */}
      {modal.type && (
        <CommonModal
          visible={modal.visible}
          title={modal.type === 'wash' ? '세차 완료' : '주유 완료'}
          message={
            modal.type === 'wash'
              ? '해당 차량의 세차가 완료됐나요?'
              : '해당 차량의 주유가 완료됐나요?'
          }
          cancelText="취소"
          confirmText="확인"
          onCancel={closeModal}
          onConfirm={handleConfirm}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_00,
    paddingHorizontal: 16,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: colors.GRAY_00,
  },
  backBtn: { marginRight: 8 },
  backIcon: { width: 20, height: 20, resizeMode: 'contain' },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.GRAY_90,
    lineHeight: 22.4,
    marginTop: Platform.OS === 'android' ? -2 : 0,
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
    width: 3,
    marginLeft: 4,
    marginVertical: 4,
    borderRadius: 2,
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
    gap: 6,
  },
  iconRow: { flexDirection: 'row', gap: 4 },
  washIcon: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
    tintColor: colors.PRIMARY_50,
  },
  fuelIcon: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
    tintColor: colors.RED_50,
  },
  smallIcon: { width: 12, height: 12, resizeMode: 'contain' },
  carName: { fontSize: 12, fontWeight: '500', color: colors.GRAY_60 },
  plateBadge: {
    backgroundColor: colors.PRIMARY_05,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  plate: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_60,
    lineHeight: 15.4,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  date: { fontSize: 11, fontWeight: '400', color: colors.GRAY_50 },
  time: { fontSize: 11, fontWeight: '400', color: colors.GRAY_50 },
  rightWrap: { flexDirection: 'row', alignItems: 'center' },
  arrowWrap: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: { width: 16, height: 16, resizeMode: 'contain' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  actionBtn: { padding: 8, borderRadius: 4 },
  blueBorderBtn: { borderWidth: 1, borderColor: colors.PRIMARY_50 },
  redBorderBtn: { borderWidth: 1, borderColor: colors.RED_50 },
  actionText: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15.4,
  },
});
