addLayer("achievements", {
    symbol: "🏆",
    row: "side",
    resource: "achievements.",

    tooltip: "Achievements",

    layerShown: true,

    tabFormat: {
        Milestones: {
            embedLayer: "milestones",
        },
        Challenges: {
            embedLayer: "challenges",
        },
    },
});

addLayer("milestones", {
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

    tabFormat: {
        Achievements: {
            content: [
                "main-display",
                "achievements",
            ],
        },
        Effects: {
            content: [
                "main-display",
                ["display-text", function() {
                    let effects = layers.milestones.calcEffect();
                    let tableData = {};
                    for (let item in effects) {
                        let data;
                        if (effects[item] instanceof Decimal) {
                            if (effects[item].eq(0)) continue;
                            data = "+" + format(effects[item]) + "%";
                        }
                        tableData[item.charAt(0).toUpperCase() + item.slice(1).replace(/([A-Z])/g,' $1')] = data;
                    };
                    return formatTable(tableData, {headings: ["Point", "Boost"]});
                }],
            ],
        },
    },

    calcEffect(effect = null) {
        let ret = {};
        switch(effect) {
            case null:
            case "blankPigment":
                ret.blankPigment = achievementEffect("milestones", 11);
                if (effect) break;
            case "redPigment":
                ret.redPigment = achievementEffect("milestones", 21);
                if (effect) break;
            case "orangePigment":
                ret.orangePigment = achievementEffect("milestones", 22);
                if (effect) break;
            case "yellowPigment":
                ret.yellowPigment = achievementEffect("milestones", 23);
                if (effect) break;
            case "greenPigment":
                ret.greenPigment = achievementEffect("milestones", 31);
                if (effect) break;
            case "bluePigment":
                ret.bluePigment = achievementEffect("milestones", 32);
                if (effect) break;
            case "purplePigment":
                ret.purplePigment = achievementEffect("milestones", 33);
                if (effect) break;
        }

        if (effect) ret = ret[effect];
        return ret;
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
                        return "Have " + formatWhole(this.goal()) + " blank pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% blank pigment.";
                    case this.max:
                        return "MAXED\nReward:\n+" + formatWhole(this.effect()) + "% blank pigment.";
                    default:
                        return "Have " + formatWhole(this.goal()) + " blank pigment.\nCurrent Reward:\n+" + formatWhole(this.effect()) + "% blank pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% blank pigment.";
                }
            },

            max: 30,
            goal() {
                return new Decimal(1e3).pow(player[this.layer].levels[this.id]).max(10);
            },
            done() {
                return player.points.gte(this.goal());
            },
            onComplete() {
                if (player[this.layer].levels[this.id] != this.max) {
                    player[this.layer].levels[this.id] += 1;
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(this.max).mul(layers.challenges.calcEffect());
            },
        },

        21: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(player[this.layer].levels[this.id]/10)] + "<br>Red<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, this.max)%10)
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(this.goal()) + " red pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% red pigment.";
                    case this.max:
                        return "MAXED\nReward:\n+" + formatWhole(this.effect()) + "% red pigment.";
                    default:
                        return "Have " + formatWhole(this.goal()) + " red pigment.\nCurrent Reward:\n+" + formatWhole(this.effect()) + "% red pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% red pigment.";
                }
            },

            style() {
                return {opacity: (player.redPigment.unlocked ? 1 : 0)};
            },

            max: 30,
            goal() {
                return new Decimal(1e3).pow(player[this.layer].levels[this.id]).max(10);
            },
            done() {
                return player.redPigment.points.gte(this.goal()) && this.style().opacity;
            },
            onComplete() {
                if (player[this.layer].levels[this.id] != this.max) {
                    player[this.layer].levels[this.id] += 1;
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(this.max).mul(layers.challenges.calcEffect());
            },
        },
        22: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(player[this.layer].levels[this.id]/10)] + "<br>Yellow<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, this.max)%10)
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(this.goal()) + " yellow pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% yellow pigment.";
                    case this.max:
                        return "MAXED\nReward:\n+" + formatWhole(this.effect()) + "% yellow pigment.";
                    default:
                        return "Have " + formatWhole(this.goal()) + " yellow pigment.\nCurrent Reward:\n+" + formatWhole(this.effect()) + "% yellow pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% yellow pigment.";
                }
            },

            style() {
                return {opacity: (player.yellowPigment.unlocked ? 1 : 0)};
            },

            max: 30,
            goal() {
                return new Decimal(1e3).pow(player[this.layer].levels[this.id]).max(10);
            },
            done() {
                return player.yellowPigment.points.gte(this.goal()) && this.style().opacity;
            },
            onComplete() {
                if (player[this.layer].levels[this.id] != this.max) {
                    player[this.layer].levels[this.id] += 1;
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(this.max).mul(layers.challenges.calcEffect());
            },
        },
        23: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(player[this.layer].levels[this.id]/10)] + "<br>Blue<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, this.max)%10)
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(this.goal()) + " blue pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% blue pigment.";
                    case this.max:
                        return "MAXED\nReward:\n+" + formatWhole(this.effect()) + "% blue pigment.";
                    default:
                        return "Have " + formatWhole(this.goal()) + " blue pigment.\nCurrent Reward:\n+" + formatWhole(this.effect()) + "% blue pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% blue pigment.";
                }
            },

            style() {
                return {opacity: (player.bluePigment.unlocked ? 1 : 0)};
            },

            max: 30,
            goal() {
                return new Decimal(1e3).pow(player[this.layer].levels[this.id]).max(10);
            },
            done() {
                return player.bluePigment.points.gte(this.goal()) && this.style().opacity;
            },
            onComplete() {
                if (player[this.layer].levels[this.id] != this.max) {
                    player[this.layer].levels[this.id] += 1;
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(this.max).mul(layers.challenges.calcEffect());
            },
        },

        31: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(player[this.layer].levels[this.id]/10)] + "<br>Orange<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, this.max)%10)
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(this.goal()) + " orange pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% orange pigment.";
                    case this.max:
                        return "MAXED\nReward:\n+" + formatWhole(this.effect()) + "% orange pigment.";
                    default:
                        return "Have " + formatWhole(this.goal()) + " orange pigment.\nCurrent Reward:\n+" + formatWhole(this.effect()) + "% orange pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% orange pigment.";
                }
            },

            style() {
                return {opacity: (player.orangePigment.unlocked ? 1 : 0)};
            },

            max: 30,
            goal() {
                return new Decimal(1e3).pow(player[this.layer].levels[this.id]).max(10);
            },
            done() {
                return player.orangePigment.points.gte(this.goal()) && this.style().opacity;
            },
            onComplete() {
                if (player[this.layer].levels[this.id] != this.max) {
                    player[this.layer].levels[this.id] += 1;
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(this.max).mul(layers.challenges.calcEffect());
            },
        },
        32: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(player[this.layer].levels[this.id]/10)] + "<br>Green<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, this.max)%10)
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(this.goal()) + " green pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% green pigment.";
                    case this.max:
                        return "MAXED\nReward:\n+" + formatWhole(this.effect()) + "% green pigment.";
                    default:
                        return "Have " + formatWhole(this.goal()) + " green pigment.\nCurrent Reward:\n+" + formatWhole(this.effect()) + "% green pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% green pigment.";
                }
            },

            style() {
                return {opacity: (player.greenPigment.unlocked ? 1 : 0)};
            },

            max: 30,
            goal() {
                return new Decimal(1e3).pow(player[this.layer].levels[this.id]).max(10);
            },
            done() {
                return player.greenPigment.points.gte(this.goal()) && this.style().opacity;
            },
            onComplete() {
                if (player[this.layer].levels[this.id] != this.max) {
                    player[this.layer].levels[this.id] += 1;
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(this.max).mul(layers.challenges.calcEffect());
            },
        },
        33: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(player[this.layer].levels[this.id]/10)] + "<br>Purple<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, this.max)%10)
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(this.goal()) + " purple pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% purple pigment.";
                    case this.max:
                        return "MAXED\nReward:\n+" + formatWhole(this.effect()) + "% purple pigment.";
                    default:
                        return "Have " + formatWhole(this.goal()) + " purple pigment.\nCurrent Reward:\n+" + formatWhole(this.effect()) + "% purple pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% purple pigment.";
                }
            },

            style() {
                return {opacity: (player.purplePigment.unlocked ? 1 : 0)};
            },

            max: 30,
            goal() {
                return new Decimal(1e3).pow(player[this.layer].levels[this.id]).max(10);
            },
            done() {
                return player.purplePigment.points.gte(this.goal()) && this.style().opacity;
            },
            onComplete() {
                if (player[this.layer].levels[this.id] != this.max) {
                    player[this.layer].levels[this.id] += 1;
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(this.max).mul(layers.challenges.calcEffect());
            },
        },
    },
})

