<template>
    <div>
    	<div class="chat">
    		<div class='left_list'>
                <div class="chat_list_head">
                    <div style='padding:24px 20px 17px 20px;line-height: 60px'>
                        <div style='float: left;'>
                            <img src="../../assets/head_customerservice.png" alt="" class="img" style="margin-right: 10px" @click='openInfo'>
                            <span class="nickNameStyle">{{nickName}}</span>
                        </div>
                        <span style='color:#ddd;float: right;cursor: pointer;font-size: 14px' @click='systemOut'>退出</span>
                        <div style='clear: both;'></div>
                    </div>
                    <div class="search">
                        <el-input placeholder='搜索最近联系人' icon='search' v-model='search_roster' :on-icon-click='searchRoster'></el-input>
                    </div>
                </div> 
                <div class="list_content" ref='listBody' id='listBody'>
                    <div class="chat-no-list" v-if='currentList.length==0'>并没有人~</div>
                    <chatList  v-for='(list,index) in currentList' :dot='list.dot' :nick='list.nick' :name='list.name'  :list='allChatConent'  :key='index' :class='{active:list.isActive}' @currt='selectStyle(list.name,list.nick)'></chatList>
                </div>
            </div>
            <div class='right_chat'>
                <div class="contact_header">{{current_roster_nick}}</div>
                <div class="more" @click='queryChat(false,current_roster,10)'><span>点击加载更多</span></div>
                <div class="contact_body" ref='contactBody'>
                    <template v-for='(item,index) in allChatConent[current_roster]'>
                        <chatFrom  :message='item' v-if='user!==item.to'></chatFrom>
                        <chatTo :message='item'  v-else></chatTo>
                    </template>
                </div>
                <div class="contact_footer">
                    <sendInfo :nickName='nickName' :roster='current_roster' :userName='user' @addMessage='addMessage'></sendInfo>
                </div>
            </div>
        </div>
        <el-dialog title="修改个人信息" v-model="dialogVisible" size="small" :lock-scroll="lock_scroll"  top='24%'>
            <div class="edit">
                <div class="content">
                    <!-- <h3>头像</h3>
                    <div class="img_content" >
                        <img  :src="imgUrl" class="img">
                    </div>
                    <el-button type='primary' size='small' @click='changePic'>上传头像</el-button>
                    <span>支持jpg、png、bmp格式的图片，且文件小于2M</span>
                    <input ref='input1' type="file" style='display: none' @change='changeFile' accept="image/png,image/gif,image/jpg"> -->
                    
                    <h3>昵称</h3>
                    <div class="input-contain">
                        <input  name="nick" type="text" v-model='changeNick' placeholder="昵称">
                        <span class="error" v-if="nickName_show"><i class="el-icon-circle-cross red-circle"></i>请输入昵称</span>
                        <span class="error" v-if="nickName_rule_show"><i class="el-icon-circle-cross red-circle"></i>1-50个字符可包含特殊字符或表情</span>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="modifyUserNick">确 定</el-button>
                <el-button @click="dialogVisible = false;">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import chatList from '../chatList/chatList'
import chatFrom from '../chatFrom/chatFrom'
import chatTo from '../chatTo/chatTo'
import sendInfo from '../sendInfo/sendInfo'
import conn from '@/config/littlec.im'
import url from '../../assets/head_customerservice.png'
import { Loading } from 'element-ui';
// import { mapActions } from 'vuex'

