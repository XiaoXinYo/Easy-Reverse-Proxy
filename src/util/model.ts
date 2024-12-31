import type {ProxyReqCallback, ProxyResCallback} from 'http-proxy';
import type {RequestHandler} from 'http-proxy-middleware';

export interface Proxy {
    domain: string;
    url: string;
    enable: boolean;
    template?: Template;
}

export interface MiddlewareConfig {
    target: string;
    changeOrigin: boolean;
    selfHandleResponse?: boolean;
    on: {
        proxyReq: ProxyReqCallback;
        proxyRes?: ProxyResCallback;
    }
}

export interface Middleware {
    domain: string;
    middleware: RequestHandler;
    enable: boolean;
}

export interface TemplateRequest {
    header: object;
    body: object;
}

export interface TemplateResponse {
    header: object;
    body: string;
}

export interface Template {
    request?: (option: TemplateRequest) => TemplateRequest;
    response?: (option: TemplateResponse) => Promise<TemplateResponse>;
}