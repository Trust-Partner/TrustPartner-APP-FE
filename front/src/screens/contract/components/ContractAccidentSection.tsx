import React from 'react';
import { View, Text, Image } from 'react-native';
import { InfoRow } from './rows/InfoRow';
import { StatusRow } from './rows/StatusRow';
import { s } from '../styles';

interface Props {
  accident: {
    status: string[];
    carNumber: string;
    carModel: string;
    displacement: string;
    garage: string;
    requestCompany: string;
  };
}

export const ContractAccidentSection = ({ accident }: Props) => {
  return (
    <View style={s.card}>
      <View style={s.cardTitleRow}>
        <Image
          source={require('../../../assets/common/file_icon.png')}
          style={s.iconSmall}
        />
        <Text style={s.cardTitle}>사고 차량 정보</Text>
      </View>

      <View style={{ gap: 8 }}>
        <StatusRow label="진행상태" value={accident.status} />
        <InfoRow label="고객 차량번호" value={accident.carNumber} />
        <InfoRow label="고객 차종" value={accident.carModel} />
        <InfoRow label="고객 배기량" value={accident.displacement} />
        <InfoRow label="입고 공업사" value={accident.garage} />
        <InfoRow label="요청업체" value={accident.requestCompany} />
      </View>
    </View>
  );
};
