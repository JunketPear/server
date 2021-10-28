//LiteXLoader Dev Helper
/// <reference path="c:\Users\电脑\.vscode\extensions\moxicat.lxldevhelper-0.1.4/Library/JS/Api.js" /> 



mc.regPlayerCmd('here','向所有玩家发送你的当前位置',function(player){
    mc.runcmd('tellraw @a {"rawtext":[{"text":"§5[坐标]§r 玩家§e '+player.name+' §r在§6 '+player.pos.dim+' §r的§c '+parseInt(player.pos.x)+' §a '+parseInt(player.pos.y)+' §b '+parseInt(player.pos.z)+'"}]}')
})