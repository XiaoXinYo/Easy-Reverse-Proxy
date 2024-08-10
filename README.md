![Release](https://img.shields.io/badge/Release-0.0.1-blue)
---
## 介绍
一款基于Node.js Express框架,开发的反向代理程序.
## 需求
1. 平台: Linux/Windows/MacOS.
2. 语言: Node.js.
## 配置
查看./src/config.py文件.
```TypeScript
let proxys: Proxy[] = [
    {
        domain: "www.example1.com",
        url: "https://www.google.com/"
    },
    {
        domain: "www.example2.com",
        url: "https://github.com/"
    }
]
```
> 1. www.example1.com 代理 https://www.google.com/
> 2. www.example2.com 代理 https://github.com/