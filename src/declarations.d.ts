// We need to tell TypeScript
// that when we write "import styles from './styles.styl'
// we mean to load a module (to look for a './styles.styl.d.ts').
declare module '*.styl';
declare module '*.png';
declare module '*.svg';
declare module 'uilib';

declare var PRODUCTION: boolean;
