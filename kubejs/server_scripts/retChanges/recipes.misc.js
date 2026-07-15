// priority: 0
"use strict";

const registerRetChangeMiscRecipes = (event) => {

	// #region Coin <-> Coinstack conversion

	const COIN_TIERS = [
		'zinc',
		'copper',
		'brass',
		'iron',
		'industrial_iron',
		'gold',
		'netherite'
	]

	COIN_TIERS.forEach(tier => {
		const coin = `createdeco:${tier}_coin`
		const coinstack = `createdeco:${tier}_coinstack`

		event.shapeless(Item.of(coinstack, 1), [coin, coin, coin, coin])
			.id(`tfg:ret/coinstack_from_${tier}_coin`)

		event.shapeless(Item.of(coin, 4), [coinstack])
			.id(`tfg:ret/coin_from_${tier}_coinstack`)
	})

	// #endregion

	// #region Coin exchange cascade (Zinc <-> Copper <-> Iron <-> Gold)
	// Going UP: 4 coinstacks of lower tier -> 1 coin of higher tier
	// Going DOWN: 1 coin of higher tier -> 4 coinstacks of lower tier

	// Zinc <-> Copper
	event.shapeless(Item.of('createdeco:zinc_coinstack', 4), ['createdeco:copper_coin'])
		.id('tfg:ret/zinc_coinstacks_from_copper_coin')
	event.shapeless(Item.of('createdeco:copper_coin', 1), ['createdeco:zinc_coinstack', 'createdeco:zinc_coinstack', 'createdeco:zinc_coinstack', 'createdeco:zinc_coinstack'])
		.id('tfg:ret/copper_coin_from_zinc_coinstacks')

	// Copper <-> Iron
	event.shapeless(Item.of('createdeco:copper_coinstack', 4), ['createdeco:iron_coin'])
		.id('tfg:ret/copper_coinstacks_from_iron_coin')
	event.shapeless(Item.of('createdeco:iron_coin', 1), ['createdeco:copper_coinstack', 'createdeco:copper_coinstack', 'createdeco:copper_coinstack', 'createdeco:copper_coinstack'])
		.id('tfg:ret/iron_coin_from_copper_coinstacks')

	// Iron <-> Gold
	event.shapeless(Item.of('createdeco:iron_coinstack', 4), ['createdeco:gold_coin'])
		.id('tfg:ret/iron_coinstacks_from_gold_coin')
	event.shapeless(Item.of('createdeco:gold_coin', 1), ['createdeco:iron_coinstack', 'createdeco:iron_coinstack', 'createdeco:iron_coinstack', 'createdeco:iron_coinstack'])
		.id('tfg:ret/gold_coin_from_iron_coinstacks')

	// #endregion

	// #region Food milling

	event.recipes.greate.milling('2x tfc:olive_paste', 'tfc:food/olive')

	// #endregion

}
