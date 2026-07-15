// priority: 0
"use strict";

const registerRetChangeMachineRecipes = (event) => {

	// #region ULV Machine Casing

	event.remove({ output: 'gtceu:ulv_machine_casing' })

	let inter = 'create:andesite_casing'
	event.recipes.createSequencedAssembly([
		'gtceu:ulv_machine_casing'
	], 'create:andesite_casing', [
		event.recipes.createDeploying(inter, [inter, 'gtceu:wrought_iron_screw']),
		event.recipes.createDeploying(inter, [inter, 'greate:steel_cogwheel']),
		event.recipes.createDeploying(inter, [inter, 'greate:large_steel_cogwheel']),
		event.recipes.createDeploying(inter, [inter, 'greate:steel_cogwheel']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:wrought_iron_screw']),
		event.recipes.createDeploying(inter, [inter, '#forge:wax']),
		event.recipes.greate.pressing(inter, inter)
	]).transitionalItem(inter).loops(1).id('tfg:ret/sequenced_assembly/ulv_machine_casing')

	// #endregion

	// #region ULV Machine Hull

	event.remove({ output: 'gtceu:ulv_machine_hull' })

	// Old 10.7 custom recipe
	inter = 'gtceu:ulv_machine_casing'
	event.recipes.createSequencedAssembly([
		'gtceu:ulv_machine_hull'
	], 'gtceu:ulv_machine_casing', [
		event.recipes.createDeploying(inter, [inter, 'gtceu:vacuum_tube']),
		event.recipes.createDeploying(inter, [inter, '#forge:double_plates/lead']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:black_steel_screw']),
		event.recipes.createDeploying(inter, [inter, '#forge:double_plates/lead']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:black_steel_screw']),
		event.recipes.greate.pressing(inter, inter)
	]).transitionalItem(inter).loops(3).id('tfg:ret/sequenced_assembly/ulv_machine_hull_old')

	// New recipe
	inter = 'gtceu:ulv_machine_casing'
	event.recipes.createSequencedAssembly([
		'gtceu:ulv_machine_hull'
	], 'gtceu:ulv_machine_casing', [
		event.recipes.createDeploying(inter, [inter, '#gtceu:circuits/ulv']),
		event.recipes.createDeploying(inter, [inter, '#forge:plates/lead']),
		event.recipes.createFilling(inter, [inter, Fluid.of('tfg:bakelite', 50)]),
		event.recipes.createDeploying(inter, [inter, '#forge:plates/lead']),
		event.recipes.createFilling(inter, [inter, Fluid.of('tfg:bakelite', 50)]),
		event.recipes.greate.pressing(inter, inter)
	]).transitionalItem(inter).loops(3).id('tfg:ret/sequenced_assembly/ulv_machine_hull')

	// #endregion

	// #region LV Machine Casing

	event.remove({ output: 'gtceu:lv_machine_casing' })

	inter = 'gtceu:black_steel_frame'
	event.recipes.createSequencedAssembly([
		'gtceu:lv_machine_casing'
	], 'gtceu:black_steel_frame', [
		event.recipes.createDeploying(inter, [inter, '#forge:double_plates/steel']),
		event.recipes.createFilling(inter, [inter, Fluid.of('gtceu:seed_oil', 250)]),
		event.recipes.greate.pressing(inter, inter),
		event.recipes.createDeploying(inter, [inter, 'gtceu:diamond_screw']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:diamond_screw']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:diamond_screw']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:diamond_screw'])
	]).transitionalItem(inter).loops(6).id('tfg:ret/sequenced_assembly/lv_machine_casing')

	// #endregion

	// #region LV Machine Hull

	event.remove({ output: 'gtceu:lv_machine_hull' })

	// Old 10.7 custom recipe
	event.recipes.create.mechanical_crafting('gtceu:lv_machine_hull', [
		'DED',
		'CAC',
		'CBC'
	], {
		A: 'gtceu:lv_machine_casing',
		B: '#gtceu:circuits/lv',
		C: 'gtceu:rubber_plate',
		D: 'gtceu:tin_single_cable',
		E: 'gtceu:double_red_steel_plate'
	}).id('tfg:ret/mechanical_crafting/lv_machine_hull_old')

	// New recipe with bakelite
	event.recipes.create.mechanical_crafting('gtceu:lv_machine_hull', [
		'DBD',
		'CAC'
	], {
		A: 'gtceu:lv_machine_casing',
		B: '#gtceu:circuits/lv',
		C: 'tfg:bakelite_plate',
		D: 'gtceu:tin_single_cable'
	}).id('tfg:ret/mechanical_crafting/lv_machine_hull')

	// #endregion

	// #region Aluminium Frame

	event.remove({ output: 'gtceu:aluminium_frame' })

	inter = 'gtceu:tempered_glass'
	event.recipes.createSequencedAssembly([
		'2x gtceu:aluminium_frame'
	], 'gtceu:tempered_glass', [
		event.recipes.createDeploying(inter, [inter, 'gtceu:aluminium_foil']),
		event.recipes.createDeploying(inter, [inter, 'greate:aluminium_shaft']),
		event.recipes.createFilling(inter, [inter, Fluid.of('gtceu:seed_oil', 500)]),
		event.recipes.greate.cutting(inter, inter),
		event.recipes.createDeploying(inter, [inter, 'gtceu:aluminium_ring']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:aluminium_screw']),
		event.recipes.greate.pressing(inter, inter)
	]).transitionalItem(inter).loops(20).id('tfg:ret/sequenced_assembly/aluminium_frame')

	// #endregion

	// #region LV Assembler

	event.remove({ output: 'gtceu:lv_assembler' })

	event.recipes.create.mechanical_crafting('gtceu:lv_assembler', [
		'A BAB A',
		'CCCDCCC',
		'EFEGEHE'
	], {
		A: 'gtceu:lv_robot_arm',
		B: 'gtceu:basic_electronic_circuit',
		C: 'gtceu:lv_conveyor_module',
		D: 'gtceu:lv_machine_hull',
		E: 'gtceu:tin_single_cable',
		F: 'gtceu:blue_steel_gear',
		G: 'gtceu:black_steel_gear',
		H: 'gtceu:red_steel_gear'
	}).id('tfg:ret/mechanical_crafting/lv_assembler')

	// #endregion

	// #region LV Arc Furnace

	event.remove({ output: 'gtceu:lv_arc_furnace' })

	event.recipes.create.mechanical_crafting('gtceu:lv_arc_furnace', [
		'  ABA  ',
		' C D C ',
		' C D C ',
		'ECEFECE',
		'GHIJIHG',
		'  HKH  '
	], {
		A: 'minecraft:lightning_rod',
		B: 'tfc:crucible',
		C: 'gtceu:lv_voltage_coil',
		D: 'gtceu:copper_tiny_fluid_pipe',
		E: 'gtceu:red_alloy_octal_cable',
		F: 'gtceu:lv_machine_hull',
		G: 'gtceu:lv_electric_piston',
		H: 'gtceu:basic_electronic_circuit',
		I: 'gtceu:lv_transformer_1a',
		J: 'gtceu:lv_electric_pump',
		K: 'gtceu:lv_input_hatch'
	}).id('tfg:ret/mechanical_crafting/lv_arc_furnace')

	// #endregion

	// #region Heatproof Machine Casing

	event.remove({ output: 'gtceu:heatproof_machine_casing' })

	inter = 'gtceu:invar_frame'
	event.recipes.createSequencedAssembly([
		'gtceu:heatproof_machine_casing'
	], 'gtceu:invar_frame', [
		event.recipes.createDeploying(inter, [inter, 'vintageimprovements:invar_sheet']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:asbestos_dust']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:asbestos_dust']),
		event.recipes.greate.pressing(inter, inter)
	]).transitionalItem(inter).loops(8).id('tfg:ret/sequenced_assembly/heatproof_machine_casing')

	// #endregion

	// #region Cupronickel Coil Block

	event.remove({ output: 'gtceu:cupronickel_coil_block' })

	inter = 'gtceu:bronze_frame'
	event.recipes.createSequencedAssembly([
		'gtceu:cupronickel_coil_block'
	], 'gtceu:bronze_frame', [
		event.recipes.createDeploying(inter, [inter, 'gtceu:fine_cupronickel_wire']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:fine_cupronickel_wire']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:fine_cupronickel_wire']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:fine_cupronickel_wire']),
		event.recipes.createDeploying(inter, [inter, '#forge:foils/blue_steel']),
		event.recipes.createDeploying(inter, [inter, '#forge:foils/blue_steel']),
		event.recipes.createDeploying(inter, [inter, '#forge:ingots/magnesia_refractory_brick']),
		event.recipes.createFilling(inter, [inter, Fluid.of('gtceu:tin_alloy', 36)])
	]).transitionalItem(inter).loops(8).id('tfg:ret/sequenced_assembly/cupronickel_coil_block')

	// #endregion

	// #region Kanthal Coil Block

	event.remove({ output: 'gtceu:kanthal_coil_block' })

	inter = 'gtceu:kanthal_block'
	event.recipes.createSequencedAssembly([
		'gtceu:kanthal_coil_block'
	], 'gtceu:kanthal_block', [
		event.recipes.createDeploying(inter, [inter, 'gtceu:kanthal_single_wire']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:kanthal_single_wire']),
		event.recipes.createDeploying(inter, [inter, '#forge:foils/rene_41']),
		event.recipes.createDeploying(inter, [inter, '#forge:foils/rene_41']),
		event.recipes.createDeploying(inter, [inter, '#forge:ingots/silicon_carbide']),
		event.recipes.createFilling(inter, [inter, Fluid.of('gtceu:cobalt', 36)])
	]).transitionalItem(inter).loops(16).id('tfg:ret/sequenced_assembly/kanthal_coil_block')

	// #endregion

	// #region Deployer

	event.shaped('create:deployer', [
		'AGA',
		'DBF',
		' CE'
	], {
		A: '#forge:cogwheels',
		B: 'create:shadow_steel_casing',
		C: 'create:brass_hand',
		D: '#forge:tools/wrenches',
		E: '#forge:tools/screwdrivers',
		F: 'create:electron_tube',
		G: '#forge:shafts'
	}).id('tfg:create/shaped/deployer')

	event.recipes.gtceu.assembler('create:deployer')
		.itemInputs('#forge:cogwheels', 'create:shadow_steel_casing', 'create:brass_hand', 'create:electron_tube', '#forge:shafts')
		.itemOutputs('create:deployer')
		.duration(50)
		.EUt(GTValues.VA[GTValues.ULV])

	TFGHelpers.registerMaterialInfo('create:deployer', [GTMaterials.Brass, 12/9, GTMaterials.BlackSteel, 1, GTMaterials.Wood, 1]);

	// #endregion

	// #region Vintage Improvements Laser

	// Remove built-in VI recipes for laser
	event.remove({ output: 'vintageimprovements:laser' })

	// Laser block (laser_item doesn't exist in VI 0.3.7.3)
	event.shaped('vintageimprovements:laser', [
		'ABA',
		'CDC',
		'AEA'
	], {
		A: 'create:brass_casing',
		B: 'greate:aluminium_shaft',
		C: 'gtceu:lv_voltage_coil',
		D: 'gtceu:lv_machine_hull',
		E: '#gtceu:circuits/lv'
	}).id('tfg:vi/shaped/laser')

	// #endregion

}
