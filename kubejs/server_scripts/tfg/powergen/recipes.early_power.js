"use strict";

const registerTFGEarlyPowerRecipes = (event) => {

	// T0 Wooden Shaft — lumber + logs + saw → 9x andesite alloy shaft
	// No metal required, gates Create after basic woodworking
	event.shaped('9x greate:andesite_alloy_shaft', [
		'L#L',
		'LSL',
		'L#L'
	], {
		L: '#tfc:lumber',
		'#': '#minecraft:logs',
		S: '#forge:tools/saws'
	}).id('tfg:shaped/wooden_shaft')

}
