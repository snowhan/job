$c = {
    'p0': '/assets/theme/gplan/jiamian/img/',
    'p1':'/assets/theme/gplan/img/',
    'PageUrl':'/theme_gplan/jiamian',/*本页URL*/
    'OrderUrl':'/order/show' ,    /*订购URL*/
    'PageCode':'theme.gplan.jiamian.main'
};
$c.PageUrlEncoder = $g.URLEncoder.encode($c.PageUrl);

$c.routes = {
    //    返回
    'back': {
        link:$d.backUrl,
        path: [false, false, 'btn_1', false],
        img:[$c.p0+'b3_btn_0.png',$c.p0+'b3_btn_1.png']
    },
    'btn_get_star':{
        img:[$c.p1 +'b1_btn_0.png',$c.p1 +'b1_btn_0.png']
    },
    'btn_prince':{
        img:[$c.p0 +'wangzi_1.png',$c.p0 +'wangzi_1.png']
    },
    'btn_princess':{
        img:[$c.p0 +'gongzhu_1.png',$c.p0 +'gongzhu_1.png']
    },
    'btn_0':{
        img:[$c.p0 + 'b1_btn_0.png',$c.p0 + 'b1_btn_1.png'],
        path:['back','btn_1','btn_foot_0',false]
    },
    'btn_1':{
        img:[$c.p0 + 'b2_btn_0.png',$c.p0 + 'b2_btn_1.png'],
        path:['back',false,'btn_foot_2','btn_0']
    },
    'btn_foot_0':{
        link:$d.zhuanti[0].link,
        img:[$c.p0+'f1_focus.png',$c.p0+'f1.png'],
        path:['btn_0','btn_foot_1',false,false]
    },
    'btn_foot_1':{
        link:$d.zhuanti[1].link,
        img:[$c.p0+'f2_focus.png',$c.p0+'f2.png'],
        path:['btn_0','btn_foot_2',false,'btn_foot_0']
    },
    'btn_foot_2':{
        link:$d.zhuanti[2].link,
        img:[$c.p0+'f3_focus.png',$c.p0+'f3.png'],
        path:['btn_1',false,false,'btn_foot_1']
    }
};


