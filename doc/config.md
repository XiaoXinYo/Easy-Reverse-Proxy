# 配置
## config.ts
查看config.ts文件.
### Proxy
```Typescript
interface Proxy {
    domain: string; // 域名
    url: string; // 网址
    enable: boolean; // 开启
    template?: Template; // 模板
}
```
## 示例
```TypeScript
import type {Proxy} from './util/model';

export let PORT = 377; // 端口

export let PROXY_CODE_SECRET = 'Easy-Reverse-Proxy'; // 代理码密钥
// 代理
export let PROXIES: Proxy[] = [
    {
        domain: "www.example.com",
        url: "https://github.com/",
        enable: true
    }
];
```
说明: www.example.com 代理 https://github.com/.