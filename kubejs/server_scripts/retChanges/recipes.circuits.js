// priority: 0
"use strict";

const registerRetChangeCircuitRecipes = (event) => {

	// #region Resistor

	event.remove({ output: 'gtceu:resistor' })
	event.remove({ id: 'gtceu:assembler/resistor_coal' })

	// Shaped recipe
	event.shaped('gtceu:resistor', [
		'ADA',
		'BCB',
		'ADA'
	], {
		A: 'minecraft:paper',
		B: 'gtceu:sticky_resin',
		C: 'tfc:fire_clay_block',
		D: 'gtceu:glass_tube'
	}).id('tfg:ret/shaped/resistor')

	// Sequenced Assembly — cheap route
	let inter = 'gtceu:glass_tube'
	event.recipes.createSequencedAssembly([
		'gtceu:resistor'
	], 'gtceu:glass_tube', [
		event.recipes.createDeploying(inter, [inter, 'tfc:powder/kaolinite']),
		event.recipes.createDeploying(inter, [inter, 'tfc:powder/graphite']),
		event.recipes.createDeploying(inter, [inter, 'minecraft:paper']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:sticky_resin']),
		event.recipes.greate.pressing(inter, inter)
	]).transitionalItem(inter).loops(4).id('tfg:ret/sequenced_assembly/resistor')

	// Sequenced Assembly — advanced route (4x output)
	inter = 'gtceu:glass_tube'
	event.recipes.createSequencedAssembly([
		'4x gtceu:resistor'
	], 'gtceu:glass_tube', [
		event.recipes.createDeploying(inter, [inter, 'tfc:fire_clay']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:fine_annealed_copper_wire']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:fine_annealed_copper_wire']),
		event.recipes.createDeploying(inter, [inter, '#forge:dyes/green_dye']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:fine_red_alloy_wire']),
		event.recipes.createFilling(inter, [inter, Fluid.of('gtceu:toluene', 50)])
	]).transitionalItem(inter).loops(4).id('tfg:ret/sequenced_assembly/resistor_advanced')

	// #endregion

	// #region Resin Printed Circuit Board

	event.remove({ id: 'gtceu:shaped/basic_circuit_board' })
	event.remove({ id: 'gtceu:assembler/basic_circuit_board' })

	// Sequenced Assembly
	inter = 'gtceu:resin_circuit_board'
	event.recipes.createSequencedAssembly([
		'gtceu:resin_printed_circuit_board'
	], 'gtceu:resin_circuit_board', [
		event.recipes.createDeploying(inter, [inter, 'gtceu:copper_single_wire']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:copper_single_wire']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:copper_single_wire']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:copper_single_wire']),
		event.recipes.createFilling(inter, [inter, Fluid.of('gtceu:glue', 50)]),
		event.recipes.greate.pressing(inter, inter)
	]).transitionalItem(inter).loops(4).id('tfg:ret/sequenced_assembly/resin_printed_circuit_board')

	// #endregion

	// #region Phenolic Circuit Board — keep 13.3 bakelite recipes as-is

	// No changes — 13.3 bakelite forming press + assembler recipes remain

	// #endregion

	// #region Phenolic Printed Circuit Board

	event.remove({ output: 'gtceu:phenolic_printed_circuit_board' })

	// Sequenced Assembly
	inter = 'gtceu:phenolic_circuit_board'
	event.recipes.createSequencedAssembly([
		'5x gtceu:phenolic_printed_circuit_board'
	], 'gtceu:phenolic_circuit_board', [
		event.recipes.createDeploying(inter, [inter, 'gtceu:fine_silver_wire']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:fine_silver_wire']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:fine_silver_wire']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:fine_silver_wire']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:fine_silver_wire']),
		event.recipes.createFilling(inter, [inter, Fluid.of('gtceu:iron_iii_chloride', 25)]),
		event.recipes.greate.pressing(inter, inter)
	]).transitionalItem(inter).loops(32).id('tfg:ret/sequenced_assembly/phenolic_printed_circuit_board')

	// #endregion

	// #region Basic Electronic Circuit (LV)

	event.remove({ id: 'gtceu:shaped/electronic_circuit_lv' })
	event.remove({ output: 'gtceu:basic_electronic_circuit' })
	event.remove({ id: 'gtceu:circuit_assembler/electronic_circuit_lv' })
	event.remove({ id: 'tfg:gtceu/sequenced_assembly/basic_electronic_circuit' })

	// Recipe 1 — Standard (resin board)
	event.recipes.createSequencedAssembly([
		'gtceu:basic_electronic_circuit'
	], 'gtceu:resin_printed_circuit_board', [
		event.recipes.createDeploying('tfg:unfinished_basic_electronic_circuit', ['tfg:unfinished_basic_electronic_circuit', 'gtceu:resistor']),
		event.recipes.createDeploying('tfg:unfinished_basic_electronic_circuit', ['tfg:unfinished_basic_electronic_circuit', 'gtceu:resistor']),
		event.recipes.createDeploying('tfg:unfinished_basic_electronic_circuit', ['tfg:unfinished_basic_electronic_circuit', 'gtceu:vacuum_tube']),
		event.recipes.createDeploying('tfg:unfinished_basic_electronic_circuit', ['tfg:unfinished_basic_electronic_circuit', 'gtceu:vacuum_tube']),
		event.recipes.createDeploying('tfg:unfinished_basic_electronic_circuit', ['tfg:unfinished_basic_electronic_circuit', 'create:electron_tube']),
		event.recipes.createFilling('tfg:unfinished_basic_electronic_circuit', ['tfg:unfinished_basic_electronic_circuit', Fluid.of('gtceu:rubber', 576)]),
		event.recipes.createDeploying('tfg:unfinished_basic_electronic_circuit', ['tfg:unfinished_basic_electronic_circuit', 'create:precision_mechanism'])
	]).transitionalItem('tfg:unfinished_basic_electronic_circuit').loops(1).id('tfg:ret/sequenced_assembly/basic_electronic_circuit_1_rubber')

	// Recipe 2 — Alternate (phenolic board, 2x output, uses circuit tag)
	inter = 'gtceu:phenolic_printed_circuit_board'
	event.recipes.createSequencedAssembly([
		'2x gtceu:basic_electronic_circuit'
	], 'gtceu:phenolic_printed_circuit_board', [
		event.recipes.createDeploying(inter, [inter, 'gtceu:gold_single_cable']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:gold_single_cable']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:resistor']),
		event.recipes.createDeploying(inter, [inter, '#gtceu:circuits/ulv']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:manganese_foil']),
		event.recipes.createFilling(inter, [inter, Fluid.of('gtceu:soldering_alloy', 72)]),
		event.recipes.greate.pressing(inter, inter)
	]).transitionalItem(inter).loops(3).id('tfg:ret/sequenced_assembly/basic_electronic_circuit_2_alternate')

	// Recipe 2 alt — Woods metal variant (half fluid)
	inter = 'gtceu:phenolic_printed_circuit_board'
	event.recipes.createSequencedAssembly([
		'2x gtceu:basic_electronic_circuit'
	], 'gtceu:phenolic_printed_circuit_board', [
		event.recipes.createDeploying(inter, [inter, 'gtceu:gold_single_cable']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:gold_single_cable']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:resistor']),
		event.recipes.createDeploying(inter, [inter, '#gtceu:circuits/ulv']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:manganese_foil']),
		event.recipes.createFilling(inter, [inter, Fluid.of('tfg:woods_metal', 36)]),
		event.recipes.greate.pressing(inter, inter)
	]).transitionalItem(inter).loops(3).id('tfg:ret/sequenced_assembly/basic_electronic_circuit_3_woods_metal')

	// #endregion

	// #region Good Electronic Circuit (MV)

	event.remove({ output: 'gtceu:good_electronic_circuit' })

	// 10.7 custom recipe
	inter = 'gtceu:phenolic_printed_circuit_board'
	event.recipes.createSequencedAssembly([
		'gtceu:good_electronic_circuit'
	], 'gtceu:phenolic_printed_circuit_board', [
		event.recipes.createDeploying(inter, [inter, '#gtceu:circuits/lv']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:diode']),
		event.recipes.createDeploying(inter, [inter, '#gtceu:circuits/lv']),
		event.recipes.createFilling(inter, [inter, Fluid.of('gtceu:rubber', 500)]),
		event.recipes.createDeploying(inter, [inter, 'gtceu:fine_manganese_phosphide_wire']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:resistor']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:fine_manganese_phosphide_wire']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:resistor'])
	]).transitionalItem(inter).loops(2).id('tfg:ret/sequenced_assembly/good_electronic_circuit')

	// #endregion

}
