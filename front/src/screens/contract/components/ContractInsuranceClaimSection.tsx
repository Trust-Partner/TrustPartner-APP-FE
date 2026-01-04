import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { InfoRow } from './rows/InfoRow';
import { EditRow } from './rows/EditRow';
import { StatusRow } from './rows/StatusRow';
import { colors } from '../../../constants/colors';
import { s } from '../styles';

interface Props {
  isEditMode: boolean;
  insurance: {
    status: string[];
    company: string;
    claimNumber: string;
    manager: string;
    fax: string;
    phone: string;
  };
  onChange: (key: string, value: string) => void;
  onCopy: (value: string, label: string) => void;
}

export const ContractInsuranceClaimSection = ({
  isEditMode,
  insurance,
  onChange,
  onCopy,
}: Props) => {
  return (
    <View style={s.card}>
      <View style={s.cardTitleRow}>
        <Image
          source={require('../../../assets/common/file_icon.png')}
          style={s.iconSmall}
        />
        <Text style={s.cardTitle}>보험사 청구</Text>
      </View>

      <View style={{ gap: 8 }}>
        <StatusRow label="진행상태" value={insurance.status} />

        {isEditMode ? (
          <>
            <EditRow
              label="보험사"
              value={insurance.company}
              onChangeText={v => onChange('company', v)}
            />
            <EditRow
              label="접수 번호"
              value={insurance.claimNumber}
              onChangeText={v => onChange('claimNumber', v)}
            />
            <EditRow
              label="담당자"
              value={insurance.manager}
              onChangeText={v => onChange('manager', v)}
            />
            <EditRow
              label="담당자 팩스"
              value={insurance.fax}
              onChangeText={v => onChange('fax', v)}
            />
            <EditRow
              label="담당자 연락처"
              value={insurance.phone}
              onChangeText={v => onChange('phone', v)}
            />
          </>
        ) : (
          <>
            <InfoRow label="보험사" value={insurance.company} />
            <InfoRow label="접수 번호" value={insurance.claimNumber} />
            <InfoRow label="담당자" value={insurance.manager} />
            <InfoRow
              label="담당자 팩스"
              value={insurance.fax}
              copyable
              onCopy={onCopy}
            />
            <InfoRow
              label="담당자 연락처"
              value={insurance.phone}
              copyable
              onCopy={onCopy}
            />
          </>
        )}
      </View>
    </View>
  );
};
