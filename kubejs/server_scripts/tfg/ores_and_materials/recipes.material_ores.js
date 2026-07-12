// priority: 0
"use strict";

// TODO: merge these two tag prefixes

/**
 * @param {Internal.RecipesEventJS} event 
 * @param {com.gregtechceu.gtceu.api.data.chemical.material.Material_} material 
*/
function processSmallOre(event, material) {
	if (!material.hasFlag(TFGMaterialFlags.HAS_SMALL_TFC_ORE))
		return;

	const smallOre = ChemicalHelper.get(TFGTagPrefix.oreSmall, material, 1);
	const tinyDust = ChemicalHelper.get(TagPrefix.dustTiny, material, 1);
	const crushedOre = ChemicalHelper.get(TagPrefix.crushed, material, 1);

	if (smallOre === null) return;
	const materialName = material.getName();

	// Quern: small_ore → tiny_dust (manual path)
	if (!tinyDust.isEmpty()) {
		event.recipes.tfc.quern(tinyDust, smallOre)
			.id(`tfg:quern/small_${materialName}`)
	}

	// Melting
	if (material.hasProperty(TFGPropertyKey.TFC_PROPERTY)) {
		addTFCMelting(event, smallOre, material, 16, 'small_ore');
	}
}

/**
 * @param {Internal.RecipesEventJS} event 
 * @param {com.gregtechceu.gtceu.api.data.chemical.material.Material_} material 
 * @param {*} oreProperty
 * The material's ore property
 * @param {number} multiplier
 * How many ingots/gems/dusts each ore item should smelt into.
 * Can be a non-integer, in which case it'll smelt into nuggets/small dusts etc.
 * @param {Internal.ItemStack} oreItem
 * The input item to be smelted
 * @param {string} type
 * The type of ore being smelted, used for recipe IDs
 */
function smeltOre(event, material, oreProperty, multiplier, oreItem, type) {
	const smeltingMaterial = oreProperty.getDirectSmeltResult().isNull() ? material : oreProperty.getDirectSmeltResult();
	if (!material.hasProperty(PropertyKey.BLAST) && !material.hasFlag(MaterialFlags.NO_ORE_SMELTING)) {
		let ingotItem;
		if (smeltingMaterial.hasProperty(PropertyKey.INGOT)) {
			ingotItem = ChemicalHelper.getIngot(smeltingMaterial, GTValues.M * multiplier)
		}
		else if (smeltingMaterial.hasProperty(PropertyKey.GEM)) {
			if (multiplier >= 1) {
				ingotItem = ChemicalHelper.get(TagPrefix.gem, smeltingMaterial, multiplier)
			}
			else {
				ingotItem = ChemicalHelper.get(TagPrefix.gemFlawed, smeltingMaterial, 1)
			}
		}
		else {
			ingotItem = ChemicalHelper.getDust(smeltingMaterial, GTValues.M * multiplier)
		}

		if (!ingotItem.isEmpty()) {
			event.smelting(ingotItem, oreItem).id(`gtceu:smelting/smelt_${type}_${material.getName()}_ore_to_ingot`)
		}
	}
}

/**
 * @param {Internal.RecipesEventJS} event 
 * @param {com.gregtechceu.gtceu.api.data.chemical.material.Material_} material 
 */
