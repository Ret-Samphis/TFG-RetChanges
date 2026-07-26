// priority: 0
"use strict";

const registerRetChangeComponentRecipes = (event) => {

	// #region ULV Voltage Coil

	event.remove({ output: 'gtceu:ulv_voltage_coil' })

	event.recipes.createSequencedAssembly([
		'gtceu:ulv_voltage_coil'
	], 'gtceu:magnetic_iron_rod', [
		event.recipes.createDeploying('gtceu:magnetic_iron_rod', ['gtceu:magnetic_iron_rod', '#forge:fine_wires/lead'])
	]).transitionalItem('gtceu:magnetic_iron_rod').loops(16).id('tfg:ret/sequenced_assembly/ulv_voltage_coil')

	// #endregion

	// #region LV Voltage Coil

	event.remove({ id: 'gtceu:assembler/voltage_coil_ulv' })
	event.remove({ id: 'gtceu:assembler/voltage_coil_lv' })

	let inter = 'gtceu:magnetic_iron_rod'
	event.recipes.createSequencedAssembly([
		'gtceu:lv_voltage_coil'
	], 'gtceu:magnetic_iron_rod', [
		event.recipes.createDeploying(inter, [inter, 'gtceu:fine_steel_wire']),
		event.recipes.greate.pressing(inter, inter)
	]).transitionalItem(inter).loops(32).id('tfg:ret/sequenced_assembly/lv_voltage_coil')

	// #endregion

	// #region LV Conveyor Module

	event.remove({ output: 'gtceu:lv_conveyor_module' })

	inter = 'ret:reinforced_rubber_belt'
	event.recipes.createSequencedAssembly([
		'gtceu:lv_conveyor_module'
	], 'ret:reinforced_rubber_belt', [
		event.recipes.createDeploying(inter, [inter, 'gtceu:lv_electric_motor']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:lv_electric_motor']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:long_steel_rod']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:long_steel_rod']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:small_steel_gear']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:small_steel_gear']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:tin_single_cable'])
	]).transitionalItem(inter).loops(1).id('tfg:ret/sequenced_assembly/lv_conveyor_module')

	// #endregion

	// #region LV Electric Pump

	event.remove({ output: 'gtceu:lv_electric_pump' })

	inter = 'greate:steel_mechanical_pump'
	event.recipes.createSequencedAssembly([
		'gtceu:lv_electric_pump'
	], 'greate:steel_mechanical_pump', [
		event.recipes.createDeploying(inter, [inter, 'gtceu:tin_rotor']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:rubber_ring']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:rubber_ring']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:lv_electric_motor']),
		event.recipes.createFilling(inter, [inter, Fluid.of('gtceu:lubricant', 50)]),
		event.recipes.createDeploying(inter, [inter, 'gtceu:tin_single_cable']),
		event.recipes.greate.pressing(inter, inter)
	]).transitionalItem(inter).loops(1).id('tfg:ret/sequenced_assembly/lv_electric_pump')

	// #endregion

	// #region LV Emitter

	event.remove({ output: 'gtceu:lv_emitter' })

	inter = 'create:electron_tube'
	event.recipes.createSequencedAssembly([
		'gtceu:lv_emitter'
	], 'create:electron_tube', [
		event.recipes.createDeploying(inter, [inter, '#gtceu:circuits/lv']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:flawless_quartzite_gem']),
		event.recipes.createDeploying(inter, [inter, '#gtceu:circuits/lv']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:tin_single_cable']),
		event.recipes.createFilling(inter, [inter, Fluid.of('gtceu:brass', 72)]),
		event.recipes.greate.pressing(inter, inter)
	]).transitionalItem(inter).loops(1).id('tfg:ret/sequenced_assembly/lv_emitter')

	// #endregion

	// #region LV Robot Arm

	event.remove({ output: 'gtceu:lv_robot_arm' })

	event.recipes.create.mechanical_crafting('gtceu:lv_robot_arm', [
		'PPRM ',
		' RIR ',
		'RMR  ',
		'PGCPT'
	], {
		P: 'gtceu:steel_plate',
		R: 'gtceu:steel_rod',
		M: 'gtceu:lv_electric_motor',
		I: 'gtceu:lv_electric_piston',
		G: 'gtceu:small_steel_gear',
		C: '#gtceu:circuits/lv',
		T: 'gtceu:tin_single_cable'
	}).id('tfg:ret/mechanical_crafting/lv_robot_arm')

	// #endregion

	// #region LV Electric Motor

	event.remove({ output: 'gtceu:lv_electric_motor' })

	inter = 'gtceu:ulv_voltage_coil'
	event.recipes.createSequencedAssembly([
		'gtceu:lv_electric_motor'
	], 'gtceu:ulv_voltage_coil', [
		event.recipes.createDeploying(inter, [inter, 'gtceu:copper_single_wire']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:copper_single_wire']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:iron_ring']),
		event.recipes.createFilling(inter, [inter, Fluid.of('gtceu:lubricant', 50)]),
		event.recipes.createDeploying(inter, [inter, 'gtceu:tin_single_cable']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:wrought_iron_foil']),
		event.recipes.greate.pressing(inter, inter)
	]).transitionalItem(inter).loops(3).id('tfg:ret/sequenced_assembly/lv_electric_motor')

	// #endregion

	// #region LV Electric Piston

	event.remove({ output: 'gtceu:lv_electric_piston' })

	inter = 'gtceu:steel_small_fluid_pipe'
	event.recipes.createSequencedAssembly([
		'gtceu:lv_electric_piston'
	], 'gtceu:steel_small_fluid_pipe', [
		event.recipes.createDeploying(inter, [inter, 'gtceu:long_steel_rod']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:steel_plate']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:rubber_ring']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:small_steel_gear']),
		event.recipes.createDeploying(inter, [inter, 'gtceu:lv_electric_motor']),
		event.recipes.createFilling(inter, [inter, Fluid.of('gtceu:lubricant', 50)]),
		event.recipes.createDeploying(inter, [inter, 'gtceu:tin_single_cable']),
		event.recipes.greate.pressing(inter, inter)
	]).transitionalItem(inter).loops(1).id('tfg:ret/sequenced_assembly/lv_electric_piston')

	// #endregion

	// #region Mechanical Pump alternate (input for pump SA)

	event.recipes.greate.compacting('greate:steel_mechanical_pump', [
		'create:fluid_pipe',
		'#forge:wax',
		'#forge:wax',
		'greate:steel_cogwheel'
	])
		.recipeTier(1)
		.id('tfg:ret/compacting/mechanical_pump')

	// #endregion

	// #region Aluminium EBF

	event.remove({ id: 'gtceu:electric_blast_furnace/blast_aluminium' })
	event.remove({ id: 'gtceu:electric_blast_furnace/blast_aluminium_gas' })

	event.recipes.gtceu.electric_blast_furnace('tfg:ret/blast_aluminium')
		.itemInputs('gtceu:aluminium_dust')
		.itemOutputs('gtceu:aluminium_ingot')
		.chancedOutput('gtceu:ash_dust', 3000, 0)
		.circuit(1)
		.duration(180 * 20)
		.blastFurnaceTemp(1700)
		.EUt(120)

	event.recipes.gtceu.electric_blast_furnace('tfg:ret/blast_aluminium_gas')
		.itemInputs('gtceu:aluminium_dust')
		.itemOutputs('gtceu:aluminium_ingot')
		.inputFluids(Fluid.of('gtceu:nitrogen', 1000))
		.chancedOutput('gtceu:ash_dust', 3000, 0)
		.circuit(2)
		.duration(120 * 20)
		.blastFurnaceTemp(1700)
		.EUt(120)

	// #endregion

}
