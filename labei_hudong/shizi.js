var logger = gdds.Logger('shizi.js');
var async = require('async');

var HomeUrl='/home3';
var queryUrlByRcode=function(rcode,cb){
    gdds.resourceDao.queryByExample({code:rcode},cb,['url']);
};

var main=function(req,res,next){
    var ccode='hd_shizi';
    var view = 'shizi/main';

    var isHD = Number(req.session.isHD);
    var backUrl = req.query.backUrl || HomeUrl;

    async.parallel({
            'mediaLink':function(cb){
                var rcode='ds_hd_shizi_0_1_labei';/*大厅rcode*/
                queryUrlByRcode(rcode,function(err,rows){
                    var url=rows.length==1?rows[0].url:'';
                    cb(err,url)
                });
            },
            'product':function(cb){
                var pcode='ds_hd_shizi_1_0_djt';/*小豆派派文字王国pcode*/
                gdds.resourceDao.queryResourceByPCode(pcode,function(err,rows){
                    cb(err,rows);
                });
            },
            'recommend':function(cb){
                gdds.recommendDao.queryByExample(
                    {'category':'shizi-favorite'},
                    function(err,rows){cb(err,rows);},
                    ['url','img','seq'],'seq asc'
                );
            }
        },function(err,result){
            if(err){
                logger.error(err,'数据查询错误！');
                return next(err);
            }

            var data={
                backUrl:backUrl,
                isHD:isHD,
                mediaLink:result.mediaLink,
                product:JSON.stringify(result.product),
                recommend:JSON.stringify(result.recommend)
            }
            res.render(view,data);
    });
};
var enter=function(req,res,next){
    res.redirect('/assets/interact/shizi/enter/main.html');
};
exports.mapping = [
    ['get','/main',main],
    ['get','/enter',enter]
];