function processPoorRawOre(event, material) {
	const poorOreItem = ChemicalHelper.get(TFGTagPrefix.poorRawOre, material, 1)
	const impureDust = ChemicalHelper.get(TagPrefix.dustImpure, material, 1)

	if (poorOreItem === null || impureDust === null)
		return;

	const materialName = material.getName();
	const oreProperty = material.getProperty(PropertyKey.ORE)
	const multiplier = oreProperty.getOreMultiplier();

	// Quern: raw ore → tiny_dust (manual starter path, 133%)
	const tinyDust = ChemicalHelper.get(TagPrefix.dustTiny, material, Math.floor(24 * multiplier * 1.5 / 16));
	if (!tinyDust.isEmpty()) {
		event.recipes.tfc.quern(tinyDust, poorOreItem)
			.id(`tfg:quern/poor_${materialName}_to_tiny`)
	}

	// Gem handling
	if (material.hasProperty(PropertyKey.GEM)) {
		const gemItem = ChemicalHelper.get(TagPrefix.gem, material, 1)
		const chipped = ChemicalHelper.get(TagPrefix.gemChipped, material, 1)

		// Sandpaper → gem_chipped (respects ore multiplier)
		if (!chipped.isEmpty()) {
			event.recipes.create.sandpaper_polishing(chipped.copyWithCount(multiplier), poorOreItem)
				.id(`tfg:polishing/poor_${materialName}_gem`)
		}

		// Forge hammer → chanced full gem stopgap (10%)
		event.recipes.gtceu.forge_hammer(`hammer_poor_${materialName}_gem`)
			.itemInputs(poorOreItem)
			.category(GTRecipeCategories.ORE_FORGING)
			.duration(100)
			.EUt(16)
			.chancedOutput(gemItem, 1000, 0)
	}

	// Melting
	const tfcProperty = material.getProperty(TFGPropertyKey.TFC_PROPERTY);
	if (tfcProperty !== null) {
		addTFCMelting(event, poorOreItem, material, global.calcAmountOfMetalProcessed(24, tfcProperty.getPercentOfMaterial()), 'poor_raw_ore');
	}
}

/**
 * @param {Internal.RecipesEventJS} event 
 * @param {com.gregtechceu.gtceu.api.data.chemical.material.Material_} material 
 */
function processNormalRawOre(event, material) {
	const oreProperty = material.getProperty(PropertyKey.ORE)
	const multiplier = oreProperty.getOreMultiplier();
	const normalOreItem = ChemicalHelper.get(TagPrefix.rawOre, material, 1)
	const impureDust = ChemicalHelper.get(TagPrefix.dustImpure, material, 1)

	if (normalOreItem === null || impureDust === null)
		return;

	const materialName = material.getName();

	// Remove auto-generated GTCEu raw→crushed recipe + its Greate integration (uses existing helper)
	removeMaceratorRecipe(event, `macerate_raw_${materialName}_ore_to_crushed_ore`)
	event.remove({ id: `gtceu:compressor/compress_${materialName}_to_raw_ore_block` })
	event.remove({ id: `gtceu:forge_hammer/decompress_${materialName}_to_raw_ore` })

	// Quern: raw ore → tiny_dust (manual starter path, 133%)
	const tinyDust = ChemicalHelper.get(TagPrefix.dustTiny, material, Math.floor(36 * multiplier * 1.5 / 16));
	if (!tinyDust.isEmpty()) {
		event.recipes.tfc.quern(tinyDust, normalOreItem)
			.id(`tfg:quern/normal_${materialName}_to_tiny`)
	}

	// Gem handling
	if (material.hasProperty(PropertyKey.GEM)) {
		const gemItem = ChemicalHelper.get(TagPrefix.gem, material, 1)
		const chipped = ChemicalHelper.get(TagPrefix.gemChipped, material, 1)

		// Sandpaper → gem_chipped (respects ore multiplier)
		if (!chipped.isEmpty()) {
			event.recipes.create.sandpaper_polishing(chipped.copyWithCount(multiplier), normalOreItem)
				.id(`tfg:polishing/raw_${materialName}_gem`)
		}

		// Forge hammer → chanced full gem stopgap (20%)
		event.recipes.gtceu.forge_hammer(`hammer_${materialName}_gem`)
			.itemInputs(normalOreItem)
			.category(GTRecipeCategories.ORE_FORGING)
			.duration(100)
			.EUt(16)
			.chancedOutput(gemItem, 2000, 0)
	}

	// Melting
	const tfcProperty = material.getProperty(TFGPropertyKey.TFC_PROPERTY);
	if (tfcProperty !== null) {
		addTFCMelting(event, normalOreItem, material, global.calcAmountOfMetalProcessed(36, tfcProperty.getPercentOfMaterial()), 'raw_ore');
	}
}

