import {generateSha256} from './helper';
import {PROXY_CODE_SECRET} from '../config';

export function generateProxyUrl(url: string): string {
    return `/${generateSha256(url, PROXY_CODE_SECRET)}?url=${btoa(url)}`;
}