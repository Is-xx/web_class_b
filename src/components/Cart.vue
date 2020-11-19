<template>
    <div class="cart">
        <Header></Header>
        <div class="cart_info">
            <div class="cart_title">
                <span class="text">我的购物车</span>
                <span class="total">共{{ this.$store.state.cart_length }}门课程</span>
            </div>
            <div class="cart_table">
                <div class="cart_head_row">
                    <span class="doing_row"></span>
                    <span class="course_row">课程</span>
                    <span class="expire_row">有效期</span>
                    <span class="price_row">单价</span>
                    <span class="do_more">操作</span>
                </div>
                <div class="cart_course_list">
                    <CartItem v-for="course in cart_list" :course="course" @btn="refresh"></CartItem>
                </div>
                <div class="cart_footer_row">
                    <span class="cart_select"><label @click="select_all"><span><el-checkbox
                        v-model="checked"></el-checkbox></span><span>全选</span></label></span>
                    <span class="cart_delete"><i class="el-icon-delete"></i> <span>删除</span></span>
                    <router-link to="/order"><span class="goto_pay">去结算</span></router-link>
                    <span class="cart_total">总计：¥{{ total_price }}</span>
                </div>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
import CartItem from "./CartItem";
import Footer from "./common/Footer";
import Header from "./common/Header";

export default {
    name: "Cart",
    data() {
        return {
            checked: '',
            cart_list: [],
            total_price: 0,
        }
    },
    methods: {
        //计算购物车商品总价格
        cart_total_price() {
            let total = 0;
            this.cart_list.forEach((course, key) =>{
                // 判断商品是否选中了，只有选中的课程才计入总价
                if (course.selected) {
                    course.expire_list.forEach((good, key) =>{
                        if (course.expire_id === good.id){
                            total += parseFloat(good.real_price);
                        }
                    })
                }
            })
            this.total_price = total;
        },
        // 检查用户是否登录
        check_user_login() {
            let token = sessionStorage.token;
            if (!token) {
                let self = this;
                this.$confirm("对不起,请登录后再添加购物车", {
                    callback() {
                        self.$router.push("/login");
                    }
                });
                return false
            }
            return token;
        },
        get_cart() {
            let token = this.check_user_login();
            this.$axios.get(this.$settings.HOST + "cart/option/", {
                headers: {
                    "Authorization": "jwt " + token
                }
            }).then(res => {
                this.cart_list = res.data;
                this.cart_total_price();
            }).catch(error => {
                this.$message({
                    message: '登录过期，请重新登录',
                    type: "warning",
                    duration: 1000,
                })
                // this.$router.push('/login');
            })
        },
        refresh(msg) {
            if (msg==='refresh'){
                this.get_cart();
                this.check_select();
            }else {
                this.cart_total_price();
            }

        },
        select_all() {
            let token = sessionStorage.token;
            this.$axios({
                url: this.$settings.HOST + 'cart/options/',
                method: 'put',
                params: {
                    selected: this.checked,
                },
                headers: {
                    "Authorization": "jwt " + token
                },
            }).then(res => {
                this.get_cart()
            })
        },
        check_select() {
            let token = sessionStorage.token;
            this.$axios({
                url: this.$settings.HOST + 'cart/options/',
                method: 'get',
                headers: {
                    "Authorization": "jwt " + token
                },
            }).then(res => {
                this.checked = res.data;
            })
        },
    },
    watch: {
        'checked': function () {
        }
    },
    created() {
        // 获取购物车商品数据
        this.get_cart();
        this.check_select();
    },
    components: {
        CartItem: CartItem,
        Footer: Footer,
        Header: Header,
    },
}
</script>

<style scoped>
.cart_info {
    width: 1200px;
    margin: 0 auto 200px;
}

.cart_title {
    margin: 25px 0;
}

.cart_title .text {
    font-size: 18px;
    color: #666;
}

.cart_title .total {
    font-size: 12px;
    color: #d0d0d0;
}

.cart_table {
    width: 1170px;
}

.cart_table .cart_head_row {
    background: #F7F7F7;
    width: 100%;
    height: 80px;
    line-height: 80px;
    padding-right: 30px;
}

.cart_table .cart_head_row::after {
    content: "";
    display: block;
    clear: both;
}

.cart_table .cart_head_row .doing_row,
.cart_table .cart_head_row .course_row,
.cart_table .cart_head_row .expire_row,
.cart_table .cart_head_row .price_row,
.cart_table .cart_head_row .do_more {
    padding-left: 10px;
    height: 80px;
    float: left;
}

.cart_table .cart_head_row .doing_row {
    width: 78px;
}

.cart_table .cart_head_row .course_row {
    width: 530px;
}

.cart_table .cart_head_row .expire_row {
    width: 188px;
}

.cart_table .cart_head_row .price_row {
    width: 162px;
}

.cart_table .cart_head_row .do_more {
    width: 162px;
}

.cart_footer_row {
    padding-left: 30px;
    background: #F7F7F7;
    width: 100%;
    height: 80px;
    line-height: 80px;
}

.cart_footer_row .cart_select span {
    margin-left: -7px;
    font-size: 18px;
    color: #666;
}

.cart_footer_row .cart_delete {
    margin-left: 58px;
}

.cart_delete .el-icon-delete {
    font-size: 18px;
}

.cart_delete span {
    margin-left: 15px;
    cursor: pointer;
    font-size: 18px;
    color: #666;
}

.cart_total {
    float: right;
    margin-right: 62px;
    font-size: 18px;
    color: #666;
}

.goto_pay {
    float: right;
    width: 159px;
    height: 80px;
    outline: none;
    border: none;
    background: #ffc210;
    font-size: 18px;
    color: #fff;
    text-align: center;
    cursor: pointer;
}
</style>
