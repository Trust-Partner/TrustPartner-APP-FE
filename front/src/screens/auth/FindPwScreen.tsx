import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { colors } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { useFindPasswordCode } from '../../hooks/auth/useFindPasswordCode';
import { useFindPassword } from '../../hooks/auth/useFindPassword';

export default function FindPwScreen() {
  const navigation = useNavigation();
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [password, setPassword] = useState<string>('');

  const findPasswordCodeMutation = useFindPasswordCode();
  const findPasswordMutation = useFindPassword();

  const handlePhoneChange = (text: string) => {
    const numbers = text.replace(/[^0-9]/g, '');
    let formatted = numbers;
    if (numbers.length < 4) {
      formatted = numbers;
    } else if (numbers.length < 8) {
      formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      formatted = `${numbers.slice(0, 3)}-${numbers.slice(
        3,
        7,
      )}-${numbers.slice(7, 11)}`;
    }
    setPhone(formatted);
  };

  const handleSendCode = async () => {
    if (!role) {
      Alert.alert('알림', '사용자 구분을 선택해주세요.');
      return;
    }
    if (!name || !phone) {
      Alert.alert('알림', '이름과 휴대폰 번호를 입력해주세요.');
      return;
    }

    try {
      // 하이픈 제거한 숫자만 추출
      const phoneNumber = phone.replace(/[^0-9]/g, '');

      await findPasswordCodeMutation.mutateAsync({
        role,
        payload: {
          name,
          phoneNumber,
        },
      });

      setSent(true);
      Alert.alert('알림', '인증번호가 발송되었습니다.');
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || '인증번호 발송에 실패했습니다.';
      Alert.alert('오류', errorMessage);
    }
  };

  const handleVerify = async () => {
    if (!role) {
      Alert.alert('알림', '사용자 구분을 선택해주세요.');
      return;
    }
    if (!code) {
      Alert.alert('알림', '인증번호를 입력해주세요.');
      return;
    }

    try {
      // 하이픈 제거한 숫자만 추출
      const phoneNumber = phone.replace(/[^0-9]/g, '');

      const response = await findPasswordMutation.mutateAsync({
        role,
        payload: {
          name,
          phoneNumber,
          verificationCode: code,
        },
      });

      setPassword(response.password);
      setVerified(true);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || '인증번호 확인에 실패했습니다.';
      Alert.alert('오류', errorMessage);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={s.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={s.card}>
          <Text style={s.title}>비밀번호 찾기</Text>

          {verified && password && (
            <View style={s.resultBox}>
              <Text style={s.resultTitle}>비밀번호 찾기가 완료되었습니다.</Text>
              <Text style={s.resultText}>
                회원님의 임시 비밀번호는{' '}
                <Text style={s.resultId}>{password}</Text> 입니다.
              </Text>
            </View>
          )}

          <Text style={s.subText}>
            * 가입 시 등록된 정보와 일치해야 합니다.
          </Text>

          {/* 사용자 구분 */}
          <Text style={s.inputTittle}>사용자 구분</Text>
          <View style={s.roleRow}>
            {[
              { key: 'admin', label: '매니저' },
              { key: 'user', label: 'USER' },
            ].map(({ key, label }) => (
              <TouchableOpacity
                key={key}
                style={s.roleItem}
                onPress={() =>
                  setRole(role === key ? null : (key as 'admin' | 'user'))
                }
                disabled={verified}
              >
                <View style={s.checkbox}>
                  {role === key && <Text style={s.checkmark}>✓</Text>}
                </View>
                <Text style={s.checkboxLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 이름 */}
          <Text style={s.inputTittle}>이름</Text>
          <TextInput
            style={s.input}
            placeholder="이름을 입력하세요"
            placeholderTextColor={colors.GRAY_50}
            value={name}
            editable={!verified}
            onChangeText={setName}
            keyboardType="default"
            textContentType="name"
            autoCapitalize="none"
          />

          <View style={{ marginTop: 12 }} />
          {/* 아이디 */}
          <Text style={s.inputTittle}>아이디</Text>
          <TextInput
            style={s.input}
            placeholder="아이디를 입력하세요"
            placeholderTextColor={colors.GRAY_50}
            value={username}
            editable={!verified}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <View style={{ marginTop: 12 }} />
          {/* 휴대폰 번호 */}
          <Text style={s.inputTittle}>휴대폰 번호</Text>
          <View style={s.row}>
            <TextInput
              style={[s.input, { flex: 3 }]}
              placeholder="휴대폰 번호를 입력하세요"
              placeholderTextColor={colors.GRAY_50}
              keyboardType="number-pad"
              value={phone}
              editable={!verified}
              onChangeText={handlePhoneChange}
              maxLength={13}
            />
            <TouchableOpacity
              style={[
                s.button,
                sent || findPasswordCodeMutation.isPending
                  ? s.buttonDisabled
                  : s.buttonActive,
              ]}
              disabled={sent || verified || findPasswordCodeMutation.isPending}
              onPress={handleSendCode}
            >
              <Text style={s.buttonText}>
                {findPasswordCodeMutation.isPending
                  ? '발송 중...'
                  : sent
                  ? '발송 완료'
                  : '인증번호 발송'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 인증번호 입력 */}
          {sent && (
            <>
              <View style={{ marginTop: 12 }} />
              <Text style={s.inputTittle}>인증 번호</Text>
              <View style={s.row}>
                <TextInput
                  style={[s.input, { flex: 3 }]}
                  placeholder="인증 번호를 입력하세요"
                  placeholderTextColor={colors.GRAY_50}
                  value={code}
                  editable={!verified}
                  onChangeText={setCode}
                />
                <TouchableOpacity
                  style={[
                    s.button,
                    verified || findPasswordMutation.isPending
                      ? s.buttonDisabled
                      : s.buttonActive,
                  ]}
                  disabled={verified || findPasswordMutation.isPending}
                  onPress={handleVerify}
                >
                  <Text style={s.buttonText}>
                    {findPasswordMutation.isPending
                      ? '확인 중...'
                      : verified
                      ? '인증 완료'
                      : '확인'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* 로그인으로 돌아가기 */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={verified ? s.backBtnActive : s.backBtn}
          >
            <Text
              style={[s.backText, verified && { color: colors.PRIMARY_50 }]}
            >
              로그인으로 돌아가기
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.GRAY_00,
  },
  card: {
    backgroundColor: colors.WHITE,
    marginHorizontal: 16,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 32,
    shadowColor: 'rgba(146, 150, 171, 0.30)',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.PRIMARY_50,
    textAlign: 'center',
    marginBottom: 24,
  },
  subText: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_60,
    marginBottom: 12,
  },
  inputTittle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.GRAY_80,
    marginBottom: 4,
  },
  roleRow: {
    flexDirection: 'row',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  roleItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    marginRight: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 18,
    color: colors.BLACK,
    fontWeight: '700',
    lineHeight: 23,
    textAlign: 'center',
    transform: [{ translateY: Platform.OS === 'android' ? -1 : 0 }],
  },
  checkboxLabel: {
    fontSize: 17,
    color: colors.GRAY_80,
    lineHeight: 25,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },

  roleLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_80,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'android' ? 4 : 8,
    fontSize: 17,
    fontWeight: '500',
    backgroundColor: colors.GRAY_05,
  },
  button: {
    flex: 1,
    borderRadius: 4,
    padding: 12,
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: colors.PRIMARY_50,
  },
  buttonDisabled: {
    backgroundColor: colors.PRIMARY_20,
  },
  buttonText: {
    color: colors.WHITE,
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 25,
  },
  resultBox: {
    backgroundColor: colors.PRIMARY_10,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 24,
  },
  resultTitle: {
    color: colors.PRIMARY_50,
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 4,
  },
  resultText: {
    color: colors.GRAY_60,
    fontSize: 18,
    fontWeight: '500',
  },
  resultId: {
    color: colors.PRIMARY_50,
    fontSize: 20,
    fontWeight: '700',
  },
  backBtn: {
    marginTop: 24,
  },
  backBtnActive: {
    borderWidth: 1,
    borderColor: colors.PRIMARY_50,
    borderRadius: 4,
    marginTop: 24,
    paddingVertical: 12,
  },
  backText: {
    textAlign: 'center',
    color: colors.GRAY_80,
    fontSize: 17,
    fontWeight: '500',
  },
});
