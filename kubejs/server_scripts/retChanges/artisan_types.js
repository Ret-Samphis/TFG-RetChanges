// priority: 100
"use strict";

ServerEvents.loaded(() => {
	try {
		var AT = Java.loadClass('su.terrafirmagreg.core.common.recipe.ArtisanType')
		var Ing = Java.loadClass('su.terrafirmagreg.core.common.recipe.ArtisanType$Ingredient')
		var IS = Java.loadClass('net.minecraft.world.item.ItemStack')
		var RL = Java.loadClass('net.minecraft.resources.ResourceLocation')

		var overrides = [
			['resin_board', 1, 20],
			['resin_board_4x', 1, 5],
			['phenolic_board', 1, 20],
			['phenolic_board_4x', 1, 5],
		]

		var modified = 0

		overrides.forEach(function(pair) {
			var name = pair[0]
			var slot = pair[1]
			var newCount = pair[2]

			var type = AT.ARTISAN_TYPES.get(new RL('tfg', name))
			if (type == null) {
				console.log('[RetChanges] ArtisanType tfg:' + name + ' not found')
				return
			}

			var ingredient = type.getInputIngredients().get(slot)
			if (ingredient == null) return

			var stack = ingredient.getItemStack()
			if (stack == null || stack.isEmpty()) return

			var newStack = IS(stack.getItem(), newCount)
			type.getInputIngredients().set(slot, Ing.of(newStack))

			console.log('[RetChanges] tfg:' + name + ': wire count ' + stack.getCount() + ' -> ' + newCount)
			modified++
		})

		console.log('[RetChanges] Modified ' + modified + '/4 artisan table wire costs')

	} catch (err) {
		console.log('[RetChanges] Artisan type modification failed: ' + err)
	}
})
