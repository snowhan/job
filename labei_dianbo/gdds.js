(function () {
    var hackString = function () {
        var sp = String.prototype;
        if (!sp)return;

        sp.substr = sp.substr || function (start, length) {
            len = this.length;
            length = length || len;
            if (length > len)length = len;
            if (start < 0)start = 0;
            var r = '';
            for (var i = start; i < length; i++) {
                r += this[i];
            }
            return r;
        };
    };

    var hackArray = function () {
        var ap = Array.prototype;
        if (!ap)return;

        ap.push = ap.push || function (item) {
            if (!item)return;
            if (!this.length)this.length = 0;
            this[this.length] = item;
        }
    };

    hackString();
    hackArray();

}());

window.$p={};/**存储页面相关属性*/
window.$c={};/**存储配置属性*/
window.$d={};/**存储后台推送数据属性*/
window.$g={};/**存储前台框架属性*/

/**初始化客户端设置*/
$g.init = function () {
    /**ipanel浏览器去掉边框设为-1，边框消失,iPanel.focusWidth = 0;设为0或1，边框为默认大小*/
    try {
        var i=iPanel;
        if (i) {
            i.focusWidth = -1;
            if (i.focus) {
                i.focus.width = 0;
                i.focus.borders = 0;
                i.focus.cyclicfocus = 0;
            }
        }
    } catch (e) {};
};

$g.KeyCodes = {
    'BACK': 8,
    'ENTER': 13,
    'LEFT': 37,
    'UP': 38,
    'RIGHT': 39,
    'DOWN': 40,
    'NUM_0': 48,
    'NUM_1': 49,
    'NUM_2': 50,
    'NUM_3': 51,
    'NUM_4': 52,
    'NUM_5': 53,
    'NUM_6': 54,
    'NUM_7': 55,
    'NUM_8': 56,
    'NUM_9': 57,
    'PAGE_UP': 33,
    'PAGE_DOWN': 34,
    'FAVORITE': 281,
    'FAST_UP': 264,
    'FAST_DOWN': 265,
    'PLAY':263,
    'STOP':270,
    'LOCATE':271,   // 定位键
    'VOL_UP':259,
    'VOL_DOWN':260,
    'MUTE':261
};

/**元素状态，目前用于保存隐藏的元素*/
$g.ELStatus={};

/*设置元素状态*/
$g.status=function(id,k,v){
    var o=$g.ELStatus[id];
    if(!o){o={};$g.ELStatus[id]=o;};
    if($g.undefine(v))return o[k];
    o[k]=v;
}

/**页面编码*/
$g.PageCodes = {
    /**首页**/
    'HOME':'home',
    /**二级页面——才艺天地**/
    'CY':'cy',
    /**二级页面——拉贝学堂**/
    'XT':'xt',
    /**二级页面——父母中心**/
    'FM':'fm',
    /**二级页面——成长加油站**/
    'JY':'jy',
    /**二级页面——绘本馆**/
    'HB':'hb',
    /**我的小屋**/
    'MY_HOUSE':'myhouse',
    /**三级页面**/
    'VIDEO_LIST':'videolist',
    /**三级页面-绘本**/
    'HUIBEN_PLAY':'huibenplay',
    /**视频播放页面**/
    'VIDEO':'video',
    /**专题-爱得叔叔**/
    'ADSS':'adss',
    /**专题-财商小博士**/
    'CSXBS':'csxbs'
};

/**目前用于Cookie的key值*/
$g.Keys = {
    'CUR_PAGE': 'gddsCurrentPage',
    'FOCUS': 'gddsFocus'
};

$g.log=function(info){
    info=$g.log.count+':'+info;
    var log=$g.id('log');
    if($g.log.count==10){
        $g.log.count=0;
    }else{
        $g.log.count++;
        info=log.innerHTML+'<br/>'+info;
    }
    log.innerHTML=info;
};
$g.log.count=0;

$g.event = function (e) {
    return e || window.event;
};

$g.ready = function (cb) {
    window.onload = cb;
};

$g.unload = function (cb) {
    window.onunload= cb;
};

$g.onkeydown = function (cb) {
    document.onkeypress = cb;
    // document.onkeydown= cb;
};

$g.redirect = function (url) {
    window.location.href = url;
};

$g.id = function (id) {
    return document.getElementById(id);
};