/**
* @param {Internal.RecipesEventJS} event 
* @param {com.gregtechceu.gtceu.api.data.chemical.material.Material_} material 
*/
function processRichRawOre(event, material) {
	const oreProperty = material.getProperty(PropertyKey.ORE)
	const multiplier = oreProperty.getOreMultiplier();
	const richOreItem = ChemicalHelper.get(TFGTagPrefix.richRawOre, material, 1)
	const impureDust = ChemicalHelper.get(TagPrefix.dustImpure, material, 1)

	if (richOreItem === null || impureDust === null)
		return;

	const materialName = material.getName();

	// Quern: raw ore → tiny_dust (manual starter path, 133%)
	const tinyDust = ChemicalHelper.get(TagPrefix.dustTiny, material, Math.floor(48 * multiplier * 1.5 / 16));
	if (!tinyDust.isEmpty()) {
		event.recipes.tfc.quern(tinyDust, richOreItem)
			.id(`tfg:quern/rich_${materialName}_to_tiny`)
	}

	// Gem handling
	if (material.hasProperty(PropertyKey.GEM)) {
		const gemItem = ChemicalHelper.get(TagPrefix.gem, material, 1)
		const flawed = ChemicalHelper.get(TagPrefix.gemFlawed, material, 1)

		// Sandpaper → gem_flawed (respects ore multiplier, = 72 mB × multiplier)
		if (!flawed.isEmpty()) {
			event.recipes.create.sandpaper_polishing(flawed.copyWithCount(multiplier), richOreItem)
				.id(`tfg:polishing/rich_${materialName}_gem`)
		}

		// Forge hammer → chanced full gem stopgap (30%)
		event.recipes.gtceu.forge_hammer(`hammer_rich_${materialName}_gem`)
			.itemInputs(richOreItem)
			.category(GTRecipeCategories.ORE_FORGING)
			.duration(100)
			.EUt(16)
			.chancedOutput(gemItem, 3000, 0)
	}

	// Melting
	const tfcProperty = material.getProperty(TFGPropertyKey.TFC_PROPERTY);
	if (tfcProperty !== null) {
		addTFCMelting(event, richOreItem, material, global.calcAmountOfMetalProcessed(48, tfcProperty.getPercentOfMaterial()), 'rich_raw_ore');
	}
}

/**
* @param {Internal.RecipesEventJS} event 
* @param {com.gregtechceu.gtceu.api.data.chemical.material.Material_} material 
*/
function processCrushingWheels(event, material) {
	if (!material.hasProperty(PropertyKey.ORE)) return;

	const oreProperty = material.getProperty(PropertyKey.ORE);
	const multiplier = oreProperty.getOreMultiplier();
	const normalOreItem = ChemicalHelper.get(TagPrefix.rawOre, material, 1);
	const poorOreItem = ChemicalHelper.get(TFGTagPrefix.poorRawOre, material, 1);
	const richOreItem = ChemicalHelper.get(TFGTagPrefix.richRawOre, material, 1);
	const crushedOreItem = ChemicalHelper.get(TagPrefix.crushed, material, 1);
	if (normalOreItem === null || crushedOreItem === null) return;

	const materialName = material.getName();

	// Crushing wheels: the ONLY source of crushed_ore
	// ~50% chance at multiplier× crushed_ore per normal ore = ~200% yield
	const addCrushingRecipe = (oreItem, chance, suffix) => {
		if (oreItem === null) return;
		event.recipes.create.crushing([
			Item.of(crushedOreItem.copyWithCount(multiplier)).withChance(chance)
		], oreItem)
			.processingTime(1250)
			.id(`tfg:crushing/${materialName}_crushed_${suffix}`)
	};

	addCrushingRecipe(poorOreItem, 2/6, "poor");
	addCrushingRecipe(normalOreItem, 2/4, "normal");
	addCrushingRecipe(richOreItem, 2/3, "rich");

	// Small ore: fixed 16 mB base, 200% → 32 mB / 144 = 2/9 chance, no multiplier
	const smallOreItem = ChemicalHelper.get(TFGTagPrefix.oreSmall, material, 1);
	if (smallOreItem !== null && !smallOreItem.isEmpty() && crushedOreItem !== null) {
		event.recipes.create.crushing([
			Item.of(crushedOreItem.copyWithCount(1)).withChance(2/9)
		], smallOreItem)
			.processingTime(1250)
			.id(`tfg:crushing/${materialName}_crushed_small`)
	}
}

