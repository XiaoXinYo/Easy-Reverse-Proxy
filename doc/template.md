# 模板
## 工具
```TypeScript
function generateProxyUrl(url: string): string
```
说明: 生成原始网址的代理网址.
## 自定义模板
## request
```TypeScript
request?: (header: object, body: object) => TemplateRequestResult
```
1. 说明: 请求原始网址时调用.
2. 参数: `header`: 请求头,`body`: 请求体.
## response
```TypeScript
response?: (header: object, body: string) => Promise<TemplateResponseResult>
```
1. 说明: 原始网址响应时调用.
2. 参数: `header`: 响应头,`body`: 响应体.
## 示例
```TypeScript
import type {TemplateResponseResult, Template} from '../util/model';
import {generateProxyUrl} from '../util/template';

export default {
    response: async (header: object, body: string): Promise<TemplateResponseResult> => {
        body = body.replaceAll('Product', 'Easy-Reverse-Proxy');
        body = body.replaceAll('https://avatars.githubusercontent.com/u/56395004?v=4', generateProxyUrl('https://avatars.githubusercontent.com/u/56395004?v=4&amp;size=40'));
        return {header, body}
    }
} as Template;
```
1. Product替换为Easy-Reverse-Proxy.
2. 生成 https://avatars.githubusercontent.com/u/56395004?v=4 的代理网址并替换.