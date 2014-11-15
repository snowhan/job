$p.CK = {
    'focus': $g.Keys.FOCUS + $c.PageCode
};
$p.appState = {
    'focus': $g.cookie($p.CK.focus) || 'open_btn'
};
$p.saveCookie=function(isDefault){
    if(isDefault){
        $g.cookie($p.CK.focus,'open_btn');
        return;
    }
};
$p.router = $g.FocusRouter($p.CK.focus);
$p.open=function(){
    var jumpUrl=$c.PageUrl+'?save=1';
    if($d.isAuthed){
        if($d.interactData.open) return;
        $g.redirect(jumpUrl);
    }else{
        var link=$c.OrderUrl+'?jump='+$g.URLEncoder.encode(jumpUrl) +
            '&back='+$g.URLEncoder.encode($c.PageUrl);
        $g.redirect(link);
    }
};
$p.OpenPanel={
    'focusBtn':false,
    'init':function(){
        for(var i=0;i<3;i++){
            var bgId='panel'+i+'_bg';
            var btn='begin'+i+'_btn';
            $g.id(bgId).src=$c.p1+'panel_'+i+'.png';
            $g.id(btn).src=$c.routes[btn].img[1];
            $g.hide(bgId);
            $g.hide(btn);
        }
    },
    /*type可能值有：
        0：王子/公主开启面板
        1：王子开启面板
        2：公主开启面板*/
    'show':function(type){
        if(type>2 || type<0) return;
        var btn='begin'+type+'_btn';
        $g.show('panel'+type+'_bg');
        $g.show(btn);
        $p.OpenPanel.focusBtn=$p.router.currentFocus;
        $p.router.focus(btn);
    },
    'hide':function(type){
        if(type>2 || type<0) return;
        $g.hide('panel'+type+'_bg');
        $g.hide('begin'+type+'_btn');
        if($p.OpenPanel.focusBtn){
            $p.router.focus($p.OpenPanel.focusBtn);
            $p.OpenPanel.focusBtn=false;
        }

    }


}
$p.onKeyDown = function (e) {
    var key= $g.event(e).keyCode;

    if (key == $g.KeyCodes.BACK) {
        $p.saveCookie(true);
        $g.redirect($d.backUrl);
        return;
    }
    $p.router.go(key);
};

$p.initPage = function () {
    var R = $c.routes;

    $g.id('back_btn').src=R['back_btn'].img[1];
    /*变身按钮初始图片*/
    for(var i=1;i<=2;i++){
        var id='b'+i+'_btn';
        R[id].img=[$c.p1+'b'+i+'_f.png',$c.p1+'b'+i+'_b.png'];
        $g.id(id).src=R[id].img[1];
    }

    /*6个星按钮初始图片*/
    for(var i=1;i<=6;i++){
        var id='x'+i+'_btn';
        R[id].link=$c.links['x'+i];
        R[id].img=[$c.p1+'x'+i+'_f.png',$c.p1+'x'+i+'_b.png'];
        $g.id(id).src=R[id].img[1];
    }

    /*开启按钮*/
    var tag=$d.interactData.open?1:0;
    var id='open_btn';
    R[id].img=[$c.p1+'open'+tag+'_f.gif',$c.p1+'open'+tag+'_b.gif'];
    $g.id(id).src=R[id].img[1];

    /*开启人数*/
    $g.id('num').innerHTML=$d.openNum;

    $p.OpenPanel.init();
}

$p.initRouter = function () {
    $p.router.routes = $c.routes;
    $p.router.groups = $c.groups;

    $c.routes['back_btn'].fn=[false,false,function(id,r){$p.saveCookie(true)}];
    $c.routes['b1_btn'].fn=[false,false,function(id,r){$p.OpenPanel.show(1);}];
    $c.routes['b2_btn'].fn=[false,false,function(id,r){$p.OpenPanel.show(2);}];
    $c.routes['open_btn'].fn=[false,false,function(id,r){$p.OpenPanel.show(0);}];

    for(var i=1;i<=6;i++){
        var id='x'+i+'_btn';
        $c.routes[id].fn=[false,false,function(id,r){$p.saveCookie();}];
    }

    $c.routes['begin0_btn'].fn=[false,false,function(id,r){$p.OpenPanel.hide(0);$p.open();}];
    $c.routes['begin1_btn'].fn=[false,false,function(id,r){$p.OpenPanel.hide(1);$p.open();}];
    $c.routes['begin2_btn'].fn=[false,false,function(id,r){$p.OpenPanel.hide(2);$p.open();}];
};

$p.initApp = function () {
    $g.onkeydown($p.onKeyDown);
    $g.cookie($g.Keys.CUR_PAGE,$c.PageCode);
    $p.router.focus($p.appState.focus);
};

$g.ready(function () {
    $g.init();
    $p.initPage();
    $p.initRouter();
    $p.initApp();
});