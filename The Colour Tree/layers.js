//vscode-fold=1

addLayer("achievements", {
    symbol: "🏆",
    row: "side",
    resource: "achievements.",

    tooltip: "Achievements",

    layerShown: true,

    startData() {
        return {
            effectNotify: false,
        };
    },
    effectNotify() {
        if (player.tab == this.layer && player.subtabs[this.layer].mainTabs == "Effects") {
            player[this.layer].effectNotify = false;
        }
    },

    tabFormat: {
        Milestones: {
            embedLayer: "milestones",
        },
        Challenges: {
            embedLayer: "challenges",
        },
        Effects: {
            content: [
                ["display-text", function() {
                    let effects = tmp.milestones.effect;
                    let tableData = {};
                    for (let item in effects) {
                        if (effects[item] instanceof Decimal && effects[item].eq(0) && !player.debugOptions.showAll) continue;
                        let data = "+" + format(effects[item]) + "%";
                        tableData[item.charAt(0).toUpperCase() + item.slice(1).replace(/([A-Z])/g,' $1')] = data;
                    };
                    return formatTable(tableData, {headings: ["Point", "Boost"]});
                }],
                "blank",
                ["display-text", function() {
                    let ret = "";

                    if (hasAchievement("challenges", 11)) ret += player.stats.firstPrimary.charAt(0).toUpperCase() + player.stats.firstPrimary.slice(1).replace(/([A-Z])/g,' $1') + " is boosted by +10%.<br>";
                    if (hasAchievement("challenges", 14)) ret += player.stats.firstSecondary.charAt(0).toUpperCase() + player.stats.firstSecondary.slice(1).replace(/([A-Z])/g,' $1') + " is boosted by +10%.<br>";
                    if (hasAchievement("challenges", 21)) ret += "+" + achievementEffect("challenges", 21) + " base blank pigment gain.<br>";
                    if (hasAchievement("challenges", 22)) ret += "Keep primary pigment unlock order and automatic gain upgrades on secondary pigment reset.<br>";
                    if (hasAchievement("challenges", 24)) ret += "Secondary pigments are based on total primary pigments.<br>";

                    if (ret == "") ret = "You haven't unlocked any additional effects yet.";
                    else           ret = "You also have the following effects.<br><br>" + ret;
                    return ret;
                }],
            ],
            shouldNotify() {
                return player.achievements.effectNotify;
            },
        },
    },
});