var self
// var loadingInstance
export default {
    data() {
        return {
            dialogVisible: false,
            allLists:[],
            currentList:[],
            search_roster:'',
            current_roster:'',//当前选中的联系人用户名
            current_roster_nick:'',//当前选中联系人的昵称
            isActive:false,
            allChatConent:{},
            nickName:'',
            user:'',
            scrollHeight:0,
            sendOrMore:true,
            imgUrl:url,
            changeNick:'',
            nickName_show:false,
            nickName_rule_show:false,
            lock_scroll:false
        };
    },
    methods: {
        systemOut(){
            this.$confirm('是否确定退出当前账号?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                conn.close()
            }).catch(() => {
             
            });
        },
        //关闭聊天后续操作
        closed(){
            $.removeCookie("username")
            $.removeCookie("password")
            $.cookie("check",false)
            this.$router.push('login')
        },
        openInfo(){
            this.dialogVisible = true;
            this.changeNick=this.nickName;
            this.imgUrl=url;
        },
        // changePic(){
        //     this.$refs['input1'].click()
        // },
        // changeFile(event){
        //     var oFile = event.target.files&&event.target.files[0];
        //     var accept = /^(.+)\.(jpg||png||bmp)$/g
        //     if (oFile) {
        //         if(oFile.size/1024>=2048){
        //             this.$message.error('超出2M了,请重新上传图片')
        //             return
        //         }
        //         if(!accept.test(oFile.name)){
        //             this.$message.error('只支持上传jpg、png、bmp格式')
        //             return
        //         }
        //         window.URL = window.URL || window.webkitURL;
        //         if(window.URL){
        //             this.imgUrl=window.URL.createObjectURL(oFile) //本地预览
        //         }else{
        //             var reader = new FileReader()
        //             reader.readAsDataURL(oFile)
        //             reader.onload = function(e){
        //                 this.imgUrl=reader.result
        //             }
        //         }
        //     }
        // },
        //修改昵称
        modifyUserNick(){
            if(this.changeNick==''||this.nickName_show||this.nickName_rule_show)return 
            conn.modifyUserNick({
                nick:this.changeNick,
                success:function(msg){
                    // console.log(msg)
                    self.nickName=self.changeNick//msg.nick
                    self.dialogVisible = false
                },
                error:function(error){
                    self.$message.error('昵称修改失败,请检查网络连接!')
                }
            })
        },
        // ...mapActions([
        //   'changeAllChatConent' ,// 映射 this.increment() 为 this.$store.dispatch('increment')
        //   'changeMessage'
        // ]),
        //发送消息回调
        addMessage(data){
            var aa=this.allChatConent[this.current_roster].concat(data)
            this.allChatConent = Object.assign({}, this.allChatConent, {[this.current_roster]:aa})
            this.sendOrMore=true
        },
        //搜索联系人
        searchRoster(){
            // var self=this
            var current=_.filter(this.allLists,function(item){
                return String(item.name).indexOf(self.search_roster)>-1
            })
            this.currentList=current
            this.$nextTick(function(){                   //防止搜索为全部联系人时，列表选中状态出现混乱
                this.currentList.forEach(function(item){
                    if(item.name==self.current_roster){
                        self.$set(item,'isActive',true)
                    }else{
                        self.$set(item,'isActive',false)
                    }
                })
            })
        },
        //跳转编辑页
        editImg(){
            this.$router.push('/edit')
        },
        //点击左边联系人列表，显示对应聊天内容
        selectStyle(name,nick){ 
            // console.log(name)
            this.$nextTick(function(){
                this.currentList.forEach(function(item){
                    if(item.name==name){
                        self.$set(item,'isActive',true)
                        self.$set(item,'dot',false)
                    }else{
                        self.$set(item,'isActive',false)
                    }
                    
                })
                this.sendOrMore=true
                this.current_roster=name
                this.current_roster_nick=nick
            })
        },
        //新消息来置顶
        messageStick(name){
            var arr1=_.pluck(this.allLists, 'name')
            if(_.contains(arr1, name)){
                for (var i = 0; i < this.allLists.length; i++) {
                    if (this.allLists[i].name === name) {
                        this.allLists.unshift(this.allLists.splice(i, 1)[0])
                        break;
                    }
                }
            }else{
                this.allLists.unshift({name:name})
            }
            if(!this.search_roster){
                var arr2=_.pluck(this.currentList, 'name')
                if(_.contains(arr2, name)){
                    for (var i = 0; i < this.currentList.length; i++) {
                        if (this.currentList[i].name === name) {
                            this.currentList.unshift(this.currentList.splice(i, 1)[0])
                            break;
                        }
                    }
                }
            }
            
        },
        //sdk错误状态处理函数
        error(err){
            // console.log(err)
            // var self=this
            if(err.type==6){
                self.queryUserInfo()
                self.getRoster()
            }else if(err.type==7){
                this.$message.error({
                    'message':'账号在别处登录',
                    'duration':1000,
                    'onClose':function(){
                        self.$router.push('login')
                    }
                })
            }else{
                this.$message.error('服务器繁忙,请稍后..')
                this.$router.push('login')
            }   
        },
        //获取联系人列表
        getRoster(){
            // var self=this
            conn.getRoster({
                success:function(roster){
                    console.log(roster)
                    // loadingInstance.close()
                    util.loadingInstance1&&util.loadingInstance1.close()
                    util.loadingInstance&&util.loadingInstance.close()
                    self.currentList=self.currentList.concat(roster)
                    self.allLists=self.allLists.concat(roster)
                    self.$nextTick(function(){
                        self.selectStyle(this.currentList[0].name,this.currentList[0].nick)
                    })
                    _.each(roster,function(ele,index){
                        self.queryChat(true,ele.name)
                    })

                },
                error:function(err){
                    // console.log(err)
                    // console.log('联系人列表获取失败，请重新刷新页面')
                }
            })
        },
        //获取联系人历史消息
        queryChat(isFirst,to,limit){
            this.scrollHeight=this.$refs.contactBody.scrollHeight-this.$refs.contactBody.scrollTop;//保存当前窗口滚动条的位置
            this.sendOrMore=false
            limit?limit:limit=5;
            // var chatData=this.allChatConent[to]
            var ids=this.allChatConent[to]?this.allChatConent[to][0].guid:'';
            conn.queryChat({
                to:to, 
                //好友用户名 
                limit: limit,
                begin:ids,
                direction:1, //0代表正序，1代表倒序
                // includebegin:0,//是否包含begin ,0不包含、1包含
                success:function(messages){ 

                    if(messages.length>0){
                        // console.log(messages)
                        // self.changeAllChatConent({data:messages,to:to}) 用state方式存历史记录
                        if(_.has(self.allChatConent,to)){
                            var aa=messages.reverse().concat(self.allChatConent[to])
                            self.allChatConent = Object.assign({}, self.allChatConent, {[to]:aa})

                        }else{
                            self.$set(self.allChatConent,to,messages.reverse())
                        }
                    }else if(!isFirst){
                        self.$message.error('没有消息记录啦') 
                    }
                }, 
                error:function(e){
                    // console.log(e)
                }
            })
        },
        //收到联系人订阅请求的回调方法
        // { 
        //     from: 对方用户名, 
        //     to: 自己用户名, 
        //     type: 订阅类型（subscribe, unsubscribe, subscribed, unsubscribed）
        // }
        presence(e){
            console.log(e)
            if (e.type =='subscribe') { 
                conn.agreeAdd({ 
                    to :e.from,
                    message:'ok',
                    error:function(err){
                        console.log(err)
                    } 
                })
            }
            if (e.type =='unsubscribe' || e.type =='unsubscribed') { 
                //当删除的当前选中的联系人,自动选中下一个
                if(e.from==this.current_roster){
                    var idx=_.findLastIndex(self.currentList,{name:e.from});
                    if(self.currentList.length==1){
                        self.$delete(self.allChatConent,e.from)
                        this.current_roster_nick=''
                    }else{
                        if(self.currentList.length-1==idx){
                            idx=idx-1
                        }else{
                            idx=idx+1
                        }
                        this.selectStyle(self.currentList[idx].name,self.currentList[idx].nick)
                    }  
                }
                self.currentList=_.filter(self.currentList,function(item){
                    return String(item.name).indexOf(e.from)<0
                })
                self.allLists=_.filter(self.allLists,function(item){
                    return String(item.name).indexOf(e.from)<0
                })
                
            }
        },
        //获取用户信息
        queryUserInfo(){
            conn.queryUserInfo({
                success:function(success){
                    // console.log(success)
                    self.nickName=success.nick
                    self.user=success.userName
                    self.changeNick=success.nick
                },
                error:function(error){
                    // console.log(error)
                }
            })
        },
        //收到消息公共方法
        addAllChatConent(message,type){
            this.sendOrMore='send'
            // console.log(message)
            //新增联系人加入到联系人数组中
            var addRoster={
                dot:false,
                isActive:false,
                name:message.from,
                nick:message.extraData,
            }
            //判断当前联系人是否已经存在联系人数组中
            if(!_.findWhere(self.currentList,{name:message.from})){
                self.currentList=self.currentList.concat(addRoster)
                self.allLists=self.allLists.concat(addRoster)
            }
            message.msgType=type
            var aa=this.allChatConent[message.from].concat(message)
            this.allChatConent = Object.assign({}, this.allChatConent, {[message.from]:aa})
            this.messageStick(message.from)
            //新消息置顶滚动条上移至顶部
            this.$refs.listBody.scrollTop=0
            this.currentList.forEach(function(item){
                if(item.name!=self.current_roster){
                    if(item.name==message.from){
                        self.$set(item,'dot',true)
                        return
                    }
                }
            })
        },
        //收到文字表情消息
        textMessage(message){
            this.addAllChatConent(message,'txt')
        },
        //收到图片表情消息
        pictureMessage(message){
            // console.log(message)
            this.addAllChatConent(message,'img')
        },
        //收到收到音频消息
        audioMessage(message){
            // console.log(message)
            this.addAllChatConent(message,'audio')
        },
        //收到收到视频消息
        videoMessage(message){
            // console.log(message)
            this.addAllChatConent(message,'video')
        },
        //收到收到文件消息
        fileMessage(message){
            // console.log(message)
            this.addAllChatConent(message,'file')
        }
    },
    watch: {
        // allChatConent(n){
        //     console.log(123)
        // }
        changeNick(newdata,o){
            newdata==''?this.nickName_show=true:this.nickName_show=false;
            newdata==''||/^.{1,50}$/.test(newdata)?this.nickName_rule_show=false:this.nickName_rule_show=true;
        }
    },
    created(){
        // loadingInstance=Loading.service({target:document.getElementById('#listBody')});
        //先取聊天列表数据
        self=this //设置全局变量self
        conn.open($.cookie("username"),$.cookie("password"),
            function(success){
                self.queryUserInfo()
                self.getRoster()
            },
            self.error
        )
        conn.presence(this.presence)
        conn.closed(this.closed)
        conn.textMessage(this.textMessage)
        conn.pictureMessage(this.pictureMessage)
        conn.audioMessage(this.audioMessage)
        conn.videoMessage(this.videoMessage)
        conn.fileMessage(this.fileMessage)
    },
    mounted(){ 
        
       // this.search_roster=Littlec.im.Helper.convertCodePointsToUnicode('1f618')
       conn.add({ 
            to :'13888888888',
            error:function(err){
                console.log(err)
            } 
        });
        // if(this.currentList.length){
        //     this.selectStyle(this.currentList[0])
        // }
    },
    components:{chatList,chatFrom,chatTo,sendInfo},
    updated(){
        //接收消息时滚动条不操作
        if(this.sendOrMore!='send'){
            if(this.sendOrMore){
                // setTimeout(function(){
                //     self.$refs.contactBody.scrollTop = self.$refs.contactBody.scrollHeight;
                // },500)
                this.$refs.contactBody.scrollTop = this.$refs.contactBody.scrollHeight;
            }else{
                this.$refs.contactBody.scrollTop =this.$refs.contactBody.scrollHeight-this.scrollHeight
            }  
        }
        
    }
    
}
</script>
<style scoped >
    .chat{
        text-align: center;
        position:absolute;
        top:50%;
        left:50%;
        width:1000px;
        height:700px;
        margin-left:-500px;
        margin-top: -350px;
        text-align: center;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 5px 8px 11px rgba(0,0,0,0.4);
        -webkit-box-shadow: 5px 8px 11px rgba(0,0,0,0.4);
        -moz--box-shadow: 5px 8px 11px rgba(0,0,0,0.4);
        -ms--box-shadow: 5px 8px 11px rgba(0,0,0,0.4);
    }
    .left_list{
        float: left;
        width:340px;
        height:100%;
        background-color: #3C4147;
       /* border-bottom-left-radius: 4px;
        border-top-left-radius: 4px;*/
    }
    .right_chat{
        float: right;
        position: absolute;
        left:340px;
        right:0;
        height:100%;
        padding:10px;
        background-color: #fff;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
    }
    .chat_list_head{
        height:150px;
    }
    .text_right{
        text-align: right;
        margin-bottom: 30px;
    }
    .img{
        width: 60px;
        height:60px;
        border-radius: 4px;
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
    }
    .search{
        width: 260px;
        margin:0 auto;
    }
    .list_content{
        overflow: auto;
        height:550px;
    }
    .contact_header{
        padding:10px;
        border-bottom: 1px solid #ddd;
        height:21px;
        text-align: left;
        font-size: 16px;
        font-weight: 900;
    }
    .more{
        height:20px;
        cursor: pointer;
        font-size: 14px;
    }
    .contact_body{
        position: absolute;
        top:72px;
        bottom:231px;
        left:10px;
        right:10px;
        overflow: auto;
    }
    .contact_footer{
        position: absolute;
        bottom:10px;
        left:10px;
        right:10px;
        height:210px;
        border-top:1px solid #ddd;
        /*background-color: blue;*/
    }
    h3{
        margin:10px 0;
    }
    .edit{
        height:100%;
        position: relative;
        text-align: left;
    }
/*    .content{
        margin:0 auto;
        border:1px solid #ddd;
    }*/
    .content .img{
        margin-right: 30px;
    }
    .input-contain{
        position: relative;
        height:44px; 
   }
   .input-contain input{
        outline: none;
        width:350px;
        height:100%;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        padding-left: 10px;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
   }
   .error{
        position: absolute;
        top:100%;
        left: 10px;
        color: red;
        margin-top: 5px;
   }
   .input-contain input:hover{
        border: 1px solid #0099FF;
   }
   .nickNameStyle{
        color:#fff;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        text-align: left;
        width: 160px;
        vertical-align: middle;
        display: inline-block;
    }
    .chat-no-list{
        color: #fff;
        margin-top:20px ;
    }
</style>