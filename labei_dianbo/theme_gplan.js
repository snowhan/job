var logger = gdds.Logger('theme_gplay.js');
var async = require('async');

var um = gdds.UserManager;

var ROOT='theme/gplan/';
var CATEGORY='gplay';
var TITLE='暑期成长计划';
/*userId:用户编码
 * cb为回调函数，形式为fn(err,body),body为json对象*/
var queryUserInteract=function(userId,cb){
    gdds.userInteractDao.queryByExample({user_code:userId,category:CATEGORY},
        function(err,result){
            if(err) return cb(err);
            if(result.length!=1) return cb(err,{});
            return cb(err,JSON.parse(result[0].body));
        },
        ['user_code','category','title','body','remark']
    )
};
/*userId:用户编码
* body：存储的数据，为json对象，
* cb为回调函数，形式为fn(err)*/
var saveUserInteract=function(userId,body,cb){
    var objArr=gdds.util.objectToArray(body);
    if(objArr.length==0) return cb();

    async.waterfall([
        function(cb){
            gdds.userInteractDao.queryByExample({user_code:userId,category:CATEGORY},
            function(err,result){
                cb(err,result);
            },
            ['interact_id','user_code','category','title','body','remark']
            )
        },
        function(rs,cb){
            if(rs.length!=1){
                var row={user_code:userId,category:CATEGORY,title:TITLE,body:JSON.stringify(body)};
                gdds.userInteractDao.insert(row,function(err,result){cb(err);});
            }else{
                var row=rs[0];
                var rBody=JSON.parse(row.body);
                for(var i=0;i<objArr[0].length;i++){
                    rBody[objArr[0][i]]=objArr[1][i];
                }
                gdds.userInteractDao.update({body:JSON.stringify(rBody)},
                    {interact_id:row.interact_id},
                    function(err,result){cb(err);}
                );
            }
        }
    ],function(err){
        cb(err);
    });
};
var getUserId=function(req){
    return req.session.user.id;
};
var isAuthed=function(req){
    return um.isAuthed(req);
};
var home=function(req,res,next){
    var cate='zt-gplan-check';/*开启成长计划人数 在t_recommend存储的category字段*/
    var openKey='open';/*启动状态的key值*/
    var view=ROOT+'home/main';

    var backUrl=req.query.backUrl || '/';
    var userId = getUserId(req);
    var save = req.query.save;

    async.waterfall([
        /*查询开启人数，数据存储在表t_recommend中*/
        function(cb){
            gdds.recommendDao.queryByExample({category:cate},
                function(err,result){
                    if(err) cb(err);
                    if(result.length!=1) cb('数据库中t_recommend的数据存储错误！');

                    var rs={};
                    rs.openNum=result[0].remark;
                    cb(err,rs);
                },
                ['category','url','img','seq','remark'],
                'seq asc'
            );
        },
        /*add开启人数，并save*/
        function(rs,cb){
            if(!save) return cb(null,rs);/*没有保存操作，则跳过*/

            var random=parseInt(10+Math.random()*40);/*签到一次增加10~50的随机次数*/
            rs.openNum=parseInt(rs.openNum)+random;
            gdds.recommendDao.update({remark:rs.openNum},
                {category:cate},
                function(err,result){cb(err,rs);}
            );
        },
        /*保存用户交互数据*/
        function(rs,cb){
            if(!save) return cb(null,rs);/*没有保存操作，则跳过*/

            var body={};
            body[openKey]=1;
            saveUserInteract(userId,body,function(err){cb(err,rs);});
        },
        /*查询用户交互数据*/
        function(rs,cb){
            queryUserInteract(userId,function(err,body){
                if(err) return cb(err);

                rs.interactData=body;
                cb(err,rs);
            });
        }
    ],function(err,rs){
        if(err){
            logger.error(err,'查询数据时出错!');
            return next(err);
        }

        var data= {
            backUrl:backUrl,
            isAuthed:isAuthed(req),
            openNum:rs.openNum,
            interactData:JSON.stringify(rs.interactData)
        };

        res.render(view,data);
    });
};
var qinggan=function(req,res,next){
    var qingganView = ROOT+'/qinggan/main';
    var ccode='zt_qingganxing';
    var pcode='ds_zt_qingganxing_0_0_djt';
    var userId = getUserId(req);
    var qingganKey = 'qingganxing';
    var save = req.query.save;
    var backUrl=req.query.backUrl || '/theme_gplan/home';
    async.waterfall([
        function(cb){
            gdds.resourceDao.queryResUrlByPCode(ccode,pcode,function(err,resouces){
                if(err)return cb(err);
                var result={};
                result.resource=resouces;
                cb(err,result);
            });
        },
        /*保存用户交互数据*/
        function(result,cb){
            if(!save)return cb(null,result);
            var body={};
            body[qingganKey]=1;
            saveUserInteract(userId,body,function(err){cb(err,result);});
        },
        /*查询用户交互数据*/
        function(result,cb){
            queryUserInteract(userId,function(err,body){
                if(err)return cb(err);

                result.interactData=body;
                cb(err,result);
            });
        }
    ],
        function(err,result){
            if(err){
                logger.error(err,'情感之星二级页面查询数据库失败');
                return next(err);
            }

            var data={
                resource:JSON.stringify(result.resource),
                isAuthed:isAuthed(req),
                backUrl:backUrl,
                interactData:JSON.stringify(result.interactData)

            };

            res.render(qingganView,data);
        }
    )
};
var licai=function(req,res,next){
    var licaiView = ROOT+'/licai/main';
    var ccode='zt_caishang';
    var pcode='ds_zt_caishang_0_0_yxbb';
    var userId = getUserId(req);
    var licaiKey = 'licaixing';
    var save = req.query.save;
    var backUrl=req.query.backUrl || '/theme_gplan/home';
    async.waterfall([
        function(cb){
            gdds.resourceDao.queryResUrlByPCode(ccode,pcode,function(err,resouces){
                if(err)return cb(err);
                var result={};
                result.resource=resouces;
                cb(err,result);
            });
        },
        /*保存用户交互数据*/
        function(result,cb){
            if(!save)return cb(null,result);
            var body={};
            body[licaiKey]=1;
            saveUserInteract(userId,body,function(err){cb(err,result);});

        },
        /*查询用户交互数据*/
        function(result,cb){
            queryUserInteract(userId,function(err,body){
                if(err)return cb(err);

                result.interactData=body;
                cb(err,result);
            });
        }
    ],
    function(err,result){
        if(err){
            logger.error(err,'理财之星二级页面查询数据库失败');
            return next(err);
        }

        var data={
            resource:JSON.stringify(result.resource),
            isAuthed:isAuthed(req),
            backUrl:backUrl,
            interactData:JSON.stringify(result.interactData)

        };

        res.render(licaiView,data);
    }
    )
};
var zhihui=function(req,res,next){
    var zhihuiView = ROOT+'/zhihui/main';
    var userId = getUserId(req);
    var zhihuiKey = 'zhihuixing';
    var save = req.query.save;
    var backUrl=req.query.backUrl || '/theme_gplan/home';
    async.waterfall([
        /*保存用户交互数据*/
        function(cb){
            if(!save)return cb(null);
            var body={};
            body[zhihuiKey]=1;
            saveUserInteract(userId,body,function(err){cb(err);});
        },
        /*查询用户交互数据*/
        function(cb){
            queryUserInteract(userId,function(err,body){
                if(err)return cb(err);
                var result={};
                result.interactData=body;
                cb(err,result);
            });
        }
    ],
        function(err,result){
            if(err){
                logger.error(err,'智慧之星二级页面查询数据库失败');
                return next(err);
            }

            var data={
                resource:JSON.stringify(result.resource),
                isAuthed:isAuthed(req),
                backUrl:backUrl,
                interactData:JSON.stringify(result.interactData)

            };

            res.render(zhihuiView,data);
        }
    )
};
var caiyi=function(req,res,next){
    var caiyiView = ROOT+'/caiyi/main';
    var ccode='zt_caiyixing';
    var pcode='ds_zt_caiyixing_0_0_labei';
    var userId = getUserId(req);
    var caiyiKey = 'caiyixing';
    var save = req.query.save;
    var backUrl=req.query.backUrl || '/theme_gplan/home';
    async.waterfall([
        function(cb){
            gdds.resourceDao.queryResUrlByPCode(ccode,pcode,function(err,resouces){
                if(err)return cb(err);
                var result={};
                result.resource=resouces;
                cb(err,result);
            });
        },
        /*保存用户交互数据*/
        function(result,cb){
            if(!save)return cb(null,result);
            var body={};
            body[caiyiKey]=1;
            saveUserInteract(userId,body,function(err){cb(err,result);});
        },
        /*查询用户交互数据*/
        function(result,cb){
            queryUserInteract(userId,function(err,body){
                if(err)return cb(err);

                result.interactData=body;
                cb(err,result);
            });
        }
    ],
        function(err,result){
            if(err){
                logger.error(err,'才艺之星二级页面查询数据库失败');
                return next(err);
            }

            var data={
                resource:JSON.stringify(result.resource),
                isAuthed:isAuthed(req),
                backUrl:backUrl,
                interactData:JSON.stringify(result.interactData)

            };

            res.render(caiyiView,data);
        }
    )
};
var anquan=function(req,res,next){
    var anquanView = ROOT+'/anquan/main';
    var ccode='zt_aide';
    var pcode='ds_zt_aide_0_0_fz';
    var userId = getUserId(req);
    var anquanKey = 'anquanxing';
    var save = req.query.save;
    var backUrl=req.query.backUrl || '/theme_gplan/home';
    async.waterfall([
        function(cb){
            gdds.resourceDao.queryResUrlByPCode(ccode,pcode,function(err,resouces){
                if(err)return cb(err);
                var result={};
                result.resource=resouces;
                cb(err,result);
            });
        },
        /*保存用户交互数据*/
        function(result,cb){
            if(!save)return cb(null,result);
            var body={};
            body[anquanKey]=1;
            saveUserInteract(userId,body,function(err){cb(err,result);});
        },
        /*查询用户交互数据*/
        function(result,cb){
            queryUserInteract(userId,function(err,body){
                if(err)return cb(err);

                result.interactData=body;
                cb(err,result);
            });
        }
    ],
        function(err,result){
            if(err){
                logger.error(err,'安全之星二级页面查询数据库失败');
                return next(err);
            }

            var data={
                resource:JSON.stringify(result.resource),
                isAuthed:isAuthed(req),
                backUrl:backUrl,
                interactData:JSON.stringify(result.interactData)

            };

            res.render(anquanView,data);
        }
    )
};
var jiamian=function(req,res,next){
    var jiamianView = ROOT+'/jiamian/main';
    var userId = getUserId(req);
    var backUrl=req.query.backUrl || '/theme_gplan/home';

    queryUserInteract(userId,function(err,body){
        if(err){
            logger.error(err,'成长加冕二级页面查询数据库失败');
            return next(err);
        }

        var data={
            isAuthed:isAuthed(req),
            backUrl:backUrl,
            interactData:JSON.stringify(body)

        };
        res.render(jiamianView,data);
    });

};
exports.mapping = [
    ['get','/home',home],
    ['get','/qinggan',qinggan],
    ['get','/licai',licai],
    ['get','/zhihui',zhihui],
    ['get','/caiyi',caiyi],
    ['get','/anquan',anquan],
    ['get','/jiamian',jiamian]
];