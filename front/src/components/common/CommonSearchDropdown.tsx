import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
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

export interface CommonSearchDropdownRef {
  commit: () => void;
}

interface Props {
  placeholder: string;
  selectedValue?: string;
  onSelect: (value: string, isCustom?: boolean) => void;
  onSearch: (query: string) => Promise<string[]>;
}

const CommonSearchDropdown = React.forwardRef<CommonSearchDropdownRef, Props>(
  ({ placeholder, selectedValue, onSelect, onSearch }, ref) => {
    const [query, setQuery] = useState(selectedValue ?? '');
    const [results, setResults] = useState<string[]>([]);
    const [focused, setFocused] = useState(false);
    const [showTag, setShowTag] = useState(false);

    const inputRef = useRef<TextInput>(null);
    const queryRef = useRef(query);

    /** query ref sync */
    useEffect(() => {
      queryRef.current = query;
    }, [query]);

    /** 부모 → 자식 동기화 */
    useEffect(() => {
      setQuery(selectedValue ?? '');
    }, [selectedValue]);

    /** 검색 */
    useEffect(() => {
      if (!focused) return;

      const q = query.trim();
      if (!q) {
        setResults([]);
        setShowTag(false);
        return;
      }

      const t = setTimeout(async () => {
        const res = await onSearch(q);
        setResults(res);
        setShowTag(!res.includes(q));
      }, 300);

      return () => clearTimeout(t);
    }, [query, focused, onSearch]);

    /** 🔑 값 확정 로직 (공통) */
    const commitValue = () => {
      const value = queryRef.current.trim();

      if (!value) {
        onSelect('', false);
        setShowTag(false);
        return;
      }

      const isCustom = !results.includes(value);
      onSelect(value, isCustom);
      setShowTag(isCustom);
    };

    /** 외부에서 강제 확정 가능 */
    useImperativeHandle(ref, () => ({
      commit: commitValue,
    }));

    const handleSelect = (val: string) => {
      setQuery(val);
      setFocused(false);
      onSelect(val, false);
      Keyboard.dismiss();
    };

    const handleBlur = () => {
      commitValue();
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
            <View style={s.tag}>
              <Text style={s.tagText}>기타</Text>
            </View>
          )}
        </View>

        {focused && results.length > 0 && (
          <View style={s.dropdown}>
            <FlatList
              data={results}
              keyExtractor={(item, i) => item + i}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable style={s.option} onPress={() => handleSelect(item)}>
                  <Text style={s.optionText}>{item}</Text>
                </Pressable>
              )}
            />
          </View>
        )}

        {focused && query.trim() && results.length === 0 && (
          <Pressable style={s.optionCustom} onPress={handleBlur}>
            <Text style={s.optionText}>'{query.trim()}' 직접입력 (기타)</Text>
          </Pressable>
        )}
      </View>
    );
  },
);

export default CommonSearchDropdown;

const s = StyleSheet.create({
  container: { marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    backgroundColor: colors.GRAY_05,
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'android' ? 2 : 8,
    fontSize: 11,
    color: colors.GRAY_50,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    marginTop: 4,
    maxHeight: 180,
  },
  option: { padding: 8 },
  optionText: { fontSize: 11, color: colors.GRAY_50 },
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
    color: colors.WHITE,
  },
});
