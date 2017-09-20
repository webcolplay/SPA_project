<template>
    <div class="chatFrom" style="margin-top: 10px;">
        <div style="margin-top:10px;"><span class="time" >{{time}}</span></div>
    	<div class="list parents" >
            <img src="../../assets/head_customerservice.png" alt="" class="img">
            <i class="icon"></i>
            <div class="content">
                <img v-if='message.msgType=="img"' @click="dialogTableVisible = true" :src="message.small_link" alt="">
                <p v-else-if='message.msgType=="txt"' v-html='emojione'></p>
                <video v-else-if='message.msgType=="video"' controls width="320" height="240" :src="message.riginal_link"></video>
                <audio v-else-if='message.msgType=="audio"' controls :src="message.original_link"></audio> 
                <a v-else :href="message.original_link" download="">{{message.fileName}}</a>
            </div>      
        </div>
        <el-dialog title="原始图片" v-model="dialogTableVisible" top='10%'>
            <img  @click="dialogTableVisible = true" :src="message.middle_link" alt="">
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'chatFrom',
    data() {
        return {
            dialogTableVisible: false
        };
    },
    props:['message'],
    computed:{
        time(){
            return util.getNowDay()==this.message.time.split(' ')[0]?util.unixToTime2(util.datetimeToUnix(this.message.time)):this.message.time.split(' ')[0]
        },
        emojione(){
            if(this.message.msgType=="txt"){
                return Littlec.im.Helper.convertEmojiUnicodeToImage(this.message.data)
            }
        }
    },
    methods: {
        
    },
    watch: {
        
    }
}
</script>
<style scoped >
    .chatFrom:before{
        content: '';
        display: table;
    }
    .time{
        background-color: #c7c7c7;
        color: #fff;
        border-radius: 20px;
        padding:0 10px;
        height:20px;
        font-size: 12px;
    }
    .list{
        position: relative;
        margin-bottom: 10px;
    }
    .parents:after{
        content: '';
        display: table;
        clear: both;
    }
    .img{
        width: 40px;
        height:40px;
        border-radius: 4px;
        vertical-align: middle;
        display: inline-block;
        margin-top: 8px;
        margin-left: 16px;
        float:right;
    }
    .icon{
        position: absolute;
        right:51px;
        top:24px;
        z-index:500;
        width:10px;
        height:10px;
        /*border:1px solid #ddd;*/
        border-left: 0;
        border-top: 0;
        transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        background-color: #D0E6F3;
        box-shadow: 4px 4px 10px rgba(0,0,0,0.4);
        -webkit-box-shadow: 4px 4px 10px rgba(0,0,0,0.4);
        -moz--box-shadow: 4px 4px 10px rgba(0,0,0,0.4);
        -ms--box-shadow: 4px 4px 10px rgba(0,0,0,0.4);

    }
    .content{
        float:right;
        max-width:50%;
        /*height:100px;*/
        border-radius: 4px;
/*        border:1px solid #ddd;*/
        text-align: left;
        padding:10px;
        margin-top: 10px;
        background-color: #D0E6F3;
        box-shadow: 4px 4px 10px rgba(0,0,0,0.4);
        -webkit-box-shadow: 4px 4px 10px rgba(0,0,0,0.4);
        -moz--box-shadow: 4px 4px 10px rgba(0,0,0,0.4);
        -ms--box-shadow: 4px 4px 10px rgba(0,0,0,0.4);
        font-size: 14px;
        word-break:break-all; /*支持IE，chrome，FF不支持*/
　　    word-wrap:break-word;/*支持IE，chrome，FF*/
    }
</style>