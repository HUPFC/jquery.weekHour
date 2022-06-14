jQuery.extend({
    weekHour:function(config){
        if (typeof config === 'string'){
            config = {
                id:config
            }
        }
        var o = {
            //config配置项
            id:'',
            //区间，此处采用数组运算
            section:(function(){
                var out = [];
               for(var i =0;i<168;i++){
                  out[i] = 0;
               }
               return out;
            })(),
            callback:function(e){
                o.div().attr('data-section',e);
                console.log(e)
            },


            div:function(){
                return $('#'+o.id);
            },
            clickNum:0,//当前click次数
            clickSection:[],//一次完整的clickSection
            init:function(){
                o.id = config.id;
                if (!o.id){
                    console.log('error week-hour id unfound');
                    return false;
                }

                if (config.section){
                    var bits = [];
                    config.section.split(',').forEach(function(value,index){
                        var bit = (parseInt(value)).toString(2);
                        bit = (Array(24).join(0)+bit).slice(-24).split("");
                        for (var i in bit){
                            bits.push(parseInt(bit[i]))
                        }
                        //bits.push.apply(bits,bit);
                    })
                    o.section = bits;
                }

                if (config.callback){
                    o.callback = config.callback;
                }

                o.div().html('').append(o.html());

                o.rendering();
                o.div().attr('readonly','readonly');
                o.bind();
            },
            html:function() {
                return '    <div class="jq-pl-week-hour" id="jq-pl-week-hour">' +
                    '        <div class="jq-pl-week-hour-left">' +
                    '            <div class="jq-pl-week-hour-left-text" >时段</div>' +
                    '            <ul>' +
                    (function(){
                        var o = '';
                        var t = ['周一','周二','周三','周四','周五','周六','周日'];
                        for(var i in t){
                            o += '<li>'+t[i]+'</li>';
                        }
                        return o;
                    })()+
                    '            </ul>' +
                    '        </div>' +
                    '        <div class="jq-pl-week-hour-content">' +
                    '            <div class="jq-pl-week-hour-title">' +
                    '                <ul>' +
                    (function(){
                        var o = '';
                        var t = ['凌晨','上午','下午','晚上'];
                        for(var i in t){
                            o += '<li>'+t[i]+'</li>';
                        }
                        return o;
                    })()+
                    '                </ul>' +
                    '                <ul>' +
                    (function(){
                        var o = '';
                        for(var i=0;i<24;i++){
                            o += '<li>'+i+'</li>';
                        }
                        return o;
                    })()+
                    '                </ul>' +
                    '            </div>' +
                    '            <div class="jq-pl-week-hour-picker">' +
                    '                <ul>' +
                    (function(){
                        var o = '';
                        for(var i=0;i<168;i++){
                            o += '<li data-hour="'+i+'">&nbsp;</li>';
                        }
                        return o;
                    })()+
                    '                </ul>' +
                    '            <div>' +
                    '        </div>' +
                    '    </div>'
            },
            bind:function(){
                $('body')
                .on({
                    'click':function(){
                        var hour = parseInt($(this).data('hour'));
                        o.clickNum++;
                        o.div().find('#jq-pl-week-hour').attr('data-click_num',o.clickNum%2)
                        o.sectionHandle(hour,$(this));

                    }
                },'#jq-pl-week-hour .jq-pl-week-hour-picker ul li');
            },
            sectionHandle:function(hour,dom){
                /**
                 * 区间处理
                 * 判断当前操作状态 起始、结束
                 *      起始时仅处理当前点击的dom class
                 *      结束时 处理区间所有dom class 并更新section
                 */

                var status = o.clickNum%2;//1：起始 0：结束
                if (status){
                    if ( o.clickSection.length !== 0) {
                        alert('数据异常，请刷新后重试')
                    }
                    if (dom.hasClass('on')){
                        dom.removeClass('on');
                    }else{
                        dom.addClass('on');
                    }
                    o.clickSection.push(hour);
                }else{
                    if ( o.clickSection.length !== 1){
                        alert('数据异常，请刷新后重试')
                    }
                    o.clickSection.push(hour);

                    //渲染处理
                    if (o.clickSection.length !== 2
                    ){
                        console.log('error ,week-hour clickSection error size ',o.clickSection);
                        o.clickSection = [];
                        return false;
                    }else{
                        var sectionValue = 1;//默认选中
                        o.clickSection.sort();
                        console.log(o.clickSection);
                        if (o.section[o.clickSection[0]]){
                            sectionValue = 0;//反选渲染
                        }

                        for (var i = o.clickSection[0];i<=o.clickSection[1];i++){
                            o.section[i] = sectionValue;
                        }

                        //开始渲染
                        o.rendering();
                        o.callback(o.getSection());
                    }
                }
            },
            rendering:function(){
                console.log('RENDERING',o.section);
                o.div().find('#jq-pl-week-hour .jq-pl-week-hour-picker ul li').each(function(index,value){
                    var obj = $(value);
                    if (o.section[index]){
                        if (!obj.hasClass('on')){
                            obj.addClass('on')
                        }
                    }else{
                        obj.removeClass('on')
                    }
                })
                o.clickSection = [];
            },
            getSection:function(){
                var out = [];
                o.section.forEach(function(value,index){
                    var week = Math.floor(index/24);
                    if (!out[week]){
                        out[week] = '';
                    }
                    out[week] = value.toString()+out[week];
                });

                for (var i in out){
                    out[i] = parseInt(out[i],2)
                }

                return out.join(',');
            },
            status:function(){
                return !(o.clickNum % 2);
            }
        };
        o.init();
        return o;
    }
})
