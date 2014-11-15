$p.next=function(){
    var D1=$c.s1.data;
    var action=$p.check(D1);
    $p.handler[action]();
};
$p.handler={
    'nt':function(){
        $p.nextTopic();
        //$g.Engine.play($c.s1.data.clip);/*如果clip有next属性，则注释此行代码*/
    },
    'nl':function(){
        $p.nextLevel();
        $g.Engine.curStage('s0');
    },
    'end':function(){
        $g.Engine.curStage('s2');
    }
};
/*判断下步状态,优先级按顺序
 * nt:下一题
 * nl:下一关
 * end：结束
 * */
$p.check=function(data){
    var topics=$c['topics'+data.level];
    if(data.idx<topics.length-1) return 'nt';
    if(data.level < $c.game.LEVEL-1) return 'nl';
    return 'end';
};
$p.nextTopic=function(){
    var D=$c.s1.data;
    var topics=$c['topics'+D.level];
    D.idx++;
    D.need=topics[D.idx].need+'';
    D.clip='p'+ D.level+'c'+ D.idx+'ST';
    D.okClip='p'+D.level+'c'+D.idx+'OK';
    D.failClip='p'+D.level+'Wrong';
    D.page='pg0';
    var btns=$c[D.page].btns;
    for(var i=0;i<btns.length;i++){
        D.btns[i]=btns[i].id;
    }
    if(topics[D.idx].card){
        $p.refreshImg(D.page,topics[D.idx].card);
    }
};
$p.nextLevel=function(){
    var nLeve= parseInt($c.s1.data.level)+1;
    $p.skipLevel(nLeve);
};
$p.skipLevel=function(level){
    if(level>=0 && level<$c.game.LEVEL){
        var D0=$c.s0.data;
        var D1=$c.s1.data;

        D0.clips=['p'+level+'Start0','p'+level+'Start1'];
        D1.level=level;
        D1.idx=-1;
    }
};
/*只用于page在隐藏的时候，刷新图片*/
$p.refreshImg=function(page,card){
    var Page=$g.Engine.page(page);
    var btns=$c[page].btns;
    for(var i=0;i<btns.length && i<card.length;i++){
        btns[i].img=[$c.p1+card[i]+'_f.png',$c.p1+card[i]+'_b.png'];
        if(Page) {
            var Btn=Page.btn(btns[i].id);
            var tag=Btn.m.status=='focus'?0:1;
            Btn.m.unmask=btns[i].img[tag];
        }
    }
};
$p.BackPanel={
    'visible':0,
    'cPage':false,
    'show':function(){
        var p = $p.BackPanel;
        var e = $g.Engine;
        var player=$g.InteractPlayer;
        if(p.visible) return;

        if(e.m.curPage) p.cPage=e.m.curPage;
        if(p.cPage==$p.SkipPanel.page){
            $p.SkipPanel.hide();
        }
        player.pause();
        e.showPage('pgB');
        p.visible=1;
    },
    'hide':function(){
        var p = $p.BackPanel;
        var e = $g.Engine;
        var player=$g.InteractPlayer;
        if(!p.visible) return;

        e.hidePage('pgB');
        if(p.cPage && p.cPage!=$p.SkipPanel.page) {
            e.showPage(p.cPage);
            p.cPage=false;
        }
        if(p.cPage==$p.SkipPanel.page){
            $p.SkipPanel.show('c');
            p.cPage=false;
        }
        player.resume();
        p.visible=0;
    }
};
$p.EndPanel={
    'visible':0,    /*可见状态属性，可能值0：隐藏,1：显示*/
    'cPage':false,/*暂存面板前的页面*/
    'show':function(){
        var p = $p.EndPanel;
        var e = $g.Engine;
        var player=$g.InteractPlayer;
        if(p.visible) return;

        if(e.m.curPage) p.cPage=e.m.curPage;
        player.pause();
        e.showPage('pgE');
        p.visible=1;
    },
    'hide':function(){
        var p = $p.EndPanel;
        var e = $g.Engine;
        var player=$g.InteractPlayer;
        if(!p.visible) return;

        e.hidePage('pgE');
        if(p.cPage) {
            e.showPage(p.cPage);
            p.cPage=false;
        }
        player.resume();
        p.visible=0;
    }
};
$p.SkipPanel={
    'visible':0,
    'status':false,/*e：展开，c：折叠*/
    'page':'pgS',/*page的ID*/
    'eBtns':['pSb2','pSb3','pSb4','pSb5','pSb6','pSb0'],/*展开状态额外显示的按钮*/
    'cBtns':['pSb1'],/*折叠状态显示的按钮*/
    /*切换展开折叠状态,s的可能值为e，c*/
    '_swap':function(s){
        var P=$p.SkipPanel;
        var E=$g.Engine;
        var player=$g.InteractPlayer;

        if(!P.visible) {
            E.showPage(P.page);
            E.focusBtn(P.eBtns[0]);
            P.status='e';
            P.visible=1;
        }
        if(P.status==s) return;
        if(s=='e'){
            player.pause();
            for(var i=0;i< P.eBtns.length;i++){
                E.showBtn(P.eBtns[i])
            }
            E.focusBtn(P.eBtns[0]);
        }
        if(s=='c'){
            player.resume();
            E.focusBtn(P.cBtns[0]);
            for(var i=0;i< P.eBtns.length;i++){
                E.hideBtn(P.eBtns[i])
            }
        }
        P.status=s;
    },
    'show':function(status){
        var P=$p.SkipPanel;
        var E=$g.Engine;
        if(!status) {
            E.showPage(P.page);
            P.visible=1;
            return;
        }
        P._swap(status);
    },
    'hide':function(){
        var P=$p.SkipPanel;
        var E=$g.Engine;

        if(!P.visible) return;
        E.hidePage(P.page);
        P.status=false;
        P.visible=0;
    }
};
/*玩法介绍的提示面板，只显示一次*/
$p.TipPanel={
    count:0,/*显示次数*/
    MaxCount:0,/*最大显示次数*/
    'show':function(autoHide){
        var id='pTb0';
        var TP=$p.TipPanel;
        if(TP.count>=TP.MaxCount) return;

        $g.id(id).src=$c.p0+'tip_play.gif';
        if($g.isHide(id)) $g.show(id);
        TP.count++;

        if(!autoHide) return;
        setTimeout(function(){
            $p.TipPanel.hide();
        },7000);
    },
    'hide':function(){
        var id='pTb0';
        $g.hide(id);
    }
};
$p.exit=function(url){
    var cPage=$g.Engine.m.curPage;
    if(cPage) $g.Engine.hidePage(cPage);

    var link= url || $d.backUrl;
    $g.Engine.stop();
    $g.InteractPlayer.close();
    $g.redirect(link);
}

