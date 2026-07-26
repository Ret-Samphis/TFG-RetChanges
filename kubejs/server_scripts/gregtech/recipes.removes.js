// priority: 0
"use strict";

/**
 * @param {Internal.RecipesEventJS} event 
 */
function removeGTCEURecipes(event) {

	event.replaceInput({ input: "gtceu:wood_drum" }, "gtceu:wood_drum", "minecraft:glass")
	event.replaceInput({ input: "minecraft:chest" }, "minecraft:chest", "#forge:chests/wooden")


	//#region Stone

	removeMaceratorRecipe(event, "macerate_stone_stairs")
	removeMaceratorRecipe(event, "macerate_stone_slab")
	removeMaceratorRecipe(event, "macerate_stone_button")
	removeMaceratorRecipe(event, "macerate_stone_brick_stairs")
	removeMaceratorRecipe(event, "macerate_stone_brick_slab")
	removeMaceratorRecipe(event, "macerate_red_sandstone_stairs")
	removeMaceratorRecipe(event, "macerate_red_sandstone_slab")
	removeMaceratorRecipe(event, "macerate_cobblestone_slab")
	removeMaceratorRecipe(event, "macerate_stone_bricks")
	removeMaceratorRecipe(event, "macerate_mossy_cobblestone")
	removeMaceratorRecipe(event, "macerate_cobblestone_wall")
	removeMaceratorRecipe(event, "macerate_cobblestone")
	removeMaceratorRecipe(event, "gravel_to_flint")
	removeMaceratorRecipe(event, "macerate_furnace")
	removeCutterRecipe(event, "cut_stone_block_to_plate")
	removeCutterRecipe(event, "cut_stone_block_to_plate_water")
	removeCutterRecipe(event, "cut_stone_block_to_plate_distilled_water")

	//#endregion

	//#region Deepslate

	removeCutterRecipe(event, "cut_cobbled_deepslate_into_slab")
	removeCutterRecipe(event, "cut_cobbled_deepslate_into_slab_water")
	removeCutterRecipe(event, "cut_cobbled_deepslate_into_slab_distilled_water")

	removeCutterRecipe(event, "cut_polished_deepslate_into_slab")
	removeCutterRecipe(event, "cut_polished_deepslate_into_slab_water")
	removeCutterRecipe(event, "cut_polished_deepslate_into_slab_distilled_water")

	removeCutterRecipe(event, "cut_deepslate_bricks_into_slab")
	removeCutterRecipe(event, "cut_deepslate_bricks_into_slab_water")
	removeCutterRecipe(event, "cut_deepslate_bricks_into_slab_distilled_water")

	removeCutterRecipe(event, "cut_deepslate_tile_into_slab")
	removeCutterRecipe(event, "cut_deepslate_tile_into_slab_water")
	removeCutterRecipe(event, "cut_deepslate_tile_into_slab_distilled_water")

	// #endregion

	// #region Blackstone

	removeCutterRecipe(event, "cut_blackstone_into_slab")
	removeCutterRecipe(event, "cut_blackstone_into_slab_water")
	removeCutterRecipe(event, "cut_blackstone_into_slab_distilled_water")

	removeCutterRecipe(event, "cut_polished_blackstone_into_slab")
	removeCutterRecipe(event, "cut_polished_blackstone_into_slab_water")
	removeCutterRecipe(event, "cut_polished_blackstone_into_slab_distilled_water")

	removeCutterRecipe(event, "cut_polished_blackstone_brick_into_slab")
	removeCutterRecipe(event, "cut_polished_blackstone_brick_into_slab_water")
	removeCutterRecipe(event, "cut_polished_blackstone_brick_into_slab_distilled_water")

	// #endregion

	// Nuke ALL Greate auto-integration for ALL macerator recipes (use explicit Create recipes)
	event.remove({ id: /greate:(milling|crushing)\/integration\/gtceu\/macerator\/.*/ })

	// Remove GTCEu electric furnace & vanilla smelting for ore intermediates → ingot
	event.remove({ id: /gtceu:smelting\/smelt_.*(?:ore|impure|pure|dirty|crushed|purified|refined|raw)(?:_.+)?_to_ingot/ })
	event.remove({ type: 'minecraft:smelting', input: '#forge:raw_materials' })
	event.remove({ type: 'minecraft:smelting', input: '#forge:dusts_impure' })
	event.remove({ type: 'minecraft:smelting', input: '#forge:crushed_ores' })
	event.remove({ type: 'minecraft:smelting', input: '#forge:crushed_purified_ores' })
	event.remove({ type: 'minecraft:smelting', input: '#forge:crushed_refined_ores' })
	event.remove({ type: 'gtceu:electric_furnace', input: '#forge:raw_materials' })
	event.remove({ type: 'gtceu:electric_furnace', input: '#forge:dusts_impure' })

	// Remove auto-generated GTCEu processing for impure/dirty dust
	event.remove({ id: /gtceu:macerator\/macerate_.+_dirty_dust_to_dust/ })
	event.remove({ id: /gtceu:ore_washer\/wash_.+_dirty_dust_to_dust/ })
	event.remove({ id: /gtceu:centrifuge\/centrifuge_.+_dirty_dust_to_dust/ })
	event.remove({ id: /gtceu:forge_hammer\/hammer_.+_dirty_dust_to_dust/ })

	// Remove GTCEu raw ore → crushed ore auto-generation (replaced by impure path)
	event.remove({ id: /gtceu:macerator\/macerate_.+_ore_to_crushed_ore$/ })

	// Remove ore block auto-compression/decompression
	event.remove({ id: /gtceu:compressor\/compress_.+_to_raw_ore_block/ })
	event.remove({ id: /gtceu:forge_hammer\/decompress_.+_to_raw_ore/ })

	// Remove Geologic Vulcanizer raw ore processing gas recipes
	event.remove({ id: /tfg:ore_processing_gas\/ore_proc_gas\/(normal|poor|rich)_.+/ })

	// Remove forge hammer ore block → crushed_ore recipes (clutter from auto-generation)
	event.remove({ id: /gtceu:forge_hammer\/hammer_.+_ore_to_crushed_ore/ })

	// Create crushed ores (used as purified ore equivalents) — block smelting
	const CREATE_CRUSHED_ORES = ['create:crushed_raw_copper', 'create:crushed_raw_gold', 'create:crushed_raw_silver', 'create:crushed_raw_tin', 'create:crushed_raw_lead', 'create:crushed_raw_zinc'];
	CREATE_CRUSHED_ORES.forEach(ore => {
		event.remove({ type: 'minecraft:smelting', input: ore })
		event.remove({ type: 'minecraft:blasting', input: ore })
		event.remove({ type: 'gtceu:electric_furnace', input: ore })
	});

	// Remove forge hammer crushed_ore → impure_dust auto-generation (clutter)
	event.remove({ id: /gtceu:forge_hammer\/hammer_.+_crushed_ore_to_impure_dust/ })
}

function removeMaceratorRecipe(event, id) {
	event.remove({ id: `gtceu:macerator/${id}` })
	event.remove({ id: `greate:milling/integration/gtceu/macerator/${id}` })
	event.remove({ id: `greate:crushing/integration/gtceu/macerator/${id}` })
}

function removeCutterRecipe(event, id) {
	event.remove({ id: `gtceu:cutter/${id}` })
	event.remove({ id: `greate:cutting/integration/gtceu/cutter/${id}` })
}
