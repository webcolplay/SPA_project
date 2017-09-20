<template>
	<div class="list" @click='changeColor'>
		<div class='floatLeft wt_img'>
            <i class="el-icon-circle-cross circle" @click="delete1"></i>
			<img src="../../assets/head_user.png" class="img">
		</div>
		<div class='floatLeft wt_content'>
			<p class="message">{{nick}}</p>
			<p class="message" v-html='message'></p>
		</div>
		<div class='floatLeft wt_time'>
			<p>{{time}}</p>
            <i class="circle2" v-if='dot'></i>
		</div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import conn from '@/config/littlec.im'

export default {
    data() {
        return {
            time:'',
            message:''
        };
    },
    props:['name','list','dot','nick'],
    methods: {
        delete1(){
            var self=this
            conn.removeRoster({
                to:this.name, 
                success:function(data){
                    //当删除的当前选中的联系人,自动选中下一个
                    var current_roster=self.$parent.current_roster
                    var currentList=self.$parent.currentList
                    if(self.name==current_roster){
                        var idx=_.findLastIndex(currentList,{name:self.name});
                        if(currentList.length==1){
                            self.$delete(self.$parent.allChatConent,self.name)
                            self.$parent.current_roster_nick=''
                        }else{
                            if(currentList.length-1==idx){
                                idx=idx-1
                            }else{
                                idx=idx+1
                            }
                            self.$parent.selectStyle(currentList[idx].name,currentList[idx].nick)
                        }  
                    }
                    self.$parent.currentList=_.filter(self.$parent.currentList,function(item){
                        return String(item.name).indexOf(self.name)<0
                    })
                    self.$parent.allLists=_.filter(self.$parent.allLists,function(item){
                        return String(item.name).indexOf(self.name)<0
                    })
                    self.$message.success({
                        'message':'删除成功',
                        'duration':1000
                    })
                },
                error:function(e){
                    self.$message.error({
                        'message':'服务器请求失败,请稍后再试!',
                        'duration':500
                    })
                }
            })
        },
        changeColor() { 
            //反馈给父组件右边聊天框修改
            this.$emit('currt')
        },
        chatShow(message){
            if(message){
                // console.log(message)
                var num=message.slice(-1)[0]
                util.getNowDay()==num.time.split(' ')[0]?this.time=util.unixToTime2(util.datetimeToUnix(num.time)):this.time=num.time.split(' ')[0]
                switch (num.msgType){
                    case 'txt':
                        this.message=Littlec.im.Helper.convertEmojiUnicodeToImage(num.data.replace(/<br>/ig,' '))
                        break
                    case 'img':
                        this.message='[图片]'
                        break
                    case 'audio':
                        this.message='[音频]'
                        break
                    case 'file':
                        this.message='文件:['+num.fileName+']'
                        break
                    case 'video':
                        this.message='[视频]'
                        break
                    case 'location':
                        this.message='[位置]'
                        break
                }
            }else{
                this.message=''
                this.time=''
            }
        }
    },
    watch: {
        list(n){
            // console.log(n)
            this.chatShow(n[this.name])
        }
    },
    beforeUpdate(){
        this.chatShow(this.list[this.name])
    },
    mounted(){ 
        this.chatShow(this.list[this.name])
    }
}
</script>
<style scoped >
    .list{
    	height:60px;
    	border-bottom: 1px solid #353A40;
    	background-color: #3C4147;
        font-size: 14px;
    }
    .active{
    	background-color: #4C535D
    }
    .list:hover .circle{
    	display: block;
    }
    .floatLeft{
    	float: left;
    	height:100%;
    	position: relative;
        line-height: 60px;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        padding:0 4px;
    }
    .floatLeft p{
        color:#ececec;
    }
    .wt_img{
    	width:25%;
    }
    .wt_content{
    	width:50%;
    }
    .wt_time{
    	width:25%;
        padding:0;
    }
    .img{
        width: 40px;
        height:40px;
        border-radius: 4px;
        vertical-align: middle;
        display: inline-block;
    }
    .circle{
    	position: absolute;
    	left:5px;
        top:24px;
    	font-size: 12px;
    	cursor: pointer;
    	display: none;
        color:#ececec;
    }
    .circle2{
    	position: absolute;
    	width:10px;
    	height:10px;
    	background-color: red;
    	border-radius: 50%;
    	right:2px;
        top:2px;
    }
    .message{
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
        text-align: left;
        line-height: 30px;
    }
</style>