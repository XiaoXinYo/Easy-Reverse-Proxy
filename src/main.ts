import express from 'express';
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';
import { ExceptionResponse, ExceptionResponseCode, Response } from './core';
import { PORT, PROXYS } from './config';
import type { Proxy } from './config';

let APP = express();

PROXYS.forEach((item: Proxy, index: number, array: Proxy[]): void => {
    if (item.enable) {
        APP.use((request, response, next): void | Promise<void> => {
            if (request.hostname !== item.domain) {
                return next();
            }

            return createProxyMiddleware({
                target: item.url,
                changeOrigin: true,
                selfHandleResponse: true,
                on: {
                    proxyRes: responseInterceptor(async (targetResponseBuffer: Buffer, targetResponse, proxyRequest, proxyResponse): Promise<string> => {
                        if (targetResponse.headers.location) {
                            throw new ExceptionResponse(ExceptionResponseCode.SYSTEM, '代理网址错误');
                        }

                        let targetResponseText = targetResponseBuffer.toString('utf-8');
                        for (let replace of item.replaces) {
                            targetResponseText = targetResponseText.replaceAll(replace.old, replace.new);
                        }
                        return targetResponseText;
                    })
                }
            })(request, response, next)
        });
    } else {
        APP.use((request, response, next): void => {
            if (request.hostname !== item.domain) {
                return next();
            }

            throw new ExceptionResponse(ExceptionResponseCode.SYSTEM, '代理已关闭');
        });
    }
});

APP.use((request, response, next): void => {
    throw new ExceptionResponse(ExceptionResponseCode.SYSTEM, '代理不存在');
});

APP.use((error, request, response, next): void => {
    if (error instanceof ExceptionResponse) {
        return response.json(Response.error(error.code, error.message));
    }

    return response.status(500).json(Response.error(500, "未知错误"));
});

APP.listen(PORT);