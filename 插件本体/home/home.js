var money;
var tmp = { "homedata": {}, "home": {}, "config": null };
var conf = { "HOME开关": true, "最大家数量": 5, "回家所需经济": 0, "创建家所需经济": 0, "删除家回退经济": 0 };

function ST(pl, text) {
    pl.tell("§l§d[HOME] " + text + "");
}

function tp(pl, x, y, z, dimid, home) {
    pl.teleport(new FloatPos(x, y, z, dimid));
    ST(pl, '§b传送到家("' + home + '")成功');
};

function homego(pl, cmd) {
    if (cmd.length == 1) {
        var home = cmd[0].replace(/\"/g, "");
        var xmon = tmp["config"]["回家所需经济"];
        var mon;
        if (xmon != 0)
            mon = money('getmoney', pl.realName);
        if (home == '')
            ST(pl, '§b请输入至少一个字符');
        else if (tmp["homedata"][pl.realName][home] == null)
            ST(pl, '§b你目前还没有这个名字的家');
        else {
            var jieg = true;
            if (xmon != 0) {
                if (mon >= xmon && money('setmoney', pl.realName, (mon - xmon)))
                    jieg = true;
                else
                    jieg = false;
            }
            if (jieg)
                tp(pl, tmp["homedata"][pl.realName][home]['x'], tmp["homedata"][pl.realName][home]['y'], tmp["homedata"][pl.realName][home]['z'], tmp["homedata"][pl.realName][home]['dimid'], home);
            else
                ST(pl, '§c传送失败,请检查经济');
        }
    } else
        ST(pl, "§c命令输入有误,请检查后重试");
}

function homeadd(pl, cmd) {
    if (cmd.length == 1) {
        var home = cmd[0].replace(/\"/g, "");
        var xmon = tmp["config"]["创建家所需经济"];
        var mon;
        if (xmon != 0)
            mon = money('getmoney', pl.realName);
        if (home == '')
            ST(pl, '§b请输入至少一个字符');
        else {
            var homelist = [];
            for (var i in tmp["homedata"][pl.realName]) {
                homelist.push(i);
            };
            if (tmp["homedata"][pl.realName] == null)
                tmp["homedata"][pl.realName] = {};
            if (tmp["homedata"][pl.realName][home] != null) {
                ST(pl, '§c你已经有这个家了,不能重复添加相同名字的家');
            } else if (tmp["config"]["最大家数量"] > homelist.length) {
                var jie = true;
                if (xmon != 0) {
                    if (mon >= xmon && money('setmoney', pl.realName, (mon - xmon)))
                        jie = true;
                    else
                        jie = false;
                }
                if (jie) {
                    tmp["homedata"][pl.realName][home] = { "x": JSON.parse(pl.pos.x.toFixed(1)), "y": JSON.parse(pl.pos.y.toFixed(1)), "z": JSON.parse(pl.pos.z.toFixed(1)), "dimid": pl.pos.dimid };
                    save();
                    ST(pl, '§b添加家("' + home + '")成功');
                } else
                    ST(pl, '§c添加失败,请检查经济');
            } else {
                ST(pl, '§c添加失败,您的家数量满 ' + tmp["config"]["最大家数量"] + ' 个了!');
            }
        }
    } else
        ST(pl, "§c命令输入有误，请检查后重试");
}

function homedel(pl, cmd) {
    if (cmd.length == 1) {
        var home = cmd[0].replace(/\"/g, "");
        var xmon = tmp["config"]["删除家回退经济"];
        var mon;
        if (xmon != 0)
            mon = money('getmoney', pl.realName);
        if (home == '')
            ST(pl, '§b请输入至少一个字符');
        else {
            var pd = false;
            for (var i in tmp["homedata"][pl.realName]) {
                if (i == home) {
                    pd = true;
                    break;
                }
            }
            if (tmp["homedata"][pl.realName] == null)
                ST(pl, '§c您还没有添加家');
            else if (pd) {
                var jie = true;
                if (xmon != 0) {
                    if (money('setmoney', pl.realName, (mon + xmon)))
                        jie = true;
                    else
                        jie = false;
                }
                if (jie) {
                    delete tmp["homedata"][pl.realName][home];
                    save();
                    ST(pl, '§b已成功删除家("' + home + '")');
                } else
                    ST(pl, '§c删除家失败,原因未知');
            } else
                ST(pl, '§c家("' + home + '")不存在');
        }
    }
}

function homels(pl, cmd) {
    if (cmd.length == 0) {
        var homelist1;
        for (var i in tmp["homedata"][pl.realName]) {
            if (homelist1 == null) {
                homelist1 = '"' + i + '"';
            } else {
                var homelist1 = homelist1 + "," + '"' + i + '"';
            }
        }
        if (homelist1 == undefined)
            ST(pl, '§c您还没有添加任何家');
        else
            ST(pl, '§a你现在拥有家: ' + homelist1 + '');
    } else
        ST(pl, '§c您输入的命令有误,请检查后重新输入');
}

function homegui(pl, cmd) {
    if (cmd.length == 0) {
        pl.sendSimpleForm('§l§dHOME', '§l§b表单选项如下,请选择一个', ["§l§b添加家", "§l§a前往家", "§l§c删除家"], ["", "", ""], function (pl, selected) {
            if (selected == 0) {
                var newform = mc.newCustomForm();
                newform.setTitle("§l§dHOMEADD");
                var tit = "§l§b输入你要创建的家名字:";
                if (tmp["config"]["创建家所需经济"] != 0)
                    tit = `§l§b输入你要创建家的名字\n§a此过程需要消耗 §e${tmp["config"]["创建家所需经济"]} §f${money('moneyname')} §a您还剩余: §e${money('getmoney', pl.realName)} §f${money('moneyname')}`;
                newform.addInput(tit, "home", "");
                pl.sendForm(newform, function (pl1, selected1) {
                    if (selected1 != null)
                        pl1.runcmd('/home add "' + selected1[0] + '"');
                    else
                        ST(pl1, '§b表单已放弃');
                });
            } else if (selected == 1) {
                var homelist = [];
                var image = [];
                for (var i in tmp["homedata"][pl.realName]) {
                    homelist.push(i);
                    image.push("");
                }
                if (JSON.stringify(homelist) == '[]') {
                    ST(pl, '§c您当前没有添加任何家');
                } else {
                    var sonc = '§l§b表单选项如下,请选择一个:';
                    if (tmp["config"]["回家所需经济"] != 0)
                        sonc = `§l§b表单选项如下,请选择一个\n§a此过程需要消耗 §e${tmp["config"]["回家所需经济"]} §f${money('moneyname')} §a您还剩余 §e${money('getmoney', pl.realName)} §f${money('moneyname')}`;
                    pl.sendSimpleForm('§l§dHOMEGO', sonc, homelist, image, function (pl1, selected1) {
                        if (selected1 != null)
                            pl1.runcmd('/home go "' + homelist[selected1] + '"');
                        else
                            ST(pl1, '§b表单已放弃');
                    })
                }
            } else if (selected == 2) {
                var newform = mc.newCustomForm();
                newform.setTitle("§l§dHOMEDEL");
                var homelist = [];
                for (var i in tmp["homedata"][pl.realName]) {
                    homelist.push(i);
                }
                var titl = "§l§c选择一个家进行删除";
                if (tmp["config"]["删除家回退经济"] != 0)
                    titl = `§l§c选择一个家进行删除\n§a此过程可以回退 §e${tmp["config"]["删除家回退经济"]} §f${money('moneyname')} §a您还剩余: §e${money('getmoney', pl.realName)} §f${money('moneyname')}`
                newform.addDropdown(titl, homelist, 0);
                if (JSON.stringify(homelist) != '[]') {
                    pl.sendForm(newform, function (pl1, selected1) {
                        if (selected1 != null)
                            pl1.runcmd('/home del "' + homelist[selected1[0]] + '"');
                        else
                            ST(pl1, '§b表单已放弃');
                    })
                } else
                    ST(pl, '§b您还没有添加任何家');
            } else
                ST(pl, '§b表单已放弃');
        })
    }
}

function homeasgui(pl, cmd) {
    if (cmd.length == 0) {
        var plslist = [];
        for (var i in tmp["homedata"]) {
            plslist.unshift(i);
        }
        var newform = mc.newCustomForm();
        newform.setTitle("§l§dHOMEAS");
        newform.addDropdown("§l§c选择一个玩家进行管理", plslist, 0);
        pl.sendForm(newform, function (pl, selected) {
            if (selected != null) {
                pl.sendSimpleForm('§l§dHOMEAS', '§l§b表单选项如下,请选择一个', ["§l§b添加TA的家", "§l§a前往TA的家", "§l§c删除TA的家"], ["", "", ""], function (pl1, selected1) {
                    if (selected1 == 0) {
                        var newform = mc.newCustomForm();
                        newform.setTitle("§l§dHOMEASADD");
                        newform.addInput("§l§b输入你要创建的家名字:", "home", "");
                        pl1.sendForm(newform, function (pl2, selected2) {
                            if (selected2 != null)
                                pl2.runcmd('/homeas "' + plslist[selected[0]] + '" add "' + selected2[0] + '"');
                            else
                                ST(pl2, '§b表单已放弃');
                        });
                    } else if (selected1 == 1) {
                        var homelist = [];
                        var image = [];
                        for (var i in tmp["homedata"][plslist[selected[0]]]) {
                            homelist.push(i);
                            image.push("");
                        }
                        if (JSON.stringify(homelist) == '[]') {
                            ST(pl1, '§cTA当前没有添加任何家');
                        } else {
                            pl1.sendSimpleForm('§l§dHOMEASGO', '§l§b表单选项如下,请选择一个', homelist, image, function (pl2, selected2) {
                                if (selected2 != null)
                                    pl2.runcmd('/homeas "' + plslist[selected[0]] + '" go "' + homelist[selected2] + '"');
                                else
                                    ST(pl2, '§b表单已放弃');
                            })
                        }
                    } else if (selected1 == 2) {
                        var newform = mc.newCustomForm();
                        newform.setTitle("§l§dHOMEASDEL");
                        var homelist = [];
                        for (var i in tmp["homedata"][plslist[selected[0]]]) {
                            homelist.push(i);
                        }
                        newform.addDropdown("§l§c选择一个TA的家进行删除", homelist, 0);
                        if (JSON.stringify(homelist) != '[]') {
                            pl1.sendForm(newform, function (pl2, selected2) {
                                if (selected2 != null)
                                    pl2.runcmd('/homeas "' + plslist[selected[0]] + '" del "' + homelist[selected2[0]] + '"');
                                else
                                    ST(pl2, '§b表单已放弃');
                            })
                        } else
                            ST(pl1, '§bTA还没有添加任何家');
                    } else
                        ST(pl1, '§b表单已放弃');
                })
            } else
                ST(pl, '§b表单已放弃');
        })
    } else
        ST(pl, '§c命令错误，请检查后重试')
}

function homeas(pl, cmd) {
    if (cmd.length == 3) {
        var plname = cmd[0].replace(/\"/g, "");
        var operation = cmd[1];
        var home = cmd[2].replace(/\"/g, "");
        if (operation == 'add') {
            var homelist = [];
            var homeyn = false;
            for (var i in tmp["homedata"][plname]) {
                homelist.push(i);
                if (i == home)
                    homeyn = true;
            }
            if (homelist.length >= tmp["config"]["最大家数量"])
                ST(pl, '§cTA的家数量已经满 ' + tmp["config"]["最大家数量"] + ' 个了,请删除一些后再试');
            else if (!homeyn) {
                tmp["homedata"][plname][home] = { "x": JSON.parse(pl.pos.x.toFixed(1)), "y": JSON.parse(pl.pos.y.toFixed(1)), "z": JSON.parse(pl.pos.z.toFixed(1)), "dimid": pl.pos.dimid };
                save();
                ST(pl, '§a修改成功');
            } else if (homeyn)
                ST(pl, '§cTA已经有这个家了,不能重复添加,请尝试换一个名字');
        } else if (operation == 'go') {
            var homeyn = false;
            for (var i in tmp["homedata"][plname]) {
                if (i == home)
                    homeyn = true;
            }
            if (homeyn)
                tp(pl, tmp["homedata"][plname][home].x, tmp["homedata"][plname][home].y, tmp["homedata"][plname][home].z, tmp["homedata"][plname][home].dimid, home);
            else
                ST(pl, '§cTA的这个家不存在');
        } else if (operation == 'del') {
            var homeyn = false;
            for (var i in tmp["homedata"][plname]) {
                if (i == home)
                    homeyn = true;
            }
            if (homeyn) {
                delete tmp["homedata"][plname][home];
                save();
                ST(pl, '§b删除TA家("' + home + '")成功');
            } else if (!homeyn)
                ST(pl, '§cTA的这个家不存在');
        }
    } else if (cmd.length == 2) {
        var plname = cmd[0].replace(/\"/g, "");;
        var operation = cmd[1];
        if (operation == 'ls') {
            var homelist1;
            for (var i in tmp["homedata"][pl.realName]) {
                if (homelist1 == null) {
                    homelist1 = '"' + i + '"';
                } else {
                    var homelist1 = homelist1 + "," + '"' + i + '"';
                }
            }
            if (homelist1 == undefined)
                ST(pl, '§cTA还没添加任何家');
            else
                ST(pl, '§aTA现在拥有家: ' + homelist1 + '');
        } else
            ST(pl, '§c您输入的命令有误,请检查后再重试');
    } else if (cmd.length == 0)
        homeasgui(pl, []);
    else
        ST(pl, '§c您输入的命令有误,请检查后再重试')
}

function server(cmd) {
    if (cmd.length == 0) {
        log('[INFO][HOME] 开始遍历PFESS路径...');
        var fil = file.readFrom('.\\plugins\\PFEssentials\\data\\homelist.json');
        if (fil != null) {
            logout('[INFO][HOME] 已找到文件,开始导入...');
            tmp["homedata"] = JSON.parse(fil);
            save();
            logout('[INFO][HOME] 导入成功!');
        } else {
            logout('[INFO][HOME] 没有找到文件!');
        }
    } else
        logout('命令出错!请检查后重试!')
}

function save() {
    file.writeTo('.\\plugins\\Timiya\\data\\homelist.json', JSON.stringify(tmp["homedata"], null, 2));
}

function read() {
    file.createDir('.\\plugins\\Timiya\\config');
    file.createDir('.\\plugins\\Timiya\\data');
    var json = file.readFrom(".\\plugins\\Timiya\\config\\home.json");
    if (json == null) {
        file.writeTo('.\\plugins\\Timiya\\config\\home.json', JSON.stringify(conf, null, 2));
        json = file.readFrom('.\\plugins\\Timiya\\config\\home.json');
        log('[INFO][HOME] 配置文件已补齐');
    }
    var ddd = JSON.parse(json);
    tmp["config"] = conf;
    tmp["config"]["HOME开关"] = ddd["HOME开关"];
    tmp["config"]["最大家数量"] = ddd["最大家数量"];
    if (ddd["创建家所需经济"] == null || ddd["回家所需经济"] == null || ddd["删除家回退经济"] == null) {
        file.writeTo('.\\plugins\\Timiya\\config\\home.json', JSON.stringify(tmp["config"], null, '\t'));
        log('[INFO][HOME] 配置已补全');
    }
    tmp["config"]["创建家所需经济"] = ddd["创建家所需经济"];
    tmp["config"]["回家所需经济"] = ddd["回家所需经济"];
    tmp["config"]["删除家回退经济"] = ddd["删除家回退经济"];
    log('[INFO][HOME] 配置已读取');
    var jso = file.readFrom('.\\plugins\\Timiya\\data\\homelist.json');
    if (jso == null) {
        file.writeTo('.\\plugins\\Timiya\\data\\homelist.json', '{}');
        jso = '{}';
        log('[INFO][HOME] 成功自动生成空数据文件');
    }
    tmp["homedata"] = JSON.parse(jso);
    log('[INFO][HOME] 配置文件已读取');
}

function logout(e) {
    mc.sendCmdOutput('[INFO][HOME]' + e + '');
}

function load() {
    read();
    if (tmp["config"]["HOME开关"]) {
        setTimeout(function () {
            if (tmp["config"]["创建家所需经济"] != 0 || tmp["config"]["删除家回退经济"] != 0 || tmp["config"]["回家所需经济"] != 0) {
                money = lxl.import('MONEY');
                if (money != null)
                    log('[INFO][HOME] Economic_core API导入成功');
                else {
                    log('[INFO][HOME] Economic_core API导入失败,自动将经济变量设置为0');
                    tmp["config"]["回家所需经济"] = 0;
                    tmp["config"]["创建家所需经济"] = 0;
                    tmp["config"]["删除家回退经济"] = 0;
                }
            }
            mc.regPlayerCmd('home', 'HOME命令', homegui, 0);
            mc.regPlayerCmd('home gui', '打开HOME总GUI', homegui, 0);
            mc.regPlayerCmd('home go', `/home go <input:homename> 前往某个家(需要 ${tmp["config"].回家所需经济} 经济)`, homego, 0);
            mc.regPlayerCmd('home del', `/home del <input:homename> 删除某个家(回退 ${tmp["config"].删除家回退经济} 经济)`, homedel, 0);
            mc.regPlayerCmd('home add', `/home add <input:homename> 添加一个家(需要 ${tmp["config"].创建家所需经济} 经济)`, homeadd, 0);
            mc.regPlayerCmd('home ls', '列出自己的所有家', homels, 0);
            mc.regPlayerCmd('homeas', '/homeas <input:playername> <add:del:go:ls> <homename:homename:homename:> 管理某个人的家', homeas, 1);
            mc.regPlayerCmd('homeas gui', '打开HOMEAS总GUI', homeasgui, 1);
            mc.regConsoleCmd('IPFH', '导入PFET HOME', server);
            log("[INFO][HOME] HOME loaded! Edition: 2.8");
        }, 5000)
    }
}
load();