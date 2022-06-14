# jquery.weekHour
基于jquery的多时段小时选择器（按周）
样例文件 demo/index.html
```
    <script src="jquery.1.9.1.min.js"></script>
    <script type="text/javascript" src="jquery.week-hour.js"></script>
    <link  rel="stylesheet" type="text/css"  href="jquery.week-hour.css">
    
    var o = $.weekHour({
            id:'week-hour',
            section:'16777214,16777215,15,0,0,0,0',//预选项 可不填
            callback:function(section){
                //回调
                console.log(section);
            }
        });
    o.getSection();//不走回调，直接获取当前值
```
