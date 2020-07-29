import { ResourceManager, ResourceType } from "@egret/core";

declare var generateEUI: any;

export class ThemeAdapter implements eui.IThemeAdapter {

  public getTheme(url: string, onSuccess: Function, onError: Function, thisObject: any): void {
    const Res = ResourceManager.instance;
    if (typeof generateEUI !== 'undefined') {
      setTimeout(() => {
        onSuccess.call(thisObject, generateEUI);
      }, 100);
    }
    else {
      Res.load({ uri: url, type: ResourceType.Text })
        .then((resourceItem) => {
          onSuccess.call(thisObject, resourceItem.data);
        })
        .catch(() => { // 异常
          onError.call(thisObject);
          console.error(`ThemeAdapter：${url} load error!`);
        });
    }
  }
}