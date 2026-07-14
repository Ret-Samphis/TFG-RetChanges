// priority: 0
"use strict";

const registerTFGEarlyPower = (event) => {
	const $GreatePropertyKeys = Java.loadClass("electrolyte.greate.content.gtceu.material.GreatePropertyKeys")

	// T0 AndesiteAlloy: 32 (unchanged)
	// T1 Steel: 128 -> 1024 (8x)
	GTMaterials.Steel.getProperty($GreatePropertyKeys.KINETIC).setMaxCapacity(1024)
	// T2 Aluminium: 512 -> 4096 (8x)
	GTMaterials.Aluminium.getProperty($GreatePropertyKeys.KINETIC).setMaxCapacity(4096)
	// T3 StainlessSteel: 2048 -> 16384 (8x)
	GTMaterials.StainlessSteel.getProperty($GreatePropertyKeys.KINETIC).setMaxCapacity(16384)
	// T4 Titanium: 8192 -> 65536 (8x)
	GTMaterials.Titanium.getProperty($GreatePropertyKeys.KINETIC).setMaxCapacity(65536)
	// T5 TungstenSteel: 32768 -> 262144 (8x)
	GTMaterials.TungstenSteel.getProperty($GreatePropertyKeys.KINETIC).setMaxCapacity(262144)
	// T6 RhodiumPlatedPalladium: 131072 -> 1048576 (8x)
	GTMaterials.RhodiumPlatedPalladium.getProperty($GreatePropertyKeys.KINETIC).setMaxCapacity(1048576)
	// T7 NaquadahAlloy: 524288 -> 4194304 (8x)
	GTMaterials.NaquadahAlloy.getProperty($GreatePropertyKeys.KINETIC).setMaxCapacity(4194304)
	// T8 Darmstadtium: 2097152 -> 8388608 (4x — capped by last tier)
	GTMaterials.Darmstadtium.getProperty($GreatePropertyKeys.KINETIC).setMaxCapacity(8388608)
	// T9 Neutronium: 8388608 (unchanged, last tier)
}
