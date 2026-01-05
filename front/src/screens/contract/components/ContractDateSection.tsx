import React from 'react';
import { View, Text, Image } from 'react-native';
import { InfoRow } from './rows/InfoRow';
import { s } from '../styles';

interface Props {
  contractDate: {
    start: string;
    end: string;
    period: string;
  };
}

export const ContractDateSection = ({ contractDate }: Props) => {
  return (
    <View style={s.card}>
      <View style={s.cardTitleRow}>
        <Image
          source={require('../../../assets/common/calendar.png')}
          style={s.iconSmall}
        />
        <Text style={s.cardTitle}>계약 일시</Text>
      </View>

      <View style={{ gap: 8 }}>
        <InfoRow label="계약 체결일" value={contractDate.start} />
        <InfoRow label="차량 반납일" value={contractDate.end} />
        <InfoRow label="렌트기간" value={contractDate.period} />
      </View>
    </View>
  );
};
