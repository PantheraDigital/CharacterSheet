class FeatureData {
  constructor(name, description, isPassive = true) {
    this.name = name;
    this.description = description;
    this.isPassive = isPassive;
  }
};

class RaceData {
  constructor(name, variant, source, description,
    abilityScoreIncrease, age, alignment, size, speed,
    languages, features) {
    this.name = name;
    this.variant = variant;
    this.source = source;
    this.description = description;

    this.abilityScoreIncrease = abilityScoreIncrease;
    this.age = age;
    this.alignment = alignment;
    this.size = size;
    this.speed = speed;
    this.languages = languages;

    this.features = features;
  }
};

class BackgroundData {
  constructor(name, source, description, profSkills, profTools,
    profLanguages, equipment, features, personalityTraits,
    ideals, bonds, flaws) {
    this.name = name;
    this.source = source;
    this.description = description;

    this.profSkills = profSkills;
    this.profTools = profTools;
    this.profLanguages = profLanguages;

    this.equipment = equipment;
    this.features = features;

    this.personalityTraits = personalityTraits;
    this.ideals = ideals;
    this.bonds = bonds;
    this.flaws = flaws;
  }
};


let subclassData = {
    "description":"",
    "features":[]
}

let classData = {
    "hit-dice":"",
    "hp-lv-1":"",
    "hp-lv-up":"",

    "prof-bonus":"",
    "prof-armor":[],
    "prof-weapons":[],
    "prof-tools":[],
    "prof-saving-throws":[],
    "prof-skills":[],

    "equipment":"",
    "features":[],

    "spell-save":"",
    "spell-attack-mod":"",
    "spells-known":[],
    "spell-slots":[],

    "subclass":{},
    
    "character-table":{}
};

let characterData = {
    "name": "Aelarion Brightwing",
    "race": "Elf",
    "class": "Ranger",
    "background": "Outlander",
    "level": 1,
    "xp": 0,
    "alignment": "Chaotic Good",
    "hit-dice": "",
  
    "strength": 10,
    "dexterity": 14,
    "constitution": 12,
    "intelligence": 10,
    "wisdom": 15,
    "charisma": 13,
    //skills and bonuses can be calculated

    "prof-bonus": 2,
    "prof-armor": "",
    "prof-weapons": "",
    "prof-tools": "",
    "prof-languages": "",
    "saving-throws": ["strength", "dexterity"],
    "skills": ["athletics", "stealth", "survival"],
    
    "hp-current": 8,
    "hp-max": 8,
    "hp-temp": 0,
  
    "death-saves-successes": 0,
    "death-saves-failures": 0,
  
    "inspiration": 0,
    "passive-wisdom": 0,
  
    "armor-class": 13,
    "initiative": 2,
    "speed": 30,
  
    "equipment": "",
  
    "money-cp": 50,
    "money-sp": 0,
    "money-ep": 0,
    "money-gp": 50,
    "money-pp": 0,
  
    "traits": [
      {
        "name": "Ability Name",
        "description": "Ability Description",
        "charges": 2,
        "expended": 0
      }
    ],
  
    "spell-save": 8,
    "spell-attack-mod": 8,
    "spell-ability": "",
  
    "sorcery-points": 0,
    "sorcery-current-points": 0,
  
    "spells":{
      "cantrips": [
      ],
      "1":{
        "slots": 2,
        "expended": 1, 
        "spells": [
        ]
      },
      "2":{
        "slots": 0,
        "expended": 0, 
        "spells": []
      },
      "3":{
        "slots": 0,
        "expended": 0, 
        "spells": []
      },
      "4":{
        "slots": 0,
        "expended": 0, 
        "spells": []
      },
      "5":{
        "slots": 0,
        "expended": 0, 
        "spells": []
      },
      "6":{
        "slots": 0,
        "expended": 0, 
        "spells": []
      },
      "7":{
        "slots": 0,
        "expended": 0, 
        "spells": []
      },
      "8":{
        "slots": 0,
        "expended": 0, 
        "spells": []
      },
      "9":{
        "slots": 0,
        "expended": 0, 
        "spells": []
      }
    }
  };