# 配置
## config.py
查看config.py文件.
## Proxy
```Typescript
interface Proxy {
    domain: string; // 域名
    url: string; // 网址
    enable: boolean; // 开启
    template?: Template; // 模板
    replaces?: { // 替换
        old: string | RegExp; // 旧文本
        new: string; // 新文本
    }[];
}
```
### 示例
```TypeScript
import {Proxy} from './util/model';
import Github from './template/github';

export let PORT = 370; // 端口

export let PROXY_CODE_SECRET = 'Easy-Reverse-Proxy' // 代理码密钥
// 代理
export let PROXYS: Proxy[] = [
    {
        domain: "www.example.com",
        url: "https://github.com/",
        enable: true,
        template: Github
    }
];
```
www.example.com 代理 https://github.com/