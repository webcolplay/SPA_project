<template>
	<div class="edit">
		<h2>个人信息</h2>
        <div class="content">
            <h3>头像</h3>
            <el-button type='primary' size='large' @click='changePic'>上传头像</el-button>
            <span>支持jpg、png、bmp格式的图片，且文件小于2M</span>
            <input ref='input1' type="file" style='display: none' @change='changeFile' >
            <div class="img_content">
                <img  :src="imgUrl" class="img">
            </div>
            <h3>昵称</h3>
            <div class="input-contain">
                <input  name="nick" type="text" v-model='nickName' placeholder="昵称">
                <span class="error" v-if="nickname_show">请输入昵称</span>
            </div>
            <h3>密码</h3>
            <div class="input-contain">
                <input name="psw"  type="text" v-model='passWord' placeholder="密码">
                <span class="error" v-if="password_show">请输入密码</span>
            </div>
            <el-button type='primary' size='large' >保存</el-button>
            <el-button type='' size='large' @click='$router.push("/chat")'>取消</el-button>
        </div>
        
    </div>
</template>

<script>

import imgUrl from '../../assets/123.png'
import conn from '@/config/littlec.im'
var self

export default {
    data() {
        return {
            imgUrl:imgUrl,
            nickname_show:false,
            password_show:false,
            nickName:'',
            passWord:''
        };
    },
    methods: {
        changePic(){
            this.$refs['input1'].click()
        },
        changeFile(event){
            var oFile = event.target.files&&event.target.files[0];
            var accept = /^(.+)\.(jpg||png||bmp)$/g
            if (oFile) {
                if(oFile.size/1024>=2048){
                    this.$message.error('超出2M了,请重新上传图片')
                    return
                }
                if(!accept.test(oFile.name)){
                    this.$message.error('只支持上传jpg、png、bmp格式')
                    return
                }
                window.URL = window.URL || window.webkitURL;
                if(window.URL){
                    this.imgUrl=window.URL.createObjectURL(oFile) //本地预览
                }else{
                    var reader = new FileReader()
                    reader.readAsDataURL(oFile)
                    reader.onload = function(e){
                        this.imgUrl=reader.result
                    }
                }
            }
        },
        //获取用户信息
        queryUserInfo(){
            conn.queryUserInfo({
                success:function(success){
                    // console.log(success)
                    self.nickName=success.nick
                    self.user=success.userName

                },
                error:function(error){
                    // console.log(error)
                }
            })
        },
        //sdk错误状态处理函数
        error(err){
            if(err.type==7){
                this.$message.error({
                    'message':'账号在别处登录',
                    'duration':1000,
                    'onClose':function(){
                        self.$router.push('login')
                    }
                })
            }else{
                this.$message.error(err.msg)
            }   
        }
    },
    watch: {
        
    },
    created(){
        //先取聊天列表数据
        self=this //设置全局变量self
        conn.open($.cookie("username"),$.cookie("password"),
            function(success){
                self.queryUserInfo()
            },
            self.error
        )
    },
    mounted(){ 
    
    },
    components:{}
}
</script>

<style scoped >
.num1{
    height:200px;
    background-color: red;
}
.num2{
    height:200px;
    background-color: green;
}
.num3{
    height:200px;
    background-color: blue;
}
    h2{
       margin-top: 0 
    }
    h3{
        margin:10px 0;
    }
    .edit{
        height:100%;
        position: relative;
        text-align: left;
    }
    .content{
        width:600px;
        margin:0 auto;
      /*  border:1px solid #ddd;*/
    }
    .img_content{
        margin-top: 20px
    }
    .img{
        width:140px;
        height:140px;
    }
    .input-contain{
        position: relative;
        height:52px; 
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
</style>