/**
* @param {Internal.RecipesEventJS} event 
* @param {com.gregtechceu.gtceu.api.data.chemical.material.Material_} material 
*/
function processSequencedAssembly(event, material) {
	if (!material.hasProperty(PropertyKey.ORE)) return;

	const oreProperty = material.getProperty(PropertyKey.ORE);
	const multiplier = oreProperty.getOreMultiplier();
	const crushedItem = ChemicalHelper.get(TagPrefix.crushed, material, 1);
	const normalOreItem = ChemicalHelper.get(TagPrefix.rawOre, material, 1);
	const poorOreItem = ChemicalHelper.get(TFGTagPrefix.poorRawOre, material, 1);
	const richOreItem = ChemicalHelper.get(TFGTagPrefix.richRawOre, material, 1);

	if (normalOreItem === null || crushedItem === null) return;

	const materialName = material.getName();

	const addSAPress = (oreItem, oreBase, tier, useMultiplier) => {
		if (oreItem === null) return;
		const oreValue = oreBase * (useMultiplier !== false ? multiplier : 1);
		const targetMB = oreValue * 1.5;
		let successWeight, fillerWeight;
		if (oreBase === 16) {
			successWeight = 1;
			fillerWeight = 5;
		} else if (oreBase === 24) {
			successWeight = 1;
			fillerWeight = 3;
		} else if (oreBase === 36) {
			successWeight = 3;
			fillerWeight = 5;
		} else {
			successWeight = 1;
			fillerWeight = 1;
		}
		const crushedCount = useMultiplier !== false ? multiplier : 1;
		const tr = oreItem;
		event.recipes.create.sequenced_assembly([
			Item.of(crushedItem.copyWithCount(crushedCount)).withChance(successWeight),
			Item.of('gtceu:stone_dust').withChance(fillerWeight),
		], tr, [
			event.recipes.greate.pressing(tr, tr),
			event.recipes.greate.pressing(tr, tr),
			event.recipes.greate.pressing(tr, tr),
		])
			.transitionalItem(tr)
			.loops(1)
			.id(`tfg:sequenced_assembly/crush_${materialName}_${tier}`)
	};

	addSAPress(poorOreItem, 24, 'poor');
	addSAPress(normalOreItem, 36, 'normal');
	addSAPress(richOreItem, 48, 'rich');

	// Small ore: fixed 16 mB base, no multiplier
	const smallOreItemSA = ChemicalHelper.get(TFGTagPrefix.oreSmall, material, 1);
	addSAPress(smallOreItemSA, 16, 'small', false);
}

