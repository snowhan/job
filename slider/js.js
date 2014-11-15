function slider_demo(demo_id,speed){
    var snow_demo = document.getElementById(demo_id);
    snow_demo.innerHTML += '<ol id="snow-tagNum"></ol>';
    snow_demo.getElementsByTagName('div')[0].id = 'snow-bannerDiv';
    var bannerDiv = document.getElementById('snow-bannerDiv')
        ,bannerImg = bannerDiv.getElementsByTagName('li')
        ,imgLength = bannerImg.length
        ,ttop = bannerDiv.offsetTop
        ,bannerTagNum = document.getElementById('snow-tagNum')
        ,intervalId;

    for(var j=1;j<imgLength+1;j++){
        bannerTagNum.innerHTML += '<li value="'+(j-1)+'">'+j+'</li>';
        bannerTagNum.getElementsByTagName('li')[0].className='select';
    }

    //换图片
    function changePic(index) {
        var nowTop = -index*83 + ttop;
        document.getElementsByTagName('ul')[0].style.top = nowTop +'px';
        changeTagNum(index)
    }

    //换数字下标
    function changeTagNum(index){
        for(var i = 0;i < imgLength;i++){
            bannerTagNum.getElementsByTagName('li')[i].className='';
        }
        bannerTagNum.getElementsByTagName('li')[index].className='select';
    }

    //设置定时器
    function timer(){
        var index = 0;
        intervalId = setInterval(function(){
            if(index == imgLength) index = 0;

            changePic(index);
            index++;
        },speed);
    }

    //执行
    timer();

    //鼠标放到图片上停止轮播
    bannerDiv.onmouseover = function(){
        clearInterval(intervalId);
    };

    //鼠标离开图片继续轮播
    bannerDiv.onmouseout = function(){
        timer();
    };

    //点击数字下标展现与之对应的图片
    for(var i = 0;i < imgLength;i++){
        bannerTagNum.getElementsByTagName('li')[i].onclick = function(){
            var index = this.getAttribute('value');
            changePic(index);
        };
    }
}