import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {
  DispatchRequest,
  mockDispatchRequests,
} from '../../../mock/mockDispatchRequests';
import { colors } from '../../../constants/colors';
import DispatchInfoModal from '../../../components/dispatch/DispatchInfoModal';
import DispatchRejectModal from '../../../components/dispatch/DispatchRejectModal';
import { SwipeListView } from 'react-native-swipe-list-view';

export default function DispatchRequestScreen() {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [infoVisible, setInfoVisible] = useState(false);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [selected, setSelected] = useState<DispatchRequest | null>(null);

  const activeRequests = useMemo(
    () => mockDispatchRequests.filter(req => req.status === 'active'),
    [],
  );

  const toggleExpand = (id: string) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id],
    );
  };

  const openInfo = (item: DispatchRequest) => {
    setSelected(item);
    setInfoVisible(true);
  };

  const openReject = (item: DispatchRequest) => {
    setSelected(item);
    setRejectVisible(true);
  };

  return (
    <View style={s.container}>
      {/* 서브헤더 */}
      <View style={s.header}>
        <Text style={s.headerTitle}>
          배차 요청건 <Text style={s.count}>{activeRequests.length}건</Text>
        </Text>
        <Text style={s.headerSub}>사용자들의 배차 요청을 관리합니다</Text>
      </View>

      <SwipeListView
        data={mockDispatchRequests}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isActive = item.status === 'active';
          const expanded = expandedIds.includes(item.id);

          return (
            <TouchableOpacity
              onPress={() => openInfo(item)}
              activeOpacity={0.9}
              style={s.item}
            >
              <View style={s.innerRow}>
                {/* 상태바 */}
                <View
                  style={[
                    s.statusBar,
                    {
                      backgroundColor: isActive
                        ? colors.PRIMARY_50
                        : colors.GRAY_20,
                    },
                  ]}
                />

                {/* 본문 */}
                <View style={s.contentRow}>
                  <Text style={[s.company, !isActive && s.textGray]}>
                    {item.company}
                  </Text>
                  {item.label && (
                    <View style={s.badge}>
                      <Text style={s.badgeText}>{item.label}</Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }} />
                  <Text style={s.time}>{item.time}</Text>
                  <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                    <Image
                      source={require('../../../assets/common/down_arrow.png')}
                      style={[
                        s.arrowIcon,
                        {
                          transform: [{ rotate: expanded ? '180deg' : '0deg' }],
                        },
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {expanded && (
                <View style={s.expandArea}>
                  <Text style={s.modelText}>{item.model}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        renderHiddenItem={() => <View />}
        rightOpenValue={-70}
        disableRightSwipe
        // 스와이프하면 모달 띄우기
        onRowOpen={(rowKey, rowMap) => {
          const item = mockDispatchRequests.find(i => i.id === rowKey);
          if (item) {
            openReject(item);
            // 스와이프 후 자동 닫기
            rowMap[rowKey]?.closeRow?.();
          }
        }}
      />

      {/* 모달 */}
      <DispatchInfoModal
        visible={infoVisible}
        item={selected}
        onClose={() => setInfoVisible(false)}
      />
      <DispatchRejectModal
        visible={rejectVisible}
        onClose={() => setRejectVisible(false)}
      />
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
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.GRAY_90,
  },
  count: {
    fontWeight: '600',
    color: colors.PRIMARY_50,
  },
  headerSub: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_40,
  },
  list: {
    paddingBottom: 80,
  },
  item: {
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBar: {
    width: 2,
    height: '100%',
    borderRadius: 1,
    marginRight: 8,
    alignSelf: 'center',
    marginLeft: -8,
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
    marginTop: -2,
  },
  company: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.GRAY_60,
    lineHeight: 17,
  },
  badge: {
    backgroundColor: colors.YELLOW_00,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
    marginTop: -1.2,
  },
  badgeText: {
    fontSize: 11,
    lineHeight: 15,
    color: colors.GRAY_60,
  },
  time: {
    fontSize: 11,
    lineHeight: 15,
    color: colors.GRAY_60,
    marginRight: 10,
  },
  arrowIcon: {
    width: 14,
    height: 14,
    tintColor: colors.GRAY_40,
    resizeMode: 'contain',
  },
  expandArea: {
    marginTop: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  modelText: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15,
    color: colors.GRAY_60,
  },
  textGray: {
    color: colors.GRAY_40,
  },
});
