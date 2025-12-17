import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  LayoutAnimation,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../../constants/colors';
import DispatchInfoModal from '../../../components/dispatch/DispatchInfoModal';
import DispatchRejectModal from '../../../components/dispatch/DispatchRejectModal';
import { SwipeListView } from 'react-native-swipe-list-view';
import { HIT_SLOP } from '../../../constants/touch';
import { DispatchItem } from '../../../api/dispatch';
import {
  getCarYearGroupLabel,
  getDisplacementLabel,
} from '../../../utils/carMapping';
import { useDispatchList } from '../../../hooks/dispatch/useDispatchList';
import { useRejectDispatch } from '../../../hooks/dispatch/useRejectDispatch';
import { useFocusEffect } from '@react-navigation/native';

export default function DispatchRequestScreen() {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [infoVisible, setInfoVisible] = useState(false);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [selected, setSelected] = useState<DispatchItem | null>(null);

  const { data, isLoading, isFetching, isError, refetch } = useDispatchList();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  const rejectMutation = useRejectDispatch();

  const requests = data?.dispatchList ?? [];

  const activeRequests = useMemo(
    () => requests.filter(req => req.dispatchStatus === 'REQUESTED'),
    [requests],
  );

  const sortedRequests = useMemo(() => {
    if (!requests) return [];

    return [...requests].sort((a, b) => {
      const aActive = a.dispatchStatus === 'REQUESTED';
      const bActive = b.dispatchStatus === 'REQUESTED';

      // 진행중 먼저
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;

      // 같은 그룹이면 최신순 (선택)
      return (
        new Date(b.dispatchDateTime).getTime() -
        new Date(a.dispatchDateTime).getTime()
      );
    });
  }, [requests]);

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
      await rejectMutation.mutateAsync(selected.dispatchId);
      setRejectVisible(false);
    } catch (e) {
      console.log('배차 요청 거부 실패:', e);
    }
  };

  if (isLoading) {
    return (
      <View style={s.loadingContainer}>
        <ActivityIndicator size="small" color={colors.PRIMARY_50} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={s.container}>
        <Text style={s.errorText}>배차 요청 목록을 불러올 수 없습니다.</Text>
        <Text style={s.errorSub}>네트워크 또는 서버 오류가 발생했습니다.</Text>

        <Pressable onPress={() => refetch()} style={s.retryBtn}>
          <Text style={s.retryText}>다시 시도</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>
          배차 요청건 <Text style={s.count}>{activeRequests.length}건</Text>
        </Text>
        <Text style={s.headerSub}>사용자들의 배차 요청을 관리합니다</Text>
      </View>

      <SwipeListView
        data={sortedRequests}
        keyExtractor={item => String(item.dispatchId)}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
          />
        }
        contentContainerStyle={{
          flexGrow: 1,
        }}
        ListEmptyComponent={
          <View style={s.emptyContainer}>
            <Text style={s.emptyText}>배차 요청이 없습니다.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const isOpen = !!expanded[item.dispatchId];

          const isReplacement = item.isReplacement;
          const isActive = item.dispatchStatus === 'REQUESTED';

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
                    <Text style={[s.company, !isActive && s.textGray]}>
                      {item.partnerName}
                    </Text>

                    {isReplacement && (
                      <View style={s.badge}>
                        <Text style={s.badgeText}>교체건</Text>
                      </View>
                    )}

                    <View style={{ flex: 1 }} />

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.GRAY_00,
  },
  loading: {
    fontSize: 14,
    color: colors.GRAY_60,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.RED_50,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSub: {
    fontSize: 12,
    color: colors.GRAY_50,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryBtn: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.PRIMARY_05,
    borderRadius: 6,
  },
  retryText: {
    color: colors.PRIMARY_50,
    fontSize: 13,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  emptyText: {
    fontSize: 13,
    color: colors.GRAY_40,
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
