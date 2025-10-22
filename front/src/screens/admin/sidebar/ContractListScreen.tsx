import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';
import { colors } from '../../../constants/colors';
import { contractListMock } from '../../../mock/contractListMock';

export default function ContractListScreen() {
  const [search, setSearch] = useState('');
  const [openPicker, setOpenPicker] = useState<'start' | 'end' | null>(null);
  const [range, setRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({
    startDate: null,
    endDate: null,
  });

  const handleDaySelect = (day: any) => {
    const selected = day.dateString;
    if (openPicker === 'start') {
      setRange({ ...range, startDate: selected });
    } else if (openPicker === 'end') {
      setRange({ ...range, endDate: selected });
    }
    setOpenPicker(null);
  };

  const filteredList = contractListMock.filter(item => {
    const matchSearch =
      item.customerName.includes(search) ||
      item.carName.includes(search) ||
      item.carNumber.includes(search);

    const matchDate =
      (!range.startDate ||
        dayjs(item.startDate).isAfter(
          dayjs(range.startDate).subtract(1, 'day'),
        )) &&
      (!range.endDate ||
        dayjs(item.endDate).isBefore(dayjs(range.endDate).add(1, 'day')));

    return matchSearch && matchDate;
  });

  return (
    <View style={s.container}>
      {/* 검색 */}
      <View style={s.searchBox}>
        <Image
          source={require('../../../assets/common/search.png')}
          style={s.searchIcon}
        />
        <TextInput
          placeholder="차종, 차량번호, 고객명으로 검색"
          style={s.input}
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={colors.GRAY_50}
        />
      </View>

      {/* 날짜 버튼 */}
      <View style={s.dateRow}>
        <TouchableOpacity
          style={s.dateBtn}
          onPress={() => setOpenPicker(openPicker === 'start' ? null : 'start')}
        >
          <Image
            source={require('../../../assets/common/calendar.png')}
            style={s.icon}
          />
          <Text style={s.dateText}>
            {range.startDate ? range.startDate : '시작일'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.dateBtn}
          onPress={() => setOpenPicker(openPicker === 'end' ? null : 'end')}
        >
          <Image
            source={require('../../../assets/common/calendar.png')}
            style={s.icon}
          />
          <Text style={s.dateText}>
            {range.endDate ? range.endDate : '종료일'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 드롭다운 캘린더 (Input 아래 작게 표시) */}
      {openPicker && (
        <View style={s.dropdownCalendar}>
          <Calendar
            onDayPress={handleDaySelect}
            markedDates={{
              [openPicker === 'start'
                ? range.startDate || ''
                : range.endDate || '']: {
                selected: true,
                selectedColor: colors.PRIMARY_50,
              },
            }}
            theme={{
              arrowColor: colors.PRIMARY_50,
              todayTextColor: colors.PRIMARY_60,
              selectedDayBackgroundColor: colors.PRIMARY_50,
              selectedDayTextColor: '#fff',
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 12,
            }}
          />
        </View>
      )}

      {/* 계약서 리스트 */}
      <View style={s.cardContainer}>
        <FlatList
          data={filteredList}
          keyExtractor={item => item.id.toString()}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={s.card}>
              <View style={s.cardRow}>
                <Image
                  source={require('../../../assets/admin-contract/person.png')}
                  style={s.iconSmall}
                />
                <Text style={s.cardText}>{item.customerName}</Text>
              </View>

              <View style={s.cardRow}>
                <Image
                  source={require('../../../assets/admin-contract/calender.png')}
                  style={s.iconSmall}
                />
                <Text style={s.cardDateText}>{item.startDate}</Text>
              </View>

              <View style={s.carBox}>
                <Image
                  source={require('../../../assets/common/file_icon.png')}
                  style={s.iconCar}
                />
                <View style={s.textRow}>
                  <Text style={s.carName}>{item.carName}</Text>
                  <Text style={s.carNumber}>{item.carNumber}</Text>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_00,
    padding: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.GRAY_20,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  searchIcon: {
    width: 12,
    height: 12,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_50,
    lineHeight: 15.4,
    marginTop: -1.5,
    paddingVertical: 0,
    paddingHorizontal: 0,
    includeFontPadding: false,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateBtn: {
    width: '49%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.GRAY_05,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    padding: 8,
  },
  dateText: { fontSize: 11, fontWeight: '400', color: colors.GRAY_50 },
  icon: {
    width: 12,
    height: 12,
    marginRight: 8,
  },
  dropdownCalendar: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardContainer: {
    flex: 1,
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    padding: 12,
  },
  card: {
    backgroundColor: colors.GRAY_05,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconSmall: {
    width: 16,
    height: 16,
    marginRight: 6,
    marginLeft: 4,
  },
  iconCar: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  cardText: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.GRAY_80,
    lineHeight: 16.8,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  cardDateText: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.GRAY_80,
    lineHeight: Platform.OS === 'ios' ? 16.8 : 12,
  },
  carBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.PRIMARY_10,
    borderRadius: 4,
    padding: 4,
  },
  textRow: {
    flexDirection: 'row',
  },
  carName: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.GRAY_80,
    lineHeight: 16.8,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  carNumber: {
    marginLeft: 4,
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_50,
    lineHeight: 15.4,
    marginTop: Platform.OS === 'android' ? -2 : 0.7,
  },
});
