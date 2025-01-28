import express from 'express';
import type {Request, Response, NextFunction} from "express";
import {fixRequestBody, responseInterceptor, createProxyMiddleware} from 'http-proxy-middleware';
import bodyParser from 'body-parser';

import {PROXIES, PROXY_CODE_SECRET, PORT} from './config';
import type {Middleware, MiddlewareConfig} from './util/model';
import {generateSha256} from "./util/auxiliary";
import {ExceptionResponse, ExceptionResponseCode, GenerateResponse} from './util/core';

let APP = express();

let MIDDLEWARES = PROXIES.filter((item): boolean => {return item.enable;}).map((item): Middleware => {
    let config: MiddlewareConfig = {
        target: item.url,
        changeOrigin: true,
        on: {
            proxyReq: fixRequestBody
        }
    };

    if (item.template) {
        if (item.template.request) {
            config.on.proxyReq = (targetRequest, request: Request): void => {
                let targetRequestHeader = {};
                for (let targetRequestHeaderKey in targetRequest.getHeaders()) {
                    targetRequestHeader[targetRequestHeaderKey] = targetRequest.getHeader(targetRequestHeaderKey);
                    targetRequest.removeHeader(targetRequestHeaderKey);
                }

                let result = item.template.request({header: targetRequestHeader, body: request.body});
                for (let resultHeaderKey in result.header) {
                    targetRequest.setHeader(resultHeaderKey, result.header[resultHeaderKey]);
                }
                request.body = result.body;
                fixRequestBody(targetRequest, request);
            }
        }
        if (item.template.response) {
            config.on.proxyRes = responseInterceptor(async (targetResponseBuffer, targetResponse, request, response): Promise<Buffer> => {
                let responseHeader = {};
                for (let responseHeaderKey in response.getHeaders()) {
                    responseHeader[responseHeaderKey] = response.getHeader(responseHeaderKey);
                    response.removeHeader(responseHeaderKey);
                }

                let result = await item.template.response({header: responseHeader, body: targetResponseBuffer});
                for (let resultHeaderKey in result.header) {
                    response.setHeader(resultHeaderKey, result.header[resultHeaderKey]);
                }
                return result.body;
            });
            config.selfHandleResponse = true;
        }
    }

    return {
        domain: item.domain,
        middleware: createProxyMiddleware(config)
    }
});

APP.use('/:code([0-9a-zA-Z]{64})', (request, response, next): void | Promise<void> => {
    let url = request.query.url as string;
    let code = request.params.code;
    url = atob(url);
    if (generateSha256(url, PROXY_CODE_SECRET) !== code) {
        return next();
    }

    return createProxyMiddleware({
        target: url,
        changeOrigin: true
    })(request, response, next);
});

APP.use(bodyParser.json(), bodyParser.urlencoded({extended: true}), (request, response, next): Promise<void> => {
    let proxy = PROXIES.find((item): boolean => {return item.domain === request.hostname;});
    if (!proxy) {
        throw new ExceptionResponse(ExceptionResponseCode.SYSTEM, '代理不存在');
    }

    if (proxy.enable) {
        return MIDDLEWARES.find((item): boolean => {return item.domain === proxy.domain;}).middleware(request, response, next);
    } else {
        throw new ExceptionResponse(ExceptionResponseCode.SYSTEM, '代理已关闭');
    }
});

APP.use((error: Error, request: Request, response: Response, next: NextFunction): void => {
    if (error instanceof ExceptionResponse) {
        return GenerateResponse.error(error.code, error.message)(response);
    }

    return GenerateResponse.error(500, "未知错误", 500)(response);
});

APP.listen(PORT);