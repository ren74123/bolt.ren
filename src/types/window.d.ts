interface WxSDK {
  shareToFriend: (options: {
    title: string;
    imageUrl: string;
    success?: () => void;
    fail?: () => void;
  }) => void;
  shareToTimeline: (options: {
    title: string;
    imageUrl: string;
    success?: () => void;
    fail?: () => void;
  }) => void;
}

declare global {
  interface Window {
    wx?: WxSDK;
  }
}

export {};
