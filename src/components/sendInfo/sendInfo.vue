<template>
	<div class="list">
          <div class='fnBlock'>
                <keep-alive>
                    <emojiList v-if='isShow' @select='change'></emojiList>
                </keep-alive>
                <span class="blcok emoji" @click='show' title='发送表情'></span>
                <span class="blcok jd"  title='发送图片'>
                    <input type="file" ref='pic' id='pic' @change='sendPic'  style='width:100%;height:100%;opacity: 0'>
                </span>
                <span class="blcok file" title='发送文件'>
                    <input type="file" id='file' @change='sendFile' style='width:100%;height:100%;opacity: 0'>
                </span>
                <!-- <span class="blcok t"></span> -->
          </div>
          <div class="message">
            <textarea  v-model='content' placeholder="请输入发送内容" @keyup.enter='send' @keyup.ctrl.enter='tap'  ></textarea>
          </div>
          <div class="footer">
            <el-button @click='send'>发送</el-button>
          </div>  
    </div>
</template>

<script>
import emojiList from '../emojiList/emojiList'
import conn from '@/config/littlec.im'
var preTime=new Date()
export default {
    name:'sendInfo',
    data() {
        return {
          content:'',
          isShow:false
        };
    },
    props:['userName','roster','nickName'],
    methods: {
        tap(){
            this.content=this.content+'\r\n'
            return false
        },
        send(event){
            var curentTime=new Date()
            if(curentTime-preTime<500){
                this.content=this.content.replace(/\n|\r\n/g,'')
                preTime=curentTime
                this.$message.info({
                    'message':'发送消息太频繁',
                    'duration':400, 
                })
                return
            }else{
                preTime=curentTime
            }
            if(this.content.trim()=='' || event.ctrlKey){
                // this.content=''
                return
            }
            conn.sendTextMessage({
                to :[this.roster],
                msg :this.content.replace(/\n|\r\n/g,'<br>'),
                type :'chat',
                extraData:this.nickName,
                isExtra:true,
                error:function(e){
                    console.log(e)
                }
            })
            //触发chat组件事件
            this.$emit('addMessage',{ 
                data:this.content.replace(/\n|\r\n/g,'<br>'), 
                from: this.userName, 
                to: this.roster,  
                time:util.timeFormat123(), 
                msgType: 'txt', 
                type: "chat"
            })
            // console.log(this.content.trim().replace(/\n|\r\n/g,'<br>'))
            this.content=''
            this.isShow=false
        },
        show(){
            this.isShow=!this.isShow
        },
        change(code){
            this.content=this.content+Littlec.im.Helper.convertCodePointsToUnicode(code)
        },
        sendFile(e){
            var self=this
            conn.sendFile({
                type:'chat',
                fileInputId: 'file',
                to:[this.roster],
                extraData:this.nickName,
                isExtra:true,
                onFileUploadError: function(error) { 
                    // console.log(error);
                    self.$message.error({
                        'message':error.msg,
                        'duration':1000,
                        'onClose':function(){
                            
                        }
                    })
                },
                onFileUploadProgress: function(data) { 
                    // console.log(data)
                    //文件上传中的处理 
                }, 
                onFileUploadComplete: function(data) { 
                    //文件上传成功后的处理 
                    // var msgType=null;
                    // console.log(data)
                    // if(data.type=='image'){
                    //     msgType='img'
                    // }else{
                    //     msgType='file'
                    // }
                    self.$emit('addMessage',{
                        from: self.userName,
                        to: self.roster, 
                        time:util.timeFormat123(), 
                        msgType: 'file',
                        type: "chat",
                        original_link:data.original_link,
                        fileName:e.target.value.split("\\").slice(-1)[0]
                    })
                }
            })
        },
        sendPic(e){
            var self=this
            conn.sendPicture({
                type:'chat',
                fileInputId: 'pic',
                to:[this.roster],
                extraData:this.nickName,
                isExtra:true,
                onFileUploadError: function(error) { 
                    // console.log(error);
                    self.$message.error({
                        'message':error.msg,
                        'duration':1000,
                        'onClose':function(){
                            
                        }
                    })
                },
                onFileUploadProgress: function(data) { 
                    // console.log(data)
                    //文件上传中的处理 
                }, 
                onFileUploadComplete: function(data) { 
                    //文件上传成功后的处理 
                    // console.log(data)
                    //$('#pic').val('')
                    var picDom = self.$refs.pic
                    picDom.value=''
                    self.$emit('addMessage',{
                        from: self.userName,
                        to: self.roster, 
                        time:util.timeFormat123(), 
                        msgType: 'img',
                        type: "chat",
                        original_link:data.original_link,
                        middle_link:data.middle_link,
                        small_link:data.small_link,
                        height:data.height,
                        width:data.width,
                        fileName:e.target.value.split("\\").slice(-1)[0]
                    })
                }
            })
        }
    },
    watch: {
    },
    components:{emojiList}
}
</script>
<style scoped >
    textarea::-webkit-input-placeholder { 
        color: #b2b8c2!important;
        font-size: 16px;
    }
    textarea:-moz-placeholder { 
        color:  #b2b8c2!important;
        font-size: 16px;
    }
    textarea:-ms-input-placeholder {
        color: #b2b8c2!important;
        font-size: 16px;
    }
    .list{
        position: relative;
    }
    .fnBlock{
        height:34px;
        padding:4px;
        clear: both;
        position: relative;
    }
    .blcok{
        float:left;
        height:100%;
        width:40px;
    }
    .emoji{
        background: url(../../assets/icon_expression.png) no-repeat;
    }
    .jd{
        background: url(../../assets/icon_picture.png) no-repeat;
    }
    .file{
        background: url(../../assets/icon_file.png) no-repeat;
        overflow: hidden;
    }
/*    .t{
        background: url(../../assets/t.png) no-repeat;
    }*/
    .message{
        height:120px;
    }
    .footer{
        text-align:right;
        margin-top: 12px;
    }
    textarea{
        resize:none;
        width: 100%;
        height:100%;
        border:0;
        outline: none;
        font-size: 16px;
        font-family: 'Microsoft YaHei','Avenir', Helvetica, Arial, sans-serif;
         box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
    }
    
</style>