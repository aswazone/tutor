
import Vapi from '@vapi-ai/web';
import { env } from './env.config';

export const vapi = new Vapi(env.VAPI_PUBLIC_KEY as string);