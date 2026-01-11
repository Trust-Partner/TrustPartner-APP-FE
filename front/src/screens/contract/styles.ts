import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../constants/colors';

export const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GRAY_00,
    padding: 20,
  },
  header: {
    fontSize: 20,
    color: colors.GRAY_90,
  },
  vehicleBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.GRAY_10,
    borderRadius: 4,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    columnGap: 8,
  },
  vehicleModel: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.GRAY_90,
    lineHeight: 31,
  },
  vehicleNumber: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.GRAY_60,
    lineHeight: 28,
    marginTop: Platform.OS === 'android' ? -2 : 0,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginBottom: 18,
  },
  iconSmall: {
    width: 16,
    height: 16,
    tintColor: colors.GRAY_80,
  },
  topBtn: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    borderColor: colors.PRIMARY_50,
    columnGap: 8,
  },
  topBtnText: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.PRIMARY_50,
    lineHeight: 25,
  },

  card: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 12,
    padding: 20,
    marginBottom: 8,
    backgroundColor: colors.WHITE,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.GRAY_80,
    marginTop: Platform.OS === 'android' ? -3 : 0,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_50,
  },
  infoValue: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_80,
  },

  tagSingle: {
    backgroundColor: colors.PRIMARY_10,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tagText: {
    color: colors.PRIMARY_50,
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 25,
  },

  memoContainerBox: {
    backgroundColor: colors.GRAY_05,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    padding: 12,
    gap: 8,
  },
  memoBox: {
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 10,
    padding: 14,
  },
  memoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  memoDate: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.GRAY_50,
  },
  memoWriter: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.PRIMARY_50,
  },
  memoContent: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.GRAY_80,
  },

  memoInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  memoInput: {
    flex: 1,
    backgroundColor: colors.GRAY_05,
    borderWidth: 1,
    borderColor: colors.GRAY_10,
    borderRadius: 4,
    padding: 12,
    fontSize: 17,
    fontWeight: 400,
    color: colors.GRAY_50,
    lineHeight: 25,
  },
  memoAddBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    backgroundColor: colors.PRIMARY_50,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  memoAddText: { color: colors.WHITE, fontSize: 22, fontWeight: '700' },
});
