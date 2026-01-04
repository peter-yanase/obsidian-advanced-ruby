export interface RubyMatch {
	start: number;
	end: number;
	base: string;
	ruby: string;
}

export interface ARSettings {
	smartarrows: boolean;
}

export const DEFAULT_SETTINGS: ARSettings = {
	smartarrows: true,
};
