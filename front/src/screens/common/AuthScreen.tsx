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
} from 'react-native';
import { useAuthStore } from '../../states/useAuthStore';
import { mockUsers } from '../../mock/users';
import { colors } from '../../constants/colors';

export default function AuthScreen() {
  const login = useAuthStore(s => s.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [autoLogin, setAutoLogin] = useState(false);

  const handleLogin = () => {
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
    <View style={s.container}>
      <View style={s.card}>
        <Text style={s.logo}>Trust Solution</Text>

        <Text style={s.label}>아이디</Text>
        <TextInput
          placeholder="아이디를 입력하세요"
          value={username}
          onChangeText={setUsername}
          style={s.input}
        />

        <Text style={s.label}>비밀번호</Text>
        <View style={s.inputContainer}>
          <TextInput
            placeholder="비밀번호를 입력하세요"
            value={password}
            secureTextEntry={secure}
            onChangeText={setPassword}
            style={s.inputField}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)} style={s.eyeBtn}>
            {secure ? (
              <Image
                source={require('../../assets/auth/Eye.png')}
                style={s.eyeImg}
              />
            ) : (
              <Image
                source={require('../../assets/auth/Eye-off.png')}
                style={s.eyeImg}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* 자동 로그인 체크박스 */}
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
          onPress={handleLogin}
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
  eyeBtn: {
    paddingHorizontal: 12,
  },
  eyeImg: {
    width: 15,
    height: 15,
    color: colors.GRAY_50,
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
    color: '#fff',
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
});
