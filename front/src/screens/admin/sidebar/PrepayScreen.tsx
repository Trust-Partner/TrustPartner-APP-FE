import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  LayoutAnimation,
  Pressable,
  Image,
} from 'react-native';
import { colors } from '../../../constants/colors';
import {
  prepaymentMock,
  PrepaymentItemType,
} from '../../../mock/prepaymentMock';
import CommonModal from '../../../components/common/CommonModal';
import AppHeader from '../../../components/common/AppHeader';

export default function PrepaymentScreen() {
  const [activeTab, setActiveTab] = useState<'waiting' | 'current' | 'past'>(
    'waiting',
  );
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  const data = prepaymentMock[activeTab];

  const handleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderRowLayout = (
    isHeader = false,
    item?: PrepaymentItemType,
    expanded?: boolean,
  ) => (
    <View style={s.rowLayout}>
      <View style={{ flex: 66, alignItems: 'center' }}>
        <Text style={isHeader ? s.headerText : s.cellText}>
          {isHeader ? '차량명' : item?.carName}
        </Text>
      </View>
      <View style={{ flex: 74, alignItems: 'center' }}>
        <Text style={isHeader ? s.headerText : s.cellText}>
          {isHeader ? '번호' : item?.carNumber}
        </Text>
      </View>
      <View style={{ flex: 60, alignItems: 'center' }}>
        <Text style={isHeader ? s.headerText : s.cellText}>
          {isHeader ? '요청업체' : item?.company}
        </Text>
      </View>
      <View style={{ flex: 58, alignItems: 'center' }}>
        <Text
          style={[
            isHeader ? s.headerText : s.cellText,
            !isHeader && { color: colors.GRAY_50 },
          ]}
        >
          {isHeader ? '경과기간' : item?.duration}
        </Text>
      </View>

      <View
        style={{ width: 30, alignItems: 'center', justifyContent: 'center' }}
      >
        {isHeader ? (
          <View />
        ) : (
          <View style={s.arrowWrap}>
            <Image
              source={require('../../../assets/common/down_arrow.png')}
              style={[
                s.arrowIcon,
                { transform: [{ rotate: expanded ? '180deg' : '0deg' }] },
              ]}
            />
          </View>
        )}
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: PrepaymentItemType }) => {
    const isOpen = !!expanded[item.id];
    return (
      <Pressable onPress={() => handleExpand(item.id)} style={s.item}>
        <View style={s.statusBar} />
        <View style={s.itemBody}>
          {renderRowLayout(false, item, isOpen)}

          {isOpen && (
            <View style={s.buttonRow}>
              <Pressable
                style={[s.actionBtn, { backgroundColor: colors.GRAY_80 }]}
              >
                <Text style={s.actionText}>계약서 확인</Text>
              </Pressable>
              {item.status === 'waiting' && (
                <Pressable
                  style={[s.actionBtn, { backgroundColor: colors.PRIMARY_50 }]}
                  onPress={() => setConfirmModalVisible(true)}
                >
                  <Text style={s.actionText}>지급확정</Text>
                </Pressable>
              )}
              <Pressable
                style={[s.actionBtn, { backgroundColor: colors.RED_50 }]}
                onPress={() => setCancelModalVisible(true)}
              >
                <Text style={s.actionText}>취소신청</Text>
              </Pressable>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        canGoBack
        centerContent={<Text style={s.header}>사전지급 관리</Text>}
      />
      <View style={s.container}>
        {/* 상단 요약형 탭 */}
        <View style={s.summaryContainer}>
          {(
            [
              {
                key: 'waiting',
                label: '지급대기',
                value: prepaymentMock.waiting.length,
              },
              {
                key: 'current',
                label: '당월배차내역',
                value: prepaymentMock.current.length,
              },
              {
                key: 'past',
                label: '지난배차내역',
                value: prepaymentMock.past.length,
              },
            ] as const
          ).map((tab, idx) => {
            const isActive = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                style={[s.summaryCell, idx !== 2 && s.rightDivider]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={s.value}>{tab.value}</Text>
                <Text style={s.label}>{tab.label}</Text>
                {isActive && <View style={s.activeBorder} />}
              </Pressable>
            );
          })}
        </View>

        {/* 리스트 영역 */}
        <View style={s.listBox}>
          {renderRowLayout(true)}

          <FlatList
            data={data}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
          />
        </View>
        <CommonModal
          visible={confirmModalVisible}
          title="지급확정"
          message="지급 확정할까요?"
          confirmText="지급확정"
          cancelText="취소"
          onCancel={() => setConfirmModalVisible(false)}
          onConfirm={() => {
            setConfirmModalVisible(false);
            console.log('지급 확정 처리');
          }}
        />

        <CommonModal
          visible={cancelModalVisible}
          title="취소신청"
          message="취소 신청할까요?"
          confirmText="취소신청"
          cancelText="취소"
          onCancel={() => setCancelModalVisible(false)}
          onConfirm={() => {
            setCancelModalVisible(false);
            console.log('취소 신청 처리');
          }}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.GRAY_00,
  },
  header: {
    fontSize: 14,
    color: colors.GRAY_90,
  },
  summaryContainer: {
    flexDirection: 'row',
    borderWidth: 0,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: colors.WHITE,
  },
  summaryCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
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
    borderColor: colors.PRIMARY_50,
    borderRadius: 4,
    zIndex: 1,
  },
  value: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.PRIMARY_50,
  },
  label: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_60,
  },
  listBox: {
    flex: 1,
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
  },
  rowLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  headerText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_60,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  item: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    backgroundColor: colors.WHITE,
  },
  statusBar: {
    width: 2,
    marginLeft: 4,
    marginVertical: 4,
    backgroundColor: colors.PRIMARY_50,
  },
  itemBody: {
    flex: 1,
    marginLeft: -6,
  },
  cellText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_60,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  arrowWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  actionBtn: {
    borderRadius: 4,
    padding: 8,
  },
  actionText: {
    color: colors.WHITE,
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15.4,
  },
});
