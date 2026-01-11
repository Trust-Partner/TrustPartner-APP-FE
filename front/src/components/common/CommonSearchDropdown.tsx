import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  FlatList,
  Keyboard,
  Platform,
} from 'react-native';
import { colors } from '../../constants/colors';

interface DropdownItem {
  label: string;
  value: string;
}

interface Props {
  placeholder: string;
  selectedValue?: string; // label
  onSelect: (item: DropdownItem, isCustom?: boolean) => void;
  onSearch: (query: string) => Promise<DropdownItem[]>;
}

export default function CommonSearchDropdown({
  placeholder,
  selectedValue,
  onSelect,
  onSearch,
}: Props) {
  const [query, setQuery] = useState(selectedValue || '');
  const [results, setResults] = useState<DropdownItem[]>([]);
  const [focused, setFocused] = useState(false);
  const [showTag, setShowTag] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setQuery(selectedValue || '');
  }, [selectedValue]);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setShowTag(false);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await onSearch(query);
        setResults(res);

        const isCustom = !res.some(r => r.label === query.trim());
        setShowTag(isCustom);
      } catch (e) {
        console.warn('검색 실패:', e);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  const handleSelect = (item: DropdownItem) => {
    setQuery(item.label);
    setShowTag(false);
    setFocused(false);
    onSelect(item, false);

    inputRef.current?.blur();
    Keyboard.dismiss();
  };

  const handleBlur = () => {
    if (query.trim().length === 0) {
      setFocused(false);
      return;
    }

    const matched = results.find(r => r.label === query.trim());

    if (matched) {
      onSelect(matched, false);
    } else {
      // 직접 입력 (기타)
      onSelect({ label: query.trim(), value: query.trim() }, true);
    }

    setFocused(false);
  };

  return (
    <View style={s.container}>
      <View style={{ position: 'relative' }}>
        <TextInput
          ref={inputRef}
          style={s.input}
          placeholder={placeholder}
          value={query}
          onChangeText={setQuery}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          placeholderTextColor={colors.GRAY_50}
        />

        {showTag && (
          <View
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: [{ translateY: -9 }],
              backgroundColor: colors.PRIMARY_50,
              borderRadius: 12,
              paddingHorizontal: 6,
              paddingVertical: 6,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: '400',
                color: colors.WHITE,
                lineHeight: 15.4,
              }}
            >
              기타
            </Text>
          </View>
        )}
      </View>

      {focused && results.length > 0 && (
        <View style={s.dropdown} pointerEvents="auto">
          <FlatList
            data={results}
            keyExtractor={item => item.value}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable style={s.option} onPress={() => handleSelect(item)}>
                <Text style={s.optionText}>{item.label}</Text>
              </Pressable>
            )}
          />
        </View>
      )}

      {focused && query.trim().length > 0 && results.length === 0 && (
        <Pressable style={s.optionCustom} onPress={handleBlur}>
          <Text style={s.optionText}>'{query.trim()}' 직접입력 (기타)</Text>
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginBottom: 8,
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    backgroundColor: colors.GRAY_05,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'android' ? 2 : 8,
    fontSize: 17,
    fontWeight: '400',
    color: colors.GRAY_50,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    marginTop: 4,
    maxHeight: 180,
    zIndex: 10, // iOS
    elevation: 10,
  },
  option: {
    padding: 12,
  },
  optionText: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.GRAY_50,
  },
  optionCustom: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.PRIMARY_10,
    backgroundColor: colors.PRIMARY_00,
    borderRadius: 4,
    marginTop: 4,
  },
});
