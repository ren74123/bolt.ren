import { supabase } from './supabase';

interface WxConfig {
  appId: string;
  timestamp: number;
  nonceStr: string;
  signature: string;
}

// 初始化微信 JS-SDK
export async function initWxSDK() {
  try {
    // 从后端获取配置参数
    const { data: config, error } = await supabase
      .from('api_keys')
      .select('api_key')
      .eq('service', 'wechat')
      .single();

    if (error) throw error;

    // 加载微信 JS-SDK
    const script = document.createElement('script');
    script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.wx) {
        window.wx.config({
          debug: false,
          appId: config.api_key,
          timestamp: Math.floor(Date.now() / 1000),
          nonceStr: generateNonceStr(),
          signature: generateSignature(config.api_key),
          jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData']
        });

        window.wx.ready(() => {
          console.log('WeChat JS-SDK ready');
        });

        window.wx.error((err: any) => {
          console.error('WeChat JS-SDK error:', err);
        });
      }
    };
  } catch (err) {
    console.error('Failed to initialize WeChat JS-SDK:', err);
  }
}

// 生成随机字符串
function generateNonceStr(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 生成签名
function generateSignature(appId: string) {
  // 实际项目中应该从后端获取签名
  // 这里仅作示例
  return 'mock-signature';
}

// 分享到微信好友
export function shareToFriend(options: {
  title: string;
  desc: string;
  link: string;
  imgUrl: string;
}) {
  if (!window.wx) {
    console.error('WeChat JS-SDK not loaded');
    return;
  }

  window.wx.updateAppMessageShareData({
    ...options,
    success: () => {
      console.log('Share to friend success');
    },
    fail: (err: any) => {
      console.error('Share to friend failed:', err);
    }
  });
}

// 分享到朋友圈
export function shareToTimeline(options: {
  title: string;
  link: string;
  imgUrl: string;
}) {
  if (!window.wx) {
    console.error('WeChat JS-SDK not loaded');
    return;
  }

  window.wx.updateTimelineShareData({
    ...options,
    success: () => {
      console.log('Share to timeline success');
    },
    fail: (err: any) => {
      console.error('Share to timeline failed:', err);
    }
  });
}
