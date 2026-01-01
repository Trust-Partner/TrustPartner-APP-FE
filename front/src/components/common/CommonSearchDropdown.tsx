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

interface Props {
  placeholder: string;
  selectedValue?: string;
  onSelect: (value: string) => void;
  onSearch: (query: string) => Promise<string[]>;
}

export default function CommonSearchDropdown({
  placeholder,
  selectedValue,
  onSelect,
  onSearch,
}: Props) {
  const [query, setQuery] = useState(selectedValue ?? '');
  const [results, setResults] = useState<string[]>([]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!focused || query.trim().length === 0) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await onSearch(query);
        setResults(res);
      } catch (e) {
        console.warn('검색 실패:', e);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, focused]);

  const handleSelect = (name: string) => {
    setQuery(name);
    setFocused(false);
    onSelect(name);
    inputRef.current?.blur();
    Keyboard.dismiss();
  };

  return (
    <View style={s.container}>
      <TextInput
        ref={inputRef}
        style={s.input}
        placeholder={placeholder}
        value={query}
        onChangeText={setQuery}
        onFocus={() => setFocused(true)}
        placeholderTextColor={colors.GRAY_50}
      />

      {focused && results.length > 0 && (
        <View style={s.dropdown}>
          <FlatList
            data={results}
            keyExtractor={(item, idx) => item + idx}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable style={s.option} onPress={() => handleSelect(item)}>
                <Text style={s.optionText}>{item}</Text>
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
  tag: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: [{ translateY: -9 }],
    backgroundColor: colors.PRIMARY_50,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.WHITE,
    lineHeight: 15.4,
  },
});
