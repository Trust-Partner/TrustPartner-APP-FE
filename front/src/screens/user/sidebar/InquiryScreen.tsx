import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { colors } from '../../../constants/colors';
import ToastMessage from '../../../components/common/ToastMessage';
import AppHeader from '../../../components/common/AppHeader';
import { HIT_SLOP } from '../../../constants/touch';
import { usePartnerInquiry } from '../../../hooks/inquiry/usePartnerInquiry';
import { useGeneralManagerInquiry } from '../../../hooks/inquiry/useGeneralManagerInquiry';
import { useAuthStore } from '../../../states/useAuthStore';

export default function InquiryScreen() {
  const [toastMsg, setToastMsg] = useState('');

  const user = useAuthStore(s => s.user);
  if (!user || user.kind !== 'USER') {
    return null;
  }

  const partnerQuery = usePartnerInquiry(user.partnerId);
  const managerQuery = useGeneralManagerInquiry();

  const handleCopy = (text: string) => {
    Clipboard.setString(text);
    setToastMsg('전화번호가 복사되었습니다.');
  };

  const contactList = useMemo(() => {
    if (!partnerQuery.data || !managerQuery.data) return [];

    return [
      {
        ...partnerQuery.data,
        subTitle: '배회차 관련 문의',
      },
      {
        ...managerQuery.data,
        subTitle: '앱 사용 및 정산금 관련 문의',
      },
    ];
  }, [partnerQuery.data, managerQuery.data]);

  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        canGoBack
        centerContent={<Text style={s.header}>문의하기</Text>}
      />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={s.container}>
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Image
                source={require('../../../assets/common/phone.png')}
                style={s.icon}
              />
              <Text style={s.title}>연락처 안내</Text>
            </View>

            {contactList.map(item => (
              <View key={item.id} style={s.contactBox}>
                <View style={s.contactRow}>
                  <Image
                    source={require('../../../assets/common/person.png')}
                    style={s.personIcon}
                  />

                  <View style={{ flex: 1 }}>
                    <Text style={s.contactTitle}>
                      {item.title} | {item.subTitle}
                    </Text>

                    <Text style={s.contactName}>{item.staffName}</Text>

                    <View style={s.phoneRow}>
                      <Text style={s.contactPhone}>{item.phoneNumber}</Text>
                      <Pressable
                        hitSlop={HIT_SLOP.SAFE_VERTICAL}
                        onPress={() => handleCopy(item.phoneNumber)}
                      >
                        <Image
                          source={require('../../../assets/common/copy.png')}
                          style={s.copyIcon}
                        />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            ))}

            <View style={s.noticeBox}>
              <Text style={s.noticeTitle}>24시간 언제나 열려있습니다.</Text>
              <Text style={s.noticeText}>
                전화나 문자 주시면 확인 후 바로 연락드리겠습니다.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {toastMsg ? (
        <ToastMessage message={toastMsg} onHide={() => setToastMsg('')} />
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_00,
    padding: 16,
  },
  header: {
    fontSize: 14,
    color: colors.GRAY_90,
  },
  card: {
    backgroundColor: colors.WHITE,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 4,
    tintColor: colors.GRAY_80,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.GRAY_80,
    lineHeight: 16.8,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  contactBox: {
    backgroundColor: colors.PRIMARY_05,
    borderWidth: 1,
    borderColor: colors.PRIMARY_20,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  personIcon: {
    width: 16,
    height: 16,
    tintColor: colors.GRAY_80,
    marginRight: 8,
  },
  contactTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.GRAY_80,
    lineHeight: 16.8,
    marginTop: Platform.OS === 'android' ? -1 : 0,
  },
  contactName: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '400',
    color: colors.PRIMARY_90,
  },
  phoneRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contactPhone: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.PRIMARY_90,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  copyIcon: {
    width: 12,
    height: 12,
    tintColor: colors.PRIMARY_90,
  },
  noticeBox: {
    backgroundColor: colors.GRAY_05,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  noticeTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.GRAY_80,
  },
  noticeText: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.GRAY_50,
    marginTop: 4,
  },
});
