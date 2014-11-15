$c = {
    'p0': '/assets/theme/gplan/licai/img/',
    'p1':'/assets/theme/gplan/img/',
    'getStarUrl':'/theme_gplan/licai?save=1',
    'PageUrl':'/theme_gplan/licai',/*本页URL*/
    'pcode':'ds_zt_caishang_0_0_yxbb',
    'ccode':'zt_caishang',
    'OrderUrl':'/order/show' ,    /*订购URL*/
    'PageCode':'theme.gplan.licai.main'
};
$c.PageUrlEncoder = $g.URLEncoder.encode($c.PageUrl);

$c.routes = {
//    返回
    'back': {
        link:$d.backUrl,
        path: [false, false, 'btn_0', 'btn_0'],
        img:[$c.p0+'b3_btn_0.png',$c.p0+'b3_btn_1.png']
    },
//    彩蛋
    'nav_0': {
        path: ['back', 'btn_0', 'btn_footer_0', false],
        img:[$c.p0+'j2_btn_1.png',$c.p0+'j2_btn_2.png']
    },
//    领取理财之星按钮
    'btn_0': {

        path: ['back', 'back', 'btn_footer_2', 'nav_0'],
        img:[$c.p0+'b1_btn_0.png',$c.p0+'b1_btn_1.png']
    },
//    底排6个按钮
    'btn_footer_0': {

        path: ['nav_0', 'btn_footer_1', false, 'btn_footer_5'],
        img:[$c.p0+$d.resource[0].code+'_f.png',$c.p0+$d.resource[0].code+'_b.png']
    },
    'btn_footer_1': {
        path: ['nav_0', 'btn_footer_2',false, 'btn_footer_0'],
        img:[$c.p0+$d.resource[1].code+'_f.png',$c.p0+$d.resource[1].code+'_b.png']
    },
    'btn_footer_2': {
        path: ['btn_0', 'btn_footer_3', false, 'btn_footer_1'],
        img:[$c.p0+$d.resource[2].code+'_f.png',$c.p0+$d.resource[2].code+'_b.png']
    },
    'btn_footer_3':{
        path:['btn_0','btn_footer_4',false,'btn_footer_2'],
        img:[$c.p0+$d.resource[3].code+'_f.png',$c.p0+$d.resource[3].code+'_b.png']
    },
    'btn_footer_4':{
        path:['btn_0','btn_footer_5',false,'btn_footer_3'],
        img:[$c.p0+$d.resource[4].code+'_f.png',$c.p0+$d.resource[4].code+'_b.png']
    },
    'btn_footer_5':{
        path:['btn_0','btn_footer_0',false,'btn_footer_4'],
        img:[$c.p0+$d.resource[5].code+'_f.png',$c.p0+$d.resource[5].code+'_b.png']
    },

    'btn_index':{
        path:[false,false,false,false]
    },
    'bg_0':{
        img:$c.p1+ 'bg_0.png'
    },
    'btn_star_index':{
        img:$c.p0+ 'licaiStar.png'
    },

    'bg_1':{
        img:$c.p1+'bg1_1.png'
    },
    'btn_play':{
        img:[$c.p1+'b2_play_btn_0.png',$c.p1+'b2_play_btn_1.png'],
        path:['btn_back',false,false,false]
    },
    'btn_back':{
        img:[$c.p1+'back_btn_0.png',$c.p1+'back_btn_1.png'],
        path:[false,false,'btn_play',false]
    }


};
