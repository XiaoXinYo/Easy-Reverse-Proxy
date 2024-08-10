import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ExceptionResponse, ExceptionResponseCode, Response } from './core';
import { proxys } from './config';
import type { Proxy } from './config';

let APP = express();

APP.use((request, response, next) => {
    let proxy = proxys.find((config: Proxy): boolean => request.hostname.includes(config.domain));
    if (!proxy) {
       throw new ExceptionResponse(ExceptionResponseCode.SYSTEM, '代理不存在');
    }

    return createProxyMiddleware({
        target: proxy.url,
        changeOrigin: true,
        on: {
            proxyRes: (proxyRes, req, res): void => {
                if(proxyRes.headers.location) {
                    next(new ExceptionResponse(ExceptionResponseCode.SYSTEM, '代理网址错误'));
                }
            }
        }
    })(request, response, next);
})

APP.use((error, request, response, next) => {
    if (error instanceof ExceptionResponse) {
        return response.json(Response.error(error.code, error.message));
    }

    return response.status(500).json(Response.error(500, "未知错误"));
});

APP.listen(370);