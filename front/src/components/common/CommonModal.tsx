import React from 'react';
import { View, Text, Pressable, StyleSheet, Keyboard } from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../../constants/colors';
import modal from 'react-native-modal';

type Props = {
  visible: boolean;
  title?: string; // 상단 제목
  message?: string; // 본문 내용
  children?: React.ReactNode; // 추가 내용
  confirmText?: string; // 오른쪽 버튼 텍스트
  cancelText?: string; // 왼쪽 버튼 텍스트
  onConfirm?: () => void; // 확인 콜백
  onCancel?: () => void; // 취소 콜백
  hideCancel?: boolean; // 취소 버튼 숨김 여부
};

export default function CommonModal({
  visible,
  title = '',
  message = '',
  children,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  hideCancel = false,
}: Props) {
  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.5}
      animationIn="fadeIn"
      animationOut="fadeOut"
      statusBarTranslucent
      avoidKeyboard
      onBackdropPress={onCancel}
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Pressable onPress={Keyboard.dismiss}>
          <View style={s.modal}>
            {/* 제목 */}
            {!!title && <Text style={s.title}>{title}</Text>}

            {/* 본문 */}
            {!!message && <Text style={s.message}>{message}</Text>}

            {/* 커스텀 콘텐츠 */}
            {children}

            {/* 버튼 영역 */}
            <View
              style={[s.btnRow, hideCancel && { justifyContent: 'center' }]}
            >
              {!hideCancel && (
                <Pressable style={[s.btn, s.cancel]} onPress={onCancel}>
                  <Text style={s.cancelText}>{cancelText}</Text>
                </Pressable>
              )}

              <Pressable style={[s.btn, s.confirm]} onPress={onConfirm}>
                <Text style={s.confirmText}>{confirmText}</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
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
    paddingHorizontal: 16,
    alignSelf: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    color: colors.GRAY_90,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.GRAY_60,
    textAlign: 'center',
    marginBottom: 24,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    columnGap: 8,
  },
  btn: {
    flex: 1,
    borderRadius: 4,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancel: {
    borderWidth: 1,
    borderColor: colors.PRIMARY_50,
  },
  confirm: {
    backgroundColor: colors.PRIMARY_50,
  },
  cancelText: {
    fontSize: 17,
    color: colors.PRIMARY_50,
    fontWeight: '400',
  },
  confirmText: {
    fontSize: 17,
    color: colors.WHITE,
    fontWeight: '400',
  },
});
