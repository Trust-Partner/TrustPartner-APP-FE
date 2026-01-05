import React from 'react';
import { View, Text, Image } from 'react-native';
import { InfoRow } from './rows/InfoRow';
import { s } from '../styles';

interface Props {
  exchange: {
    date: string;
    returnDate: string;
    period: string;
    model: string;
    number: string;
  };
}

export const ContractExchangeSection = ({ exchange }: Props) => {
  return (
    <View style={s.card}>
      <View style={s.cardTitleRow}>
        <Image
          source={require('../../../assets/common/calendar.png')}
          style={s.iconSmall}
        />
        <Text style={s.cardTitle}>교체 계약서</Text>
      </View>

      <View style={{ gap: 8 }}>
        <InfoRow label="교체일" value={exchange.date} />
        <InfoRow label="차량 반납일" value={exchange.returnDate} />
        <InfoRow label="렌트기간" value={exchange.period} />
        <InfoRow label="렌트 차량" value={exchange.model} />
        <InfoRow label="렌트 차량번호" value={exchange.number} />
      </View>
    </View>
  );
};