addLayer("challenges", {
    resource: "achievements",

    layerShown: true,

    effectDescription() {
        return "<br>boosting all milestone achievement effects by x" + format(this.calcEffect()) + ".";
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

    tabFormat: {
        Achievements: {
            content: [
                "main-display",
                "achievements",
            ],
        },
        Effects: {
            content: [
                "main-display",
                ["display-text", function() {
                    let ret = "";

                    if (hasAchievement("challenges", 11)) ret += player.firsts.primaryPigment.charAt(0).toUpperCase() + player.firsts.primaryPigment.slice(1).replace(/([A-Z])/g,' $1') + " is boosted by +10%.<br>";
                    if (hasAchievement("challenges", 14)) ret += player.firsts.secondaryPigment.charAt(0).toUpperCase() + player.firsts.secondaryPigment.slice(1).replace(/([A-Z])/g,' $1') + " is boosted by +10%.<br>";
                    if (hasAchievement("challenges", 21)) ret += "+" + achievementEffect("challenges", 21) + " base blank pigment gain.<br>";
                    if (hasAchievement("challenges", 22)) ret += "Keep unlock order and automatic gain upgrades on secondary pigment reset.<br>";
                    if (hasAchievement("challenges", 23)) ret += "Secondary pigments are based on total primary pigments.<br>";

                    if (ret == "") ret = "You haven't unlocked any additional effects yet.";
                    return ret;
                }],
            ],
        },
    },

    calcEffect() {
        return new Decimal(player.challenges.achievements.length).add(1).log(10).add(1); 
    },

    achievements: {
        rows() {
            let rows = 1;
            if (player.orangePigment.unlocked || player.greenPigment.unlocked || player.purplePigment.unlocked) rows ++;
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
                if (player.redPigment.unlocked)    player.firsts.primaryPigment = "redPigment";
                if (player.yellowPigment.unlocked) player.firsts.primaryPigment = "yellowPigment";
                if (player.bluePigment.unlocked)   player.firsts.primaryPigment = "bluePigment";
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
                if (player.orangePigment.unlocked) player.firsts.secondaryPigment = "orangePigment";
                if (player.greenPigment.unlocked)  player.firsts.secondaryPigment = "greenPigment";
                if (player.purplePigment.unlocked) player.firsts.secondaryPigment = "purplePigment";
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
            effect() {
                return hasChallenge("orangePigment", 11) + hasChallenge("greenPigment", 11) + hasChallenge("purplePigment", 11);
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
        },
        23: {
            name: "Repetition",
            tooltip: "Complete four secondary challenges.\nReward:\nSecondary pigments are now based on total primary pigments.",

            style: {
                color: "#FD0",
            },

            done() {
                return hasChallenge("orangePigment", 11) + hasChallenge("orangePigment", 12) + hasChallenge("greenPigment", 11) + hasChallenge("greenPigment", 12) + hasChallenge("purplePigment", 11) + hasChallenge("purplePigment", 12) >= 4;
            },
        },
        24: {
            name: "Out Of<br>Order",
            tooltip: "Complete a Complementary challenge before an Addition challenge.",

            done() {
                return (!hasChallenge("orangePigment", 11) && hasChallenge("orangePigment", 12)) || (!hasChallenge("greenPigment", 11) && hasChallenge("greenPigment", 12)) || (!hasChallenge("purplePigment", 11) && hasChallenge("purplePigment", 12));
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
})