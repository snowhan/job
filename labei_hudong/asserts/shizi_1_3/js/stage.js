$c.s0={
    'id':'s0',
    'desc':'动画播放',
    'data':{
        clips:['p0Start0','p0Start1']
    },
    'events':[
        {'on':'enter','exp':['engine.play:data.clips[0]']},
        {'on':'clip.start:data.clips[0]','exp':['$p.SkipPanel.show:c']},
        {'on':'clip.end:data.clips[0]','exp':['$p.SkipPanel.hide']},
        {'on':'clip.end:data.clips[1]','to':'s1'},
        {'on':'leave','exp':[]}
    ]
};
$c.s0h={
    'id':'s0h',
    'desc':'动画播放,辅助s0，用于level的skip',
    'data':$c.s0.data,
    'events':[
        {'on':'enter','exp':['engine.play:data.clips[1]']},
        {'on':'clip.end:data.clips[1]','to':'s1'},
        {'on':'leave','exp':[]}
    ]
};

$c.s1={
    'id':'s1',
    'desc':'答题场景',
    'data':{
        'idx':-1,                /*当前题目在集合中的序号*/
        'level':0,               /*关卡，从0开始*/
        'need':false,           /*当前选项的正确答案序号*/
        'okClip':false,         /*回答正确的clip ID*/
        'failClip':false,      /*回答错误的clip ID*/
        'clip':false,           /*当前题目对应的clip的ID*/
        'page': false,          /*选项页面ID*/
        'btns':[]               /*选项页面按钮*/
    },
    'events':[
        {'on':'enter','exp':['$p.nextTopic'/*,'engine.play:data.clip'*/]},/*上一个clip有next属性*/

        {'on':'clip.end:data.clip','exp':['engine.showPage:data.page','$p.TipPanel.show:1']},
        {'on':'clip.end:data.okClip','exp':['$p.next']},
        {'on':'clip.end:data.failClip','exp':['engine.play:data.clip']},

        {'on':'select:data.btns[0]','test':['data.need','==','0'],
            'ok':['engine.hidePage:data.page','engine.play:data.okClip'],
            'fail':['engine.hidePage:data.page','engine.play:data.failClip']},
        {'on':'select:data.btns[1]','test':['data.need','==','1'],
            'ok':['engine.hidePage:data.page','engine.play:data.okClip'],
            'fail':['engine.hidePage:data.page','engine.play:data.failClip']},
        {'on':'select:data.btns[2]','test':['data.need','==','2'],
            'ok':['engine.hidePage:data.page','engine.play:data.okClip'],
            'fail':['engine.hidePage:data.page','engine.play:data.failClip']},
        {'on':'select:data.btns[3]','test':['data.need','==','3'],
            'ok':['engine.hidePage:data.page','engine.play:data.okClip'],
            'fail':['engine.hidePage:data.page','engine.play:data.failClip']}
    ]
};
$c.s2={
    'id':'s2',
    'desc':'结束场景',
    'events':[
        {'on':'enter','exp':['engine.play:end']},
        {'on':'clip.end:end','exp':['$p.EndPanel.show']},
        {'on':'leave','exp':['$p.EndPanel.hide']}
    ]
};

$c.engine={
    'media':$c.media,
    'pages':[$c.pg0,$c.pgB,$c.pgE,$c.pgS],
    'stages':[$c.s0,$c.s0h,$c.s1,$c.s2],
    'events':[
        {'on':'select:pBb1','exp':['$p.BackPanel.hide']},
        {'on':'select:pBb2','exp':['$p.exit']},
        {'on':'select:pEb1','exp':['$p.exit:$c.homeUrl']},
        {'on':'select:pEb2','exp':['$p.skipLevel:0','$g.Engine.curStage:s0h']},
        {'on':'select:pEb3','exp':['$p.skipLevel:0','$g.Engine.curStage:s0h']},
        {'on':'select:pEb4','exp':['$p.skipLevel:1','$g.Engine.curStage:s0h']},
        {'on':'select:pEb5','exp':['$p.skipLevel:2','$g.Engine.curStage:s0h']},
        {'on':'select:pEb6','exp':['$p.skipLevel:3','$g.Engine.curStage:s0h']},
        {'on':'select:pSb1','exp':['$p.SkipPanel.show:e']},
        {'on':'select:pSb2','exp':['$p.SkipPanel.show:c']},
        {'on':'select:pSb3','exp':['$p.SkipPanel.hide','$p.skipLevel:0','$g.Engine.curStage:s0h']},
        {'on':'select:pSb4','exp':['$p.SkipPanel.hide','$p.skipLevel:1','$g.Engine.curStage:s0h']},
        {'on':'select:pSb5','exp':['$p.SkipPanel.hide','$p.skipLevel:2','$g.Engine.curStage:s0h']},
        {'on':'select:pSb6','exp':['$p.SkipPanel.hide','$p.skipLevel:3','$g.Engine.curStage:s0h']}
    ]
};