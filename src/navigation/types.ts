import type { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Quran: undefined;
  Prayer: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  SurahReader: { surahId: number };
  Qibla: undefined;
  Bookmarks: undefined;
  Search: undefined;
  Appearance: undefined;
  ReciterPicker: undefined;
  About: undefined;
};

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
