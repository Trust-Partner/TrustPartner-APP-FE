import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Clipboard from '@react-native-clipboard/clipboard';
import { colors } from '../../constants/colors';
import { DispatchRequest } from '../../mock/mockDispatchRequests';
import ToastMessage from '../common/ToastMessage';

type Props = {
  visible: boolean;
  item?: DispatchRequest | null;
  onClose: () => void;
};

export default function DispatchInfoModal({ visible, item, onClose }: Props) {
  const [toastMsg, setToastMsg] = useState('');
  if (!item) return null;

  const handleCopy = (text: string, label: string) => {
    Clipboard.setString(text);
    setToastMsg(`${label}가 복사되었습니다.`);
  };

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
        {/* 닫기 버튼 */}
        <TouchableOpacity onPress={onClose}>
          <Image
            source={require('../../assets/common/close.png')}
            style={s.close}
          />
        </TouchableOpacity>

        {/* 타이틀 */}
        <Text style={s.title}>공업사 정보</Text>

        {/* 회사명 */}
        <View style={s.box}>
          <View style={s.rowBetween}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={require('../../assets/admin-dispatch/company.png')}
                  style={s.icon}
                />
                <Text style={s.label}>회사명</Text>
              </View>
              <Text style={[s.value, { marginLeft: 25 }]}>{item.company}</Text>
            </View>
          </View>
        </View>

        {/* 담당자 */}
        <View style={[s.box, s.blueBox]}>
          <View style={s.rowBetween}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={require('../../assets/admin-dispatch/person.png')}
                  style={s.icon}
                />
                <Text style={s.label}>담당자</Text>
              </View>
              <Text style={[s.value, { marginLeft: 25 }]}>안병권</Text>
            </View>
          </View>
        </View>

        {/* 연락처 */}
        <View style={[s.box, s.blueBox]}>
          <View style={s.rowBetween}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={require('../../assets/admin-dispatch/phone.png')}
                  style={s.icon}
                />
                <Text style={s.label}>연락처</Text>
              </View>
              <Text style={[s.value, { marginLeft: 25 }]}>010-5486-5478</Text>
            </View>

            <TouchableOpacity
              onPress={() => handleCopy('010-5486-5478', '연락처')}
              style={s.copyBtn}
              hitSlop={10}
            >
              <Image
                source={require('../../assets/admin-dispatch/copy.png')}
                style={s.copyIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 주소 */}
        <View style={[s.box, s.blueBox]}>
          <View style={s.rowBetween}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={require('../../assets/admin-dispatch/location.png')}
                  style={s.icon}
                />
                <Text style={s.label}>주소</Text>
              </View>
              <Text style={[s.value, { marginLeft: 25 }]}>중계로 95길 33</Text>
            </View>

            <TouchableOpacity
              onPress={() => handleCopy('중계로 95길 33', '주소')}
              style={s.copyBtn}
              hitSlop={10}
            >
              <Image
                source={require('../../assets/admin-dispatch/copy.png')}
                style={s.copyIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {toastMsg ? (
        <ToastMessage message={toastMsg} onHide={() => setToastMsg('')} />
      ) : null}
    </Modal>
  );
}

const s = StyleSheet.create({
  modal: {
    backgroundColor: colors.WHITE,
    width: '100%',
    borderRadius: 8,
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  close: {
    alignSelf: 'flex-end',
    width: 16,
    height: 16,
    tintColor: colors.GRAY_60,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.GRAY_90,
    alignSelf: 'center',
    marginBottom: 16,
  },
  box: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 6,
    padding: 8,
  },
  blueBox: {
    borderColor: colors.PRIMARY_15,
    backgroundColor: colors.PRIMARY_00,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 8,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 11,
    color: colors.GRAY_40,
    lineHeight: 15.4,
  },
  value: {
    fontSize: 11,
    color: colors.GRAY_90,
    marginTop: 4,
  },
  copyBtn: {
    marginLeft: 'auto',
  },
  copyIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
});
