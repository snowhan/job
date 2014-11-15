$p.CK = {
    'focus': $g.Keys.FOCUS + $c.PageCode,
    'prince':$c.PageCode+'prince',
    'princess':$c.PageCode+'princess'
};
$p.appState = {
    'focus': $g.cookie($p.CK.focus) || 'btn_foot_0',
    'prince': $g.cookie($p.CK.prince) || '0',
    'princess': $g.cookie($p.CK.princess) || '0'
};

$p.focusBtnReset=function(){
    if(!parseInt($p.appState.prince)){
        $p.router.focus('btn_0');
        return;
    }
    if(!parseInt($p.appState.princess)){
        $p.router.focus('btn_1');
        return;
    }
    $p.router.focus('btn_foot_0');
};

$p.convertState=function(){
    /*如果变身王子*/
    if(parseInt($p.appState.prince)){
        $g.id('btn_0').src=$c.p0 + 'b1_btn_2.png';
        $g.id('btn_prince').src=$c.p0 +'wangzi_0.png';
        $p.router.enableRoute('btn_0',false);
    }
    /*如果变身公主*/
    if(parseInt($p.appState.princess)){
        $g.id('btn_1').src=$c.p0 + 'b2_btn_2.png';
        $g.id('btn_princess').src=$c.p0 +'gongzhu_0.png';
        $p.router.enableRoute('btn_1',false);
    }
};

$p.saveCookie=function(isDefault){
    if(isDefault){
        $g.cookie($p.CK.focus,'btn_foot_0');
        return;
    }
    $g.cookie($p.CK.prince,$p.appState.prince);
    $g.cookie($p.CK.princess,$p.appState.princess);
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

$p.convert={
    'prince':function(){
        if($p.isGottenAllStar()){
            $p.appState.prince ='1';
            $p.saveCookie(false);
//            $p.router.focus('btn_foot_0');
            $g.redirect($c.PageUrl);
        }else{
            $p.showStarPanel.show();
        }
    },
    'princess':function(){
        if($p.isGottenAllStar()){
            $p.appState.princess ='1';
            $p.saveCookie(false);
//            $p.router.focus('btn_foot_0');
            $g.redirect($c.PageUrl);
        }else{
            $p.showStarPanel.show();
        }
    }
};

$p.showStarPanel ={
    'focusBtn':false,
    'show':function(){
        $g.show('bg_0');
        $g.show('btn_get_star');
        $g.show('btn_star_title');
        $g.id('btn_star_title').src=$c.p0 +'t_1.png';
        $g.id('btn_get_star').src=$c.p1 +'b1_btn_0.png';
        $g.id('bg_0').src=$c.p0 +'bg_00.png';

        for(var i=0;i<$d.allStar.length;i++){
            $d.allStar[i]?$g.id('btn_star_'+(i+1)).src=$c.p1 +(i+1) + '_0.png'
                :$g.id('btn_star_'+(i+1)).src=$c.p1 +(i+1) +'_1.png';
        }

        for(i=1;i<6;i++){
            $g.show('btn_star_' + i);
        }
        $p.showStarPanel.focusBtn=$p.router.currentFocus;
        $p.router.focus('btn_get_star');
    },
    'hide':function(){
        $g.hide('bg_0');
        $g.hide('btn_get_star');
        $g.hide('btn_star_title');
        for(var i=1;i<6;i++){
            $g.hide('btn_star_' + i);
        }
        $p.router.focus($p.showStarPanel.focusBtn);
    }
};



$p.initPage = function () {
    $g.id('back').src=$c.routes['back'].img[1];
    $g.id('btn_princess').src=$c.routes['btn_princess'].img[1];
    $g.id('btn_prince').src=$c.routes['btn_prince'].img[1];
    $g.id('btn_0').src=$c.routes['btn_0'].img[1];
    $g.id('btn_1').src=$c.routes['btn_1'].img[1];
    $g.id('btn_foot_0').src=$c.routes['btn_foot_0'].img[1];
    $g.id('btn_foot_1').src=$c.routes['btn_foot_1'].img[1];
    $g.id('btn_foot_2').src=$c.routes['btn_foot_2'].img[1];
};

$p.initRouter = function () {
    $p.router.routes = $c.routes;

    $c.routes.btn_0.fn = [false,false,$p.convert.prince];
    $c.routes.btn_1.fn = [false,false,$p.convert.princess];
    $c.routes.btn_get_star.fn = [false,false,$p.showStarPanel.hide];
    $c.routes.back.fn=[false,false,function(id,r){$p.saveCookie(true)}];
};

/**初始化应用功能*/
$p.initApp = function () {
    $g.cookie($g.Keys.CUR_PAGE, $c.PageCode);

    $g.onkeydown($p.onKeyDown);
    $p.focusBtnReset();
    $p.convertState();
};

/**入口函数*/
$g.ready(function () {
    $g.init();
    $p.initPage();
    $p.initRouter();
    $p.initApp();
});
