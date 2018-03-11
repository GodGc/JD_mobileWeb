/* Created by GodC on 2018/3/9.*/
//等页面加载完毕之后进行事件处理
window.onload = function () {
    //header滚动透明度改变事件
    headerScroll();
    //秒杀倒计时的效果
    cutDownTime();
    //轮播图的效果
    banner();
}

//header方法：1、获取导航栏距离距离页面顶部的距离（在导航栏处透明度为1）
            //2、在onscroll事件中获取到滚动的距离
            //3、滚动的距离/导航栏距离 = 透明度 大于1变为1 小于1变为0.X
function headerScroll(){
    //1.获取元素    导航栏高度、页面滚动高度
    //console.log("自身的高度offsetHeight："+document.querySelector(".jd_nav").offsetHeight);
    //console.log("页面头部到元素的高度offsetTop："+document.querySelector(".jd_nav").offsetTop);
    //希望得到的值是 页面头部到元素底部的高度 所以相加
    var navDom = document.querySelector(".jd_nav");
    var maxDistance = navDom.offsetTop + navDom.offsetHeight;

    //再获取顶部的通栏
    var headerDom = document.querySelector(".jd_header_box");
    headerDom.style.backgroundColor = "rgba(201,21,35,0.0)";
    //2.注册onscroll事件 给window注册
    window.onscroll = function () {
        //获取页面滚动的值  此处注意点：window.document.documentElement.scrollTop >>>documentElement
        var pageScroll = window.document.documentElement.scrollTop;
        //console.log(pageScroll);

        //计算出透明度，滚动值/maxDistance 0-1的值，如果大于1变成等于1
        var alphaPercent = pageScroll/maxDistance;
        //console.log(alphaPercent);
        if(alphaPercent>1){
            alphaPercent = 1;
        }
        //给通栏透明度赋值
        headerDom.style.backgroundColor = "rgba(201, 21, 35,"+alphaPercent+")";
    }
}
//秒杀倒计时
function cutDownTime(){
    //秒杀倒计时
    //1 获取元素
    var spanArr = document.querySelectorAll(".ms_time>span");
    //console.log(spanArr);
    //定义倒计时时间
    var totalHour = 3;
    var totalSec = totalHour *60 *60;
    //定义计时器，给计时器一个变量名 方便结束 一秒一动
    var timerId = setInterval(function () {
        //判断倒计时是否结束
        if(totalSec<=0){
            clearInterval(timerId);
            console.log("秒杀倒计时结束");
            //然后就return结束 跳出代码
            return;
        }
        totalSec--;
        //将剩余秒数 对应回 小时 分钟 秒
        //1hour = 3600s 有几个3600就有几个hour
        var msHour =Math.floor(totalSec/3600);
        //取出小时之后剩下的秒数/60 = 分钟
        var msMin = Math.floor(totalSec%3600/60)
        //不够一分钟的就是剩下的秒数
        var msSec = totalSec % 60;

        //修改dom元素显示
        spanArr[0].innerHTML = Math.floor(msHour/10);
        spanArr[1].innerHTML = Math.floor(msHour%10);
        spanArr[3].innerHTML = Math.floor(msMin/10);
        spanArr[4].innerHTML = Math.floor(msMin%10);
        spanArr[6].innerHTML = Math.floor(msSec/10);
        spanArr[7].innerHTML = Math.floor(msSec%10);
    },1000);




}



//banner轮播：定时器+使用过渡 实现效果
//图片轮播+index小圆点轮播+过渡效果
//获取元素：当前屏幕宽度、ul、下部的index
function banner(){
    var screenWidth = document.body.offsetWidth;
    var moveUl = document.querySelector(".banner_ul");
    //moveUl.style.transition = "all .3s";
    //如果轮播到最后一张需要切到第一张的时候，过程中会出现过渡导致会浏览到之前的所有图片，所以需要在最后一张的时候关闭过渡，切换到第一张图
    var indexLiArr = document.querySelectorAll(".banner_index li");
    //在CSS中已经修改ul先往左移动一张图，所以从1负值，在定时器中index++变为2开始移动
    var index = 1;
    var timerId = setInterval(Ultimer,1000)
    function Ultimer() {
        index++;
        //如果index值index*screenWidth超过Ul的宽度那么将不能回位到第一张，所以加一个判断
        if(index >= 9){
            index = 1;
            //关闭过渡+瞬间切到第一张
            moveUl.style.transition = "";
        }else{
            moveUl.style.transition = "all .3s";
        }

        //translaX往左移动 是负值，右移，是正值
        moveUl.style.transform = "translateX("+index*screenWidth*-1+"px)";
        //再修改下部的index小圆点 排他之后给当前index原点负值
        for(var i = 0;i<indexLiArr.length;i++){
            indexLiArr[i].className = "";
        };
        indexLiArr[index-1].className="current";

    }

    //添加注册移动端touch事件
    //定义 记录开始的值、移动的值、distance
    var startX = 0;
    var moveX = 0;
    var distanceX = 0;
    moveUl.addEventListener("touchstart", function (event) {
        //手指触摸 停止轮播 清除定时器 关闭过渡 记录开始值
        clearInterval(timerId);
        moveUl.style.transition = "";
        //记录开始值
        startX = event.touches[0].clientX;
    })
    moveUl.addEventListener("touchmove", function (event) {
        //触摸中 计算移动的值
        //移动后的位置-起始位置 = 移动了的距离；
        moveX = event.touches[0].clientX - startX;
        //移动UL
        //console.log(moveX + index * -1 * screenWidth);
        moveUl.style.transform = "translateX("+(moveX+index*-1*screenWidth)+"px)"
    })
    moveUl.addEventListener("touchend", function (event) {
        //01触摸结束 判断移动的距离进行是否吸附 这个时候moveX不用考虑正负 Math.abs()取绝对值
        /*
            和maxDistance相比
            如果移动距离小于，吸附回原moveX+index*-1*screenWidth
            如果距离大于，则需要判断正负，index++或者index-- 然后再moveX+index*-1*screenWidth
        */
        //最大偏移值maxDistance 屏幕的一半
        var maxDistance = screenWidth /2;
        if(Math.abs(moveX) > maxDistance){
            //先判断移动的放心 moveX的正负 如果移动距离大于maxDistance则相应的移动一整页
            if(moveX>0){
                index--;
                if(index <= 0){
                    index = 8;
                    moveUl.style.transition = "";
                }else{
                    moveUl.style.transition = "all .3s";
                }
                moveUl.style.transform = "translateX("+index*screenWidth*-1+"px)";
                for(var i = 0;i<indexLiArr.length;i++){
                    indexLiArr[i].className = "";
                };
                indexLiArr[index-1].className="current";
            }else{
                index++;
                if(index >= 9){
                    index = 1;
                    moveUl.style.transition = "";
                }else{
                    moveUl.style.transition = "all .3s";
                }
                moveUl.style.transform = "translateX("+index*screenWidth*-1+"px)";
                for(var i = 0;i<indexLiArr.length;i++){
                    indexLiArr[i].className = "";
                };
                indexLiArr[index-1].className="current";
            }
        }else{
            //如果移动距离小于，则吸附回原位置 再还原过渡效果
            this.style.transition = "all .3s";
            this.style.transform = "translateX("+(index*-1*screenWidth)+"px)";
        }
        //02开始轮播 开启定时器
        timerId = setInterval(Ultimer,1000)
    })
}