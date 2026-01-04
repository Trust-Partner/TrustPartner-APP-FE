import React from 'react';
import { View, Text, Image } from 'react-native';
import { InfoRow } from './rows/InfoRow';
import { s } from '../styles';

interface Props {
  payment: {
    method: string;
    time: string;
    amount: string;
    note: string;
  };
}

export const ContractPaymentSection = ({ payment }: Props) => {
  return (
    <View style={s.card}>
      <View style={s.cardTitleRow}>
        <Image
          source={require('../../../assets/common/money.png')}
          style={s.iconSmall}
        />
        <Text style={s.cardTitle}>결제 정보</Text>
      </View>

      <View style={{ gap: 8 }}>
        <InfoRow label="결제방식" value={payment.method} />
        <InfoRow label="결제시점" value={payment.time} />
        <InfoRow label="금액" value={payment.amount} />
        <InfoRow label="메모사항" value={payment.note} />
      </View>
    </View>
  );
};