/**
* @param {Internal.RecipesEventJS} event 
* @param {com.gregtechceu.gtceu.api.data.chemical.material.Material_} material 
*/
function processCrushedOre(event, material) {
	const crushedOreItem = ChemicalHelper.get(TagPrefix.crushed, material, 1)
	const impureDustItem = ChemicalHelper.get(TagPrefix.dustImpure, material, 1)
	const pureOreItem = ChemicalHelper.get(TagPrefix.crushedPurified, material, 1)
	const materialName = material.getName();

	if (crushedOreItem !== null && pureOreItem !== null) {
		let byproductMaterial = material.getProperty(PropertyKey.ORE).getOreByProduct(0, material);
		const byproductItem = ChemicalHelper.get(TagPrefix.dust, byproductMaterial, 1)
		
		// GT machines
		event.recipes.gtceu.ore_washer(`wash_${materialName}_crushed_ore_to_purified_ore_distilled`)
			.itemInputs(crushedOreItem)
			.inputFluids("gtceu:distilled_water 50")
			.itemOutputs(pureOreItem, 'gtceu:stone_dust')
			.chancedOutput(byproductItem, 3333, 0)
			.duration(20)
			.EUt(GTValues.VHA[GTValues.LV])

		event.recipes.gtceu.ore_washer(`wash_${materialName}_crushed_ore_to_purified_ore`)
			.itemInputs(crushedOreItem)
			.inputFluids("minecraft:water 100")
			.itemOutputs(pureOreItem, 'gtceu:stone_dust')
			.chancedOutput(byproductItem, 3333, 0)
			.circuit(1)
			.duration(40)
			.EUt(GTValues.VHA[GTValues.LV])

		event.recipes.gtceu.macerator(`macerate_${materialName}_crushed_ore_to_impure_dust`)
			.itemInputs(crushedOreItem)
			.itemOutputs(impureDustItem)
			.chancedOutput(byproductItem, 1400, 0)
			.category(GTRecipeCategories.ORE_CRUSHING)
			.duration(20)
			.EUt(2)

		// Bulk washing
		
		event.recipes.greate.splashing(
			[pureOreItem, Item.of(byproductItem).withChance(0.14), 'gtceu:stone_dust'],
			[crushedOreItem, Fluid.of('minecraft:water', 100)]
		)
		.recipeTier(1)
		.circuitNumber(1)
		.id(`tfg:splashing/${materialName}_purified_ore_water`)

		event.recipes.greate.splashing(
			[pureOreItem, Item.of(byproductItem).withChance(0.333), 'gtceu:stone_dust'],
			[crushedOreItem, Fluid.of('gtceu:distilled_water', 50)]
		)
		.recipeTier(1)
		.circuitNumber(2)
		.id(`tfg:splashing/${materialName}_purified_ore_distilled`)

		// Dropping in water
		event.custom({
			type: "ae2:transform",
			circumstance: {
				type: "fluid",
				tag: "tfc:any_water"
			},
			ingredients: [
				crushedOreItem.toJson()
			],
			result: pureOreItem.toJson()
		}).id(`tfg:ae_transform/${materialName}_purified_ore`)

		event.recipes.tfc.barrel_instant()
			.inputItem(crushedOreItem)
			.inputFluid(Fluid.of("minecraft:water", 10))
			.outputItem(pureOreItem)
			.id(`tfg:instant_barrel/${materialName}_purified_ore`)

		// Melting
		const tfcProperty = material.getProperty(TFGPropertyKey.TFC_PROPERTY);
		if (tfcProperty !== null) {
			addTFCMelting(event, crushedOreItem, material, global.calcAmountOfMetalProcessed(80, tfcProperty.getPercentOfMaterial()), 'purified_ore');
		}
	}

}

/**
* @param {Internal.RecipesEventJS} event 
* @param {com.gregtechceu.gtceu.api.data.chemical.material.Material_} material 
*/
function processPurifiedOre(event, material) {
	const pureOreItem = ChemicalHelper.get(TagPrefix.crushedPurified, material, 1)
	const pureDustItem = ChemicalHelper.get(TagPrefix.dustPure, material, 1)

	if (pureOreItem !== null && pureDustItem !== null) {
		const materialName = material.getName();		
		let byproductMaterial = material.getProperty(PropertyKey.ORE).getOreByProduct(1, material);
		const byproductItem = ChemicalHelper.get(TagPrefix.dust, byproductMaterial, 1)

		// With byproducts
		event.recipes.gtceu.macerator(`macerate_${materialName}_crushed_ore_to_dust`)
			.itemInputs(pureOreItem)
			.itemOutputs(pureDustItem)
			.chancedOutput(byproductItem, 1400, 0)
			.category(GTRecipeCategories.ORE_CRUSHING)
			.duration(20)
			.EUt(GTValues.VHA[GTValues.LV])

		// Without byproducts
		event.recipes.greate.pressing(pureDustItem, pureOreItem)
			.recipeTier(1)
			.id(`greate:pressing/pure_crushed_${material.getName()}_to_pure_dust`)

		const tfcProperty = material.getProperty(TFGPropertyKey.TFC_PROPERTY);
		if (tfcProperty !== null) {
			addTFCMelting(event, pureOreItem, material, global.calcAmountOfMetalProcessed(100, tfcProperty.getPercentOfMaterial()), 'pure_crushed');
		}
	}
}

