import { queryParams, LS } from 'uilib';
import { createStore, useStore } from 'justorm/react';

import { colorsConfig, getThemeConfig } from './theme';

const qParams = queryParams.parseQueryParams();
const initialThemeType = (LS.get('theme') as 'light' | 'dark') ?? 'dark';

function getInitialActiveColor() {
  return (
    localStorage.getItem('activeColor') ??
    colorsConfig[initialThemeType]['active-color']
  );
}

const initialActiveColor = getInitialActiveColor();

const STORE = createStore('app', {
  theme: initialThemeType,
  currThemeConfig: getThemeConfig(initialThemeType, initialActiveColor),
  activeColor: initialActiveColor,
  isEmbed: Boolean(qParams.embed),

  setTheme(theme) {
    this.theme = theme;
    this.updateTheme(theme);

    localStorage.setItem('theme', theme);
  },

  setActiveColor(color) {
    this.activeColor = color;
    this.updateTheme();

    localStorage.setItem('activeColor', color);
  },

  // @ts-ignore
  updateTheme(theme = this.theme) {
    this.currThemeConfig = getThemeConfig(theme, this.activeColor);
  },
});

export default STORE;
export type AppStore = typeof STORE;

export const useApp = (fields: (keyof AppStore)[] = []) => {
  const store = useStore({ app: fields });
  return store.app;
};
