import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Clipboard from '@react-native-clipboard/clipboard';
import { colors } from '../../constants/colors';
import ToastMessage from '../common/ToastMessage';
import { HIT_SLOP } from '../../constants/touch';
import { DispatchItem } from '../../api/dispatch';
import { usePartnerInfo } from '../../hooks/dispatch/usePartnerInfo';

type Props = {
  visible: boolean;
  item?: DispatchItem | null;
  onClose: () => void;
};

export default function DispatchInfoModal({ visible, item, onClose }: Props) {
  const [toastMsg, setToastMsg] = useState('');

  const { data: partner } = usePartnerInfo(item?.partnerId);

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
        <Pressable
          onPress={() => onClose()}
          hitSlop={HIT_SLOP.MEDIUM}
          style={s.closeBtn}
        >
          <Image
            source={require('../../assets/common/close.png')}
            style={s.closeIcon}
          />
        </Pressable>

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

              <Text style={[s.value, { marginLeft: 25 }]}>
                {item.partnerName}
              </Text>
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

              <Text style={[s.value, { marginLeft: 25 }]}>
                {partner?.teamLeaderInfo.staffName ?? '-'}
              </Text>
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

              <Text style={[s.value, { marginLeft: 25 }]}>
                {partner?.phoneNumber ?? '-'}
              </Text>
            </View>

            <Pressable
              onPress={() => handleCopy(partner?.phoneNumber ?? '', '연락처')}
              style={s.copyBtn}
              hitSlop={HIT_SLOP.MEDIUM}
            >
              <Image
                source={require('../../assets/admin-dispatch/copy.png')}
                style={s.copyIcon}
              />
            </Pressable>
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

              <Text style={[s.value, { marginLeft: 25 }]}>
                {partner?.address ?? '-'}
              </Text>
            </View>

            <Pressable
              onPress={() => handleCopy(partner?.address ?? '', '주소')}
              style={s.copyBtn}
              hitSlop={HIT_SLOP.MEDIUM}
            >
              <Image
                source={require('../../assets/admin-dispatch/copy.png')}
                style={s.copyIcon}
              />
            </Pressable>
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
    paddingTop: 8,
    paddingBottom: 32,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    width: 20,
    height: 20,
    justifyContent: 'center',
    resizeMode: 'contain',
    marginRight: -8,
  },
  closeIcon: {
    width: 20,
    height: 20,
    tintColor: colors.GRAY_60,
  },
  box: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 6,
    padding: 12,
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
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: 'contain',
  },
  label: {
    fontSize: 17,
    color: colors.GRAY_40,
    lineHeight: 25,
  },
  value: {
    fontSize: 17,
    color: colors.GRAY_90,
    marginTop: 4,
  },
  copyBtn: {
    marginLeft: 'auto',
  },
  copyIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
