var tmp = { "backdata": {}, "back": {}, "Invincible": {}, "config": {}, "tell": {} };
var conf = { "BACK开关": true, "保存/读取死亡记录": true, "每人最大存入数量": 5, "返回死亡点后无敌时间": 5, "返回死亡点所需经济": 0 };
var money;

function ST(pl, text) {
    pl.tell('§l§d[BACK] ' + text + '');
}

function tp(pl, x, y, z, dimid) {
    pl.teleport(new FloatPos(x, y, z, dimid));
    ST(pl, '§b传送到暴毙点成功');
}

function save() {
    file.writeTo('.\\plugins\\Timiya\\data\\deathlist.json', JSON.stringify(tmp["backdata"], null, 2));
}

function back(pl, hurtname) {
    var time = system.getTimeStr();
    if (tmp["backdata"][pl.realName] == null)
        tmp["backdata"][pl.realName] = [];
    tmp["backdata"][pl.realName].unshift({ "time": time, "x": JSON.parse(pl.pos.x.toFixed(1)), "y": JSON.parse(pl.pos.y.toFixed(1)), "z": JSON.parse(pl.pos.z.toFixed(1)), "dimid": pl.pos.dimid });
    if (tmp["backdata"][pl.realName].length > tmp["config"]["每人最大存入数量"] - 1) {
        var num = tmp["backdata"][pl.realName].length - tmp["config"]["每人最大存入数量"] + 1;
        for (var i = 1; i < num; i++) {
            tmp["backdata"][pl.realName].pop();
        }
    }
    if (tmp["config"]["保存/读取死亡记录"] == true)
        save();
    var dim;
    if (tmp["backdata"][pl.realName][0].dimid == 0)
        dim = "主世界";
    else if (tmp["backdata"][pl.realName][0].dimid == 1)
        dim = "地狱";
    else if (tmp["backdata"][pl.realName][0].dimid == 2)
        dim = "末地";
    if (tmp["config"]["BACK开关"] == true)
        tmp["tell"][pl.realName] = '§b你暴毙了,你的暴毙点:' + dim + ' ' + tmp["backdata"][pl.realName][0].x + ' ' + tmp["backdata"][pl.realName][0].y + ' ' + tmp["backdata"][pl.realName][0].z + ',时间:' + tmp["backdata"][pl.realName][0].time + ' 使用/back可返回死亡地点';
    else
        tmp["tell"][pl.realName] = '§b你暴毙了,你的暴毙点:' + dim + ' ' + tmp["backdata"][pl.realName][0].x + ' ' + tmp["backdata"][pl.realName][0].y + ' ' + tmp["backdata"][pl.realName][0].z + ',时间:' + tmp["backdata"][pl.realName][0].time + '';
}

function backto(pl, cmd) {
    var xmon = tmp["config"]["返回死亡点所需经济"];
    var mon;
    if (xmon != 0)
        mon = money('getmoney', pl.realName);
    if (tmp["backdata"][pl.realName] != null && JSON.stringify(tmp["backdata"]) != '[]') {
        var dim;
        if (tmp["backdata"][pl.realName][0].dimid == 0)
            dim = "主世界";
        else if (tmp["backdata"][pl.realName][0].dimid == 1)
            dim = "地狱";
        else if (tmp["backdata"][pl.realName][0].dimid == 2)
            dim = "末地";
        var info = '§l§b你最近的暴毙信息:' + dim + ' ' + tmp["backdata"][pl.realName][0].x + ' ' + tmp["backdata"][pl.realName][0].y + ' ' + tmp["backdata"][pl.realName][0].z + ',时间:' + tmp["backdata"][pl.realName][0].time + '';
        if (xmon != 0)
            info = '§l§b你最近的暴毙信息:' + dim + ' ' + tmp["backdata"][pl.realName][0].x + ' ' + tmp["backdata"][pl.realName][0].y + ' ' + tmp["backdata"][pl.realName][0].z + ',时间:' +tmp["backdata"][pl.realName][0].time + '\n§a返回死亡点需要§a ' + xmon + ' §f' + money('moneyname') + ',§a你还拥有 §e' + mon + ' §f' + money('moneyname') + ' §b确定要继续吗？'
        pl.sendModalForm('§l§dBACK', info, '前往暴毙点', '退出界面', function (pl, selected) {
            if (selected == 1) {
                var bool = true;
                if (xmon != 0) {
                    if (mon >= xmon && money('setmoney', pl.realName, (mon - xmon)))
                        bool = true;
                    else
                        bool = false;
                }
                if (bool) {
                    tp(pl, tmp["backdata"][pl.realName][0].x, tmp["backdata"][pl.realName][0].y, tmp["backdata"][pl.realName][0].z, tmp["backdata"][pl.realName][0].dimid);
                    tmp["Invincible"][pl.realName] = true;
                    setTimeout(function () {
                        delete tmp["Invincible"][pl.realName];
                    }, tmp["config"]["返回死亡点后无敌时间"] * 1000);
                } else
                    ST(pl, '§c暴毙点传送失败,请检查余额');
            } else if (selected == 0) {
                ST(pl, '§b已关闭表单');
            } else if (selected == null) {
                ST(pl, '§b已放弃表单');
            }
        })
    } else
        ST(pl, '§c无死亡记录');
}

