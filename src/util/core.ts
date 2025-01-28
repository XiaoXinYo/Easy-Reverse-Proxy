import type {Response} from 'express';

import type {GenerateResponseCallback} from './model';

export enum ExceptionResponseCode {
    SYSTEM = 100
}

export class ExceptionResponse extends Error {
    readonly code: ExceptionResponseCode;

    constructor(code: ExceptionResponseCode, message: string) {
        super(message);
        this.code = code;
    }
}

export class GenerateResponse {
    private static generate(httpCode: number, serviceCode: number, message: string, data: any): GenerateResponseCallback {
        return function(response: Response): void {
            response.status(httpCode).json({
                code: serviceCode,
                message: message,
                data: data
            });
        }
    }

    static error(serviceCode: number, message: string, httpCode: number=200): GenerateResponseCallback {
        return GenerateResponse.generate(httpCode, serviceCode, message, null);
    }

    static success(data: any): GenerateResponseCallback {
        return GenerateResponse.generate(200, 200, 'success', data);
    }
}