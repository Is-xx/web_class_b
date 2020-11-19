<template>
    <div class="cart_item">
        <div class="cart_column column_1">
            <el-checkbox class="my_el_checkbox" v-model="course.selected"></el-checkbox>
        </div>
        <div class="cart_column column_2">
            <img :src="course.course_img" alt="">
            <span><router-link :to="'/detail/'+course.id">{{ course.name }}</router-link></span>
        </div>
        <div class="cart_column column_3">
            <el-select v-model="course.expire_id" size="mini" placeholder="请选择购买有效期" class="my_el_select" @change="expire_price()">
                <el-option :label="item.expire_text" :value="item.id" :key="item.id" v-for="item in course.expire_list"></el-option>
            </el-select>
        </div>
        <div class="cart_column column_4">¥{{ real_price }}</div>
        <div class="cart_column column_4"><button @click="delete_course">删除</button></div>
    </div>
</template>


<script>
export default {
    name: "CartItem",
    data() {
        return {
           real_price: this.course.real_price,
        }
    },
    props: ['course'],
    methods: {
        expire_price(){
            let id = this.course.expire_id;
            this.course.expire_list.forEach((good, key) =>{
                if (good.id === id) {
                    this.real_price = good.real_price
                }
            })
            this.$emit("btn", 'total');
        },
        change_selected(){
            let token = sessionStorage.token;
            this.$axios({
                url: this.$settings.HOST + 'cart/option/',
                method: 'put',
                params: {
                    course_id: this.course.id,
                    selected: this.course.selected,
                },
                headers: {
                    "Authorization": "jwt " + token
                },
            }).then(res =>{
                this.$emit("btn", 'refresh');
            })
        },
        delete_course(){
            let token = sessionStorage.token;
            this.$axios({
                url: this.$settings.HOST + 'cart/option/',
                method: 'delete',
                params: {
                    course_id: this.course.id,
                },
                headers: {
                    "Authorization": "jwt " + token
                },
            }).then(res => {
                this.$message({
                    message: '删除成功',
                    type: "success",
                    duration: 1000,
                })
                this.$store.commit("delete_course", res.data.cart_length);
                this.$emit("btn", 'refresh')
            })
        },
        // 发起修改有效期的请求
        change_expire(){
            let token = sessionStorage.token;
            this.$axios({
                url: this.$settings.HOST + 'cart/option/',
                method: "patch",
                data: {
                    expire_id: this.course.expire_id,
                    course_id: this.course.id,
                },
                headers: {
                    "Authorization": "jwt " + token
                },
            }).then(res =>{
                this.$message({
                    message: res.data.message,
                    type: "success",
                    duration: 1000,
                })
            })
        },
    },
    watch: {
        "course.selected": function () {
            this.change_selected();
        },
        // 监测select框的有效期id的一旦发生变化，则发起修改有效期的请求
        "course.expire_id": function (){
            this.change_expire()
        },
    },
    created() {
        this.expire_price()
    }
}
</script>

<style scoped>
.cart_item::after {
    content: "";
    display: block;
    clear: both;
}

.cart_column {
    float: left;
    height: 250px;
}

.cart_item .column_1 {
    width: 88px;
    position: relative;
}

.my_el_checkbox {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    width: 16px;
    height: 16px;
}

.cart_item .column_2 {
    padding: 67px 10px;
    width: 520px;
    height: 116px;
}

.cart_item .column_2 img {
    width: 175px;
    height: 115px;
    margin-right: 35px;
    vertical-align: middle;
}

.cart_item .column_3 {
    width: 197px;
    position: relative;
    padding-left: 10px;
}

.my_el_select {
    width: 117px;
    height: 28px;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
}

.cart_item .column_4 {
    padding: 67px 10px;
    height: 116px;
    width: 142px;
    line-height: 116px;
}

</style>

