import React from "react";

export interface Service {
	id: number;
	name: string;
	colors: string[];
}

export interface DataItem {
	x: string;
	y: number;
	selected: boolean;
}