$g.bodyBg=function(url){
    document.body.style.backgroundImage='url("'+url+'")';
}

$g.show = function (id) {
    $g.id(id).style.visibility = 'visible';
    $g.status(id,'visible','v');
};

$g.hide = function (id) {
    $g.id(id).style.visibility = 'hidden';
    $g.status(id,'visible','h');
};

/*在某些机顶盒上，当要显示、隐藏的元素超过6个速度会很慢，
此时需要使用以下方法，使用透明图片实现显示，隐藏的效果*/
$g.mask=function(id,img){
    $g.id(id).src=img;
    $g.status(id,'visible','h');
};

$g.unmask=function(id,img){
    $g.id(id).src=img;
    $g.status(id,'visible','v');
};

$g.isHide = function (id) {
    return $g.status(id,'visible')=='h';
};

$g.showAll=function(ids){
  for(var i= 0;i<ids.length;i++)
    $g.show(ids[i]);
};

$g.hideAll=function(ids){
    for(var i= 0;i<ids.length;i++)
        $g.hide(ids[i]);
};

$g.cookie = function (k,v,p) {
    p=p||'/';
    if (v) {
        document.cookie = (k + '=' + v+';path='+p);
        return;
    }

    var cookie = document.cookie;
    var start = cookie.indexOf(k + '=');
    if (start == -1)return;

    start = cookie.indexOf('=', start) + 1;
    var end = cookie.indexOf(';', start);
    if (end == -1)end = cookie.length;
    return cookie.substr(start, end - start);
};

$g.undefine=function(v){
    return (typeof v==='undefined');
};


$g.extend=function(c,p,props){
    if(!c||!p||!props)return c;
    for(var i= 0,len=props.length;i<len;i++){
        var prop=props[i];
        if(prop)c[prop]=p[prop];
    }

    return c;
};

/**有关Array的util方法*/
$g.Array={
    /**从values数组匹配value获取索引值i，然后返回keys[i]*/
    'key':function(value,values,keys){
        if($g.undefine(value)||!keys||!values)return;
        var i=$g.Array.indexOf(value,values);
        return keys[i];
    },
    'find':function(key,value,items){
        if(!items)return;

        for(var i= 0,len=items.length;i<len;i++){
            var item=items[i];
            if(item&&item[key]==value)
                return item;
        }
        return false;
    },
    'index':function(key,value,items){
        if(!items)return -1;

        for(var i= 0,len=items.length;i<len;i++){
            var item=items[i];
            if(item&&item[key]==value)
                return i;
        }
        return -1;
    },
    'indexOf':function(value,items){
        if(!items)return -1;

        for(var i= 0,len=items.length;i<len;i++){
            var item=items[i];
            if(item==value)return i;
        }
        return -1;
    }
};

/**URL编码器*/
$g.URLEncoder={
    'SpecChars':[['=', '/', '?', '&', ' ', ':', '@', '+', '$', '#', ','],
                 ['3D','2F','3F','26','20','3A','40','2B','24','23','2C']],
    'encode':function(url){
        if(!url||url.length==0)return url;

        var r='';
        for(var i=0;i<url.length;i++){
            var c=url.substr(i,1);
            var v=$g.Array.key(c,this.SpecChars[0],this.SpecChars[1]);
            r+=(v?'%'+v:c);
        }
        return r;
    },
    'decode':function(url){
        if(!url||url.length==0)return url;

        var r='';
        for(var i=0;i<url.length;i++){
            var c=url.substr(i,1);
            var k=false;

            if(c=='%'){
                var v=url.substr(i+1,2);
                k=$g.Array.key(v,this.SpecChars[1],this.SpecChars[0]);
            }

            if(k){r+=k;i+=2;}
            else{r+=c;}
        }

        return r;
    }
}

/**用于滚动条目，参数包括(参数值可在创建roller对象后修改)：
 * startFlag:开始标志，一般为用于显示数据的页面元素id，下同
 * endFlag:结束标志
 * flagTotal:标志总数
 * items:数据项
 * cb：回调函数，格式为fn(type,roller)
 * type:可为prev,next,first,last,
 * roller:当前滚动对象
 **/