/**
 * @param {Internal.RecipesEventJS} event 
 * @param {com.gregtechceu.gtceu.api.data.chemical.material.Material_} material 
*/
function processRefinedOre(event, material) {
	const refinedOreItem = ChemicalHelper.get(TagPrefix.crushedRefined, material, 1)
	const dustItem = ChemicalHelper.get(TagPrefix.dust, material, 1)

	if (refinedOreItem !== null && dustItem !== null) {
		const materialName = material.getName();
		let byproductMaterial = material.getProperty(PropertyKey.ORE).getOreByProduct(2, material);
		const byproductItem = ChemicalHelper.get(TagPrefix.dust, byproductMaterial, 1)

		// With byproducts
		event.recipes.gtceu.macerator(`macerate_${materialName}_refined_ore_to_dust`)
			.itemInputs(refinedOreItem)
			.itemOutputs(dustItem)
			.chancedOutput(byproductItem, 1400, 0)
			.category(GTRecipeCategories.ORE_CRUSHING)
			.duration(20)
			.EUt(GTValues.VHA[GTValues.LV])

		// Without byproducts
		event.recipes.greate.pressing(dustItem, refinedOreItem)
			.recipeTier(1)
			.id(`greate:pressing/refined_${material.getName()}_to_dust`)

		const tfcProperty = material.getProperty(TFGPropertyKey.TFC_PROPERTY);
		if (tfcProperty !== null) {
			addTFCMelting(event, refinedOreItem, material, global.calcAmountOfMetalProcessed(110, tfcProperty.getPercentOfMaterial()), 'refined_crushed');
		}
	}
}


/**
* @param {Internal.RecipesEventJS} event 
 * @param {com.gregtechceu.gtceu.api.data.chemical.material.Material_} material 
*/
function processImpureDust(event, material) {
	const impureDustItem = ChemicalHelper.get(TagPrefix.dustImpure, material, 1)
	const dustItem = ChemicalHelper.get(TagPrefix.dust, material, 1)

	if (impureDustItem === null)
		return;

	const materialName = material.getName();

	// Ore washer: impure_dust → dust (pure, no byproduct)
	event.recipes.gtceu.ore_washer(`wash_${materialName}_impure_to_dust`)
		.itemInputs(impureDustItem)
		.inputFluids("minecraft:water 100")
		.itemOutputs(dustItem)
		.duration(material.getMass())
		.EUt(GTValues.VHA[GTValues.LV])

	// Bulk washing (fan, barrel, in-world water)
	event.recipes.greate.splashing(
		[dustItem],
		[impureDustItem, Fluid.of('minecraft:water', 100)]
	)
	.recipeTier(1)
	.circuitNumber(1)
	.id(`tfg:splashing/${materialName}_dust_from_impure_water`)

	event.recipes.greate.splashing(
		[dustItem],
		[impureDustItem, Fluid.of('gtceu:distilled_water', 50)]
	)
	.recipeTier(1)
	.circuitNumber(2)
	.id(`tfg:splashing/${materialName}_dust_from_impure_distilled`)

	event.recipes.tfc.barrel_instant()
		.inputItem(impureDustItem)
		.inputFluid(Fluid.of("minecraft:water", 10))
		.outputItem(dustItem)
		.id(`tfg:instant_barrel/${materialName}_dust_from_impure`)

	event.custom({
		type: "ae2:transform",
		circumstance: {
			type: "fluid",
			tag: "tfc:any_water"
		},
		ingredients: [
			impureDustItem.toJson()
		],
		result: dustItem.toJson()
	}).id(`tfg:ae_transform/${materialName}_dust_from_impure`)

	// VI centrifuge: impure_dust → dust + chanced byproduct (alt path)
	let orePropertyVI = material.getProperty(PropertyKey.ORE);
	let byproductMaterialVI = orePropertyVI !== null ? orePropertyVI.getOreByProduct(0, material) : null;
	if (byproductMaterialVI !== null) {
		let byproductDustVI = ChemicalHelper.get(TagPrefix.dust, byproductMaterialVI, 1);
		event.recipes.vintageimprovements.centrifugation(
			[dustItem, Item.of(byproductDustVI).withChance(0.111)],
			impureDustItem)
			.processingTime(material.getMass() * 10 * global.VINTAGE_IMPROVEMENTS_DURATION_MULTIPLIER)
			.minimalRPM(32)
			.id(`tfg:vi/centrifuge/${materialName}_dust_from_impure`)
	}

	// GTCEu centrifuge: impure_dust → dust (+ chanced byproduct dust)
	let oreProperty = material.getProperty(PropertyKey.ORE);
	let byproductStack = null;
	if (oreProperty !== null) {
		let byproductMaterial = oreProperty.getOreByProduct(0, material);
		if (byproductMaterial !== null) {
			let byproductDust = ChemicalHelper.get(TagPrefix.dust, byproductMaterial, 1);
			if (!byproductDust.isEmpty())
				byproductStack = byproductDust;
		}
	}

	let gtCentrifuge = event.recipes.gtceu.centrifuge(`centrifuge_${materialName}_dust_from_impure`)
		.itemInputs(impureDustItem)
		.itemOutputs(dustItem)
		.duration(material.getMass() * 4)
		.EUt(GTValues.VA[GTValues.MV])
	if (byproductStack !== null)
		gtCentrifuge.chancedOutput(byproductStack, 1400, 0)

	// Melting: 100 mB per impure_dust (original upstream value)
	const tfcProperty = material.getProperty(TFGPropertyKey.TFC_PROPERTY);
	if (tfcProperty !== null) {
		addTFCMelting(event, impureDustItem, material, global.calcAmountOfMetalProcessed(100, tfcProperty.getPercentOfMaterial()), 'impure_dust');
	}
}

