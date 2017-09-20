<template>
	<div class="emojiList">
        <ul class="parents">
            <li v-for='(item,index) in list' :key='index' @click='change(item.codePoint)'>
                <img :src="item.link" alt="" class="img">
            </li>
        </ul>
    </div>
</template>

<script>

export default {
    name:'emojiList',
    data() {
        return {
            list:[]
        };
    },
    props:{
    },
    methods: {
        change(code){
            this.$emit('select',code)
        },
        addToMapStorage(unicode, shortname){
            if(/[-]/ig.test(unicode)){
                return
            }
            if(parseInt(unicode,16)<128340 || parseInt(unicode,16)>128662){
                return
            }
            if(!_.findWhere(this.list,{codePoint:unicode})){
                this.list=this.list.concat({
                    codePoint:unicode,
                    link:emojione.imagePathPNG + unicode + '.png'+ emojione.cacheBustParam
                })
            }
        }
    },
    watch: {
    },
    mounted(){ 
        // this.list=Littlec.im.Helper.getInCommonUseEmojiList( )
        emojione.mapEmojioneList(this.addToMapStorage)
        // console.log(emojione.mapUnicodeToShort())
    },
    activated(){

    }
}
</script>
<style scoped >
    .emojiList{
        position: absolute;
        left: 20px;
        bottom:50px;
        width:496px;
        height:256px;
        background-color: #fff;
        z-index: 2006;
        border-radius: 4px;
        border:1px solid #ddd;
        box-shadow: 4px 4px 10px rgba(0,0,0,0.4);
        -webkit-box-shadow: 4px 4px 10px rgba(0,0,0,0.4);
        -moz--box-shadow: 4px 4px 10px rgba(0,0,0,0.4);
        -ms--box-shadow: 4px 4px 10px rgba(0,0,0,0.4);
        overflow: auto;
    }
    .parents:after{
        content: '';
        display: table;
        clear: both;
    }
    .parents{
        margin:10px;
        padding:0;
        border:1px solid #ddd;
        border-bottom:0;
        border-right:0;
    }
    .parents li{
        border:1px solid #ddd;
        border-top:0;
        border-left:0;
        float: left;
    }
    .img{
        width: 24px;
        height:24px;
        display: inline-block;
        vertical-align: middle;
        cursor:pointer;
    }
</style>