import {generateSha256} from './auxiliary';
import {PROXY_CODE_SECRET} from '../config';

export function generateProxyUrl(url: string): string {
    return `/${generateSha256(url, PROXY_CODE_SECRET)}?url=${btoa(url)}`;
}

export function verifyProxyCode(url: string, code: string): boolean {
    return generateSha256(url, PROXY_CODE_SECRET) === code
}