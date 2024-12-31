import express from 'express';
import type {Request} from "express";
import bodyParser from 'body-parser';
import {createProxyMiddleware, fixRequestBody, responseInterceptor} from 'http-proxy-middleware';

import {PROXYS, PORT, PROXY_CODE_SECRET} from './config';
import type {Proxy, Middleware, MiddlewareConfig} from './util/model';
import {generateSha256} from "./util/auxiliary";
import {ExceptionResponse, ExceptionResponseCode, Response} from './util/core';

let APP = express();

let MIDDLEWARES = PROXYS.map((item: Proxy): Middleware => {
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
            config.on.proxyRes = responseInterceptor(async (targetResponseBuffer: Buffer, targetResponse, request, response): Promise<string> => {
                let responseHeader = {};
                for (let responseHeaderKey in response.getHeaders()) {
                    responseHeader[responseHeaderKey] = response.getHeader(responseHeaderKey);
                    response.removeHeader(responseHeaderKey);
                }

                let result = await item.template.response({header: responseHeader, body: targetResponseBuffer.toString('utf-8')});
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
        middleware: createProxyMiddleware(config),
        enable: item.enable
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

APP.use(bodyParser.json(), bodyParser.urlencoded({extended: true}), (request, response, next): void | Promise<void> => {
    let middleware = MIDDLEWARES.find((item: Middleware): boolean => {return request.hostname === item.domain});
    if (!middleware) {
        throw new ExceptionResponse(ExceptionResponseCode.SYSTEM, '代理不存在');
    }

    if (middleware.enable) {
        return middleware.middleware(request, response, next);
    } else {
        throw new ExceptionResponse(ExceptionResponseCode.SYSTEM, '代理已关闭');
    }
});

APP.use((error, request, response, next): void => {
    if (error instanceof ExceptionResponse) {
        return Response.error(error.code, error.message)(response);
    }

    return Response.error(500, "未知错误", 500)(response);
});

APP.listen(PORT);