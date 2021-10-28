var tmp = { "tpa": {}, "tpaui": {}, "config": {} };
var conf = { "TPA(HERE)过期时间": 40, "TPA(HERE)成功消耗的经济": 0 };
var money;

function checkon(pl) {
    var ls = mc.getOnlinePlayers();
    for (var i in ls) {
        if (ls[i].realName == pl)
            return ls[i];
    }
    return null;
}

function ST(pl, text) {
    pl.tell("§l§d[TPA] " + text);
}

function DELTPA() {
    var NewTime = new Date().getTime();
    for (var i in tmp["tpa"]) {
        if (tmp["tpa"][i]["time"] != null) {
            var time = tmp["tpa"][i]["time"];
            var TimeDifference = NewTime - time;
            if (TimeDifference >= (tmp["config"]["TPA(HERE)过期时间"] * 1000)) {
                var pl = mc.getPlayer(tmp["tpa"][i]["xuid"]);
                var player = mc.getPlayer(tmp["tpa"][i]["plxuid"]);
                if (i.split('_')[0] == "TPA") {
                    ST(pl, "§c你发给玩家 §e" + player.realName + " §c的TPA请求已过期");
                    ST(player, "§c玩家 §e" + pl.realName + " §c发给你的TPA请求已过期");
                } else if (i.split('_')[0] == "TPAHERE") {
                    ST(pl, "§c你发给玩家 §e" + player.realName + " §c的TPAHERE请求已过期");
                    ST(player, "§c玩家 §e" + pl.realName + " §c发给你的TPAHERE请求已过期");
                }
                delete tmp["tpa"][i];
            }
        }
    }
}

function tpagui(pl, cmd) {
    if (cmd.length == 0) {
        var newform = mc.newCustomForm();
        newform.setTitle("TPAGUI");
        var pls = [];
        var ls = mc.getOnlinePlayers();
        for (var i in ls) {
            pls.push(ls[i].realName);
        }
        newform.addDropdown("§l§b请选择一个玩家", pls, 0);
        newform.addDropdown("§l§a请选择TPA类型", ["我传送过去", "TA传送过来"], 0);
        if (tmp["config"]["TPA(HERE)成功消耗的经济"] != 0)
            newform.addLabel('§l§b成功后消耗' + tmp["config"]["TPA(HERE)成功消耗的经济"] + '经济');
        pl.sendForm(newform, function (pl, selected) {
            if (selected == null)
                ST(pl, "§l§c表单已放弃");
            else {
                if (selected[1] == 0)
                    pl.runcmd('/tpa "' + pls[selected[0]] + '"');
                if (selected[1] == 1)
                    pl.runcmd('/tpahere "' + pls[selected[0]] + '"');
            }
        })
    } else
        ST(pl, "§c您输入的命令异常，请检查后再重试!");
}

