import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuthStore } from '../../states/useAuthStore';
import { colors } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigations/auth/AuthStack';

type LoginForm = {
  loginId: string;
  password: string;
};

export default function AuthScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const login = useAuthStore(s => s.login);

  const { control, handleSubmit, watch } = useForm<LoginForm>({
    mode: 'onBlur',
    defaultValues: { loginId: '', password: '' },
  });

  const loginId = watch('loginId');
  const password = watch('password');

  const [secure, setSecure] = useState(true);
  const [autoLogin, setAutoLogin] = useState(false);
  const [isManager, setIsManager] = useState(false);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const onSubmit = async ({ loginId, password }: LoginForm) => {
    if (isLoggingIn) return;

    const role: 'ADMIN' | 'USER' = isManager ? 'ADMIN' : 'USER';

    try {
      setIsLoggingIn(true);
      await login(loginId, password, role, autoLogin);
    } catch (err) {
      Alert.alert('로그인 실패', '아이디 또는 비밀번호를 확인해주세요.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={s.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={s.card}>
          <Text style={s.logo}>Trust Solution</Text>

          {/* 아이디 */}
          <Text style={s.label}>아이디</Text>
          <Controller
            control={control}
            name="loginId"
            rules={{ required: '아이디를 입력해주세요.' }}
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <>
                <TextInput
                  placeholder="아이디를 입력하세요"
                  placeholderTextColor={colors.GRAY_50}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="username"
                  autoComplete="username"
                  returnKeyType="next"
                  style={[s.input, fieldState.error && s.inputError]}
                />
                {fieldState.error && (
                  <Text style={s.errorText}>{fieldState.error.message}</Text>
                )}
              </>
            )}
          />

          {/* 비밀번호 */}
          <Text style={s.label}>비밀번호</Text>
          <Controller
            control={control}
            name="password"
            rules={{ required: '비밀번호를 입력해주세요.' }}
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <>
                <View
                  style={[s.inputContainer, fieldState.error && s.inputError]}
                >
                  <TextInput
                    placeholder="비밀번호를 입력하세요"
                    placeholderTextColor={colors.GRAY_50}
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
                  <Pressable
                    onPress={() => setSecure(!secure)}
                    style={s.eyeBtn}
                  >
                    <Image
                      source={
                        secure
                          ? require('../../assets/auth/Eye.png')
                          : require('../../assets/auth/Eye-off.png')
                      }
                      style={s.eyeImg}
                    />
                  </Pressable>
                </View>
                {fieldState.error && (
                  <Text style={s.errorText}>{fieldState.error.message}</Text>
                )}
              </>
            )}
          />

          {/* 자동 로그인 / 매니저 */}
          <View style={s.optionRow}>
            <Pressable
              style={s.optionItem}
              onPress={() => setAutoLogin(!autoLogin)}
            >
              <View style={s.checkbox}>
                {autoLogin && <Text style={s.checkmark}>✓</Text>}
              </View>
              <Text style={s.checkboxLabel}>자동 로그인</Text>
            </Pressable>

            <Pressable
              style={s.optionItem}
              onPress={() => setIsManager(!isManager)}
            >
              <View style={s.checkbox}>
                {isManager && <Text style={s.checkmark}>✓</Text>}
              </View>
              <Text style={s.checkboxLabel}>매니저</Text>
            </Pressable>
          </View>

          {/* 로그인 버튼 */}
          <Pressable
            style={[
              s.loginBtn,
              (!(loginId && password) || isLoggingIn) && s.loginBtnDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={!(loginId && password) || isLoggingIn}
          >
            <View style={s.loginContent}>
              <Text style={[s.loginText, isLoggingIn && { opacity: 0 }]}>
                로그인
              </Text>
              {isLoggingIn && (
                <ActivityIndicator
                  size="small"
                  color={colors.WHITE}
                  style={StyleSheet.absoluteFill}
                />
              )}
            </View>
          </Pressable>

          {/* 하단 링크 */}
          <View style={s.bottomLinks}>
            <Pressable onPress={() => navigation.navigate('FindId')}>
              <Text style={s.link}>아이디 찾기</Text>
            </Pressable>
            <Text style={s.divider}> | </Text>
            <Pressable onPress={() => navigation.navigate('FindPassword')}>
              <Text style={s.link}>비밀번호 찾기</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  logo: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.PRIMARY_50,
    marginBottom: 24,
  },
  label: {
    fontSize: 17,
    marginBottom: 8,
    fontWeight: '500',
    color: colors.GRAY_80,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'android' ? 4 : 8,
    marginBottom: 12,
    fontSize: 17,
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
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'android' ? 4 : 8,
    fontSize: 17,
  },
  inputError: {
    borderColor: colors.RED_50,
  },
  eyeBtn: {
    paddingHorizontal: 16,
  },
  eyeImg: {
    width: 15,
    height: 15,
    tintColor: colors.GRAY_50,
  },
  optionRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  optionItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 16,
    transform: [{ translateY: Platform.OS === 'android' ? -1 : 0 }],
  },
  checkboxLabel: {
    fontSize: 17,
    color: colors.GRAY_80,
    lineHeight: 15.4,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },
  loginBtn: {
    backgroundColor: colors.PRIMARY_50,
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginBtnDisabled: {
    backgroundColor: colors.GRAY_15,
  },
  loginContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: colors.WHITE,
    fontWeight: '400',
    fontSize: 17,
  },
  bottomLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  link: {
    color: colors.GRAY_80,
    fontSize: 17,
  },
  divider: {
    marginHorizontal: 14,
  },
  errorText: {
    color: colors.RED_50,
    fontSize: 10,
    marginBottom: 6,
    marginTop: -10,
  },
});