addLayer("milestones", {
    resource: "milestones.",

    layerShown: true,

    startData() {
        let levels = {};
        for (let achievement in this.achievements) {
            if (achievement == "rows" || achievement == "cols") continue;
            levels[achievement] = 0;
        };

        return {
            points: "",
            levels: levels,
        };
    },
    points() {
        let points = 0;
        let total = 0;
        for (let achievement in this.achievements) {
            if (achievement == "rows" || achievement == "cols") continue;
            points += player[this.layer].levels[achievement];
            total += this.achievements[achievement].max;
        }
        player[this.layer].points = points + "/" + total;
    },

    tabFormat: [
        "main-display",
        "achievements",
    ],

    effect() {
        return ret = {
            blankPigment:  achievementEffect("milestones", 11),
            redPigment:    achievementEffect("milestones", 21),
            yellowPigment: achievementEffect("milestones", 22),
            bluePigment:   achievementEffect("milestones", 23),
            orangePigment: achievementEffect("milestones", 31),
            greenPigment:  achievementEffect("milestones", 32),
            purplePigment: achievementEffect("milestones", 33),
        };
    },

    achievements: {
        rows: 3,
        cols: 3,

        11: {
            name() {
                return "A Blank<br>Canvas<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, this.max))
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " blank pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% blank pigment.";
                    case this.max:
                        return "MAXED\nReward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% blank pigment.";
                    default:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " blank pigment.\nCurrent Reward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% blank pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% blank pigment.";
                }
            },

            max: 40,
            goal() {
                return new Decimal(1e3).pow(player[this.layer].levels[this.id]).max(10);
            },
            done() {
                return player.points.gte(tmp[this.layer].achievements[this.id].goal);
            },
            onComplete() {
                player[this.layer].levels[this.id] += 1;
                if (player[this.layer].levels[this.id] < this.max) {
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(this.max).mul(tmp.challenges.effect);
            },
        },

        21: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(Math.min(player[this.layer].levels[this.id], this.max-1)/10)] + "<br>Red<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, this.max)%10)
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " red pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% red pigment.";
                    case this.max:
                        return "MAXED\nReward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% red pigment.";
                    default:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " red pigment.\nCurrent Reward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% red pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% red pigment.";
                }
            },

            style() {
                return {opacity: (player.redPigment.unlocked || player.debugOptions.showAll ? 1 : 0)};
            },

            max: 40,
            goal() {
                return new Decimal(1e3).pow(player[this.layer].levels[this.id]).max(10);
            },
            done() {
                return player.redPigment.points.gte(tmp[this.layer].achievements[this.id].goal) && tmp[this.layer].achievements[this.id].style.opacity;
            },
            onComplete() {
                player[this.layer].levels[this.id] += 1;
                if (player[this.layer].levels[this.id] < this.max) {
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(this.max).mul(tmp.challenges.effect);
            },
        },
        22: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(Math.min(player[this.layer].levels[this.id], this.max-1)/10)] + "<br>Yellow<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, this.max)%10)
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " yellow pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% yellow pigment.";
                    case this.max:
                        return "MAXED\nReward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% yellow pigment.";
                    default:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " yellow pigment.\nCurrent Reward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% yellow pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% yellow pigment.";
                }
            },

            style() {
                return {opacity: (player.yellowPigment.unlocked || player.debugOptions.showAll ? 1 : 0)};
            },

            max: 40,
            goal() {
                return new Decimal(1e3).pow(player[this.layer].levels[this.id]).max(10);
            },
            done() {
                return player.yellowPigment.points.gte(tmp[this.layer].achievements[this.id].goal) && tmp[this.layer].achievements[this.id].style.opacity;
            },
            onComplete() {
                player[this.layer].levels[this.id] += 1;
                if (player[this.layer].levels[this.id] < this.max) {
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(this.max).mul(tmp.challenges.effect);
            },
        },
        23: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(Math.min(player[this.layer].levels[this.id], this.max-1)/10)] + "<br>Blue<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, this.max)%10)
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " blue pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% blue pigment.";
                    case this.max:
                        return "MAXED\nReward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% blue pigment.";
                    default:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " blue pigment.\nCurrent Reward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% blue pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% blue pigment.";
                }
            },

            style() {
                return {opacity: (player.bluePigment.unlocked || player.debugOptions.showAll ? 1 : 0)};
            },

            max: 40,
            goal() {
                return new Decimal(1e3).pow(player[this.layer].levels[this.id]).max(10);
            },
            done() {
                return player.bluePigment.points.gte(tmp[this.layer].achievements[this.id].goal) && tmp[this.layer].achievements[this.id].style.opacity;
            },
            onComplete() {
                player[this.layer].levels[this.id] += 1;
                if (player[this.layer].levels[this.id] < this.max) {
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(this.max).mul(tmp.challenges.effect);
            },
        },

        31: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(Math.min(player[this.layer].levels[this.id], this.max-1)/10)] + "<br>Orange<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, this.max)%10)
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " orange pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% orange pigment.";
                    case this.max:
                        return "MAXED\nReward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% orange pigment.";
                    default:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " orange pigment.\nCurrent Reward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% orange pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% orange pigment.";
                }
            },

            style() {
                return {opacity: (player.orangePigment.unlocked || player.debugOptions.showAll ? 1 : 0)};
            },

            max: 40,
            goal() {
                return new Decimal(1e3).pow(player[this.layer].levels[this.id]).max(10);
            },
            done() {
                return player.orangePigment.points.gte(tmp[this.layer].achievements[this.id].goal) && tmp[this.layer].achievements[this.id].style.opacity;
            },
            onComplete() {
                player[this.layer].levels[this.id] += 1;
                if (player[this.layer].levels[this.id] < this.max) {
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(this.max).mul(tmp.challenges.effect);
            },
        },
        32: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(Math.min(player[this.layer].levels[this.id], this.max-1)/10)] + "<br>Green<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, this.max)%10)
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " green pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% green pigment.";
                    case this.max:
                        return "MAXED\nReward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% green pigment.";
                    default:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " green pigment.\nCurrent Reward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% green pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% green pigment.";
                }
            },

            style() {
                return {opacity: (player.greenPigment.unlocked || player.debugOptions.showAll ? 1 : 0)};
            },

            max: 40,
            goal() {
                return new Decimal(1e3).pow(player[this.layer].levels[this.id]).max(10);
            },
            done() {
                return player.greenPigment.points.gte(tmp[this.layer].achievements[this.id].goal) && tmp[this.layer].achievements[this.id].style.opacity;
            },
            onComplete() {
                player[this.layer].levels[this.id] += 1;
                if (player[this.layer].levels[this.id] < this.max) {
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(this.max).mul(tmp.challenges.effect);
            },
        },
        33: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(Math.min(player[this.layer].levels[this.id], this.max-1)/10)] + "<br>Purple<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, this.max)%10)
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " purple pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% purple pigment.";
                    case this.max:
                        return "MAXED\nReward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% purple pigment.";
                    default:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " purple pigment.\nCurrent Reward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% purple pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% purple pigment.";
                }
            },

            style() {
                return {opacity: (player.purplePigment.unlocked || player.debugOptions.showAll ? 1 : 0)};
            },

            max: 40,
            goal() {
                return new Decimal(1e3).pow(player[this.layer].levels[this.id]).max(10);
            },
            done() {
                return player.purplePigment.points.gte(tmp[this.layer].achievements[this.id].goal) && tmp[this.layer].achievements[this.id].style.opacity;
            },
            onComplete() {
                player[this.layer].levels[this.id] += 1;
                if (player[this.layer].levels[this.id] < this.max) {
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(this.max).mul(tmp.challenges.effect);
            },
        },
    },
});