$p.onKeyDown = function (e) {
    var key = $g.event(e).keyCode;
    var K=$g.KeyCodes;

    if (key ==K.BACK){
        var EP=$p.EndPanel;
        var BP=$p.BackPanel;
        if(EP.visible) return;
        BP.visible?BP.hide():BP.show();
    }
    $g.Engine.go(key);
    $p.Debug.run(key);/*调试*/
};

$p.initEngine= function(){
    $g.Engine.m=$c.engine;
    $g.Engine.init($d.isHD);
    $g.Engine.start();
};

$p.initApp = function(){
    $g.onkeydown($p.onKeyDown);
};

$g.ready(function(){
    $p.initEngine();
    $p.initApp();
});

$p.Debug={
    'i':0,
    'run':function(key){
        var K=$g.KeyCodes;

        var debug=$p.Debug;
        var E=$g.Engine;
        var clips=$c.media.clips;

        if (key == 115){ /*电脑F4按键*/
        }

        if(key== K.NUM_0){
            $p.exit('/');
        }

        if(key== K.NUM_9){
            debug.i++;
            if(debug.i>=clips.length) debug.i-=clips.length;
            var clip=clips[debug.i];
            $g.log('play:'+clip.id);
            E.play(clip.id);
        }
        if(key== K.NUM_8){
            var clip=clips[debug.i];
            $g.log('play:'+clip.id);
            E.play(clip.id);
        }
        if(key== K.NUM_7){
            debug.i--;
            if(debug.i<0) debug.i+=clips.length;
            var clip=clips[debug.i];
            $g.log('play:'+clip.id);
            E.play(clip.id);
        }

    }
}
