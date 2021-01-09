addLayer("achievements", {
    symbol: "🏆",
    row: "side",
    resource: "achievements.",

    tooltip: "Achievements",

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
        for (let achievement in player.achievements.levels) {
            points += player.achievements.levels[achievement];
            total += layers.achievements.achievements[achievement].max;
        }
        player.achievements.points = points + "/" + total;
    },

    tabFormat: {
        "Achievements": {
            content: [
                "main-display",
                "achievements",
            ]
        }
    },

    achievements: {
        rows: 10,
        cols: 5,

        11: {
            name() {
                return "A Blank<br>Canvas<br>" + formatNumeral(Math.min(player.achievements.levels[this.id]+1, this.max))
            },
            tooltip() {
                switch (player.achievements.levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(this.goal()) + " blank pigment.\nNext Reward:\n+" + this.effect(1) + "% blank pigment.";
                    case this.max:
                        return "MAXED\nReward:\n+" + this.effect() + "% blank pigment.";
                    default:
                        return "Have " + formatWhole(this.goal()) + " blank pigment.\nCurrent Reward:\n+" + this.effect() + "% blank pigment.\nNext Reward:\n+" + this.effect(1) + "% blank pigment.";
                }
            },

            max: 30,
            goal() {
                return new Decimal(1e3).pow(player.achievements.levels[this.id]).max(10);
            },
            done() {
                return player.points.gte(this.goal());
            },
            onComplete() {
                if (player.achievements.levels[this.id] != this.max) {
                    player.achievements.levels[this.id] += 1;
                    player.achievements.achievements.pop();
                }
            },
            effect(delta = 0) {
                return Math.min(player.achievements.levels[this.id]+delta, this.max);
            },
        },
        12: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(player.achievements.levels[this.id]/10)] + "<br>Red<br>" + formatNumeral(Math.min(player.achievements.levels[this.id]+1, this.max)%10)
            },
            tooltip() {
                switch (player.achievements.levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(this.goal()) + " red pigment.\nNext Reward:\n+" + this.effect(1) + "% red pigment.";
                    case this.max:
                        return "MAXED\nReward:\n+" + this.effect() + "% red pigment.";
                    default:
                        return "Have " + formatWhole(this.goal()) + " red pigment.\nCurrent Reward:\n+" + this.effect() + "% red pigment.\nNext Reward:\n+" + this.effect(1) + "% red pigment.";
                }
            },

            max: 30,
            goal() {
                return new Decimal(1e3).pow(player.achievements.levels[this.id]).max(10);
            },
            done() {
                return player.redPigment.points.gte(this.goal());
            },
            onComplete() {
                if (player.achievements.levels[this.id] != this.max) {
                    player.achievements.levels[this.id] += 1;
                    player.achievements.achievements.pop();
                }
            },
            effect(delta = 0) {
                return Math.min(player.achievements.levels[this.id]+delta, this.max);
            },
        },
        13: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(player.achievements.levels[this.id]/10)] + "<br>Yellow<br>" + formatNumeral(Math.min(player.achievements.levels[this.id]+1, this.max)%10)
            },
            tooltip() {
                switch (player.achievements.levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(this.goal()) + " yellow pigment.\nNext Reward:\n+" + this.effect(1) + "% yellow pigment.";
                    case this.max:
                        return "MAXED\nReward:\n+" + this.effect() + "% yellow pigment.";
                    default:
                        return "Have " + formatWhole(this.goal()) + " yellow pigment.\nCurrent Reward:\n+" + this.effect() + "% yellow pigment.\nNext Reward:+\n" + this.effect(1) + "% yellow pigment.";
                }
            },

            max: 30,
            goal() {
                return new Decimal(1e3).pow(player.achievements.levels[this.id]).max(10);
            },
            done() {
                return player.yellowPigment.points.gte(this.goal());
            },
            onComplete() {
                if (player.achievements.levels[this.id] != this.max) {
                    player.achievements.levels[this.id] += 1;
                    player.achievements.achievements.pop();
                }
            },
            effect(delta = 0) {
                return Math.min(player.achievements.levels[this.id]+delta, this.max);
            },
        },
        14: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(player.achievements.levels[this.id]/10)] + "<br>Blue<br>" + formatNumeral(Math.min(player.achievements.levels[this.id]+1, this.max)%10)
            },
            tooltip() {
                switch (player.achievements.levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(this.goal()) + " blue pigment.\nNext Reward:\n+" + this.effect(1) + "% blue pigment.";
                    case this.max:
                        return "MAXED\nReward:\n+" + this.effect() + "% blue pigment.";
                    default:
                        return "Have " + formatWhole(this.goal()) + " blue pigment.\nCurrent Reward:\n+" + this.effect() + "% blue pigment.\nNext Reward:+\n" + this.effect(1) + "% blue pigment.";
                }
            },

            max: 30,
            goal() {
                return new Decimal(1e3).pow(player.achievements.levels[this.id]).max(10);
            },
            done() {
                return player.bluePigment.points.gte(this.goal());
            },
            onComplete() {
                if (player.achievements.levels[this.id] != this.max) {
                    player.achievements.levels[this.id] += 1;
                    player.achievements.achievements.pop();
                }
            },
            effect(delta = 0) {
                return Math.min(player.achievements.levels[this.id]+delta, this.max);
            },
        },
        15: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(player.achievements.levels[this.id]/10)] + "<br>Orange<br>" + formatNumeral(Math.min(player.achievements.levels[this.id]+1, this.max)%10)
            },
            tooltip() {
                switch (player.achievements.levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(this.goal()) + " orange pigment.\nNext Reward:\n+" + this.effect(1) + "% orange pigment.";
                    case this.max:
                        return "MAXED\nReward:\n+" + this.effect() + "% orange pigment.";
                    default:
                        return "Have " + formatWhole(this.goal()) + " orange pigment.\nCurrent Reward:\n+" + this.effect() + "% orange pigment.\nNext Reward:+\n" + this.effect(1) + "% orange pigment.";
                }
            },

            max: 30,
            goal() {
                return new Decimal(1e3).pow(player.achievements.levels[this.id]).max(10);
            },
            done() {
                return player.orangePigment.points.gte(this.goal());
            },
            onComplete() {
                if (player.achievements.levels[this.id] != this.max) {
                    player.achievements.levels[this.id] += 1;
                    player.achievements.achievements.pop();
                }
            },
            effect(delta = 0) {
                return Math.min(player.achievements.levels[this.id]+delta, this.max);
            },
        },
        21: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(player.achievements.levels[this.id]/10)] + "<br>Green<br>" + formatNumeral(Math.min(player.achievements.levels[this.id]+1, this.max)%10)
            },
            tooltip() {
                switch (player.achievements.levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(this.goal()) + " green pigment.\nNext Reward:\n+" + this.effect(1) + "% green pigment.";
                    case this.max:
                        return "MAXED\nReward:\n+" + this.effect() + "% green pigment.";
                    default:
                        return "Have " + formatWhole(this.goal()) + " green pigment.\nCurrent Reward:\n+" + this.effect() + "% green pigment.\nNext Reward:+\n" + this.effect(1) + "% green pigment.";
                }
            },

            max: 30,
            goal() {
                return new Decimal(1e3).pow(player.achievements.levels[this.id]).max(10);
            },
            done() {
                return player.greenPigment.points.gte(this.goal());
            },
            onComplete() {
                if (player.achievements.levels[this.id] != this.max) {
                    player.achievements.levels[this.id] += 1;
                    player.achievements.achievements.pop();
                }
            },
            effect(delta = 0) {
                return Math.min(player.achievements.levels[this.id]+delta, this.max);
            },
        },
        22: {
            name() {
                return ["Faded", "Static", "Bright", "Vibrant"][Math.floor(player.achievements.levels[this.id]/10)] + "<br>Purple<br>" + formatNumeral(Math.min(player.achievements.levels[this.id]+1, this.max)%10)
            },
            tooltip() {
                switch (player.achievements.levels[this.id]) {
                    case 0:
                        return "Have " + formatWhole(this.goal()) + " purple pigment.\nNext Reward:\n+" + this.effect(1) + "% purple pigment.";
                    case this.max:
                        return "MAXED\nReward:\n+" + this.effect() + "% purple pigment.";
                    default:
                        return "Have " + formatWhole(this.goal()) + " purple pigment.\nCurrent Reward:\n+" + this.effect() + "% purple pigment.\nNext Reward:+\n" + this.effect(1) + "% purple pigment.";
                }
            },

            max: 30,
            goal() {
                return new Decimal(1e3).pow(player.achievements.levels[this.id]).max(10);
            },
            done() {
                return player.purplePigment.points.gte(this.goal());
            },
            onComplete() {
                if (player.achievements.levels[this.id] != this.max) {
                    player.achievements.levels[this.id] += 1;
                    player.achievements.achievements.pop();
                }
            },
            effect(delta = 0) {
                return Math.min(player.achievements.levels[this.id]+delta, this.max);
            },
        },
    },
});