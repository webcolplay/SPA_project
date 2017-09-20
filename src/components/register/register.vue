<template>
	<div class="register">
		<h1 class="mar-bom">立即注册</h1>
        <el-popover placement='right' title='标题' content='我是内容' width='200'  trigger='manual'>
        </el-popover>
        <div class="input-contain">
            <input type="text" name="nickName" v-model="nickName" placeholder="请输入昵称">
            <span class="error" v-if="nickName_show"><i class="el-icon-circle-cross red-circle"></i>请输入昵称</span>
            <span class="error" v-if="nickName_rule_show"><i class="el-icon-circle-cross red-circle"></i>1-50个字符可包含特殊字符或表情</span>
        </div>
        <div class="input-contain">
            <input type="text" name="user" v-model="user" placeholder="请输入用户名">
            <span class="error" v-if="user_show"><i class="el-icon-circle-cross red-circle"></i>请输入用户名</span>
            <span class="error" v-if="user_rule_show"><i class="el-icon-circle-cross red-circle"></i>1-50个字母、数下划线</span>
        </div>
        <div class="input-contain">
            <input type="password" name="password" v-model="password" placeholder="请输入密码">
            <span class="error" v-if="password_show"><i class="el-icon-circle-cross red-circle"></i>请输入密码</span>
            <span class="error" v-if="password_rule_show"><i class="el-icon-circle-cross red-circle"></i>6-32个字,不包含空格</span>
        </div>
        <div class="input-contain">
            <input type="password" name="passwordAgin" v-model="passwordAgin" placeholder="再次确认密码">
            <span class="error" v-if="passwordAgin_show"><i class="el-icon-circle-cross red-circle"></i>请输入确认密码</span>
            <span class="error" v-if="passwordAgin_rule_show"><i class="el-icon-circle-cross red-circle"></i>2次密码不一致</span>
        </div>
        <!-- <el-row type='flex' justify='cneter'>
            <el-col :span='12' class='register-Code'>
                <el-input type="password" v-model="validtorCode" name='validtorCode' auto-complete="off" placeholder='请输入验证码'></el-input>
                <span class="error" v-if="validtorCode_show">请输入验证码</span>
            </el-col>
            <el-col :span='8' class='register-Code'>
                <img :src="vcodeImg" alt="" width='140' height="34" style='vertical-align: middle;'>
            </el-col>
            <el-col :span='4' class='register-Code'>
                <span @click='refreshVarifyCode' class="change_img">换一张</span>
            </el-col>
        </el-row>  --> 
        <div class="input-contain space">
            <input type="button" value="注册" @click.prevent='submitForm'>
        </div>
        <router-link to="/login"><span><返回登陆</span></router-link>
    </div>
</template>

<script>
// import api from '@/config/request';
import conn from '@/config/littlec.im'

export default {
    data() {
        return {
            nickName:'',
            user:'',
            password:'',
            passwordAgin:'',
            // validtorCode:'',
            nickName_show:false,
            nickName_rule_show:false,
            user_show:false,
            user_rule_show:false,
            password_show:false,
            password_rule_show:false,
            passwordAgin_show:false,
            passwordAgin_rule_show:false,
            // validtorCode_show:false,
            // vcodeImg : "",
        }
    },
    methods: {
        submitForm() {
            if(!this.beforeSubmit()) return //console.log("有错误")
            var self=this
            conn.registerUser({
                username: this.user,//用户名字符串 
                password: this.password,//密码字符串 
                name: this.nickName,//用户昵称字符串 
                success: function(msg){
                    // console.log(msg)
                    self.$message.success('注册成功！3秒后跳转登录页')
                    setTimeout(function(){
                        self.$router.push('login')
                    },3000)
                },
                error:function(e){
                    self.$message.error(e.msg) 
                }
            })
        },
        beforeSubmit(){
            var flag='yes';
            if(this.nickName==''){
                this.nickName_show=true
                flag='no'
            }
            if(this.user==''){
                this.user_show=true
                flag='no'
            }
            if(this.password==''){
                this.password_show=true
                flag='no'
            }
            if(this.passwordAgin==''){
                this.passwordAgin_show=true
                flag='no'
            }
            // if(this.validtorCode==''){
            //     this.validtorCode_show=true
            //     flag='no'
            // }
            this.nickName_rule_show||this.user_rule_show||this.password_rule_show||this.passwordAgin_rule_show?flag='no':null;
            if(flag=='yes'){
                return true
            }else{
                return false
            }
            
        },
        refreshVarifyCode() {
            // var self = this;
            // api.getValidPic({}, function(success) {
            //     self.vcodeImg = "data:image/png;base64," + success.pic;
            // });
        }
    },
    watch: {
        nickName(newdata){
            newdata==''?this.nickName_show=true:this.nickName_show=false;
            newdata==''||/^.{1,50}$/.test(newdata)?this.nickName_rule_show=false:this.nickName_rule_show=true;
        },
        user(newdata){
            newdata==''?this.user_show=true:this.user_show=false;
            newdata==''||/^[a-zA-Z0-9_]{1,50}$/.test(newdata)?this.user_rule_show=false:this.user_rule_show=true;
        },
        password(newdata){
            newdata==''?this.password_show=true:this.password_show=false;
            newdata==''||/^[^\s]{6,8}$/i.test(newdata)?this.password_rule_show=false:this.password_rule_show=true;
        },
        passwordAgin(newdata){
            newdata==''?this.passwordAgin_show=true:this.passwordAgin_show=false;
            newdata!=''&&newdata!=this.password?this.passwordAgin_rule_show=true:this.passwordAgin_rule_show=false;
        }
        // ,validtorCode(newdata){
        //     newdata==''?this.validtorCode_show=true:this.validtorCode_show=false;
        // }
    },
    mounted() {
        this.$nextTick(function() {
            // this.refreshVarifyCode();
        })
    }                                                 
}
</script>
<style scoped >
    .register{
        position:absolute;
        top:50%;
        left:50%;
        width:300px;
        height:560px;
        margin-left:-180px;
        margin-top: -290px;
        text-align: center;
        padding:0 40px;
        background-color: #EFEFEF;
    }
    .mar-bom{
        font-size: 20px;
        margin:28px 0;
    }
    .mar-bom-small{
        margin-bottom: 20px;
        height:20px;
    }
    .input-contain{
        position: relative;
        height:52px; 
        margin-bottom: 26px
    }
    .input-contain input{
        outline: none;
        width:100%;
        height:100%;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        padding-left: 10px;
        box-sizing: border-box;
    }
    .error{
        position: absolute;
        top:100%;
        left: 10px;
        color: red;
        margin-top: 5px;
        font-size: 13px;
    }
    div.error{
        top:4px;
    }
    .input-contain input:hover{
        border: 1px solid #0099FF;
    }
    .input-contain.space{
        margin-top: 60px;
    }
    input[type='button']{
        background-color: #0099FF;
        color:#fff;
        font-size: 20px;
        cursor:pointer;
    }
    .change_img{
        color: red;
        cursor: pointer;
    }
    .register-Code{
        line-height: 38px;
        vertical-align: middle;
    }
</style>