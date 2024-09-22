![Release](https://img.shields.io/badge/Release-0.0.2-blue)
---
## 介绍
一款基于Node.js Express框架,开发的反向代理程序.
## 需求
1. 操作系统: Linux/Windows/MacOS.
2. 语言: Node.js.
## 配置
查看./src/config.ts文件.
```TypeScript
let PROXYS: Proxy[] = [
    {
        domain: "www.example1.com",
        url: "https://www.microsoft.com/",
        enable: true
    },
    {
        domain: "www.example2.com",
        url: "https://github.com/",
        enable: true
    }
]
```
> 1. www.example1.com 代理 https://www.microsoft.com/
> 2. www.example2.com 代理 https://github.com/
## 部署
1. Linux/Windows/MacOS:执行`npm run run`命令.
2. 支持Docker.
## Vercel部署
1. Fork本项目.
2. 修改配置.
3. Vercel Import Fork的项目.
4. Vercel Fork项目的Settings-Domains添加域名.