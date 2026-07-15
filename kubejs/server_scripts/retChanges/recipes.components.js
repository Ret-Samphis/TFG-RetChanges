// priority: 0
"use strict";

const registerRetChangeComponentRecipes = (event) => {

	// #region ULV Voltage Coil

	event.remove({ output: 'gtceu:ulv_voltage_coil' })

	event.recipes.createSequencedAssembly([
		'gtceu:ulv_voltage_coil'
	], 'gtceu:magnetic_iron_rod', [
		event.recipes.createDeploying('gtceu:magnetic_iron_rod', ['gtceu:magnetic_iron_rod', '#forge:fine_wires/lead'])
	]).transitionalItem('gtceu:magnetic_iron_rod').loops(32).id('tfg:ret/sequenced_assembly/ulv_voltage_coil')

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
