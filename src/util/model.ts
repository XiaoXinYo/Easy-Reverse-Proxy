import type {ProxyReqCallback, ProxyResCallback} from 'http-proxy';
import type {RequestHandler} from 'http-proxy-middleware';

export interface MiddlewareConfig {
    target: string;
    changeOrigin: boolean;
    selfHandleResponse?: boolean;
    on: {
        proxyReq?: ProxyReqCallback;
        proxyRes?: ProxyResCallback;
    }
}

export interface Middleware {
    domain: string;
    middleware: RequestHandler;
    enable: boolean;
}

export interface TemplateRequestResult {
    header: object;
    body: object;
}

export interface TemplateResponseResult {
    header: object;
    body: string;
}

export interface Template {
    request?: (header: object, body: object) => TemplateRequestResult;
    response?: (header: object, body: string) => Promise<TemplateResponseResult>;
}

export interface Proxy {
    domain: string;
    url: string;
    enable: boolean;
    template?: Template;
    replaces?: {
        old: string | RegExp;
        new: string;
    }[];
}