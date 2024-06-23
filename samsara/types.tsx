import React from "react";

export interface Service {
	id: number;
	name: string;
	colors: string[];
	image: string;
}

export interface DataItem {
	x: string;
	y: number;
	selected: boolean;
}
