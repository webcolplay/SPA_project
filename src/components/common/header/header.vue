<template>
	<el-row>
		<el-col :span="2" class='logo-container'>
			<img src="../../../assets/logo.png" class='logo' alt="">
		</el-col>
		<el-col :span="16" class="userinfo">
			<el-menu theme="dark" :default-active="$store.state.goods.currentTarget" class="el-menu-demo" mode="horizontal" unique-opened @select='change' router>
				<el-menu-item 
				:index="item.path" 
				v-for='(item,index) in $router.options.routes' 
				v-if='!item.hidden'
				:key='index'
				>
				{{item.name}}
				</el-menu-item>
			</el-menu>
		</el-col>
		<el-col :span="6" class="userinfo">
			<span class='username'>
				<el-dropdown>
					<span class="el-dropdown-link">
						system<i class="el-icon-caret-bottom el-icon--right"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command='info'>修改信息</el-dropdown-item>
						<el-dropdown-item command='pass'>修改密码</el-dropdown-item>
						<el-dropdown-item command='set' >系统设置</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</span>
			<i class="fa fa-sign-out logout" ></i>
		</el-col>
	</el-row>
</template>
<script>
	export default {
		name: 'header',
		data(){
			return{
				aa:1
			}
		},
		computed:{

		},
		methods:{
			change(index){                        //用于保存当前所选择的路由，刷新停留当前页
				localStorage.setItem('current_url',index);
			}
		}
	}
</script>
<style scoped >
	.logo{
		width:60px;
		height: 60px;
	}
    .fa-user{
        position: relative;
        top:-2px;
        margin-right: 4px;
    }
    .head-nav{
        width:100%;
        height: 60px;
        background: #324057;
        position: fixed;
        top:0px;
        left:0px;
        z-index: 999;
        color:#FFF;
        border-bottom: 1px solid #1F2D3D;
    }
    .userinfo{
        text-align: right;
        background-color: #324157;
    }
    .username{
        height: 60px;
        line-height: 60px;
        cursor: pointer;
    }
    .el-dropdown,.logout{
        color:#FFF;
    }
    .logout{
    	margin:0 20px;
    }
</style>
