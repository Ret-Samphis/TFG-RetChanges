"use strict";

const DAILY_COOLDOWN = 86400;

const registerDailyLoginEvent = (event) => {
	const player = event.player;
	const persistent = player.persistentData;

	const lastDaily = persistent.contains("lastDailyLogin") ? persistent.getLong("lastDailyLogin") : 0;
	const now = Utils.getWorld().getTime();

	if (now - lastDaily < DAILY_COOLDOWN) {
		return;
	}

	persistent.putLong("lastDailyLogin", now);
	player.give(Item.of("createdeco:zinc_coin", 8));
	player.tell(Text.green("You received your daily login reward: 8 Zinc Coins!"));
}
