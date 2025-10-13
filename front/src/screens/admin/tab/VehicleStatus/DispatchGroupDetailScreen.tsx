import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../../../components/common/AppHeader';
import { colors } from '../../../../constants/colors';
import {
  dispatchDetailMock,
  DispatchDetail,
} from '../../../../mock/vehicleStatus/vehicleDispatchDetailMock';

export default function DispatchGroupDetailScreen({ route }: any) {
  const navigation = useNavigation();
  const { groupId, groupName, type } = route.params;

  const data: DispatchDetail[] = (
    dispatchDetailMock[type as keyof typeof dispatchDetailMock] || []
  ).filter(item => item.groupId === groupId);

  const totalCount = data.length;

  return (
    <View style={{ flex: 1 }}>
      <AppHeader />
      <View style={s.container}>
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

          <Text style={s.title}>{groupName}</Text>

          <View style={s.countBadge}>
            <Text style={s.countText}>{totalCount}대</Text>
          </View>
        </View>

        <View style={s.tableWrapper}>
          <View style={s.tableHeader}>
            <Text style={[s.th, { flex: 66 }]}>차종</Text>
            <Text style={[s.th, { flex: 44 }]}>연식</Text>
            <Text style={[s.th, { flex: 74 }]}>번호</Text>
            <Text style={[s.th, { flex: 60 }]}>위치</Text>
            <Text style={[s.th, { flex: 44 }]}>세차</Text>
          </View>

          <FlatList
            data={data}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={s.row}>
                <View style={s.sideBar} />
                <View style={s.cellWrapper}>
                  <Text style={[s.td, { flex: 66 }]}>{item.model}</Text>
                  <Text style={[s.td, { flex: 44 }]}>{item.year}</Text>
                  <Text style={[s.td, { flex: 74 }]}>{item.number}</Text>
                  <Text style={[s.td, { flex: 60 }]}>{item.location}</Text>
                  <Text
                    style={[
                      s.td,
                      {
                        flex: 44,
                        color: item.washed ? colors.GREEN_50 : colors.RED_50,
                      },
                    ]}
                  >
                    {item.washed ? '○' : '✕'}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_00,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: { marginRight: 8 },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.GRAY_90,
    lineHeight: 22.4,
  },
  countBadge: {
    marginLeft: 8,
    backgroundColor: colors.PRIMARY_05,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: {
    color: colors.GRAY_60,
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15.4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.GRAY_05,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  th: {
    fontWeight: '400',
    color: colors.GRAY_60,
    textAlign: 'center',
    fontSize: 11,
  },
  tableWrapper: {
    flex: 1,
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_10,
  },
  sideBar: {
    width: 2,
    marginLeft: 4,
    marginVertical: 4,
    backgroundColor: colors.PRIMARY_50,
  },
  cellWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 6,
    paddingRight: 12,
  },
  td: {
    fontWeight: '400',
    textAlign: 'center',
    fontSize: 11,
    color: colors.GRAY_60,
  },
});
