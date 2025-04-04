declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        openTelegramLink(shareUrl: string): unknown;
        savePreparedInlineMessage: any;
        shareMessage(arg0: string): unknown;
        showAlert(arg0: string): unknown;
        initDataUnsafe: any;
        expand: any;
        tgAppInited: any;
        BackButton: any;
        ready: any;
        isVerticalSwipesEnabled: boolean;
      }
    }
    tgAppInited?: boolean;
  }
}