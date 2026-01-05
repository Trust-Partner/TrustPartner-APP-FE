import React from 'react';
import { View, Text, Image } from 'react-native';
import { InfoRow } from './rows/InfoRow';
import { EditRow } from './rows/EditRow';
import { s } from '../styles';

interface Props {
  isEditMode: boolean;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  onChange: (key: 'name' | 'phone' | 'address', value: string) => void;
  onCopy: (value: string, label: string) => void;
}

export const ContractCustomerSection = ({
  isEditMode,
  customer,
  onChange,
  onCopy,
}: Props) => {
  return (
    <View style={s.card}>
      <View style={s.cardTitleRow}>
        <Image
          source={require('../../../assets/common/person.png')}
          style={s.iconSmall}
        />
        <Text style={s.cardTitle}>고객 정보</Text>
      </View>

      {isEditMode ? (
        <>
          <View style={{ gap: 8 }}>
            <EditRow
              label="이름"
              value={customer.name}
              onChangeText={v => onChange('name', v)}
            />
            <EditRow
              label="연락처"
              value={customer.phone}
              onChangeText={v => onChange('phone', v)}
            />
            <EditRow
              label="주소"
              value={customer.address}
              onChangeText={v => onChange('address', v)}
            />
          </View>
        </>
      ) : (
        <>
          <View style={{ gap: 8 }}>
            <InfoRow label="이름" value={customer.name} />
            <InfoRow
              label="연락처"
              value={customer.phone}
              copyable
              onCopy={onCopy}
            />
            <InfoRow
              label="주소"
              value={customer.address}
              copyable
              onCopy={onCopy}
            />
          </View>
        </>
      )}
    </View>
  );
};
