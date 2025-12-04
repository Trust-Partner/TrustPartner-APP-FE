import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  LayoutAnimation,
} from 'react-native';
import { colors } from '../../../constants/colors';
import DispatchInfoModal from '../../../components/dispatch/DispatchInfoModal';
import DispatchRejectModal from '../../../components/dispatch/DispatchRejectModal';
import { SwipeListView } from 'react-native-swipe-list-view';
import { HIT_SLOP } from '../../../constants/touch';
import {
  getDispatchRequests,
  rejectDispatchRequest,
  DispatchItem,
} from '../../../api/dispatch';
import {
  getCarYearGroupLabel,
  getDisplacementLabel,
} from '../../../utils/carMapping';

export default function DispatchRequestScreen() {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [infoVisible, setInfoVisible] = useState(false);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [selected, setSelected] = useState<DispatchItem | null>(null);
  const [requests, setRequests] = useState<DispatchItem[]>([]);

  const loadRequests = async () => {
    try {
      const res = await getDispatchRequests('ALL');
      setRequests(res.data.data.dispatchList);
    } catch (e) {
      console.log('배차 요청 목록 조회 실패:', e);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const activeRequests = useMemo(
    () => requests.filter(req => req.dispatchStatus === 'REQUESTED'),
    [requests],
  );

  const formatDateTime = (iso: string) => {
    const date = new Date(iso);

    const month = date.getMonth() + 1;
    const day = date.getDate();

    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${month}/${day} ${hour}:${minute}`;
  };

  const handleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const openInfo = (item: DispatchItem) => {
    setSelected(item);
    setInfoVisible(true);
  };

  const openReject = (item: DispatchItem) => {
    setSelected(item);
    setRejectVisible(true);
  };

  const handleReject = async () => {
    if (!selected) return;
    try {
      await rejectDispatchRequest(selected.dispatchId);
      setRejectVisible(false);
      loadRequests();
    } catch (e) {
      console.log('배차 요청 거부 실패:', e);
    }
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>
          배차 요청건 <Text style={s.count}>{activeRequests.length}건</Text>
        </Text>
        <Text style={s.headerSub}>사용자들의 배차 요청을 관리합니다</Text>
      </View>

      <SwipeListView
        data={requests}
        keyExtractor={item => String(item.dispatchId)}
        renderItem={({ item }) => {
          const isOpen = !!expanded[item.dispatchId];

          // 교체건 판별 (교체건 + 완료건 동시에 표현)
          const isReplacement = item.dispatchStatus === 'CONFIRMED';
          const isActive = item.dispatchStatus === 'REQUESTED'; // 요청 건만 active

          return (
            <Pressable onPress={() => openInfo(item)} style={s.item}>
              <View style={s.rowWrap}>
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

                <View style={{ flex: 1 }}>
                  <View style={s.contentRow}>
                    {/* 회사명 (완료건이면 회색 텍스트 처리) */}
                    <Text style={[s.company, !isActive && s.textGray]}>
                      {item.partnerName}
                    </Text>

                    {/* 교체건 배지 유지 */}
                    {isReplacement && (
                      <View style={s.badge}>
                        <Text style={s.badgeText}>교체건</Text>
                      </View>
                    )}

                    <View style={{ flex: 1 }} />

                    {/* 날짜 (완료건이면 회색 처리) */}
                    <Text style={[s.time, !isActive && s.textGray]}>
                      {formatDateTime(item.dispatchDateTime)}
                    </Text>

                    <Pressable
                      hitSlop={HIT_SLOP.MEDIUM}
                      onPress={e => {
                        e.stopPropagation();
                        handleExpand(String(item.dispatchId));
                      }}
                    >
                      <Image
                        source={require('../../../assets/common/down_arrow.png')}
                        style={[
                          s.arrowIcon,
                          {
                            transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
                          },
                        ]}
                      />
                    </Pressable>
                  </View>

                  {/* 펼침 영역 */}
                  {isOpen && (
                    <View style={s.expandArea}>
                      {isReplacement ? (
                        <Text
                          style={[s.expandBadgeText, !isActive && s.textGray]}
                        >
                          {item.carModel}
                        </Text>
                      ) : (
                        <>
                          <Text
                            style={[s.expandBadgeText, !isActive && s.textGray]}
                          >
                            {item.carModel}
                          </Text>
                          <Text
                            style={[s.expandBadgeText, !isActive && s.textGray]}
                          >
                            {getCarYearGroupLabel(item.carYearGroup)}
                          </Text>
                          <Text
                            style={[s.expandBadgeText, !isActive && s.textGray]}
                          >
                            {getDisplacementLabel(item.displacementGroup)}
                          </Text>
                        </>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          );
        }}
        renderHiddenItem={() => <View />}
        rightOpenValue={-70}
        disableRightSwipe
        onRowOpen={(rowKey, rowMap) => {
          const item = requests.find(i => String(i.dispatchId) === rowKey);
          if (item) openReject(item);
          rowMap[rowKey]?.closeRow?.();
        }}
      />

      <DispatchInfoModal
        visible={infoVisible}
        item={selected}
        onClose={() => setInfoVisible(false)}
      />

      <DispatchRejectModal
        visible={rejectVisible}
        onClose={() => setRejectVisible(false)}
        onReject={handleReject}
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
  rowWrap: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  statusBar: {
    width: 2,
    borderRadius: 1,
    marginRight: 8,
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
    flexDirection: 'row',
    gap: 4,
  },
  expandBadgeText: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15,
    color: colors.GRAY_60,
  },
  textGray: {
    borderColor: colors.GRAY_10,
    color: colors.GRAY_40,
  },
});