function spawn(pl) {
    if (tmp["tell"][pl.realName] != null) {
        ST(pl, tmp["tell"][pl.realName]);
        delete tmp["tell"][pl.realName];
    }
}

function death(pl, cmd) {
    var newform = mc.newCustomForm();
    newform.setTitle("§l§dDEATHLIST");
    if (tmp["backdata"][pl.realName] == null)
        tmp["backdata"][pl.realName] = [];
    for (var i = 0; i < tmp["backdata"][pl.realName].length; i++) {
        var time = tmp["backdata"][pl.realName][i].time
        var dim;
        if (tmp["backdata"][pl.realName][i].dimid == 0)
            dim = "主世界";
        else if (tmp["backdata"][pl.realName][i].dimid == 1)
            dim = "地狱";
        else if (tmp["backdata"][pl.realName][i].dimid == 2)
            dim = "末地";
        var pos = dim + ' ' + tmp["backdata"][pl.realName][i]["x"] + ' ' + tmp["backdata"][pl.realName][i]["y"] + ' ' + tmp["backdata"][pl.realName][i]["z"];
        var info = '' + (i + 1) + '/' + tmp["config"]["每人最大存入数量"] + ': 地点:' + pos + ' 时间:' + time + '';
        newform.addLabel(info);
    }
    if (JSON.stringify(tmp["backdata"][pl.realName]) != '[]')
        pl.sendForm(newform, function () { });
    else
        ST(pl, '§b你没有死亡记录');
}

function hurt(mob, kill, Num) {
    var pl = mob.toPlayer();
    if (pl != null) {
        if (tmp["Invincible"][pl.realName] == true) {
            return false;
        }
    }
}

function read() {
    file.createDir('.\\plugins');
    file.createDir('.\\plugins\\Timiya');
    file.createDir('.\\plugins\\Timiya\\config');
    file.createDir('.\\plugins\\Timiya\\data');
    var co = file.readFrom('.\\plugins\\Timiya\\config\\back.json');
    if (co == null) {
        file.writeTo('.\\plugins\\Timiya\\config\\back.json', JSON.stringify(conf, null, 2));
        co = JSON.stringify(conf);
        log('[INFO][BACK] 已补全配置文件');
    }
    var exa = JSON.parse(co);
    tmp["config"]["BACK开关"] = exa["BACK开关"];
    tmp["config"]["保存/读取死亡记录"] = exa["保存/读取死亡记录"];
    tmp["config"]["每人最大存入数量"] = exa["每人最大存入数量"];
    tmp["config"]["返回死亡点后无敌时间"] = exa["返回死亡点后无敌时间"];
    if (exa["返回死亡点所需经济"] == null) {
        file.writeTo('.\\plugins\\Timiya\\config\\back.json', JSON.stringify(conf, null, 2));
        log('[INFO][BACK] "返回死亡点所需经济" 已自动补全置配置文件');
    } else
        tmp["config"]["返回死亡点所需经济"] = exa["返回死亡点所需经济"];
    log('[INFO][BACK] 配置文件已读取');
    if (tmp["config"]["保存/读取死亡记录"] == true) {
        var data = file.readFrom('.\\plugins\\Timiya\\data\\deathlist.json');
        if (data == null) {
            save();
            data = "{}"
            log('[INFO][BACK] 已补全数据文件');
        }
        tmp["backdata"] = JSON.parse(data);
        log('[INFO][BACK] 数据文件已读取');
    }
}

function load() {
    read();
    mc.listen("onPlayerDie", back);
    mc.listen("onMobHurt", hurt);
    mc.listen("onRespawn", spawn);
    if (tmp["config"].BACK开关 == true) {
        mc.regPlayerCmd('back', '回到上一次暴毙点', backto, 0);
        mc.regPlayerCmd('death', '查询死亡记录', death, 0);
    }
    setTimeout(function () {
        if (tmp["config"]["返回死亡点所需经济"] > 0) {
            money = lxl.import('MONEY');
            if (money('version') != null)
                log('[INFO][BACK] 检测到返回死亡点所需经济不为0,已自动导入Economic_core API');
            else {
                log('[INFO][BACK] 检测到返回死亡点所需经济不为0,导入Economic_core API失败!');
                log('[INFO][BACK] 自动将该变量设置为零...');
                tmp["config"]["返回死亡点所需经济"] = 0;
            }
        }
        log('[INFO] BACK LOADED! EDITION: 2.7');
    }, 6000)
}
load();