addLayer("challenges", {
    resource: "achievements",

    layerShown: true,

    effectDescription() {
        return "<br>boosting all milestone achievement effects by x" + format(tmp[this.layer].effect) + ".";
    },

    startData() {
        return {
            points: "",
        };
    },
    points() {
        let total = 0;
        for (let achievement in this.achievements) {
            if (achievement == "rows" || achievement == "cols") continue;
            total += 1;
        }
        player[this.layer].points = player[this.layer].achievements.length + "/" + total;
    },

    tabFormat: [
        "main-display",
        "achievements",
    ],

    effect() {
        return new Decimal(player.challenges.achievements.length).add(1).log(10).add(1); 
    },

    achievements: {
        rows() {
            let rows = 1;
            if (player.orangePigment.unlocked || player.greenPigment.unlocked || player.purplePigment.unlocked || player.debugOptions.showAll) rows ++;
            return rows;
        },
        cols: 5,

        11: {
            name: "Monochrome",
            tooltip() {
                let colour = (player.firstSecondary ? player.firstPrimaryPigment : "First primary colour");
                return  "Combine two colours.\nReward:\n" + colour + " is permanently boosted by +10%.";
            },

            style: {
                color: "#FD0",
            },

            done() {
                return player.redPigment.unlocked || player.yellowPigment.unlocked || player.bluePigment.unlocked;
            },
            onComplete() {
                if (player.redPigment.unlocked)    player.stats.firstPrimary = "redPigment";
                if (player.yellowPigment.unlocked) player.stats.firstPrimary = "yellowPigment";
                if (player.bluePigment.unlocked)   player.stats.firstPrimary = "bluePigment";

                player.achievements.effectNotify = true;
            },
            effect: 1.1,
        },
        12: {
            name: "Dual Primaries",
            tooltip: "Unlock two primary colours.",

            done() {
                return player.redPigment.unlocked + player.yellowPigment.unlocked + player.bluePigment.unlocked >= 2;
            },
        },
        13: {
            name: "Full Colour",
            tooltip: "Unlock all the primary colours.",

            done() {
                return player.redPigment.unlocked && player.yellowPigment.unlocked && player.bluePigment.unlocked;
            },
        },
        14: {
            name: "Colour<br>Mixer",
            tooltip() {
                let colour = (player.firstSecondary ? player.firstSecondaryPigment : "First secondary colour");
                return  "Combine two colours.\nReward:\n" + colour + " is permanently boosted by +10%.";
            },

            style: {
                color: "#FD0",
            },

            done() {
                return player.orangePigment.unlocked || player.greenPigment.unlocked || player.purplePigment.unlocked;
            },
            onComplete() {
                if (player.orangePigment.unlocked) player.stats.firstSecondary = "orangePigment";
                if (player.greenPigment.unlocked)  player.stats.firstSecondary = "greenPigment";
                if (player.purplePigment.unlocked) player.stats.firstSecondary = "purplePigment";

                player.achievements.effectNotify = true;
            },
            effect: 1.1,
        },
        15: {
            name: "The Colour <s>Wheel</s> Triangle",
            tooltip: "Unlock all six colours.",

            done() {
                return player.orangePigment.unlocked && player.greenPigment.unlocked && player.purplePigment.unlocked;
            },
        },

        21: {
            name: "Lines Are Better Than Triangles",
            tooltip: "Complete an Addition challenge.\nReward:\nAdd 1 to base blank pigment gain for each line unlocked.",

            style: {
                color: "#FD0",
            },

            done() {
                return hasChallenge("orangePigment", 11) || hasChallenge("greenPigment", 11) || hasChallenge("purplePigment", 11);
            },
            onComplete() {
                player.achievements.effectNotify = true;
            },
            effect() {
                return tmp.orangePigment.layerShown + tmp.greenPigment.layerShown + tmp.purplePigment.layerShown;
            },
        },
        22: {
            name: "Ditching Your Roots",
            tooltip: "Complete a Complementary challenge.\nReward:\nKeep unlock order and automatic gain upgrades on secondary pigment resets.",

            style: {
                color: "#FD0",
            },

            done() {
                return hasChallenge("orangePigment", 12) || hasChallenge("greenPigment", 12) || hasChallenge("purplePigment", 12);
            },
            onComplete() {
                player.achievements.effectNotify = true;
            },
        },
        23: {
            name: "Repetition",
            tooltip: "Complete four secondary challenges.",

            done() {
                return hasChallenge("orangePigment", 11) + hasChallenge("orangePigment", 12) + hasChallenge("greenPigment", 11) + hasChallenge("greenPigment", 12) + hasChallenge("purplePigment", 11) + hasChallenge("purplePigment", 12) >= 4;
            },
        },
        24: {
            name: "Out Of<br>Order",
            tooltip: "Complete a Complementary challenge before an Addition challenge.\nReward:\nSecondary pigments are now based on total primary pigments.",

            style: {
                color: "#FD0",
            },

            done() {
                return (!hasChallenge("orangePigment", 11) && hasChallenge("orangePigment", 12)) || (!hasChallenge("greenPigment", 11) && hasChallenge("greenPigment", 12)) || (!hasChallenge("purplePigment", 11) && hasChallenge("purplePigment", 12));
            },
            onComplete() {
                player.achievements.effectNotify = true;
            },
        },
        25: {
            name: "You Call That A Challenge?",
            tooltip: "Complete six secondary challenges.",

            done() {
                return hasChallenge("orangePigment", 11) && hasChallenge("orangePigment", 12) && hasChallenge("greenPigment", 11) && hasChallenge("greenPigment", 12) && hasChallenge("purplePigment", 11) && hasChallenge("purplePigment", 12);
            },
        },
    },
});

addLayer("statistics", {
    symbol: "📊",
    row: "side",
    
    tooltip: "Statistics",

    layerShown: true,

    tabFormat: {
        "Misc Stats": {
            content: [
                ["display-text", function() {
                    let ret = "";
        
                    ret += "You started playing " + formatTime(Math.floor((Date.now()-player.stats.startTick)/1000)).slice(0, -4) + "s ago.<br>";
                    ret += "You have " + formatTime(Math.floor(player.timePlayed)).slice(0, -4) + "s of play time.<br><br>";
                    
                    ret += "You have prestiged " + formatWhole(player.stats.resets) + " time" + (player.stats.resets != 1 ? "s" : "") + ".<br>";
                    ret += "You have bought " + formatWhole(player.stats.upgradesBought) + " upgrade" + (player.stats.upgradesBought != 1 ? "s" : "") + ".<br>";
                    ret += "You have completed " + formatWhole(player.stats.challengesCompleted) + " challenge" + (player.stats.challengesCompleted != 1 ? "s" : "") + ".<br>";
        
                    return ret;
                }],
            ],
        },
        "Layer Data": {
            unlocked: false
        },
    },
});