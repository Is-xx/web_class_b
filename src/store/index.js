import Vue from 'vue'
import Vuex from 'vuex'
import da from "element-ui/src/locale/lang/da";


Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // 购物车课程数量
        cart_length: '',
    },
    mutations: {
        // 检测提交的动作
        add_cart(state, data){
            state.cart_length = data;
        },
        delete_course(state, data){
            state.cart_length = data;
        },
    }
})
