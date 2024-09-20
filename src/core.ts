export enum ExceptionResponseCode {
    SYSTEM = 100
}

export class ExceptionResponse extends Error {
    readonly code: number;

    constructor(code: number, message: string) {
        super(message);
        this.code = code;
    }
}

export class Response {
    generate(code: number, message: string, data: any=null): object {
        return {
            code: code,
            message: message,
            data: data
        };
    }

    static error(code: number, message: string): object {
        return new Response().generate(code, message);
    }

    static success(data: any): object {
        return new Response().generate(200, 'success', data);
    }
}