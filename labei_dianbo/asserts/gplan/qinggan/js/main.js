$p.CK = {
    'focus': $g.Keys.FOCUS + $c.PageCode,
    'visible':$c.PageCode+'getStarPanel'
};
$p.appState = {
    'focus': $g.cookie($p.CK.focus) || 'btn_0',
    'visible': $g.cookie($p.CK.visible) || '0'
};
$p.saveCookie=function(isDefault){
    if(isDefault){
        $g.cookie($p.CK.focus,'btn_0');
        $g.cookie($p.CK.visible,'0');
        return;
    }
    $g.cookie($p.CK.visible,$p.appState.visible);
};
$p.router = $g.FocusRouter($p.CK.focus);

/**监听按键事件*/
$p.onKeyDown = function (e) {
    var key= $g.event(e).keyCode;

    if (key == $g.KeyCodes.BACK) {
        $p.saveCookie(true);
        $g.redirect($d.backUrl);
        return;
    }

    $p.router.go(key,$p.router);
};

$p.isGottenAllStar=function(){
    var j=1;
    for(var i=0;i< $d.allStar.length;i++){
        j = j&&$d.allStar[i]
    }
    if(j){
        return true;
    }else{
        return false;
    }
};

$p.starPanel ={
    'focusBtn':false,
    'show':function(){
        $g.show('bg_0');
        $g.show('btn_index');
        $g.id('btn_star_index').src=$c.p0+ 'qingganStar.png';

        for(var i=0;i<$d.allStar.length;i++){
            $d.allStar[i]?$g.id('btn_star_'+(i+1)).src=$c.p1 +(i+1) + '_0.png'
                :$g.id('btn_star_'+(i+1)).src=$c.p1 +(i+1) +'_1.png';
        }

        for(i=1;i<6;i++){
            $g.show('btn_star_' + i);
        }
        $g.show('btn_star_index');
        $p.starPanel.focusBtn=$p.router.currentFocus;
        $p.router.focus('btn_index');
        $p.appState.visible = '1';
    },
    'hide':function(){
        $g.hide('bg_0');
        $g.hide('btn_index');
        $g.hide('btn_star_index');
        for(var i=1;i<6;i++){
            $g.hide('btn_star_' + i);
        }
        $p.router.focus($p.starPanel.focusBtn);
        $p.appState.visible = '0';
    }
};
$p.onGetStarBtnClick=function(){
    /*如果用户没有订购，跳转订购页面*/
    if(!$d.isAuthed){
        $p.saveCookie(true);
        var link =$c.OrderUrl+'?jump='+$g.URLEncoder.encode(jumpUrl) +
            '&back='+$c.PageUrlEncoder;
        $g.redirect(link);
        return;
    }
    /*如果已订购用户没有领取过星星*/
    if(!$d.interactData.qingganxing){
        var jumpUrl = $c.PageUrl + '?save=1';
        $p.appState.visible = '1';
        $p.saveCookie(false);
        $g.redirect(jumpUrl);
        return;
    }
    /*如果已订购的用户领取过星星*/
    $p.starPanel.show();
};
$p.gamePanel={
    'focusBtn':false,
    'show':function(){
        var i = Math.floor(Math.random()*6);
        $p.gameUrl = '/toplay/interact?rcode=' + $d.game[i].gameRcode+'&backUrl='+$c.PageUrlEncoder;
        $g.show('bg_1');
        $g.show('btn_play');
        $g.show('btn_back');
        $g.show('game_pic');
        $g.id('game_pic').src=$c.p1 + $d.game[i].gameRcode + '.png';
        $g.id('btn_back').src = $c.routes['btn_back'].img[1];
        $p.gamePanel.focusBtn=$p.router.currentFocus;
        $p.router.focus('btn_play');
    },
    'hide':function(){
        $g.hide('bg_1');
        $g.hide('btn_play');
        $g.hide('btn_back');
        $g.hide('game_pic');
        $p.router.focus($p.gamePanel.focusBtn);
    }
};



$p.initPage = function () {
    for(var i=0;i<5;i++){
        var id='btn_footer_'+i;
        $g.id(id).src = $c.routes[id].img[1];
    }
    $g.id('back').src = $c.routes['back'].img[1];
    $g.id('nav_0').src = $c.routes['nav_0'].img[1];
    $g.id('btn_0').src = $c.routes['btn_0'].img[1];
    $g.id('bg_0').src = $c.p1+ 'bg1_0.png';
    if($p.isGottenAllStar()){
        $g.id('btn_index').src=$c.p1 +'b4_btn_0.png';
    }else{
        $g.id('btn_index').src=$c.p1 +'b1_btn_0.png';
    }
    $g.id('bg_1').src = $c.routes['bg_1'].img;
    $g.id('btn_play').src = $c.routes['btn_play'].img[0];
};

$p.initRouter = function () {
    $p.router.routes = $c.routes;

    for(var i=0;i<5;i++){
        var id = 'btn_footer_' + i;
        $c.routes[id].link = '/play?'+'ccode='+$c.ccode+'&pcode='+$c.pcode+'&rcode='+$d.resource[i].code+'&backUrl='+$c.PageUrlEncoder;
        $c.routes[id].fn = [false,false,function(id,r){$p.saveCookie(false);}];
    }

    $c.routes.btn_0.fn = [false,false,function(id,r){$p.onGetStarBtnClick();}];
    $c.routes.btn_index.fn = [false,false,function(id,r){
        $p.starPanel.hide();
        if($p.isGottenAllStar()){/*如果所有星星收集完毕，跳转到加冕页面*/
            $p.saveCookie(true);
            $g.redirect('/theme_gplan/jiamian');
        }
    }];
    $c.routes.nav_0.fn = [false,false,$p.gamePanel.show];
    $c.routes.btn_play.fn = [false,false,function(id,r){/*玩游戏*/
        $p.router.focus($p.gamePanel.focusBtn);
        $p.saveCookie(false);
        $g.redirect($p.gameUrl);
    }];
    $c.routes.btn_back.fn = [false,false,$p.gamePanel.hide];
    $c.routes.back.fn=[false,false,function(id,r){$p.saveCookie(true)}];
};

/**初始化应用功能*/
$p.initApp = function () {
    $g.cookie($g.Keys.CUR_PAGE, $c.PageCode);

    $g.onkeydown($p.onKeyDown);
    $p.router.focus($p.appState.focus);
    $p.gamePanel.hide();
    parseInt($p.appState.visible)?$p.starPanel.show():$p.starPanel.hide();
};

/**入口函数*/
$g.ready(function () {
    $g.init();
    $p.initPage();
    $p.initRouter();
    $p.initApp();
});
