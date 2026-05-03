import {type Context, createContext} from 'solid-js';

export type HonoContextValue = {
	path: string;
};

export const HonoContext: Context<HonoContextValue> = createContext<HonoContextValue>({path: ''});

export type HomeContextValue = {
	welcomeMessage: string;
};

export const HomeContext: Context<HomeContextValue> = createContext<HomeContextValue>({welcomeMessage: ''});