$g.Roller = function (startFlag, endFlag, flagTotal,items) {
    var s = {};
    s.startFlag = startFlag;
    s.endFlag = endFlag;
    s.flagTotal = flagTotal;
    s.cb =false;

    /**用于滚动的数据项*/
    s.items=function(items){
        if(!items)return this._items;
        this._items=items;/**私有变量，勿直接修改*/
        this.index =this.flagTotal;/**当前指向的数据项,以1开始*/
        this.start =0;/**当前滚动后数据项的开始索引值*/
        this.end =this.flagTotal;/**当前滚动后数据项的结束索引值*/
    };

    s.items(items||[],s);

    /**flag为当前的定位标志，key为按键值，暂仅支持左，右键*/
    s.roll = function (flag,key) {
        var start = -1;
        var type = false;

        if (flag == this.startFlag && key == $g.KeyCodes.LEFT) {
            if (this.index == this.flagTotal)return;
            this.index--;
            type = (this.index == this.flagTotal) ? 'first' : 'prev';
            start = this.index - this.flagTotal;
        } else if (flag == this.endFlag && key == $g.KeyCodes.RIGHT) {
            if (this.index == this._items.length)return;
            this.index++;
            type = (this.index == this._items.length) ? 'last' : 'next';
            start = this.index - this.flagTotal;
        }

        if (start < 0 || !type)return;
        this.start = start;
        this.end = start + this.flagTotal;
        this.cb(type, this);
    }

    return s;
};

/**定时滚动条目
 * items：需要显示的数据项
 * time：多少毫秒后超时
 * cb，回调函数，格式为cb(roller)
 * 注意：在某些机顶盒执行回调函数时，可能已经回收如下的s对象，或者在s的对象方法里，
 * 访问不到s的属性值。为了解决这些问题，首先需要s对象赋给全局变量，其次在调用s方法
 * 时需要重新传回s对象，以便能找到s的属性值*/
$g.TimeoutRoller = function (items) {
    var s={};
    s.count =0;/**从0开始，导致第1次超时取到的是第2个数据项*/
    s.current = false;
    s.items = items;
    s.cb = false;

    s.roll = function () {
        this.count++;
        if (this.count >= this.items.length)this.count = 0;
        this.current = this.items[this.count];
        this.cb(this);
    };

    return s;
};

/**翻页,参数如下：
 * items:需要显示的数据项
 * size:每页显示多少项,必须小于或等于items总数
 * cb:回调函数，格式为cb(pager)*/
$g.Pager = function (size,items) {
    var s = {};

    /**为了避免使用Math对象的方法*/
    s._getTotal = function (length, size) {
        if (length == 0)return 0;

        var count = 0;
        var total = 0;
        for (var i = 0; i < length; i++) {
            count++;
            if (count == size) {
                count = 0;
                total++;
            }
        }
        if (count != 0 && count < size) {
            total++;
        }
        return total;
    };


    s.size = size;/**每页显示条目数*/
    s.cb = false;/**回调函数,格式为fn(pager)*/

    /**需要翻页的数据项*/
    s.items = function (items) {
        if (!items)return this._items;
        this._items = items;/**私有变量，勿直接修改*/
        this.count = this._items.length;/**总条目数*/
        this.current = 0;/**当前页，以1开始*/
        this.total = this._getTotal(this.count, this.size);/**总页数,以1开始*/
        this.currentItems = [];/**当前页面的数据项*/
    };

    s.items(items || [],s);

    /**是否首页*/
    s.isFirst = function () {
        return this.current == 1;
    };

    /**是否末页*/
    s.isLast = function () {
        return this.current == this.total;
    };

    /**前一页*/
    s.prev = function () {
        this.skip(this.current - 1);
    };

    /**后一页*/
    s.next = function () {
        this.skip(this.current + 1);
    };

    /**根据按键值翻页*/
    s.go = function (key) {
        if (key == $g.KeyCodes.PAGE_UP) {
            this.prev();
        } else if (key == $g.KeyCodes.PAGE_DOWN) {
            this.next();
        }
    };

    /**跳到指定页数,页数以1开始*/
    s.skip = function (page) {
        if (this.total == 0) {
            this.currentItems = [];
            this.cb(this);
            return;
        }

        if (page < 1 || page > this.total)return;

        if (page == 1 && this.isFirst() ||
            page == this.total && this.isLast())return;

        this.current =parseInt(page);
        this.currentItems = [];
        var start = (page - 1) * this.size;
        var end = start + this.size;
        end = end < this.count ? end : this.count;
        for (var i = start, j = 0; i < end; i++, j++) {
            this.currentItems[j] = this._items[i];
        }
        this.cb(this);
    };

    return s;
};

