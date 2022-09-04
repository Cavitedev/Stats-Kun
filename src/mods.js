var modList = [
	{ name: "None", acronym: "NM", enum: 0 },
	{ name: "No Fail", acronym: "NF", enum: 1 },
	{ name: "Easy", acronym: "EZ", enum: 2 },
	{ name: "Touch Device", acronym: "TD", enum: 4 },
	{ name: "Hidden", acronym: "HD", enum: 8 },
	{ name: "Hard Rock", acronym: "HR", enum: 16 },
	{ name: "Sudden Death", acronym: "SD", enum: 32 },
	{ name: "Double Time", acronym: "DT", enum: 64 },
	{ name: "Relax", acronym: "RX", enum: 128 },
	{ name: "Half Time", acronym: "HT", enum: 256 },
	{ name: "Nightcore", acronym: "NC", enum: 512 },
	{ name: "Flashlight", acronym: "FL", enum: 1024 },
	{ name: "Autoplay", acronym: "AT", enum: 2048 },
	{ name: "Spun Out", acronym: "SO", enum: 4096 },
	{ name: "Autopilot", acronym: "AP", enum: 8192 },
	{ name: "Perfect", acronym: "PF", enum: 16384 },
	{ name: "Key4", acronym: "K4", enum: 32768 },
	{ name: "Key5", acronym: "K5", enum: 65536 },
	{ name: "Key6", acronym: "K6", enum: 131072 },
	{ name: "Key7", acronym: "K7", enum: 262144 },
	{ name: "Key8", acronym: "K8", enum: 524288 },
	{ name: "Fade In", acronym: "FI", enum: 1048576 },
	{ name: "Random", acronym: "RD", enum: 2097152 },
	{ name: "Cinema", acronym: "CN", enum: 4194304 },
	{ name: "Target Practice", acronym: "TP", enum: 8388608 },
	{ name: "Key9", acronym: "K9", enum: 16777216 },
	{ name: "Key Coop", acronym: "KC", enum: 33554432 },
	{ name: "Key1", acronym: "K1", enum: 67108864 },
	{ name: "Key3", acronym: "K3", enum: 134217728 },
	{ name: "Key2", acronym: "K2", enum: 268435456 },
	{ name: "ScoreV2", acronym: "SV2", enum: 536870912 },
	{ name: "Mirror", acronym: "MI", enum: 1073741824 },
];

function getMods(modEnum) {
	let modsApplied = [];

	if (modEnum === 0) {
		return [modList[0]];
	}

	for (let i = modList.length - 1; modEnum != 0; i--) {
		currentMod = modList[i];

		if (modEnum - currentMod.enum >= 0) {
			modsApplied.push(currentMod);

			modEnum -= currentMod.enum;
		}
	}
	return modsApplied.reverse();
}

function getEnum(mods) {
	if (!mods.includes(',')) {
		mods = mods.match(/.{1,2}/g);

		modEnum = modList.filter(mod => mods.some(currentMod => currentMod == mod.acronym));
	} else {
		// In the case the names get passed instead of the acronyms
		mods = mods.split(', ');

		modEnum = modList.filter(mod => mods.some(currentMod => currentMod == mod.name));
	}
	return modEnum.reduce((prev, current) => prev + current.enum, 0);
}

function getModNames(mods) {
	return mods.reduce((prev, current) => `${prev}, ${current.name}`, '').slice(2);
}

function getModAcronyms(mods) {
	return mods.reduce((prev, current) => `${prev}${current.acronym}`, '');
}

module.exports = { getMods, getEnum, getModNames, getModAcronyms };