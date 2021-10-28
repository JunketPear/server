function healths() {
    try {
        var list = mc.getOnlinePlayers();
        for (var i in list) {
            var pl = list[i];
            if (pl.getScore('syhealth') != pl.health) {
                mc.runcmd('scoreboard objectives setdisplay belowname');
                pl.setScore('syhealth', pl.health);
                setTimeout("mc.runcmd('scoreboard objectives setdisplay belowname syhealth');", 100);
            }
        }
    } catch (_) { }
};

mc.listen("onServerStarted", function () {
    setTimeout(function () {
        mc.removeScoreObjective('syheath');
        mc.newScoreObjective('syhealth', '§l§chealth');
        setInterval(() => {
            healths();
        }, 500);
    }, 4000)
});

mc.listen("onConsoleOutput", function (put) {
    if (put.search('belowname') != -1)
        return false;
})