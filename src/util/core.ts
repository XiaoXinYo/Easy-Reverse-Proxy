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

export class Response {
    private static generate(httpCode: number, serviceCode: number, message: string, data: any): Function {
        return function(response): void {
            response.status(httpCode).json({
                code: serviceCode,
                message: message,
                data: data
            });
        }
    }

    static error(serviceCode: number, message: string, httpCode: number=200): Function {
        return Response.generate(httpCode, serviceCode, message, null);
    }

    static success(data: any): Function {
        return Response.generate(200, 200, 'success', data);
    }
}