<template>
	<div class="login">
		<h1 class="mar-bom">客服登陆</h1>
        <div class="input-contain">
            <input name="username" type="text" v-model='username' placeholder="用户名">
            <span class="error" v-if="username_show"><i class="el-icon-circle-cross red-circle"></i>请输入用户名</span>
            <span class="error" v-if="username_rule_show"><i class="el-icon-circle-cross red-circle"></i>1-50个由字母、数字下划线组成的,除空格和特殊字符</span>
        </div>
        <div class="input-contain">
            <input name="pass" type="password" v-model='password' placeholder="密码">
            <span class="error" v-if="password_show"><i class="el-icon-circle-cross red-circle"></i>请输入密码</span>
            <span class="error" v-if="password_rule_show"><i class="el-icon-circle-cross red-circle"></i>6-32个字,不包含空格</span>
            
        </div>
        <div class="mar-bom-small">
            <span style='float:left'>
                <el-checkbox name='remember' v-model='check'>记住密码</el-checkbox>
            </span>
            <span style='float:right;cursor:pointer' @click='register'>马上注册</span>
        </div>
        <div class="input-contain">
            <input type="button" value="登录" @click.prevent='submitForm'>
        </div>
    </div>
</template>

<script>
    import conn from '@/config/littlec.im'
    import { mapActions } from 'vuex'
    import { Loading } from 'element-ui';
    export default {
        data() {
            return {
                check:false,
                username:'',
                password:'',
                username_show:false,
                password_show:false,
                username_rule_show:false,
                password_rule_show:false
            };
        },
        methods: {
            ...mapActions([
                'changeUerName',
                'changePassWord'
                ]),
            submitForm() {
                var self=this
                //如果没有选择记住密码的话就需要验证表单
                if(!this.beforeSubmit()) {
                    return 
                }
                var loadingInstance=Loading.service({ fullscreen: true });
                conn.open(this.username,this.password,
                    function(success){
                        // console.log(success)
                        //   self.changeUerName(self.username)
                        //   self.changePassWord(self.password)
                        $.cookie("username",self.username)
                        $.cookie("password",self.password)
                        $.cookie("check",self.check)
                        //请求成功关闭加载页
                        // setTimeout(function(){
                        //     loadingInstance.close();
                        // },500)
                        self.$router.push('/chat')
                        // self.$message.success({
                        //     'message':'登录成功！',
                        //     'duration':1000,
                        //     'onClose':function(){
                        //         self.$router.push('/chat')
                        //     }
                        // })
                    },
                    function(err){
                        console.log(err)
                        loadingInstance.close();
                        self.$message.error(err.msg)  
                    }
                )
            },
            beforeSubmit(){
                var flag='yes';
                if(this.username==''){
                    this.username_show=true
                    flag='no'
                }
                if(this.password==''){
                    this.password_show=true
                    flag='no'
                }
                this.user_rule_show||this.password_rule_show?flag='no':null;
                if(flag=='yes'){
                    return true
                }else{
                    return false
                }

            },
            register(){
                this.$router.push('/register');
            }
        },
        watch:{
            username(newdata){
                newdata==''?this.username_show=true:this.username_show=false;
                newdata==''||/^[a-zA-Z0-9_]{1,50}$/.test(newdata)?this.username_rule_show=false:this.username_rule_show=true;
            },
            password(newdata){
                newdata==''?this.password_show=true:this.password_show=false;
                newdata==''||/^[^\s]{6,8}$/i.test(newdata)?this.password_rule_show=false:this.password_rule_show=true;
            }
        },
        mounted(){
            //自动登录
        }
    }
</script>
<style scoped >
 .login{
    position:absolute;
    top:45%;
    left:50%;
    width:400px;
    height:370px;
    margin-left:-240px;
    margin-top: -185px;
    text-align: center;
    padding:0 40px;
    background-color: #EFEFEF;
}
.mar-bom{
    font-size: 20px;
    margin:28px 0;
}
.mar-bom-small{
    margin:40px 0 10px 0;
    height:20px;
}
.input-contain{
    position: relative;
    height:52px; 
    margin-bottom: 30px;
}
.input-contain input{
    outline: none;
    width:100%;
    height:100%;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    padding-left: 24px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    -ms-box-sizing: border-box;
    -o-box-sizing: border-box;
}
.error{
    position: absolute;
    top:100%;
    left: 10px;
    color: red;
    margin-top: 5px;
    font-size: 13px;
}
.input-contain input:hover{
    border: 1px solid #0099FF;
}
input[type='button']{
    background-color: #0099FF;
    color:#fff;
    font-size: 20px;
    cursor: pointer;
}
</style>