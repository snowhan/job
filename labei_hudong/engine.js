/*m的属性如下：
 * id:必须，同时页面必须存在对应的<img/>元素
 * inited:默认false
 * enabled:默认true
 * hidden:默认false
 * selected:默认为false
 * status:默认blur,可能值为focus,blur,select,unselect
 * type:push/radio，默认为push(暂不支持toggle按钮)
 * bg：背景图片，如果设置此属性，页面必须存在对应'id-bg'的<img/>元素
 * mask:遮罩透明图片，如果设置此属性，将使用此图片实现按钮隐藏
 * unmask：只读属性，按钮内部会根据按钮状态自动设置此属性
 * cb:回调函数，在路由事件触发后回调
 * link:选中后的跳转链接
 * group:所属按钮组,如果为radio按钮，必须设置此属性
 * img:[f,b,s,u],
 * fn：[f,b,s,u],
 * route:[t,r,b,l]
 *
 * Btn的page属性引用其所属的$g.Page对象
 * */
$g.Btn=function(m){
    var s={};
    s.m=m||{};

    s._getImg=function(i){
        var imgs=this.m.img;
        if(!imgs||imgs.length==0)return'';

        var img = imgs[i];
        /**选中图片默认为focus图片，未选中图片默认为blur图片*/
        if (!img) {
            if (i==3) {img = imgs[1];}
            else if (i==2) {img = imgs[0];}
        }

        return img;
    };

    s._swapImg=function(i){
        /*如果按钮为选中状态，失去焦点后应显示选中图片*/
        if(this.m.type=='radio'&&i==1&& this.m.selected)i=2;
        $g.id(this.m.id).src=this._getImg(i);
        m.unmask=this._getImg(i);
    };

    s._exec=function(i,status){
        this._swapImg(i);
        var m=this.m;
        m.status=status;
        if(status=='select')m.selected=true;
        if(status=='unselect')m.selected=false;
        if(!m.cb||m.cb(this)){
            var fn=m.fn? m.fn[i]:false;
            if(fn)fn(this);
            /*用于Page监听Route回调函数*/
            if(this.page)this.page.onRoute(this);
        }
    };

    s.init=function(){
        var m=this.m;
        if(m.inited)return;
        $g.id(m.id).src=this._getImg(1);
        m.unmask=this._getImg(1);
        if(m.bg)$g.id(m.id+'-bg').src= m.bg;
        $g.set(m,'enabled',true);
        $g.set(m,'hidden',false);
        $g.set(m,'status','blur');
        $g.set(m,'selected',false);
        $g.set(m,'type','push');
        m.inited=true;
    };

    s.focus=function(){
        var m=this.m;
        if(!m.enabled||m.hidden||m.status=='focus')return;
        this._exec(0,'focus');
    };

    s.blur=function(){
        var m=this.m;
        if(!m.enabled||m.hidden|| m.status=='blur')return;
        this._exec(1,'blur');
    };

    s.select=function(){
        var m=this.m;
        if(!m.enabled||m.hidden)return;
        /*push按钮可以多次选中，push按钮不会主动触发unselect事件。
         *radio按钮必须先取消然后才能再次选中*/
        if(m.type=='radio'&& m.selected)return;

        this._exec(2,'select');
        if(m.link)$g.redirect(m.link);
    };

    s.unselect=function(){
        var m=this.m;
        if(!m.enabled||m.hidden||!m.selected)return;
        this._exec(3,'unselect');
    };

    s.show=function(){
        var m=this.m;
        if(!m.hidden)return;

        if(m.mask&&m.unmask){
            $g.unmask(m.id, m.unmask);
            if(m.bg)$g.unmask(m.id+'-bg', m.bg);
        }else{
            $g.show(m.id);
            if(m.bg)$g.show(m.id+'-bg');
        }

        m.hidden=false;
    };

    s.hide=function(){
        var m=this.m;
        if(m.hidden)return;

        if(m.mask){
            $g.mask(m.id, m.mask);
            if(m.bg)$g.mask(m.id+'-bg', m.mask);
        }else{
            $g.hide(m.id);
            if(m.bg)$g.hide(m.id+'-bg');
        }

        m.hidden=true;
    };

    return s;
};

