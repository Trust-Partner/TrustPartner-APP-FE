import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { colors } from '../../../constants/colors';
import { HIT_SLOP } from '../../../constants/touch';
import { s } from '../styles';

interface Memo {
  id: string;
  writer: string;
  content: string;
  createdAt: string;
}

interface Props {
  memos: Memo[];
  onAddMemo: (content: string) => void;
}

const MEMO_MIN_HEIGHT = 64;
const MEMO_MAX_HEIGHT = 120;

export const ContractMemoSection = ({ memos, onAddMemo }: Props) => {
  const [newMemo, setNewMemo] = useState('');

  const handleAdd = () => {
    if (!newMemo.trim()) return;
    onAddMemo(newMemo.trim());
    setNewMemo('');
  };

  return (
    <View style={s.card}>
      <View style={s.cardTitleRow}>
        <Image
          source={require('../../../assets/common/memo.png')}
          style={s.iconSmall}
        />
        <Text style={s.cardTitle}>메모</Text>
      </View>

      <ScrollView
        style={{ maxHeight: MEMO_MAX_HEIGHT }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        <View style={[s.memoContainerBox, { minHeight: MEMO_MIN_HEIGHT }]}>
          {memos.map(m => (
            <View key={m.id} style={s.memoBox}>
              <View style={s.memoRow}>
                <Text style={s.memoDate}>{m.createdAt}</Text>
                <Text style={s.memoWriter}>{m.writer}</Text>
              </View>
              <Text style={s.memoContent}>{m.content}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={s.memoInputRow}>
        <TextInput
          value={newMemo}
          onChangeText={setNewMemo}
          placeholder="메모를 입력하세요"
          placeholderTextColor={colors.GRAY_50}
          textAlignVertical="top"
          style={s.memoInput}
        />
        <Pressable
          onPress={handleAdd}
          hitSlop={HIT_SLOP.SAFE_VERTICAL}
          disabled={!newMemo.trim()}
          style={[
            s.memoAddBtn,
            {
              backgroundColor: newMemo.trim()
                ? colors.PRIMARY_50
                : colors.GRAY_15,
            },
          ]}
        >
          <Text style={s.memoAddText}>＋</Text>
        </Pressable>
      </View>
    </View>
  );
};
