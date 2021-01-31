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

    tabFormat: {
        Milestones: {
            embedLayer: "milestones",
        },
        Challenges: {
            embedLayer: "challenges",
        },
        Secrets: {
            embedLayer: "secrets",
            unlocked() {
                return layerShown("secrets");
            }  
        },
    },
});

addLayer("milestones", {
    resource: "milestones.",

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
        ["toggle", ["milestones", "showPopups"]],
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

    achievementPopups() {
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

            max: 50,
            goal() {
                return calcAchievementGoal(player[this.layer].levels[this.id]);
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
                return "Vibrant<br>Red<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, tmp[this.layer].achievements[this.id].max))
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

            max: 50,
            goal() {
                return calcAchievementGoal(player[this.layer].levels[this.id]);
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
                return "Vibrant<br>Yellow<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, tmp[this.layer].achievements[this.id].max))
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

            max: 50,
            goal() {
                return calcAchievementGoal(player[this.layer].levels[this.id]);
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
                return "Vibrant<br>Blue<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, tmp[this.layer].achievements[this.id].max))
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

            max: 50,
            goal() {
                return calcAchievementGoal(player[this.layer].levels[this.id]);
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
                return "Vibrant<br>Orange<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, tmp[this.layer].achievements[this.id].max))
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

            max: 50,
            goal() {
                return calcAchievementGoal(player[this.layer].levels[this.id]);
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
                return "Vibrant<br>Green<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, tmp[this.layer].achievements[this.id].max))
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

            max: 50,
            goal() {
                return calcAchievementGoal(player[this.layer].levels[this.id]);
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
                return "Vibrant<br>Purple<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, tmp[this.layer].achievements[this.id].max))
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

            max: 50,
            goal() {
                return calcAchievementGoal(player[this.layer].levels[this.id]);
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
                return "Vibrant<br>Black<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, tmp[this.layer].achievements[this.id].max))
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

            max: 50,
            goal() {
                return calcAchievementGoal(player[this.layer].levels[this.id]);
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

            max: 50,
            goal() {
                return calcAchievementGoal(player[this.layer].levels[this.id]);
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

            max: 50,
            goal() {
                return calcAchievementGoal(player[this.layer].levels[this.id]);
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
                return "Vibrant<br>White<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, tmp[this.layer].achievements[this.id].max))
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

            max: 50,
            goal() {
                return calcAchievementGoal(player[this.layer].levels[this.id]);
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
                return "Vibrant<br>Grey<br>" + formatNumeral(Math.min(player[this.layer].levels[this.id]+1, tmp[this.layer].achievements[this.id].max))
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

            max: 50,
            goal() {
                return calcAchievementGoal(player[this.layer].levels[this.id]);
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
    },
});

addLayer("challenges", {
    resource: "achievements",

    shouldNotify() {
        if (player.tab == "achievements" && player.subtabs.achievements.mainTabs == "Challenges") player[this.layer].shouldNotify = false;
        return player[this.layer].shouldNotify;
    },

    effectDescription() {
        return "<br>boosting all milestone achievement effects by x" + format(tmp[this.layer].effect) + ".";
    },

    startData() {
        return {
            points: "",

            shouldNotify: false,
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
            if (tmp.challenges) {
                if (tmp.challenges.achievements.row >= 2 || player.orangePigment.unlocked || player.greenPigment.unlocked || player.purplePigment.unlocked || includesAny(player.challenges.achievements, [21, 22, 23, 24, 25])) rows ++;
                if (tmp.challenges.achievements.row >= 3 || player.blackPigment.unlocked || player.whitePigment.unlocked || includesAny(player.challenges.achievements, [31, 32, 33, 34, 35])) rows ++;
                if (tmp.challenges.achievements.row >= 4 || player.greyPigment.unlocked || includesAny(player.challenges.achievements, [41, 42, 43, 44, 45])) rows ++;
            }
            if (player.debugOptions.showAll) rows = 5;
            if (typeof tmp.challenges.achievements.rows == "number" && rows != tmp.challenges.achievements.rows) player.challenges.shouldNotify = true;
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
                        
                        tmp[this.layer].achievements[this.id].name.replaceAll(/<[^>]*>/g, " "),
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
                        
                        tmp[this.layer].achievements[this.id].name.replaceAll(/<[^>]*>/g, " "),
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
            tooltip: "Complete an Subtractive challenge.\nReward:\nAdd 1 to base blank pigment gain for each line of 3 layers shown.",

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
                        
                        tmp[this.layer].achievements[this.id].name.replaceAll(/<[^>]*>/g, " "),
                        5,
                        "#DDD"
                    );
                }
            },
            effect() {
                return tmp.orange.layerShown + tmp.green.layerShown + tmp.purple.layerShown + tmp.grey.layerShown;
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
                        
                        tmp[this.layer].achievements[this.id].name.replaceAll(/<[^>]*>/g, " "),
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
            tooltip: "Complete a Complementary challenge before an Subtractive challenge.\nReward:\nSecondary pigments are now based on total primary pigments.",

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
                        
                        tmp[this.layer].achievements[this.id].name.replaceAll(/<[^>]*>/g, " "),
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
                        
                        tmp[this.layer].achievements[this.id].name.replaceAll(/<[^>]*>/g, " "),
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
                return "Have more coats of paint than " + colour + ".\nReward:\nAll primary and secondary pigments act as if they were bought first and keep primary pigment unlock order upgrades on all resets.";
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
                        
                        tmp[this.layer].achievements[this.id].name.replaceAll(/<[^>]*>/g, " "),
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
            name: "Out of<br>Order 2",
            tooltip() {
                let firstChallenge = (player.firstShade == "blackPigment" ? "Additive" : "Subtractive");
                return "Complete Anti-Favoritism before " + firstChallenge + ".\nReward:\nAbsorbed/Reflected light is generated based on best black/white pigment.";
            },

            style: {
                color: "#FD0",
            },

            done() {
                return (player.stats.firstShade == "blackPigment" ? hasChallenge("whitePigment", 13) && !hasChallenge("whitePigment", 11) : hasChallenge("blackPigment", 13) && !hasChallenge("blackPigment", 11));
            },
            onComplete() {
                if (player[this.layer].showPopups) {
                    updateTemp();
                    doPopup(
                        "",
                        tmp[this.layer].achievements[this.id].tooltip.split("\n")[2],
                        
                        tmp[this.layer].achievements[this.id].name.replaceAll(/<[^>]*>/g, " "),
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
                        
                        tmp[this.layer].achievements[this.id].name.replaceAll(/<[^>]*>/g, " "),
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
            name: "Min-Maxing",
            tooltip: "Create the darkest and lightest shades of grey.\nReward:\nKeep all colour upgrades and challenge completions when dying any pigment. Also keep black and white pigment challenge completions.",

            style: {
                color: "#FD0",
            },

            done() {
                return player.greyPigment.maxed && player.greyPigment.minned;
            },
            onComplete() {
                if (player[this.layer].showPopups) {
                    updateTemp();
                    doPopup(
                        "",
                        tmp[this.layer].achievements[this.id].tooltip.split("\n")[2],
                        
                        tmp[this.layer].achievements[this.id].name.replaceAll(/<[^>]*>/g, " "),
                        5,
                        "#DDD"
                    );
                }
            },
        },
        43: {
            name: "50 Tones<br>of Grey",
            tooltip: "Discover 50 different tones.\nReward:\nAutomatically purchase grey pigment buyables.",

            style: {
                color: "#FD0",
            },

            done() {
                return getBuyableAmount("greyPigment", 11).gte(50);
            },
            onComplete() {
                if (player[this.layer].showPopups) {
                    updateTemp();
                    doPopup(
                        "",
                        tmp[this.layer].achievements[this.id].tooltip.split("\n")[2],
                        
                        tmp[this.layer].achievements[this.id].name.replaceAll(/<[^>]*>/g, " "),
                        5,
                        "#DDD"
                    );
                }
            },
        },
        44: {
            name: "Coming Back For More",
            tooltip: "Reach 1,000 blank pigment with only a single layer visible.\nReward:\nGrey pigment buyables don't spend pigment.",

            style: {
                color: "#FD0",
            },

            done() {
                return nLayersShown() == 1 && player.points.gte(1000);
            },
            onComplete() {
                if (player[this.layer].showPopups) {
                    updateTemp();
                    doPopup(
                        "",
                        tmp[this.layer].achievements[this.id].tooltip.split("\n")[2],
                        
                        tmp[this.layer].achievements[this.id].name.replaceAll(/<[^>]*>/g, " "),
                        5,
                        "#DDD"
                    );
                }
            },
        },
        45: {
            name: "Coming Back For More 2",
            tooltip: "Reach 1,000,000 blank pigment while in 3 challenges.\nReward:\nLose the ability to dye, but gain 10% of grey pigment gain per second.",

            style: {
                color: "#FD0",
            },

            done() {
                return inNChallenges() == 3 && player.points.gte(1000000);
            },
            onComplete() {
                if (player[this.layer].showPopups) {
                    updateTemp();
                    doPopup(
                        "",
                        tmp[this.layer].achievements[this.id].tooltip.split("\n")[2],
                        
                        tmp[this.layer].achievements[this.id].name.replaceAll(/<[^>]*>/g, " "),
                        5,
                        "#DDD"
                    );
                }
            },
        },
    },
});

addLayer("secrets", {
    layerShown() {
        return player.secrets.achievements.length > 0;
    },

    shouldNotify() {
        if (player.tab == "achievements" && player.subtabs.achievements.mainTabs == "Secrets") player[this.layer].shouldNotify = false;
        return player[this.layer].shouldNotify;
    },

    startData() {
        return {
            pinkClicked: false,
            funnyNumber: false,
            multipleVersions: false,

            shouldNotify: false,
            showPopups: true,
        };
    },

    tabFormat: [
        "achievements",
    ],

    achievementPopups() {
        return player[this.layer].showPopups;
    },
    achievements: {
        rows: 5,
        cols: 5,

        11: {
            name: "The Long<br>Haul",
            tooltip: "Play multiple major versions of The Colour Tree.",

            style() {
                return (hasAchievement(this.layer, this.id) ? "" : {opacity: 0});
            },

            done() {
                return player.secrets.multipleVersions;
            },
            onComplete() {
                player[this.layer].shouldNotify = true;
            },
        },
        12: {
            style: {
                opacity: 0,
            },

            done() {
                return false;
            },
        },
        13: {
            name: "Ha Ha<br>Comedy",
            tooltip: "Import a funny number.",

            style() {
                return (hasAchievement(this.layer, this.id) ? "" : {opacity: 0});
            },

            done() {
                return player.secrets.funnyNumber;
            },
            onComplete() {
                player[this.layer].shouldNotify = true;
            },
        },
        14: {
            style: {
                opacity: 0,
            },

            done() {
                return false;
            },
        },
        15: {
            style: {
                opacity: 0,
            },

            done() {
                return false;
            },
        },

        21: {
            style: {
                opacity: 0,
            },

            done() {
                return false;
            },
        },
        22: {
            style: {
                opacity: 0,
            },

            done() {
                return false;
            },
        },
        23: {
            style: {
                opacity: 0,
            },

            done() {
                return false;
            },
        },
        24: {
            style: {
                opacity: 0,
            },

            done() {
                return false;
            },
        },
        25: {
            name: "Completely<br>Out of<br>Order",
            tooltip: "Unlock an achievement before it is visible.",

            style() {
                return (hasAchievement(this.layer, this.id) ? "" : {opacity: 0});
            },

            done() {
                let maxID = tmp.challenges.achievements.rows * 10 + 9;

                return (max(player.challenges.achievements) > maxID);
            },
            onComplete() {
                player[this.layer].shouldNotify = true;
            },
        },

        31: {
            style: {
                opacity: 0,
            },

            done() {
                return false;
            },
        },
        32: {
            style: {
                opacity: 0,
            },

            done() {
                return false;
            },
        },
        33: {
            style: {
                opacity: 0,
            },

            done() {
                return false;
            },
        },
        34: {
            style: {
                opacity: 0,
            },

            done() {
                return false;
            },
        },
        35: {
            style: {
                opacity: 0,
            },

            done() {
                return false;
            },
        },

        41: {
            style: {
                opacity: 0,
            },

            done() {
                return false;
            },
        },
        42: {
            name: "Hidden Colour",
            tooltip: "Attempt to find the colour pink.",

            style() {
                return (hasAchievement(this.layer, this.id) ? "" : {opacity: 0});
            },

            done() {
                return player[this.layer].pinkClicked;
            },
            onComplete() {
                player[this.layer].shouldNotify = true;
            },
        },
        43: {
            style: {
                opacity: 0,
            },

            done() {
                return false;
            },
        },
        44: {
            style: {
                opacity: 0,
            },

            done() {
                return false;
            },
        },
        45: {
            style: {
                opacity: 0,
            },

            done() {
                return false;
            },
        },

        51: {
            style: {
                opacity: 0,
            },

            done() {
                return false;
            },
        },
        52: {
            style: {
                opacity: 0,
            },

            done() {
                return false;
            },
        },
        53: {
            name: "Blind<br>Luck",
            tooltip: "Be lucky.",

            style() {
                return (hasAchievement(this.layer, this.id) ? "" : {opacity: 0});
            },

            done() {
                return Math.floor(Math.random()*1000000) == 0;
            },
            onComplete() {
                player[this.layer].shouldNotify = true;
            },
        },
        54: {
            style: {
                opacity: 0,
            },

            done() {
                return false;
            },
        },
        55: {
            style: {
                opacity: 0,
            },

            done() {
                return false;
            },
        },
    }
});

addLayer("help", {
    symbol: "❔",
    row: "side",
    
    tooltip: "Help",

    layerShown: true,

    startData() {
        return {
            showAll: false,
        };
    },

    tabFormat: [
        ["display-text", "<h1><u>Help</u></h1>"],
        "blank",
        ["display-text", "Show Spoilers?"],
        "blank",
        ["toggle", ["help", "showAll"]],
        "blank",
        ["infobox", "resets"],
        "blank",
    ],

    infoboxes: {
        resets: {
            title: "Resets",
            body() {
                ret = "<br>By default the resulting amount is based on the minimum of the pigment used to make it.<br>";

                if (player.orangePigment.unlocked || player.help.showAll) ret += "Orange pigment resets red and yellow pigment.<br>";
                if (player.greenPigment.unlocked || player.help.showAll) ret += "Green pigment resets yellow and blue pigment.<br>";
                if (player.purplePigment.unlocked || player.help.showAll) ret += "Purple pigment resets red and blue pigment.<br><br>";
    
                if (player.blackPigment.unlocked || player.help.showAll) ret += "Black pigment resets coloured pigment.<br>";
                if (player.whitePigment.unlocked || player.help.showAll) ret += "White pigment resets coloured pigment.<br><br>";
    
                if (player.greyPigment.unlocked || player.help.showAll) ret += "Grey pigment resets black, white, and coloured pigment.<br><br>";
    
                return ret;
            },
            unlocked() {
                return player.orangePigment.unlocked || player.greenPigment.unlocked || player.purplePigment.unlocked || player.help.showAll;
            }
        },
    }
});

addLayer("statistics", {
    symbol: "📊",
    row: "side",
    
    tooltip: "Statistics",

    layerShown: true,

    startData() {
        return {
            activeLayer: "none",
        };
    },
    activeLayer() {
        if (document.getElementById("selectLayer")) player[this.layer].activeLayer = document.getElementById("selectLayer").value;
    },

    createDropDownMenu() {
        let ret = "<select id=selectLayer>";
        for (let LAYER of ["none"].concat(LAYERS)) {
            if (["info-tab", "options-tab", "changelog-tab", "blank", "tree-tab", "achievements", "milestones", "challenges", "secrets", "help", "statistics", "debug", "debugLayers", "debugOptions", "red", "yellow", "blue", "orange", "green", "purple", "black", "white", "grey", "pink"].includes(LAYER)) continue;
            if (LAYER != "none" && !player[LAYER].unlocked) continue;
            let selected = (LAYER == player[this.layer].activeLayer ? "selected='selected'" : "");
            ret += "<option value=" + LAYER + " " + selected + ">" + LAYER.charAt(0).toUpperCase() + LAYER.slice(1).replace(/([A-Z])/g,' $1') + "</option>";
        }
        ret += "</select>";
        return ret;
    },
    attributeViewer() {
        let ret = "<h2>Attributes</h2><br><br>";
        let tableData = {};

        let layer = player[this.layer].activeLayer;

        if (layer == "none") return "<h2>Select A Layer</h2>";

        for (let attribute in player[layer]) {
            if (["achievements", "buyables", "challenges", "clickables", "milestones", "upgrades", "levels", "unlocked", "requiresExponent", "resetTime", "spentOnBuyables", "activeChallenge"].includes(attribute)) continue;

            let name = attribute.charAt(0).toUpperCase() + attribute.slice(1).replace(/([A-Z])/g,' $1');

            tableData[name] = player[layer][attribute];
        }

        ret += formatTable(tableData, {
            headings: ["Attribute", "Value"],
        }); 

        return ret;
    },

    tabFormat: {
        "Misc Stats": {
            content: [
                ["display-text", function() {
                    let ret = "";
        
                    ret += "You started playing " + formatTime(Math.floor((Date.now()-player.stats.startTick)/1000)).slice(0, -4) + "s ago.<br>";
                    ret += "You have " + formatTime(Math.floor(player.timePlayed)).slice(0, -4) + "s of play time.<br><br>";
                    
                    ret += "You have reset " + formatWhole(player.stats.resets) + " time" + (player.stats.resets != 1 ? "s" : "") + ".<br>";
                    ret += "You have bought " + formatWhole(player.stats.upgradesBought) + " upgrade" + (player.stats.upgradesBought != 1 ? "s" : "") + ".<br>";
                    ret += "You have completed " + formatWhole(player.stats.challengesCompleted) + " challenge" + (player.stats.challengesCompleted != 1 ? "s" : "") + ".<br>";
                    ret += "You have bought " + formatWhole(player.stats.buyablesBought) + " buyable" + (player.stats.buyablesBought != 1 ? "s" : "") + ".<br>";
        
                    return ret;
                }],
            ],
        },
        "Layer Stats": {
            content: [
                ["display-text", function() {
                    return tmp.statistics.createDropDownMenu;
                }],
                "blank",
                ["display-text", function() {
                    return tmp.statistics.attributeViewer;
                }],
            ]
        },
    },
});

addNode("pink", {
    x() {
        let ret = 1;
        return ret;
    },
    y() {
        let ret = 0;
        return ret;
    },
    nodeStyle() {
        return {
            position: "absolute",
            left: "calc((50% - 240px) + " + 120*tmp[this.layer].x + "px)",
            top: "calc(180px + " + 120*tmp[this.layer].y + "px)",
            opacity: 0,
            cursor: "default",
        };
    },
    
    onClick() {
        if (layerShown("white") && layerShown("red")) player.secrets.pinkClicked = true;
    }
})