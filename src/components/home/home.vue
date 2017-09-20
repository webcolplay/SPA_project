<template>
	<div class="home">
		<head-nav></head-nav>
		<router-view></router-view>
	</div>
</template>
<script>
  import header from 'components/common/header/header';

	export default {
		name: 'home',
		components:{
			headNav:header
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