/*m属性包括：
 * id:必须
 * btns:所有按钮
 * mask:设置给按钮的mask属性，用于隐藏按钮
 * inited:默认false
 * hidden:默认true
 * cookie:使用启用cookie，默认为false。用于保存当前焦点
 * fcKey:用于保存当前焦点的cookie，默认为$g.Keys.Focus+id
 * focus:当前获取焦点的btn的id值,默认从cookie获取或取第一个btn
 * cb:回调函数，在路由事件触发后回调，格式为fn(btn,page);
 * recurTotal:迭代查找下一个焦点最大计数，默认为10
 * */
$g.Page=function(m){
    var s={};
    s.m=m||{};
    s.RS={'Btns':{}};/*保存运行时状态*/

    s.onRoute=function(btn){
        var m=this.m;
        if(m.cb)m.cb(btn,this);
        if($g.Engine)$g.Engine.onRoute(btn,this);
    };

    /**如果不传入id，则初始化全部按钮*/
    s.initBtn=function(id){
        var m=this.m;
        var btns= m.btns;
        if(id){
            var b=$g.Array.find('id',id,btns);
            btns=b?[b]:[];
        }

        for(var i= 0,len=btns.length;i<len;i++){
            var bm=btns[i];
            if(bm.inited)continue;
            if(m.mask&&!bm.mask)bm.mask= m.mask;
            var btn=$g.Btn(bm);
            btn.page=this;
            this.RS.Btns[bm.id]=btn;
            btn.init();
            if(m.hidden)btn.hide();
        }
    };

    s.init=function(){
        var m=this.m;
        if(m.inited)return;
        $g.set(m,'hidden',true);
        $g.set(m,'recurTotal',10);
        $g.set(m,'fcKey',$g.Keys.FOCUS+ m.id);
        $g.set(m,'cookie',false);
        if(m.cookie)$g.set(m,'focus',$g.cookie(m.fcKey));
        this.initBtn();
        m.inited=true;
    };

    s.findNextFocus=function(i,id){
        var btn=this.btn(id);
        for(var c= 0,len=this.m.recurTotal;c<len;c++){
            if(!btn||!btn.m.route)return;
            var next=btn.m.route[i];

            if(next&&next.indexOf('to:')==0)return next;

            btn=this.btn(next);
            if(next&&(!btn||btn.m.enabled&&
                !btn.m.hidden))return next;
        }
    };

    /*重新定位焦点，保证页面焦点可见
     * i：路由方向，默认为1*/
    s.refocus=function(i){
        i=$g.undefine(i)?1:i;
        var m=this.m;
        var id= m.focus||m.btns[0].id;

        var btn= this.btn(id);
        if(btn&&(!btn.m.enabled||btn.m.hidden))
            id=this.findNextFocus(i,id);

        btn=this.btn(id);
        if(m.focus==id&&btn&&btn.m.status!='focus')
            m.focus='';/*清空以便重新定位*/
        this.focus(id);
    };

    s.focus=function(id){
        var m=this.m;
        if(m.hidden||m.focus==id||!id)return;

        if(id.indexOf('to:')==-1){
            this.blur(m.focus);
            m.focus=id;
            if(m.cookie)$g.cookie(m.fcKey,id);
            return this.btn(id).focus();
        }

        /*使用to:page1.btn1可定义路由跳转到另一页*/
        if(!$g.Engine)return;

        var v=$g.String.split(id,':');
        v= v.length==2?v[1]:'';
        v=$g.String.split(v,'.');

        var pg=$g.Engine.page(v[0]);
        if(!pg||pg.m.hidden)return;

        this.blur(m.focus);/*避免下一页未显示，而当前页又失去焦点*/
        $g.Engine.focusToPage(v[1],v[0]);
    };

    s.blur=function(id){
        var m=this.m;
        if(m.hidden||!id)return;
        m.focus='';
        if(m.cookie)$g.cookie(m.fcKey,'');
        this.btn(id).blur();
    };

    /**会先获取焦点*/
    s.select=function(id){
        var m=this.m;
        if(m.hidden||!id)return;
        if(m.focus!=id)this.focus(id);

        var btn=this.btn(id);
        if(btn.m.type=='radio'){
            var gp=btn.m.group;
            for(var i=0;i< m.btns.length;i++){
                var b= m.btns[i];
                if(b.type!='radio'||b.id==id)continue;
                /*取消同一组的其它选中的单选按钮*/
                if(b.group&& b.group==gp||!b.group&&!gp)
                    if(b.selected)this.btn(b.id).unselect();
            }
        }

        btn.select();
    };

    /**取消选中不会获取焦点*/
    s.unselect=function(id){
        if(this.m.hidden||!id)return;
        this.btn(id).unselect();
    };

    s.go=function(key){
        var id=this.m.focus;
        if(!id||this.m.hidden)return;

        var K=$g.KeyCodes;
        if (key == K.ENTER) {
            return this.select(id);
        }

        var i = -1;
        if (key == K.UP) {i = 0}
        else if (key == K.RIGHT) {i = 1}
        else if (key == K.DOWN) {i = 2}
        else if (key == K.LEFT) {i = 3}
        else {return;}

        var next=this.findNextFocus(i,id);
        if(next)this.focus(next);
    };

    /**如果不传入id，则显示全部按钮,显示、隐藏单个按钮不会影响page的hidden属性*/
    s.show=function(id){
        if(id)return this.btn(id).show();
        var m=this.m;
        if(!m.hidden)return;
        m.hidden=false;
        var btns=m.btns;
        for(var i=0;i<btns.length;i++){
            this.btn(btns[i].id).show();
        }
    };

    /**如果不传入id，则隐藏全部按钮，显示、隐藏单个按钮不会影响page的hidden属性*/
    s.hide=function(id){
        if(id){
            this.btn(id).hide();
            return this.refocus();
        }
        var m=this.m;
        if(m.hidden)return;
        m.hidden=true;
        var btns=m.btns;
        for(var i=0;i<btns.length;i++){
            this.btn(btns[i].id).hide();
        }
    };

    /*获取页面包含的$g.Btn对象
     * 如果不传入id，则返回指定status的Btn对象数组*/
    s.btn=function(id,status){
        if(id){
            var btn=this.RS.Btns[id];
            if(!status)return btn;
            return btn.m.status==status?btn:false;
        }

        if(status){
            var btns=this.m.btns;
            var rs=[];
            for(var i= 0;i<btns.length;i++){
                var b=btns[i];
                if(b.status==status)rs.push(this.RS.Btns[b.id]);
            }
            return rs;
        }
    };

    return s;
};

