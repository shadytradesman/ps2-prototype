
class Component{ // modularity, vector, effect
  constructor(name, systemText, fieldReplacements, Enhancements, Drawbacks, BlacklistEnhancements, BlacklistDrawbacks, fields) {
	this.name = name;
	this.systemText = systemText;  
	this.fieldReplacements = fieldReplacements;
	this.enhancements = Enhancements;
	this.drawbacks = Drawbacks;
	this.blacklistEnhancements = BlacklistEnhancements;
	this.blacklistDrawbacks = BlacklistDrawbacks;
	this.fields = fields;
  }
};

class Modifier {
	constructor(name, text, fieldReplacements) {
		this.name = name;
		this.text = text;
		this.fieldReplacements = fieldReplacements;
	}
};


class FieldReplacement {
	constructor(field, isExclusive, formatText) {
		this.field=field;
		this.isExclusive=isExclusive;
		this.formatText=formatText;
	}
};

modifiers = {
	"Shredder": new Modifier("Shredder", 
		"shred armor",
		[
			new FieldReplacement("additional-effects", false, "If you successfully hit your target, the value of any armor they are wearing is reduced by 2. This penalty lasts until the armor is repaired.")
	]),
}

modalities = [
	new Component("Power", "[[character-name]] has a Power.", [], [], [], [], [], []),
	new Component("Augmentation", "[[character-name]] has been augmented.", [], [], [], [], [], []),
];

vectors = [
	new Component("Direct", 
		"((primary-activation-cost,additional-activation-costs,cast-time)) to activate.  [[aoe | [[multiple-targets | Select a]] [[target-type | [[blank-target-type]]]] target within [[activation-range]]]].  [[additional-activation-restrictions]] [[activation-roll]] [[defensive-roll]]", 
		[], [], [], [], [], []),
];

effects = [
	new Component("Injure", 
		"If the contested Outcome was positive, the target takes that much damage plus [[damage]] [[additional-damage-modifiers]]. The target’s armor is [[armor-effectiveness]].  {{additional-effects}}", 
		[
			new FieldReplacement("primary-activation-cost", false, "Exert your Mind"),
			new FieldReplacement("cast-time", false, "spend an Action"),
			new FieldReplacement("target-type", false, "any"),
			new FieldReplacement("activation-roll", false, "Roll Dexterity + Firearms, Difficulty 6"),
			new FieldReplacement("defense-roll", false, "The target may contest by rolling to dodge or Defend."), 
		], 
		[
			modifiers["Shredder"],
		], [], [], [], []),
];

console.log("gift modularities:");
console.log(modalities);

console.log("Vectors:");
console.log(vectors);

console.log("Effects");
console.log(effects);

var unrenderedSystemText = "";

function addRadiosForComponent(container, component, label) {
        $(container).append(
            $('<input>').prop({
                type: 'radio',
                id: component.name,
                name: label,
                value: component.name
            })
        ).append(
            $('<label>').prop({
                for: component.name
            }).html(component.name)
        ).append(
            $('<br>')
        );
}

function populatePowerForm(modality, vector, effect) {
	console.log(modality);
	console.log(vector);
	console.log(effect);
	var components = [modality, vector, effect];

	unrenderedSystemText = modality.systemText + "<br>" + vector.systemText + "<br>" + effect.systemText + "<br>";
	$('#unrendered-system').html(unrenderedSystemText);
	let enhancements = new Set();
	let drawbacks = new Set();
	let fields = new Set();
	let bl_enhancements = new Set();
	let bl_drawbacks = new Set();
	let bl_fields = new Set();
	components.forEach(comp => comp.enhancements.forEach(mod => enhancements.add(mod)));
	console.log(enhancements);

}

function findComponentByName(name) {
	console.log("Finding for name: " + name);
	for (let index = 0; index < modalities.length; ++index) {
		console.log(modalities[index].name);
		if (modalities[index].name == name) {
			return modalities[index];
		}
	}
	for (let index = 0; index < vectors.length; ++index) {
		if (vectors[index].name == name) {
			return vectors[index];
		}
	}
	for (let index = 0; index < effects.length; ++index) {
		if (effects[index].name == name) {
			return effects[index];
		}
	}
}

$(function() {
	effects.forEach(comp => addRadiosForComponent("#effects", comp, "effect"));
	modalities.forEach(comp => addRadiosForComponent("#modalities", comp, "modalities"));
	vectors.forEach(comp => addRadiosForComponent("#vectors", comp, "vectors"));

	$('input').on("click", function(e) {
		checkedEffects = $('input[name="effect"]:checked');
		checkedModalities = $('input[name="modalities"]:checked');
		checkedVectors = $('input[name="vectors"]:checked');
		if (checkedEffects.length && checkedModalities.length && checkedVectors.length) {
			console.log("all three!");
			populatePowerForm(findComponentByName(checkedModalities[0].value), 
				findComponentByName(checkedVectors[0].value), 
				findComponentByName(checkedEffects[0].value));
		}
	});
});

