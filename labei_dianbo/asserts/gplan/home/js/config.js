$c = {
    'p0': '/assets/theme/gplan/img/',
    'p1': '/assets/theme/gplan/home/img/',
    'PageCode': 'theme.gplan.home.main',
    'PageUrl':'/theme_gplan/home',   /*本页URL*/
    'OrderUrl':'/order/show'     /*订购URL*/
};

$c.imgs = {
    "begin":[$c.p1+'begin_f.png',$c.p1+'begin_b.png']
};
$c.links ={
    'x1':'/theme_gplan/qinggan',
    'x2':'/theme_gplan/licai',
    'x3':'/theme_gplan/zhihui',
    'x4':'/theme_gplan/caiyi',
    'x5':'/theme_gplan/anquan',
    'x6':'/theme_gplan/jiamian'
}
$c.groups = {};
$c.routes = {
    "back_btn":{"link":$d.backUrl,"img":[$c.p1+'back_f.png',$c.p1+'back_b.png'],"path":[false,false,'b2_btn','open_btn']},
    "open_btn":{"path":['back_btn','b2_btn','x3_btn','b1_btn']},
    "b1_btn":{"path":['back_btn','open_btn','x1_btn',false]},
    "b2_btn":{"path":['back_btn',false,'x6_btn','open_btn']},
    "x1_btn":{"path":['b1_btn','x2_btn',false,'x6_btn']},
    "x2_btn":{"path":['b1_btn','x3_btn',false,'x1_btn']},
    "x3_btn":{"path":['open_btn','x4_btn',false,'x2_btn']},
    "x4_btn":{"path":['open_btn','x5_btn',false,'x3_btn']},
    "x5_btn":{"path":['b2_btn','x6_btn',false,'x4_btn']},
    "x6_btn":{"path":['b2_btn','x1_btn',false,'x5_btn']},
    "begin0_btn":{"img":$c.imgs.begin,"path":[false,false,false,false]},
    "begin1_btn":{"img":$c.imgs.begin,"path":[false,false,false,false]},
    "begin2_btn":{"img":$c.imgs.begin,"path":[false,false,false,false]}

}