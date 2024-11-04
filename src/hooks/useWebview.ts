import Taro from "@tarojs/taro";

export default function useWebview() {
  function open(url: string) {
    const encoded = encodeURIComponent(url);
    Taro.navigateTo({
      url: `/pages/webview/index?target=${encoded}`
    });
  }

  return {
    open
  };
}