function tpa(pl, cmd) {
    if (cmd.length == 1) {
        player = checkon(cmd[0].replace(/\"/g, ""));
        if (player == null)
            ST(pl, "§c没有找到玩家对象");
        else {
            if (tmp["tpa"]["TPA_" + player.realName] == null && tmp["tpa"]["TPAHERE_" + player.realName] == null && gettpa(player.xuid) == null) {
                if (gettpa(pl.xuid) == null) {
                    ST(player, "§b玩家 §e" + pl.realName + " §b向你发送了一个TPA请求,/tpaaccept同意请求,/tpadeny拒绝请求");
                    ST(pl, "§b你成功的向玩家 §e" + player.realName + " §b发起了TPA请求,/tpadeny取消请求");
                    if (tmp["tpaui"][player.realName] == null || tmp["tpaui"][player.realName] == true) {
                        var con = '§l§b玩家 §e' + pl.realName + ' §b向你发送了一个TPA请求\n请选择:';
                        if (tmp["config"]["TPA(HERE)成功消耗的经济"] != 0)
                            con = '§l§b玩家 §e' + pl.realName + ' §b向你发送了一个TPA请求\n(消耗对方' + tmp["config"]["TPA(HERE)成功消耗的经济"] + '经济)\n请选择:'
                        player.sendModalForm('§l§dTPA请求', con, '同意请求', '拒绝请求', function (pl2, selected) {
                            if (selected == true)
                                pl2.runcmd('/tpaccept');
                            else
                                pl2.runcmd('/tpadeny');
                        })
                    }
                    tmp["tpa"]["TPA_" + player.realName] = { "xuid": pl.xuid, "plxuid": player.xuid, "time": new Date().getTime() };
                } else
                    pl.sendModalForm('§l§d请求未处理', '§l§b你已经发起了一个TPA(HERE)请求,但是对方没有回应,请选择:', '放弃上一次请求并发起这一次请求', '继续等待', function (pl1, selected) {
                        if (selected == true) {
                            pl1.runcmd('/tpadeny');
                            pl1.runcmd('/tpa "' + player.realName + '"');
                        } else if (selected == false)
                            ST(pl1, '§b正在等待...');
                        else
                            ST(pl1, '§b已放弃表单');
                    });
            } else
                ST(pl, '§c对方有一个未处理的TPA(HERE)请求,无法发起请求');
        }
    } else if (cmd.length == 0)
        tpagui(pl, []);
    else
        ST(pl, "§c您输入的命令异常，请检查后重试");
}

function tpahere(pl, cmd) {
    if (cmd.length == 1) {
        var player = checkon(cmd[0].replace(/\"/g, ""));
        if (player == null) {
            ST(pl, "§c没有找到玩家对象");
        } else {
            if (tmp["tpa"]["TPA_" + player.realName] == null && tmp["tpa"]["TPAHERE_" + player.realName] == null && gettpa(player.xuid) == null) {
                if (gettpa(pl.xuid) == null) {
                    ST(player, "§b玩家 §e" + pl.realName + " §b向你发送了一个TPAHERE请求,/tpaaccept同意请求,/tpadeny拒绝请求");
                    ST(pl, "§b你成功的向玩家 §e" + player.realName + " §b发起了TPAHERE请求,/tpadeny取消请求");
                    if (tmp["tpaui"][player.realName] == null || tmp["tpaui"][player.realName] == true) {
                        var con = '§l§b玩家 §e' + pl.realName + ' §b向你发送了一个TPA请求\n请选择:';
                        if (tmp["config"]["TPA(HERE)成功消耗经济"] != 0)
                            con = '§l§b玩家 §e' + pl.realName + ' §b向你发送了一个TPAHERE请求\n(成功消耗对方(' + tmp["config"]["TPA(HERE)成功消耗的经济"] + ')\n请选择:';
                        player.sendModalForm('§l§dTPAHERE请求', '§l§b玩家 §e' + pl.realName + ' §b向你发送了一个TPAHERE请求\n请选择:', '同意请求', '拒绝请求', function (pl2, selected) {
                            if (selected == true)
                                pl2.runcmd('/tpaccept');
                            else
                                pl2.runcmd('/tpadeny');
                        })
                    }
                    tmp["tpa"]["TPAHERE_" + player.realName] = { "xuid": pl.xuid, "plxuid": player.xuid, "time": new Date().getTime() };
                } else
                    pl.sendModalForm('§l§d请求未处理', '§l§b你已经发起了一个TPA(HERE)请求,但是对方没有回应,请选择:', '放弃上一次请求并发起这一次请求', '继续等待', function (pl1, selected) {
                        if (selected == true) {
                            pl1.runcmd('/tpadeny');
                            pl1.runcmd('/tpahere "' + player.realName + '"');
                        } else if (selected == false)
                            ST(pl1, '§b正在等待...');
                        else
                            ST(pl1, '§b已放弃表单');
                    });
            } else
                ST(pl, '§c对方有一个未处理的TPA(HERE)请求,无法发起请求');
        }
    } else if (cmd.length == 0)
        tpagui(pl, []);
    else
        ST(pl, "§c您输入的命令异常，请检查后重试");
}

function tpac(pl, cmd) {
    if (cmd.length == 0) {
        if (tmp["tpa"]["TPA_" + pl.realName] != null) {
            var pl2 = mc.getPlayer(tmp["tpa"]["TPA_" + pl.realName].xuid);
            if (pl2 != null) {
                var pd = true;
                if (tmp["config"]["TPA(HERE)成功消耗的经济"] != 0) {
                    pd = false;
                    if (money('getmoney', pl2.realName) >= tmp["config"]["TPA(HERE)成功消耗的经济"] && money('setmoney', pl2.realName, (money('getmoney', pl2.realName) - tmp["config"]["TPA(HERE)成功消耗的经济"])))
                        pd = true;
                }
                if (pd) {
                    pl2.teleport(pl.pos);
                    ST(pl2, '§b玩家 §e' + pl.realName + ' §b接受了你的TPA请求');
                    ST(pl, '§b你接受了玩家 §e' + pl2.realName + ' §b的TPA请求');
                    delete tmp["tpa"]["TPA_" + pl.realName];
                } else {
                    ST(pl, '§cTPA失败,原因:对方经济不足');
                    ST(pl2, '§cTPA失败,请检查经济');
                }
            } else
                ST(pl, '§c玩家对象丢失');
        } else if (tmp["tpa"]["TPAHERE_" + pl.realName] != null) {
            var pl2 = mc.getPlayer(tmp["tpa"]["TPAHERE_" + pl.realName].xuid);
            if (pl2 != null) {
                var pd = true;
                if (tmp["config"]["TPA(HERE)成功消耗的经济"] != 0) {
                    pd = false;
                    if (money('getmoney', pl2.realName) >= tmp["config"]["TPA(HERE)成功消耗的经济"] && money('setmoney', pl2.realName, (money('getmoney', pl2.realName) - tmp["config"]["TPA(HERE)成功消耗的经济"])))
                        pd = true;
                }
                if (pd) {
                    pl.teleport(pl2.pos);
                    ST(pl2, '§b玩家 §e' + pl.realName + ' §b接受了你的TPAHERE请求');
                    ST(pl, '§b你接受了玩家 §e' + pl2.realName + ' §b的TPAHERE请求');
                    delete tmp["tpa"]["TPAHERE_" + pl.realName];
                } else {
                    ST(pl, '§cTPAHERE失败,原因:对方经济不足');
                    ST(pl2, '§cTPAHERE失败,请检查经济');
                }
            } else
                ST(pl, '§c玩家对象丢失');
        } else
            ST(pl, '§c您还没有待处理的TPA(HERE)请求');
    } else
        ST(pl, "§c您输入的命令异常，请检查后重试");
}

function tpad(pl, cmd) {
    if (cmd.length == 0) {
        if (tmp["tpa"]["TPA_" + pl.realName] != null) {
            var pl2 = mc.getPlayer(tmp["tpa"]["TPA_" + pl.realName].xuid);
            if (pl2 != null)
                ST(pl2, '§c玩家 §e' + pl.realName + ' §c拒绝了你的TPA请求');
            ST(pl, '§c你拒绝了玩家 §e' + pl2.realName + ' §c的TPA请求');
            delete tmp["tpa"]["TPA_" + pl.realName];
        } else if (tmp["tpa"]["TPAHERE_" + pl.realName] != null) {
            var pl2 = mc.getPlayer(tmp["tpa"]["TPAHERE_" + pl.realName].xuid);
            if (pl2 != null)
                ST(pl2, '§c玩家 §e' + pl.realName + ' §c拒绝了你的TPAHERE请求');
            ST(pl, '§c你拒绝了玩家 §e' + pl2.realName + ' §c的TPAHERE请求');
            delete tmp["tpa"]["TPAHERE_" + pl.realName];
        } else if (gettpa(pl.xuid) != null) {
            var checktpa = gettpa(pl.xuid);
            var pl2 = mc.getPlayer(tmp["tpa"][checktpa].plxuid);
            if (pl2 != null)
                ST(pl2, '§b对方取消了发给你的TPA(HERE)请求');
            ST(pl, '§b你已取消你发起的TPA(HERE)请求');
            delete tmp["tpa"][checktpa];
        } else
            ST(pl, '§c你没有待处理的TPA(HERE)请求');
    } else
        ST(pl, "§c您输入的命令异常，请检查后重试");
}

function tpaui(pl, cmd) {
    if (cmd.length == 0) {
        if (tmp["tpaui"][pl.realName] == null || tmp["tpaui"][pl.realName] == true) {
            tmp["tpaui"][pl.realName] = false;
            save();
            ST(pl, '§b请求UI已关闭');
        } else if (tmp["tpaui"][pl.realName] == false) {
            tmp["tpaui"][pl.realName] = true;
            save();
            ST(pl, '§b请求UI已开启');
        }
    }
}

function gettpa(xuid) {
    for (var i in tmp["tpa"]) {
        if (tmp["tpa"][i].xuid == xuid)
            return i;
    }
    return null;
}

function read() {
    file.createDir('.\\plugins\\Timiya\\config');
    var fil = file.readFrom('.\\plugins\\Timiya\\config\\tpa.json');
    if (fil == null) {
        file.writeTo('.\\plugins\\Timiya\\config\\tpa.json', JSON.stringify(conf, null, 2));
        fil = file.readFrom('.\\plugins\\Timiya\\config\\tpa.json');
        log('[INFO][TPA]第一次加载此插件,配置文件已生成');
    }
    var tesst = JSON.parse(fil);
    tmp["config"]["TPA(HERE)过期时间"] = tesst["TPA(HERE)过期时间"];
    if (tesst["TPA(HERE)成功消耗的经济"] == null) {
        tmp["config"]["TPA(HERE)成功消耗的经济"] = conf["TPA(HERE)成功消耗的经济"];
        file.writeTo('.\\plugins\\Timiya\\config\\tpa.json', JSON.stringify(tmp["config"], null, 2));
        tesst = JSON.parse(file.readFrom('.\\plugins\\Timiya\\config\\tpa.json'));
        log('[INFO][TPA]配置文件已补全');
    }
    tmp["config"]["TPA(HERE)成功消耗的经济"] = tesst["TPA(HERE)成功消耗的经济"];
    log('[INFO][TPA]配置文件读取成功');
    file.createDir('.\\plugins\\Timiya\\data');
    var tpadata = file.readFrom('.\\plugins\\Timiya\\data\\tpasetting.json');
    if (tpadata == null) {
        save();
        tpadata = '{}';
        log('[INFO][TPA]第一次加载此插件,数据文件已生成');
    }
    tmp["tpaui"] = JSON.parse(tpadata);
    log('[INFO][TPA]数据文件读取成功');
}

function save() {
    file.writeTo('.\\plugins\\Timiya\\data\\tpasetting.json', JSON.stringify(tmp["tpaui"], null, 2));
}

function left(pl) {
    var xuid = pl.xuid;
    var name = pl.realName;
    if (tmp["tpa"]["TPA_" + name] != null) {
        var pl2 = mc.getPlayer(tmp["tpa"]["TPA_" + name].xuid);
        ST(pl2, '§b你发给玩家 §e' + name + ' §b的TPA(HERE)请求因为对方退出游戏而被强制取消');
        delete tmp["tpa"]["TPA_" + name];
    } else if (tmp["tpa"]["TPAHERE_" + name] != null) {
        var pl2 = mc.getPlayer(tmp["tpa"]["TPAHERE_" + name].xuid);
        ST(pl2, '§b你发给玩家 §e' + name + ' §b的TPA(HERE)请求因为对方退出游戏而被强制取消');
        delete tmp["tpa"]["TPAHERE_" + name];
    } else if (gettpa(xuid) != null) {
        var checktpa = gettpa(xuid);
        var pl2 = mc.getPlayer(tmp["tpa"][checktpa].plxuid);
        ST(pl2, '§b玩家 §e' + name + ' §b发给你的TPA(HERE)请求因为TA退出游戏而被强制取消');
        delete tmp["tpa"][checktpa];
    }
}


function load() {
    read();
    mc.listen("onLeft", left);
    setTimeout(function () {
        if (tmp["config"]["TPA(HERE)成功消耗的经济"] != 0) {
            money = lxl.import('MONEY');
            if (money('version') != null || money('version') != undefined || money('version') != '')
                log('[INFO][TPA]Economic_core API导入成功');
            else {
                tmp["config"]["TPA(HERE)成功消耗的经济"] = 0;
                log('[INFO][TPA]Economic_core API失败,已自动将TPA(HERE)成功消耗的经济设置为0');
            }
        }
        mc.regPlayerCmd('tpa', `/tpa <input:playername> 向某人发起tpa请求(消耗${tmp["config"]["TPA(HERE)成功消耗的经济"]}经济)`, tpa, 0);
        mc.regPlayerCmd('tpa gui', `打开TPA总GUI(消耗${tmp["config"]["TPA(HERE)成功消耗的经济"]}经济)`, tpagui, 0);
        mc.regPlayerCmd('tpahere', `/tpahere <input:playername> 向某人发起TPAHERE请求(消耗${tmp["config"]["TPA(HERE)成功消耗的经济"]}经济)`, tpahere, 0);
        mc.regPlayerCmd('tpaccept', `同意某玩家的TPA(HERE)请求(消耗对方${tmp["config"]["TPA(HERE)成功消耗的经济"]}经济)`, tpac, 0);
        mc.regPlayerCmd('tpadeny', `拒绝某玩家的TPA(HERE)请求/取消自己的TPA(HERE)请求(消耗对方${tmp["config"]["TPA(HERE)成功消耗的经济"]}经济)`, tpad, 0);
        mc.regPlayerCmd('tpa ui', '开启或者关闭别人向你发tpa(here)所弹出的ui', tpaui, 0);
        setInterval(function () {
            DELTPA();
        }, 500)
        log('[INFO][TPA] TPA loaded! Edition: 3.9');
    }, 6000);
};
load();