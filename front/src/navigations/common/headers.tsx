import AppHeader from '../../components/common/AppHeader';

export const drawerHeaderOptions = {
  headerShown: true,
  header: () => <AppHeader canGoBack={false} />,
};

export const stackHeaderOptions = {
  headerShown: true,
  header: () => <AppHeader canGoBack={true} />,
};
