import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuthStore } from '../../states/useAuthStore';
import { mockUsers } from '../../mock/users';
import { colors } from '../../constants/colors';

type LoginForm = {
  username: string;
  password: string;
};

export default function AuthScreen() {
  const login = useAuthStore(s => s.login);
  const { control, handleSubmit, watch } = useForm<LoginForm>({
    mode: 'onBlur',
    defaultValues: { username: '', password: '' },
  });

  const username = watch('username');
  const password = watch('password');
  const [secure, setSecure] = useState(true);
  const [autoLogin, setAutoLogin] = useState(false);

  const onSubmit = ({ username, password }: LoginForm) => {
    const found = mockUsers.find(
      u => u.username === username && u.password === password,
    );

    if (!found) {
      Alert.alert('로그인 실패', '아이디/비밀번호를 확인하세요.');
      return;
    }

    login({
      id: Date.now(),
      name: found.name,
      role: found.role,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={s.container}>
        <View style={s.card}>
          <Text style={s.logo}>Trust Solution</Text>

          {/* 아이디 */}
          <Text style={s.label}>아이디</Text>
          <Controller
            control={control}
            name="username"
            rules={{ required: '아이디를 입력해주세요.' }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <>
                <TextInput
                  placeholder="아이디를 입력하세요"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="username"
                  autoComplete="username"
                  returnKeyType="next"
                  style={[s.input, error && s.inputError]}
                />
                {error && <Text style={s.errorText}>{error.message}</Text>}
              </>
            )}
          />

          {/* 비밀번호 */}
          <Text style={s.label}>비밀번호</Text>
          <Controller
            control={control}
            name="password"
            rules={{ required: '비밀번호를 입력해주세요.' }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <>
                <View style={[s.inputContainer, error && s.inputError]}>
                  <TextInput
                    placeholder="비밀번호를 입력하세요"
                    value={value}
                    secureTextEntry={secure}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="password"
                    autoComplete="password"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    style={s.inputField}
                  />
                  <TouchableOpacity
                    onPress={() => setSecure(!secure)}
                    style={s.eyeBtn}
                    accessibilityRole="button"
                    accessibilityLabel={
                      secure ? '비밀번호 표시' : '비밀번호 숨기기'
                    }
                  >
                    <Image
                      source={
                        secure
                          ? require('../../assets/auth/Eye.png')
                          : require('../../assets/auth/Eye-off.png')
                      }
                      style={s.eyeImg}
                    />
                  </TouchableOpacity>
                </View>
                {error && <Text style={s.errorText}>{error.message}</Text>}
              </>
            )}
          />

          {/* 자동 로그인 */}
          <TouchableOpacity
            style={s.checkboxRow}
            onPress={() => setAutoLogin(!autoLogin)}
          >
            <View style={s.checkbox}>
              {autoLogin && <Text style={s.checkmark}>✓</Text>}
            </View>
            <Text style={s.checkboxLabel}>자동 로그인</Text>
          </TouchableOpacity>

          {/* 로그인 버튼 */}
          <TouchableOpacity
            style={[s.loginBtn, !(username && password) && s.loginBtnDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={!(username && password)}
          >
            <Text
              style={[
                s.loginText,
                !(username && password) && { color: colors.WHITE },
              ]}
            >
              로그인
            </Text>
          </TouchableOpacity>

          {/* 하단 링크 */}
          <View style={s.bottomLinks}>
            <TouchableOpacity>
              <Text style={s.link}>아이디 찾기</Text>
            </TouchableOpacity>
            <Text style={s.divider}> | </Text>
            <TouchableOpacity>
              <Text style={s.link}>비밀번호 찾기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_00,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.WHITE,
    marginHorizontal: 20,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 32,
    shadowColor: 'rgba(146, 150, 171, 0.30)',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.PRIMARY_50,
    marginBottom: 24,
  },
  label: {
    fontSize: 11,
    marginBottom: 8,
    fontWeight: '500',
    color: colors.GRAY_80,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: colors.GRAY_05,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    backgroundColor: colors.GRAY_05,
    marginBottom: 16,
  },
  inputField: {
    flex: 1,
    padding: 8,
    fontSize: 14,
  },
  inputError: {
    borderColor: colors.RED_50,
  },
  eyeBtn: {
    paddingHorizontal: 12,
  },
  eyeImg: {
    width: 15,
    height: 15,
    tintColor: colors.GRAY_50,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    marginRight: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 12,
    color: colors.BLACK,
    fontWeight: '600',
    lineHeight: 16,
    textAlign: 'center',
    transform: [{ translateY: Platform.OS === 'android' ? -1 : 0 }],
  },
  checkboxLabel: {
    fontSize: 11,
    color: colors.GRAY_80,
    lineHeight: 15.4,
  },
  loginBtn: {
    backgroundColor: colors.PRIMARY_50,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginBtnDisabled: {
    backgroundColor: colors.GRAY_15,
  },
  loginText: {
    color: colors.WHITE,
    fontWeight: '400',
    fontSize: 11,
  },
  bottomLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  link: {
    color: colors.GRAY_80,
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    color: colors.BLACK,
    marginHorizontal: 14,
  },
  errorText: {
    color: colors.RED_50,
    fontSize: 10,
    marginBottom: 6,
    marginTop: -10,
  },
});
