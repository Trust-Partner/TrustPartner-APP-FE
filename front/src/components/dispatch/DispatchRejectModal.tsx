import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  visible: boolean;
  onClose: () => void;
  onReject?: () => void;
};

export default function DispatchRejectModal({
  visible,
  onClose,
  onReject,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.5}
      animationIn="fadeIn"
      animationOut="fadeOut"
      statusBarTranslucent
      onBackdropPress={onClose}
    >
      <View style={s.modal}>
        <Text style={s.title}>배차 요청을 거부할까요?</Text>

        <View style={s.btnRow}>
          <Pressable style={[s.btn, s.cancel]} onPress={onClose}>
            <Text style={s.cancelText}>취소</Text>
          </Pressable>
          <Pressable style={[s.btn, s.reject]} onPress={onReject}>
            <Text style={s.rejectText}>거부</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  modal: {
    backgroundColor: colors.WHITE,
    width: '100%',
    borderRadius: 8,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignSelf: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    color: colors.GRAY_90,
    marginBottom: 24,
    textAlign: 'center',
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  btn: {
    flex: 1,
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancel: {
    borderWidth: 1,
    borderColor: colors.PRIMARY_50,
  },
  reject: {
    backgroundColor: colors.PRIMARY_50,
  },
  cancelText: {
    fontSize: 17,
    color: colors.PRIMARY_50,
    fontWeight: '500',
  },
  rejectText: {
    fontSize: 17,
    color: colors.WHITE,
    fontWeight: '500',
  },
});
