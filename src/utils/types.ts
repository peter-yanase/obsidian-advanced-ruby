export interface ARSettings {
	smartarrows: boolean;

	lv1BaseColor: string;
	lv1RubyColor: string;
	lv1RubySize: number;
	lv1RubyPosition: string;
	lv1RubyRelativeOffset: number;
	lv1RubyDistribution: string;

	lv2BaseColor: string;
	lv2RubyColor: string;
	lv2RubySize: number;
	lv2RubyPosition: string;
	lv2RubyRelativeOffset: number;
	lv2RubyDistribution: string;
}

export interface Ruby {
	start: number;
	end: number;
	base: string;
	ruby: string;
}

export type Jump = undefined | "left" | "right";
