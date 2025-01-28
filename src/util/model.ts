import type {RequestHandler} from 'http-proxy-middleware';
import type {ProxyReqCallback, ProxyResCallback} from 'http-proxy';
import type {Response} from 'express';

export interface Proxy {
    domain: string;
    url: string;
    enable: boolean;
    template?: Template;
}

export interface Middleware {
    domain: string;
    middleware: RequestHandler;
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

export interface TemplateRequest {
    header: object;
    body: object;
}

export interface TemplateResponse {
    header: object;
    body: Buffer;
}

export interface Template {
    request?: (option: TemplateRequest) => TemplateRequest;
    response?: (option: TemplateResponse) => Promise<TemplateResponse>;
}

export interface GenerateResponseCallback {
    (response: Response): void;
}