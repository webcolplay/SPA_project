<template>
<div class="content">
    <!-- Form -->
    <el-button type="text" @click="dialogFormVisible = true">添加</el-button>
    <div class="test-dialog">
        <el-dialog title="添加组织" v-model="dialogFormVisible" >
            <div id="show_content" style='width:250px;height:250px;overflow: auto;position:absolute;left:120px;z-index:100000;top:107px;' v-show='chulai'>   
                <el-tree :data="data" :props="defaultProps" :default-expand-all='true' :expand-on-click-node='false' @node-click="handleNodeClick"  class='border_none'></el-tree>
            </div>
            <el-form :model="form1" ref='form1' :rules='rules'>
                <el-form-item prop='parent' label="上级组织：" :label-width="formLabelWidth" >
                    <el-input id='ggf' v-model="form1.parent" auto-complete="off" @focus='aa' ></el-input>
                </el-form-item>
                <el-form-item prop='name' label="组织名称：" :label-width="formLabelWidth">
                    <el-input v-model="form1.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="唯一标识符：" :label-width="formLabelWidth">
                    <el-input v-model="form1.identifier" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="经度：" :label-width="formLabelWidth">
                    <el-input v-model="form1.longitude" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="纬度：" :label-width="formLabelWidth">
                    <el-input v-model="form1.latitued" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注：" :label-width="formLabelWidth">
                    <el-input type='textarea' v-model="form1.desc" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('form1')">提 交</el-button>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
    
    
</div>
    
</template>

 
<script>
export default {
    name:'test',
    data() {
        return {
            chulai:false,
            dialogFormVisible: false,
            form1: {
                parent:'',
                team:'',
                name: '',
                identifier:'',
                longitude:'',
                latitued:'',
                desc: ''
            },
            formLabelWidth: '100px',
            data: [{
                label: '一级 1',
                id:'1',
                children: [{
                    label: '二级 1-1',
                    id:'2',
                    children: [{
                        label: '三级 1-1-1',
                        id:'3'
                    }]
                }]
                },{
                label: '一级 2',
                id:'4',
                children: [{
                    label: '二级 2-1',
                    id:'5',
                    children: [{
                        label: '三级 2-1-1',
                        id:'6'
                    }]
                    },{
                    label: '二级 2-2',
                    id:'7',
                    children: [{
                        label: '三级 2-2-1',
                        id:'8'
                    }]
                }]
                }, {
                  label: '一级 3',
                  id:'9',
                  children: [{
                    label: '二级 3-1',
                    id:'10',
                    children: [{
                      label: '三级 3-1-1',
                      id:'11'
                    }]
                  }, {
                    label: '二级 3-2',
                    id:'12',
                    children: [{
                      label: '三级 3-2-1',
                      id:'13'
                    }]
                  }]
            }],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            rules:{
                parent:[{
                    required:true,message:'请选择上级组织',trigger:'change'
                }],
                name:[{
                    required:true,message:'请输入组织名称',trigger:'blur'
                }]
            }
        };
    },
    methods:{
        submitForm(ele){
            this.$refs[ele].validate((valid)=>{
                if(valid){
                    console.log(this.form1)
                }else{
                    console.log('错误');
                    return false
                }
            })
        },
        handleNodeClick(data){
            this.form1.parent=data.label
            this.form1.team=data.id
            this.chulai=false
        },
        aa(e){
            this.chulai=true
        },
        bb(e){
            this.chulai=false
        }
    },
    mounted(){
        document.addEventListener('click', (e)=>{
            // console.log(document.getElementById('show_content'))
            if(!(document.getElementById('show_content').contains(e.target))&&!(document.getElementById('ggf').contains(e.target))){this.chulai=false}
        })
    },
    components:{}
    
}
</script>
<style scoped>
    .border_none{
        border:0;
    }
</style>