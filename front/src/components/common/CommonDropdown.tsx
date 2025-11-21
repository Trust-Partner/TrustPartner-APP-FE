import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import { colors } from '../../constants/colors';

interface Props {
  placeholder: string;
  options: string[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export default function CommonDropdown({
  placeholder,
  options,
  selectedValue,
  onSelect,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View style={s.container}>
      <Pressable
        style={s.selectBox}
        onPress={() => !disabled && setOpen(prev => !prev)}
      >
        <Text
          style={[s.selectText, !selectedValue && { color: colors.GRAY_50 }]}
        >
          {selectedValue || placeholder}
        </Text>
        <Image
          source={require('../../assets/common/down_arrow.png')}
          style={[
            s.icon,
            { transform: [{ rotate: open ? '180deg' : '0deg' }] },
          ]}
        />
      </Pressable>

      {open && (
        <View style={s.dropdown}>
          <FlatList
            data={options}
            keyExtractor={(item, idx) => item + idx}
            renderItem={({ item }) => (
              <Pressable
                style={[s.option, selectedValue === item && s.optionActive]}
                onPress={() => {
                  onSelect(item);
                  setOpen(false);
                }}
              >
                <Text
                  style={[
                    s.optionText,
                    selectedValue === item && s.optionTextActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginBottom: 8,
    position: 'relative',
  },
  selectBox: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    backgroundColor: colors.GRAY_05,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
  selectText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_50,
  },
  icon: {
    width: 14,
    height: 14,
    tintColor: colors.GRAY_60,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    marginTop: 4,
    maxHeight: 180,
  },
  option: {
    padding: 8,
  },
  optionText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_50,
  },
  optionActive: {
    backgroundColor: colors.PRIMARY_00,
  },
  optionTextActive: {
    color: colors.PRIMARY_50,
    fontWeight: '500',
  },
});