/**
* @param {Internal.RecipesEventJS} event 
* @param {com.gregtechceu.gtceu.api.data.chemical.material.Material_} material 
*/
function processPureDust(event, material) {
	const pureDustItem = ChemicalHelper.get(TagPrefix.dustPure, material, 1);
	const dustItem = ChemicalHelper.get(TagPrefix.dust, material, 1);

	if (pureDustItem !== null && dustItem !== null) {
		const materialName = material.getName();

		// Bulk washing
		event.recipes.greate.splashing(
			[dustItem],
			[pureDustItem, Fluid.of('minecraft:water', 100)]
		)
		.recipeTier(1)
		.circuitNumber(1)
		.id(`tfg:splashing/${materialName}_dust_from_pure_water`)

		event.recipes.greate.splashing(
			[dustItem],
			[pureDustItem, Fluid.of('gtceu:distilled_water', 50)]
		)
		.recipeTier(1)
		.circuitNumber(2)
		.id(`tfg:splashing/${materialName}_dust_from_pure_distilled`)

		event.recipes.tfc.barrel_instant()
			.inputItem(pureDustItem)
			.inputFluid(Fluid.of("minecraft:water", 10))
			.outputItem(dustItem)
			.id(`tfg:instant_barrel/${materialName}_dust_from_pure`)

		// Centrifuging
		let byproductMaterial = material.getProperty(PropertyKey.ORE).getOreByProduct(1, material);

		event.recipes.vintageimprovements.centrifugation(
			[dustItem, Item.of(ChemicalHelper.get(TagPrefix.dust, byproductMaterial, 1)).withChance(0.111)],
			pureDustItem)
			.processingTime(material.getMass() * 10 * global.VINTAGE_IMPROVEMENTS_DURATION_MULTIPLIER)
			.minimalRPM(32)
			.id(`tfg:vi/centrifuge/${materialName}_dust_from_pure`)

		// Dropping in water
		event.custom({
			type: "ae2:transform",
			circumstance: {
				type: "fluid",
				tag: "tfc:any_water"
			},
			ingredients: [
				pureDustItem.toJson()
			],
			result: dustItem.toJson()
		}).id(`tfg:ae_transform/${materialName}_dust_from_pure`)

		// Melting
		const tfcProperty = material.getProperty(TFGPropertyKey.TFC_PROPERTY);
		if (tfcProperty !== null) {
			addTFCMelting(event, pureDustItem, material, global.calcAmountOfMetalProcessed(120, tfcProperty.getPercentOfMaterial()), 'pure_dust');
		}
	}
}

