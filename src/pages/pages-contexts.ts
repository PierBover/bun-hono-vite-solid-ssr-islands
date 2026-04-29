import { createContext, type Context } from 'solid-js';

export type RequestContextValue = {
	path: string;
};

export const RequestContext: Context<RequestContextValue> = createContext<RequestContextValue>({ path: '' });

export type HomeContextValue = {
	welcomeMessage: string;
};

export const HomeContext: Context<HomeContextValue> = createContext<HomeContextValue>({ welcomeMessage: '' });