/**焦点路由，用于管理元素焦点*/
$g.FocusRouter = function (fcKey) {
    var s = {};

    s._isValid = function (id) {
        if (!id || $g.isHide(id))return false;

        var route = this.routes[id];
        return route&&!route.disabled;
    };

    s._isHandled=function(type,id){
        return this.cb&&this.cb(type, id, this);
    };

    s._getGId = function (id) {
        var route = this.routes[id];
        if (route && route.group)
            return route.group;
        return 'root';
    };

    s._getImg = function (option, index) {
        if (!option || !option.img)
            return false;

        var imgs = option.img;
        var img = imgs[index];

        /**选中图片默认为focus图片，未选中图片默认为blur图片*/
        if (!img) {
            if (index==3) {img = imgs[1];}
            else if (index==2) {img = imgs[0];}
        }

        return img;
    }

    s._swapImg = function (id,index) {
        var gid = this._getGId(id);
        if (index == 1) {
            /**如果当前元素被选中且不属于root组，失去焦点后应显示选中时的图片*/
            var sid = this.currentSelects[gid];
            if (sid == id&&gid!='root')index = 2;
        }

        var group = this.groups[gid];
        var img = this._getImg(group, index);
        if (img)$g.id(id).src = img;

        var route = this.routes[id];
        img = this._getImg(route, index);
        if (img)$g.id(id).src = img;
    };

    s._exec = function (id,index) {
        this._swapImg(id,index);

        var group = this.groups[this._getGId(id)];
        if (group && group.fn) {
            var fn = group.fn[index];
            if (fn)fn(id, this);
        }

        var route = this.routes[id];
        if (route && route.fn) {
            var fn = route.fn[index];
            if (fn)fn(id, this);
        }
    };

    s.findNextValid=function(id,index){
        var route=this.routes[id];
        var next=route&&route.path?route.path[index]:false;

        if(!this.enableRecurFind||this._isValid(next)||
            this.recurCount==this.recurTotal){
            this.recurCount=0;
            return this._isValid(next)?next:false;
        }

        this.recurCount++;
        return this.findNextValid(next,index,this);
    }

    /**设置是否启用router*/
    s.enable=true;

    /**保存当前焦点元素的cookie的key名称*/
    s.fcKey=fcKey;

    /**当前获取焦点的元素*/
    s.currentFocus = false;

    /**当前选中的元素，可能包含多个，格式为{gid:id}*/
    s.currentSelects = {};

    /**路由信息,格式如下：
     * id:{'path':[u,r,d,l],'fn':[f,b,s,u],'img':[f,b,s,u],'group':'root','link':'url'}
     * id:可获取焦点的元素id，建议使用img元素,div元素仅作为排版
     * path:元素焦点路由路径，u,r,d,l分别表示上，右，下，左
     * fn:(可选)元素路由事件回调函数，f,b,s,u分别对应4个路由事件onfocus,onblur,onselect,onunselect
     * img:(可选)元素图片,在路由事件触发后会自动设置对应的图片,f,b,s,u意义同上
     * group:(可选)元素所属组，默认为root。具体见this.groups属性说明
     * link:(可选)选中元素后的目标跳转地址
     * disabled:(可选)此路由是否失效，默认为false
     *
     * 回调函数格式为:fn(id,router)
     * id:当前触发事件的元素id
     * router：当前router对象，可获取router.routes/router.groups等数据
     * */
    s.routes = {};

    /**元素分组信息，目前用于控制按钮组状态以及设置同一组元素的回调函数和图片等，
     * 路由事件触发后会先执行分组信息定义的回调函数。格式如下：
     * gid:{'fn':[f,b,s,u],'img':[f,b,s,u]}
     * gid：组id，需要与路由信息的'group'属性值对应
     * fn和img定义与routes的定义相同
     * */
    s.groups = {};

    /**总回调函数，如果返回false，则不会执行默认操作.
     * 回调函数格式fn(type,id,router),参数说明如下：
     * type:需要执行的操作类型，可能为focus,blur,select,unselect
     * id:被操作的元素id值
     * router：当前FocusRouter对象
     * */
    s.cb = false;

    /**如果获取的下一个路由路径无效，总共允许迭代多少次以获取有效路径*/
    s.recurTotal=10;
    /**当前迭代查找有效路径的次数*/
    s.recurCount=0;
    /**是否启用迭代查找下一个有效路由*/
    s.enableRecurFind=true;

    /**设置路由失效、生效*/
    s.enableRoute = function (id, v) {
        var route = this.routes[id];
        if (route)route.disabled = !v;
    };

    /**元素获取焦点*/
    s.focus = function (id) {
        if(!this.enable||this._isHandled('focus', id))return;
        if (!this._isValid(id))return;
        if (this.currentFocus == id)return;

        this.blur(this.currentFocus);
        this.currentFocus = id;
        $g.cookie(this.fcKey,id);

        this._exec(id,0);
    };

    /**元素失去焦点*/
    s.blur = function (id) {
        if(!this.enable||this._isHandled('blur', id))return;
        if (!this._isValid(id))return;

        this.currentFocus = false;
        this._exec(id,1);
    };

    /**选中元素，如果元素未获取焦点，会先获取焦点*/
    s.select = function (id) {
        if(!this.enable||this._isHandled('select', id))return;
        if (!this._isValid(id))return;

        this.focus(id);

        var gid = this._getGId(id);
        var oldSelect = this.currentSelects[gid];

        /**如果当前选中元素属于root组，可以再次选中*/
        if (oldSelect == id&&gid!='root')return;

        if(oldSelect!=id){
            this.unselect(oldSelect);
            this.currentSelects[gid] = id;
        }

        this._exec(id,2);
        var route = this.routes[id];
        if (route && route.link) {
            $g.redirect(route.link);
        }
    };

    /**取消选中元素，不会导致元素失去焦点*/
    s.unselect = function (id) {
        if(!this.enable||this._isHandled('unselect',id))return;
        if (!this._isValid(id))return;

        var gid = this._getGId(id);
        this.currentSelects[gid] = false;
        this._exec(id,3);
    };

    /**根据传入的按键值移动元素焦点或选中元素*/
    s.go = function (key) {
        if(!this.enable)return ;

        var K = $g.KeyCodes;
        if (key == K.ENTER){
            this.select(this.currentFocus);
            return;
        }

        var index = -1;
        if (key == K.UP) {index = 0}
        else if (key == K.RIGHT) {index = 1}
        else if (key == K.DOWN) {index = 2}
        else if (key == K.LEFT) {index = 3}
        else {return;}

        var id=this.findNextValid(this.currentFocus,index);
        this.focus(id);
    };

    return s;
};