/**
* @param {Internal.RecipesEventJS} event 
* @param {com.gregtechceu.gtceu.api.data.chemical.material.Material_} material 
*/
function processGems(event, material) {
	const gemItem = ChemicalHelper.get(TagPrefix.gem, material, 1);
	if (gemItem.isEmpty() || gemItem.hasTag('c:hidden_from_recipe_viewers'))
		return;

	const materialName = material.getName();

	const budItem = ChemicalHelper.get(TFGTagPrefix.budIndicator, material, 1);
	if (!budItem.isEmpty()) {
		event.recipes.tfc.damage_inputs_shapeless_crafting(
			event.shapeless(budItem, [gemItem, '#tfc:chisels']))
				.id(`shapeless/${materialName}_bud_indicator`)
	}

	// Remove auto-generated GTCEu macerator for gem → dust + its Greate integration
	removeMaceratorRecipe(event, `macerate_${materialName}_gem_to_dust`)

	const chipped = ChemicalHelper.get(TagPrefix.gemChipped, material, 1)
	const smallDust = ChemicalHelper.get(TagPrefix.dustSmall, material, 1)
	if (!chipped.isEmpty()) {
		event.shaped(smallDust, [
			'A', 'B'
		], {
			A: chipped,
			B: '#forge:tools/mortars'
		}).id(`shapeless/mortar_chipped_${materialName}`)
	}

	const amount = getMaterialAmount(TagPrefix.block, material);
	const block = ChemicalHelper.get(TagPrefix.block, material, 1);
	if (!block.isEmpty()) {
		event.recipes.greate.pressing(ChemicalHelper.get(TagPrefix.gem, material, amount), block)
			.recipeTier(0)
			.id(`greate:pressing/unpacking_${materialName}_block`)
	}

	event.recipes.tfc.quern(ChemicalHelper.get(TagPrefix.dust, material, 1), gemItem)
		.id(`tfg:quern/${materialName}_gem_to_dust`)

	// Melting
	const tfcProperty = material.getProperty(TFGPropertyKey.TFC_PROPERTY);
	if (tfcProperty !== null) {
		addTFCMelting(event, ChemicalHelper.get(TagPrefix.gemChipped, material, 1), material, global.calcAmountOfMetalProcessed(144 / 4, tfcProperty.getPercentOfMaterial()), 'gem_chipped');
		addTFCMelting(event, ChemicalHelper.get(TagPrefix.gemFlawed, material, 1), material, global.calcAmountOfMetalProcessed(144 / 2, tfcProperty.getPercentOfMaterial()), 'gem_flawed');
		addTFCMelting(event, gemItem, material, global.calcAmountOfMetalProcessed(144, tfcProperty.getPercentOfMaterial()), 'gem');
		addTFCMelting(event, ChemicalHelper.get(TagPrefix.gemFlawless, material, 1), material, global.calcAmountOfMetalProcessed(144 * 2, tfcProperty.getPercentOfMaterial()), 'gem_flawless');
		addTFCMelting(event, ChemicalHelper.get(TagPrefix.gemExquisite, material, 1), material, global.calcAmountOfMetalProcessed(144 * 4, tfcProperty.getPercentOfMaterial()), 'gem_exquisite');
	}

	// Gem gambling: press any gem for 10% upgrade / 90% downgrade (guaranteed down + 10% chanced up)
	const gemGambleTiers = [
		{ in: TagPrefix.gemFlawless, up: TagPrefix.gemExquisite, down: TagPrefix.gem, id: 'flawless' },
		{ in: TagPrefix.gem, up: TagPrefix.gemFlawless, down: TagPrefix.gemFlawed, id: 'normal' },
		{ in: TagPrefix.gemFlawed, up: TagPrefix.gem, down: TagPrefix.gemChipped, id: 'flawed' },
		{ in: TagPrefix.gemChipped, up: TagPrefix.gemFlawed, down: TagPrefix.dustSmall, id: 'chipped' },
	];
	gemGambleTiers.forEach(tier => {
		const inputGem = ChemicalHelper.get(tier.in, material, 1);
		const upgradeGem = ChemicalHelper.get(tier.up, material, 1);
		const downgradeGem = ChemicalHelper.get(tier.down, material, 1);
		if (!inputGem.isEmpty() && !downgradeGem.isEmpty()) {
			let outputs = [downgradeGem];
			if (!upgradeGem.isEmpty())
				outputs = [Item.of(upgradeGem).withChance(0.1), downgradeGem];
			event.recipes.greate.pressing(outputs, inputGem)
				.recipeTier(0)
				.id(`greate:pressing/gamble_${materialName}_${tier.id}`)
		}
	});
}