/*单例对象
 * m的属性包括：
 * inited:默认为false
 * enabled:默认为true
 * curStage:当前stage的id，默认为''
 * curPage:当前显示page的id，默认为''
 * data:{}
 * events:[]
 * media:{url:'',clips:[]} 媒体资源
 * pages:[]
 * stages:[]
 * */
$g.Engine={
    'm':{},/*model*/
    'RS':{'Pages':{}},/*保存运行时状态*/
    /*获取表达式参数值，主要为使右表达式和方法参数值支持$c表达式*/
    '_v':function(v,ctx){
        if(!v|| v.indexOf('.')==-1)return v;
        if(v.indexOf('$c.')==0){
            if($c)return $g.Exp.get(v,{'$c':$c});
        }else{
            if(ctx)return $g.Exp.get(v,ctx);
        }

        return v;
    },
    '_execExp':function(exps,ctx){
        if(!exps||!ctx)return;
        var s=$g.Engine;
        for(var i=0;i<exps.length;i++){
            var exp=exps[i];
            if(exp.indexOf('=')!=-1){
                var v=$g.String.split(exp,'=');
                $g.Exp.exec('=',v[0],s._v(v[1],ctx),ctx);
            }else{
                var v=$g.String.split(exp,':');
                var cx=false;
                if(v[0].indexOf('$')==0){
                    var ex=$g.String.split(v[0],'.');
                    switch (ex[0]){
                        case '$g':cx=$g;break;
                        case '$p':cx=$p;break;
                        default :break;
                    }
                    if(cx){
                        ex=$g.Array.slice(ex,1);
                        v[0]=$g.Array.join(ex,'.');
                    }
                }

                $g.Exp.invoke(v[0],cx||ctx,s._v(v[1],ctx),s._v(v[2],ctx),s._v(v[3],ctx));
            }
        }
    },
    '_execTest':function(test,ctx){
        if(!test||!ctx)return true;
        var s=$g.Engine;
        if(test[0]=='exist')return $g.Exp.exist(test[1],ctx);

        return $g.Exp.exec(test[1],s._v(test[0],ctx),s._v(test[2],ctx));
    },
    /*把ctx.events array转换为ctx.handlers map，key为事件类型,
    * 以避免循环查找handler导致的性能低的问题*/
    '_initHandler':function(ctx){
        var s=$g.Engine;
        ctx=ctx==s?s.m:ctx;
        if(ctx.handlers)return;

        ctx.handlers={};
        var es=ctx.events;
        for(var i= 0;i<es.length;i++){
            var e=es[i];
            ctx.handlers[e.on]=e;
        }
    },
    '_getHandler':function(e,ctx){
        var s=$g.Engine;
        ctx=ctx==s?s.m:ctx;
        var handler=ctx.handlers[e.type];
        if(handler)return handler;
        if(handler==-1)return ;/*说明不存在*/
        if(ctx==s.m) {
            return;
        }

        /*说明事件类型可能使用了变量*/
        var es=ctx.events||[];
        for(var i=0;i<es.length;i++){
           var ev=$g.String.split(es[i].on,':');
           var t=ev[0]+':'+ s._v(ev[1],ctx);
           if(t==e.type){
               ctx.handlers[t]=es[i];
               return es[i];
           }
        }

        /*说明找不到handler，对应handlers设置为-1*/
        ctx.handlers[e.type]=-1;
    },
    /*ctx可能为engine或stage对象*/
    '_execHandler':function(e,ctx){
        var s=$g.Engine;

        var handler= s._getHandler(e,ctx);
        if(!handler)return;

        var test=handler['test'];
        var ok=s._execTest(test,ctx);

        var to=handler['to'];
        if(to&&ok){return s.curStage(to);}

        var action=handler['action'];
        if(action&&ok){return action(e,ctx);}

        var exp=handler['exp'];
        if(exp&&ok){return s._execExp(exp,ctx);}

        exp=ok?handler['ok']:handler['fail'];
        s._execExp(exp,ctx);
    },
    /*初始化设置clip的next属性值*/
    '_initNextClip':function(){
        var clips=$g.Engine.m.media.clips;
        if(!clips||clips.length==0)return;

        for(var i=0;i<clips.length;i++){
            var clip=clips[i];
            if(clip.next)clip.next=$g.Array.find('id',clip.next,clips);
        }
    },
    'onRoute':function(btn,page){
        var type=btn.m.status+':'+btn.m.id;
        /*不激活blur与focus事件*/
        if(status=='blur' || status == 'focus') return;
        $g.Engine.fire($g.Engine.Event(type,btn));
    },
    'onPlayerPropChange':function(pn,op,np){
        /*暂时只需要statu改变事件*/
        if(pn!='statu'||!$g.Engine.m.media)return;
        var data={'pn':pn,'op':op,'np':np};
        /*var type='player.change:'+pn;
         if(pn=='statu')type='player.status:'+np;*/
        var type='player.status:'+np;
        $g.Engine.fire($g.Engine.Event(type,data));
    },
    'onClipPlayStart':function(clip){
        if(!$g.Engine.m.media)return;
        $g.Engine.fire($g.Engine.Event('clip.start:'+clip.id,clip));
    },
    'onClipPlayEnd':function(clip){
        if(!$g.Engine.m.media)return;
        $g.Engine.fire($g.Engine.Event('clip.end:'+clip.id,clip));
    },
    '__debug':function(key){
        /*按翻页键跳转场景，TODO 正式环境应注释掉此方法*/
        var i=0;
        var K=$g.KeyCodes;
        if(key==K.PAGE_UP)i=-1;
        if(key==K.PAGE_DOWN)i=1;
        if(i==0)return;

        var s=$g.Engine;
        var st= s.m.curStage;
        if(!st)return;

        var idx=$g.Array.index('id',st, s.m.stages);
        var un= s.m.stages[idx+i];
        if(un)s.curStage(un.id);
    },
    /*m.enabled为false，调用此方法无效*/
    'go':function(key){
        // 监听互动播放器事件
        $g.InteractPlayer.listen(key);

        if(key>300)return;/*忽略虚拟按键事件*/
        var s=$g.Engine;
        if(!s.m.enabled)return;
        var pg= s.page(s.m.curPage);
        if(pg&&!pg.m.hidden)pg.go(key);
        /*取消捕捉keydown事件*/
        //s.fire($g.Engine.Event('keydown:'+key,key));
        //s.__debug(key);
    },
    'init':function(isHD){
        var s=$g.Engine;
        var m=s.m;
        if(m.inited)return;
        $g.set(m,'enabled',true);
        $g.set(m,'data',{});
        s._initHandler(s);

        if(m.media){
            s._initNextClip();

            var clip = m.media.clips[0];
            // 初始化互动播放器
            $g.InteractPlayer.init(isHD, clip);
        }

        if(m.curPage)s.showPage(m.curPage);
        if(m.curStage)s.start(m.curStage);
        m.inited=true;
    },
    /*获取stage模型对象*/
    'stage':function(id){
        return $g.Array.find('id',id,$g.Engine.m.stages);
    },
    /*切换当前stage*/
    'curStage':function(id){
        var s=$g.Engine;
        var m=s.m;
        var os=s.stage(m.curStage);
        if(!id||m.curStage==id)return os;

        if(os){
            s.fire($g.Engine.Event('leave',os));
            os.engine=false;
        }

        var ns=s.stage(id);
        s._initHandler(ns);
        m.curStage=id;
        ns.engine=s;
        s.fire($g.Engine.Event('enter',ns));
    },
    /* 触发事件，m.enabled为false，调用此方法无效
     * 默认事件e将传给curStage，如果e.stop==true则取消传递*/
    'fire':function(e){
        var s=$g.Engine;
        var m=s.m;
        if(!m.enabled||!m.inited||!e||!e.type)return;
        s._execHandler(e,s);
        var cs=s.curStage();
        if(!e.stop&&cs)
            s._execHandler(e,cs);
    },
    /*id:场景id,默认为第1个stage*/
    'start':function(id){
        var m=$g.Engine.m;
        if(m.media) {
            $g.InteractPlayer.playVideo(m.media.url);
        }

        if(!id&& m.stages&& m.stages.length>0)
            id= m.stages[0].id;
        if(id)$g.Engine.curStage(id);
    },
    'stop':function(){
        var s=$g.Engine;
        var os=s.stage(s.m.curStage);

        if(os){
            s.fire($g.Engine.Event('leave',os));
            os.engine=false;
        }
    },
    /**获取Page对象*/
    'page':function(id){
        return $g.Engine.RS.Pages[id];
    },
    'initPage':function(id){
        var s=$g.Engine;
        var pg=$g.Array.find('id',id,s.m.pages);
        if(!pg||pg.inited)return;

        var page=$g.Page(pg);
        s.RS.Pages[id]=page;
        page.init();
    },
    /**播放视频片断*/
    'play':function(id){
        var m=$g.Engine.m;
        if(!m.media)return;
        var clip=$g.Array.find('id',id,m.media.clips);
        if(clip)$g.InteractPlayer.playClip(clip);
    },
    /*如果page未初始化，则会初始化
    * hideCurPage:是否隐藏前一显示页，默认为true
    * resetCurPage：是否设置engine的curPage属性为当前显示页，默认为true*/
    'showPage':function(id,hideCurPage,resetCurPage,refocus){
        hideCurPage=$g.undefine(hideCurPage)?true:hideCurPage;
        resetCurPage=$g.undefine(resetCurPage)?true:resetCurPage;

        var s=$g.Engine;
        s.initPage(id);
        var page=s.page(id);
        if(!page||id==s.m.curPage&&!page.m.hidden)return;

        if(hideCurPage)s.hidePage(s.m.curPage);
        if(resetCurPage)s.m.curPage=id;
        page.show();
        page.refocus();
    },
    'hidePage':function(id,resetCurPage){
        resetCurPage=$g.undefine(resetCurPage)?true:resetCurPage;

        var s=$g.Engine;
        var page=s.page(id);
        if(!page||page.m.hidden)return;
        if(resetCurPage)s.m.curPage='';
        page.hide();
    },
    /*把焦点移动到另一页的id指定的元素上，此方法用于在多个页面上移动焦点，
    * 如果page还未初始化或未显示，则调用此方法直接返回*/
    'focusToPage':function(id,page){
        var s=$g.Engine;
        var p= s.page(page);
        if(!p|| p.m.hidden)return;

        s.m.curPage=page;
        p.focus(id);
        p.refocus();
    },
    'showBtn':function(id,page){
        var p=$g.Engine.page(page||$g.Engine.m.curPage);
        if(p&&id)p.show(id);
    },
    'hideBtn':function(id,page){
        var p=$g.Engine.page(page||$g.Engine.m.curPage);
        if(p&&id)p.hide(id);
    },
    'focusBtn':function(id,page){
        var p=$g.Engine.page(page||$g.Engine.m.curPage);
        if(p&&id)p.focus(id);
    },
    'selectBtn':function(id,page){
        var p=$g.Engine.page(page||$g.Engine.m.curPage);
        if(p&&id)p.select(id);
    },
    'Event':function(type,data){
        return {'type':type,'data':data};
    }
};