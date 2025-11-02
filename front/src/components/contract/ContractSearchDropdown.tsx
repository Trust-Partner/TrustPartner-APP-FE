import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Keyboard,
  Platform,
} from 'react-native';
import { colors } from '../../constants/colors';

interface Props {
  placeholder: string;
  selectedValue?: string;
  onSelect: (value: string, isCustom?: boolean) => void;
  onSearch: (query: string) => Promise<string[]>;
}

export default function ContractSearchDropdown({
  placeholder,
  selectedValue,
  onSelect,
  onSearch,
}: Props) {
  const [query, setQuery] = useState(selectedValue || '');
  const [results, setResults] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);
  const [showTag, setShowTag] = useState(false);
  const inputRef = useRef<TextInput>(null);

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
        const isCustom = !res.includes(query.trim());
        setShowTag(isCustom);
      } catch (e) {
        console.warn('검색 실패:', e);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  const handleSelect = (val: string) => {
    setQuery(val);
    setShowTag(false);
    setFocused(false);
    onSelect(val, false);

    inputRef.current?.blur();
    Keyboard.dismiss();
  };

  const handleBlur = () => {
    if (query.trim().length > 0) {
      const isCustom = !results.includes(query.trim());
      setShowTag(isCustom);
      onSelect(query.trim(), isCustom);
    } else {
      setShowTag(false);
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
              paddingVertical: 2,
            }}
          >
            <Text
              style={{
                fontSize: 11,
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
        <View style={s.dropdown}>
          <FlatList
            data={results}
            keyExtractor={(item, idx) => item + idx}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={s.option}
                onPress={() => handleSelect(item)}
              >
                <Text style={s.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {focused && query.trim().length > 0 && results.length === 0 && (
        <TouchableOpacity style={s.optionCustom} onPress={handleBlur}>
          <Text style={s.optionText}>'{query.trim()}' 직접입력 (기타)</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginBottom: 12,
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    backgroundColor: colors.GRAY_05,
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'android' ? 2 : 8,
    fontSize: 11,
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
  },
  option: {
    padding: 8,
  },
  optionText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_50,
  },
  optionCustom: {
    padding: 8,
    borderWidth: 1,
    borderColor: colors.PRIMARY_10,
    backgroundColor: colors.PRIMARY_00,
    borderRadius: 4,
    marginTop: 4,
  },
});