/* 用于实现类似儿歌的固定中间项翻页滚动功能
 * flag:定义元素id,
 * range:要额外显示的数据项取值范围
 * items：数据项
 * cb:回调函数，格式为fn(type,roller)  type可能值为prev,next
 * */
$g.CycleRoller=function(flag,range,items){
    var s={};
    s.flag=flag;
    s.range=range;
    s.cb=false;

    s.resetIndexes=function(){
        this.indexes=[];
        if(this.range==0)
            return this.indexes.push(this.index);

        var c=this.range*2+1;
        var len=this._items.length;
        var start=this.index-this.range;
        for(var i= 0;i<c;i++){
            var v=start>=0?start:start+len;
            v=v<len?v:v-len;
            start++;
            this.indexes.push(v);
        }
    };
    s.items=function(items){
        if(!items)return this._items;
        this._items=items;
        this.index=0;/*当前数据项索引值*/
        this.indexes=[];/*当前要显示的全部数据项索引值*/
        this.resetIndexes();
    };
    s.items(items);

    /*orientation:滚动方向，
    *可能值：h(水平，默认值)，v(垂直)*/
    s.roll=function(flag,key,orientation){
        if(this.flag!=flag||!this._items)return;
        var len=this._items.length;
        var type=false;
        var L=$g.KeyCodes.LEFT;
        var R=$g.KeyCodes.RIGHT;
        if(orientation=='v'){
            L=$g.KeyCodes.UP;
            R=$g.KeyCodes.DOWN;
        }
        if(key==L){
            type='prev';
            this.index--;
            if(this.index<0)this.index=len-1;
        }else if(key==R){
            type='next';
            this.index++;
            if(this.index>=len)this.index=0;
        }

        if(type&&this.cb){
            this.resetIndexes();
            this.cb(type,this);
        }
    };

    return s;
};
