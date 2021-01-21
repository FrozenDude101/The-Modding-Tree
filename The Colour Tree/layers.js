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

            showPopups: true,
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
        ["display-text", "Milestone Completion Popups"],
        "blank",
        ["toggle", ["challenges", "showPopups"]],
    ],

    effect() {
        return {
            blankPigment:   achievementEffect("milestones", 11),

            redPigment:     achievementEffect("milestones", 21),
            yellowPigment:  achievementEffect("milestones", 22),
            bluePigment:    achievementEffect("milestones", 23),

            orangePigment:  achievementEffect("milestones", 31),
            greenPigment:   achievementEffect("milestones", 32),
            purplePigment:  achievementEffect("milestones", 33),

            blackPigment:   achievementEffect("milestones", 41),
            absorbedLight:  achievementEffect("milestones", 42),
            whitePigment:   achievementEffect("milestones", 44),
            reflectedLight: achievementEffect("milestones", 43),

            greyPigment:    achievementEffect("milestones", 51),
        };
    },

    achievementsPopups() {
        return player[this.layer].showPopups;
    },
    achievements: {
        rows: 5,
        cols: 4,

        11: {
            name() {
                return "A Blank<br>Canvas<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, tmp[this.layer].achievements[this.id].max))
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " blank pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% blank pigment.";
                    case tmp[this.layer].achievements[this.id].max:
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
                if (player[this.layer].levels[this.id] < tmp[this.layer].achievements[this.id].max) {
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(tmp[this.layer].achievements[this.id].max).mul(tmp.challenges.effect);
            },
        },

        21: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(Math.min(player[this.layer].levels[this.id], tmp[this.layer].achievements[this.id].max-1)/10)] + "<br>Red<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, tmp[this.layer].achievements[this.id].max)%10)
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " red pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% red pigment.";
                    case tmp[this.layer].achievements[this.id].max:
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
                if (player[this.layer].levels[this.id] < tmp[this.layer].achievements[this.id].max) {
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(tmp[this.layer].achievements[this.id].max).mul(tmp.challenges.effect);
            },
        },
        22: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(Math.min(player[this.layer].levels[this.id], tmp[this.layer].achievements[this.id].max-1)/10)] + "<br>Yellow<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, tmp[this.layer].achievements[this.id].max)%10)
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " yellow pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% yellow pigment.";
                    case tmp[this.layer].achievements[this.id].max:
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
                if (player[this.layer].levels[this.id] < tmp[this.layer].achievements[this.id].max) {
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(tmp[this.layer].achievements[this.id].max).mul(tmp.challenges.effect);
            },
        },
        23: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(Math.min(player[this.layer].levels[this.id], tmp[this.layer].achievements[this.id].max-1)/10)] + "<br>Blue<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, tmp[this.layer].achievements[this.id].max)%10)
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " blue pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% blue pigment.";
                    case tmp[this.layer].achievements[this.id].max:
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
                if (player[this.layer].levels[this.id] < tmp[this.layer].achievements[this.id].max) {
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(tmp[this.layer].achievements[this.id].max).mul(tmp.challenges.effect);
            },
        },

        31: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(Math.min(player[this.layer].levels[this.id], tmp[this.layer].achievements[this.id].max-1)/10)] + "<br>Orange<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, tmp[this.layer].achievements[this.id].max)%10)
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " orange pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% orange pigment.";
                    case tmp[this.layer].achievements[this.id].max:
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
                if (player[this.layer].levels[this.id] < tmp[this.layer].achievements[this.id].max) {
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(tmp[this.layer].achievements[this.id].max).mul(tmp.challenges.effect);
            },
        },
        32: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(Math.min(player[this.layer].levels[this.id], tmp[this.layer].achievements[this.id].max-1)/10)] + "<br>Green<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, tmp[this.layer].achievements[this.id].max)%10)
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " green pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% green pigment.";
                    case tmp[this.layer].achievements[this.id].max:
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
                if (player[this.layer].levels[this.id] < tmp[this.layer].achievements[this.id].max) {
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(tmp[this.layer].achievements[this.id].max).mul(tmp.challenges.effect);
            },
        },
        33: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(Math.min(player[this.layer].levels[this.id], tmp[this.layer].achievements[this.id].max-1)/10)] + "<br>Purple<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, tmp[this.layer].achievements[this.id].max)%10)
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " purple pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% purple pigment.";
                    case tmp[this.layer].achievements[this.id].max:
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
                if (player[this.layer].levels[this.id] < tmp[this.layer].achievements[this.id].max) {
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(tmp[this.layer].achievements[this.id].max).mul(tmp.challenges.effect);
            },
        },

        41: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(Math.min(player[this.layer].levels[this.id], tmp[this.layer].achievements[this.id].max-1)/10)] + "<br>Black<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, tmp[this.layer].achievements[this.id].max)%10)
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " black pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% black pigment.";
                    case tmp[this.layer].achievements[this.id].max:
                        return "MAXED\nReward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% black pigment.";
                    default:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " black pigment.\nCurrent Reward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% black pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% black pigment.";
                }
            },

            style() {
                return {opacity: (player.blackPigment.unlocked || player.debugOptions.showAll ? 1 : 0)};
            },

            max: 40,
            goal() {
                return new Decimal(1e3).pow(player[this.layer].levels[this.id]).max(10);
            },
            done() {
                return player.blackPigment.points.gte(tmp[this.layer].achievements[this.id].goal) && tmp[this.layer].achievements[this.id].style.opacity;
            },
            onComplete() {
                player[this.layer].levels[this.id] += 1;
                if (player[this.layer].levels[this.id] < tmp[this.layer].achievements[this.id].max) {
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(tmp[this.layer].achievements[this.id].max).mul(tmp.challenges.effect);
            },
        },
        42: {
            name() {
                return "Absorbed<br>Light<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, tmp[this.layer].achievements[this.id].max));
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " absorbed light.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% absorbed light.";
                    case tmp[this.layer].achievements[this.id].max:
                        return "MAXED\nReward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% absorbed light.";
                    default:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " absorbed light.\nCurrent Reward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% absorbed light.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% absorbed light.";
                }
            },

            style() {
                return {opacity: (player.blackPigment.unlocked || player.debugOptions.showAll ? 1 : 0)};
            },

            max: 40,
            goal() {
                return new Decimal(1e3).pow(player[this.layer].levels[this.id]).max(10);
            },
            done() {
                return player.blackPigment.light.gte(tmp[this.layer].achievements[this.id].goal) && tmp[this.layer].achievements[this.id].style.opacity;
            },
            onComplete() {
                player[this.layer].levels[this.id] += 1;
                if (player[this.layer].levels[this.id] < tmp[this.layer].achievements[this.id].max) {
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(tmp[this.layer].achievements[this.id].max).mul(tmp.challenges.effect);
            },
        },
        43: {
            name() {
                return "Reflected<br>Light<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, tmp[this.layer].achievements[this.id].max))
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " reflected light.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% reflected light.";
                    case tmp[this.layer].achievements[this.id].max:
                        return "MAXED\nReward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% reflected light.";
                    default:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " reflected light.\nCurrent Reward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% reflected light.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% reflected light.";
                }
            },

            style() {
                return {opacity: (player.whitePigment.unlocked || player.debugOptions.showAll ? 1 : 0)};
            },

            max: 40,
            goal() {
                return new Decimal(1e3).pow(player[this.layer].levels[this.id]).max(10);
            },
            done() {
                return player.whitePigment.light.gte(tmp[this.layer].achievements[this.id].goal) && tmp[this.layer].achievements[this.id].style.opacity;
            },
            onComplete() {
                player[this.layer].levels[this.id] += 1;
                if (player[this.layer].levels[this.id] < tmp[this.layer].achievements[this.id].max) {
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(tmp[this.layer].achievements[this.id].max).mul(tmp.challenges.effect);
            },
        },
        44: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(Math.min(player[this.layer].levels[this.id], tmp[this.layer].achievements[this.id].max-1)/10)] + "<br>White<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, tmp[this.layer].achievements[this.id].max)%10)
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " white pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% white pigment.";
                    case tmp[this.layer].achievements[this.id].max:
                        return "MAXED\nReward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% white pigment.";
                    default:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " white pigment.\nCurrent Reward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% green pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% white pigment.";
                }
            },

            style() {
                return {opacity: (player.whitePigment.unlocked || player.debugOptions.showAll ? 1 : 0)};
            },

            max: 40,
            goal() {
                return new Decimal(1e3).pow(player[this.layer].levels[this.id]).max(10);
            },
            done() {
                return player.whitePigment.points.gte(tmp[this.layer].achievements[this.id].goal) && tmp[this.layer].achievements[this.id].style.opacity;
            },
            onComplete() {
                player[this.layer].levels[this.id] += 1;
                if (player[this.layer].levels[this.id] < tmp[this.layer].achievements[this.id].max) {
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(tmp[this.layer].achievements[this.id].max).mul(tmp.challenges.effect);
            },
        },

        51: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(Math.min(player[this.layer].levels[this.id], tmp[this.layer].achievements[this.id].max-1)/10)] + "<br>Grey<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, tmp[this.layer].achievements[this.id].max)%10)
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " grey pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% grey pigment.";
                    case tmp[this.layer].achievements[this.id].max:
                        return "MAXED\nReward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% grey pigment.";
                    default:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " grey pigment.\nCurrent Reward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% grey pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% grey pigment.";
                }
            },

            style() {
                return {opacity: (player.greyPigment.unlocked || player.debugOptions.showAll ? 1 : 0)};
            },

            max: 40,
            goal() {
                return new Decimal(1e3).pow(player[this.layer].levels[this.id]).max(10);
            },
            done() {
                return player.greyPigment.points.gte(tmp[this.layer].achievements[this.id].goal) && tmp[this.layer].achievements[this.id].style.opacity;
            },
            onComplete() {
                player[this.layer].levels[this.id] += 1;
                if (player[this.layer].levels[this.id] < tmp[this.layer].achievements[this.id].max) {
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(tmp[this.layer].achievements[this.id].max).mul(tmp.challenges.effect);
            },
        },
        /*52: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(Math.min(player[this.layer].levels[this.id], tmp[this.layer].achievements[this.id].max-1)/10)] + "<br>Pink<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, tmp[this.layer].achievements[this.id].max)%10)
            },
            tooltip() {
                switch (player[this.layer].levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " pink pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% pink pigment.";
                    case tmp[this.layer].achievements[this.id].max:
                        return "MAXED\nReward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% pink pigment.";
                    default:
                        return "Have " + formatWhole(tmp[this.layer].achievements[this.id].goal) + " pink pigment.\nCurrent Reward:\n+" + formatWhole(tmp[this.layer].achievements[this.id].effect) + "% pink pigment.\nNext Reward:\n+" + formatWhole(this.effect(1)) + "% pink pigment.";
                }
            },

            style() {
                return {opacity: (player.darkGreyPigment.unlocked || player.debugOptions.showAll ? 1 : 0)};
            },

            max: 40,
            goal() {
                return new Decimal(1e3).pow(player[this.layer].levels[this.id]).max(10);
            },
            done() {
                return player.pinkPigment.points.gte(tmp[this.layer].achievements[this.id].goal) && tmp[this.layer].achievements[this.id].style.opacity;
            },
            onComplete() {
                player[this.layer].levels[this.id] += 1;
                if (player[this.layer].levels[this.id] < tmp[this.layer].achievements[this.id].max) {
                    player[this.layer].achievements.pop();
                }
            },
            effect(delta = 0) {
                return new Decimal(player[this.layer].levels[this.id]+delta).min(tmp[this.layer].achievements[this.id].max).mul(tmp.challenges.effect);
            },
        },*/
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

            showPopups: true,
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
        ["display-text", "Challenge Completion Popups<br>Challenges without bonuses will never popup."],
        "blank",
        ["toggle", ["challenges", "showPopups"]],
    ],

    effect() {
        return new Decimal(player.challenges.achievements.length).add(1).log(10).add(1); 
    },

    achievementPopups: false,
    achievements: {
        rows() {
            let rows = 1;
            if (tmp.milestones) {
                if (tmp.milestones.achievements.row >= 2 || player.orangePigment.unlocked || player.greenPigment.unlocked || player.purplePigment.unlocked) rows ++;
                if (tmp.milestones.achievements.row >= 3 || player.blackPigment.unlocked || player.whitePigment.unlocked) rows ++;
                if (tmp.milestones.achievements.row >= 4 || player.greyPigment.unlocked || player.pinkPigment.unlocked) rows ++;
            }
            if (player.debugOptions.showAll) rows = 5;
            return rows;
        },
        cols: 5,

        11: {
            name: "Monochrome",
            tooltip() {
                let colour = (player.stats.firstPrimary ? player.stats.firstPrimary.charAt(0).toUpperCase() + player.stats.firstPrimary.slice(1).replace(/([A-Z])/g,' $1') : "First primary colour");
                return  "Dye a primary colour.\nReward:\n" + colour + " is permanently boosted by +10%.";
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

                if (player[this.layer].showPopups) {
                    updateTemp();
                    doPopup(
                        "",
                        tmp[this.layer].achievements[this.id].tooltip.split("\n")[2],
                        tmp[this.layer].achievements[this.id].name,
                        5,
                        "#DDD"
                    );
                }
            },
            effect: 1.1,
        },
        12: {
            name: "Dual<br>Primaries",
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
                let colour = (player.stats.firstSecondary ? player.stats.firstSecondary.charAt(0).toUpperCase() + player.stats.firstSecondary.slice(1).replace(/([A-Z])/g,' $1') : "First secondary colour")
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

                if (player[this.layer].showPopups) {
                    updateTemp();
                    doPopup(
                        "",
                        tmp[this.layer].achievements[this.id].tooltip.split("\n")[2],
                        tmp[this.layer].achievements[this.id].name,
                        5,
                        "#DDD"
                    );
                }
            },
            effect: 1.1,
        },
        15: {
            name: "The Colour<br><s>Wheel</s><br>Triangle",
            tooltip: "Unlock all six colours.",

            done() {
                return player.orangePigment.unlocked && player.greenPigment.unlocked && player.purplePigment.unlocked;
            },
        },

        21: {
            name: "Lines Are<br>Better Than<br>Triangles",
            tooltip: "Complete an Addition challenge.\nReward:\nAdd 1 to base blank pigment gain for each line of 3 layers shown.",

            style: {
                color: "#FD0",
            },

            done() {
                return hasChallenge("orangePigment", 11) || hasChallenge("greenPigment", 11) || hasChallenge("purplePigment", 11);
            },
            onComplete() {
                if (player[this.layer].showPopups) {
                    updateTemp();
                    doPopup(
                        "",
                        tmp[this.layer].achievements[this.id].tooltip.split("\n")[2],
                        tmp[this.layer].achievements[this.id].name,
                        5,
                        "#DDD"
                    );
                }
            },
            effect() {
                return tmp.orange.layerShown + tmp.green.layerShown + tmp.purple.layerShown + tmp.grey.layerShown + tmp.pink.layerShown;
            },
        },
        22: {
            name: "Ditching<br>Your Roots",
            tooltip: "Complete a Complementary challenge.\nReward:\nKeep unlock order and automatic gain upgrades when dying secondary pigments.",

            style: {
                color: "#FD0",
            },

            done() {
                return hasChallenge("orangePigment", 12) || hasChallenge("greenPigment", 12) || hasChallenge("purplePigment", 12);
            },
            onComplete() {
                if (player[this.layer].showPopups) {
                    updateTemp();
                    doPopup(
                        "",
                        tmp[this.layer].achievements[this.id].tooltip.split("\n")[2],
                        tmp[this.layer].achievements[this.id].name,
                        5,
                        "#DDD"
                    );
                }
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
                if (player[this.layer].showPopups) {
                    updateTemp();
                    doPopup(
                        "",
                        tmp[this.layer].achievements[this.id].tooltip.split("\n")[2],
                        tmp[this.layer].achievements[this.id].name,
                        5,
                        "#DDD"
                    );
                }
            },
        },
        25: {
            name: "You Call<br>That A<br>Challenge?",
            tooltip: "Complete six secondary challenges.",

            done() {
                return hasChallenge("orangePigment", 11) && hasChallenge("orangePigment", 12) && hasChallenge("greenPigment", 11) && hasChallenge("greenPigment", 12) && hasChallenge("purplePigment", 11) && hasChallenge("purplePigment", 12);
            },
        },

        31: {
            name: "Value",
            tooltip() {
                let colour = (player.stats.firstShade ? player.stats.firstShade.charAt(0).toUpperCase() + player.stats.firstShade.slice(1).replace(/([A-Z])/g,' $1') : "First shade");
                return  "Unlock black or white pigment.\nReward:\n" + colour + " is permanently boosted by +10%.";
            },

            style: {
                color: "#FD0",
            },

            done() {
                return player.blackPigment.unlocked || player.whitePigment.unlocked;
            },
            onComplete() {
                if (player.blackPigment.unlocked) player.stats.firstShade = "blackPigment";
                if (player.whitePigment.unlocked) player.stats.firstShade = "whitePigment";

                if (player[this.layer].showPopups) {
                    updateTemp();
                    doPopup(
                        "",
                        tmp[this.layer].achievements[this.id].tooltip.split("\n")[2],
                        tmp[this.layer].achievements[this.id].name,
                        5,
                        "#DDD"
                    );
                }
            },
            effect: 1.1,
        },
        32: {
            name() {
                switch(player.stats.firstShade) {
                    case "blackPigment":
                        return "Black Body<br>Radiator";
                    case "whitePigment":
                        return "White Body<br>Reflector";
                    default:
                        return "??? Body<br>???";
                };
            },
            tooltip() {
                let colour = (player.stats.firstShade == "blackPigment" ? "shades" : "tints");
                return "Have more coats of paint than " + colour + ".\nReward:\nAll primary and secondary pigments act as if they were bought first.";
            },

            style: {
                color: "#FD0",
            },

            done() {
                if (player.stats.firstShade == "") return false;
                return getBuyableAmount(player.stats.firstShade, 12).gt(getBuyableAmount(player.stats.firstShade, 11));
            },
            onComplete() {
                if (player[this.layer].showPopups) {
                    updateTemp();
                    doPopup(
                        "",
                        tmp[this.layer].achievements[this.id].tooltip.split("\n")[2],
                        tmp[this.layer].achievements[this.id].name,
                        5,
                        "#DDD"
                    );
                }
            },
        },
        33: {
            name: "1-Bit",
            tooltip: "Unlock black and white pigment.",

            done() {
                return player.blackPigment.unlocked && player.whitePigment.unlocked;
            },
        },
        34: {
            name: "Out of<br>Order<sup>2</sup>",
            tooltip() {
                let firstChallenge = (player.firstShade == "blackPigment" ? "Subtractive" : "Additive");
                return "Complete Anti-Favoritism before " + firstChallenge + ".\nReward:\nAbsorbed/Reflected light is generated based on best black/white pigment.";
            },

            style: {
                color: "#FD0",
            },

            done() {
                return (player.firstShade == "blackPigment" ? hasChallenge("whitePigment", 12) && !hasChallenge("whitePigment", 11) : hasChallenge("blackPigment", 12) && !hasChallenge("blackPigment", 11));
            },
            onComplete() {
                if (player[this.layer].showPopups) {
                    updateTemp();
                    doPopup(
                        "",
                        tmp[this.layer].achievements[this.id].tooltip.split("\n")[2],
                        tmp[this.layer].achievements[this.id].name,
                        5,
                        "#DDD"
                    );
                }
            },
        },
        35: {
            name: "Fresh<br>Paint",
            tooltip() {
                let shade1 = (player.firstShade == "blackPigment" ? "black" : "white");
                let shade2 = (player.firstShade == "blackPigment" ? "white" : "black");
                return "Have more coats of " + shade2 + " paint than " + shade1 + " paint.\nReward:\nBlack/White pigment buyables don't spend pigment/light.";
            },

            style: {
                color: "#FD0",
            },

            done() {
                return (player.firstShade == "blackPigment" ? getBuyableAmount("whitePigment", 12).gt(getBuyableAmount("blackPigment", 12)) : getBuyableAmount("blackPigment", 12).gt(getBuyableAmount("whitePigment", 12)));
            },
            onComplete() {
                if (player[this.layer].showPopups) {
                    updateTemp();
                    doPopup(
                        "",
                        tmp[this.layer].achievements[this.id].tooltip.split("\n")[2],
                        tmp[this.layer].achievements[this.id].name,
                        5,
                        "#DDD"
                    );
                }
            },
        },
        
        41: {
            name: "True Monochrome",
            tooltip: "Unlock grey pigment.",

            done() {
                return player.greyPigment.unlocked;
            },
        },
        42: {
            name: "How Come Light Red Gets An Exception?",
            tooltip: "Unlock pink pigment.",

            done() {
                return player.pinkPigment.unlocked;
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