<template>
    <div class="search-input">
        <i class="iconfont iconsearch"></i>
        <input type="text" placeholder="搜索歌曲" v-model="searchWord" @input="handleToSuggest" />
        <i class="iconfont iconguanbi" v-if="searchWord" @click="handleToClose"></i>
    </div>
    <template v-if="searchType === 1">
        <div class="search-history">
            <div class="search-history-head">
                <span>历史记录</span>
                <i class="iconfont iconlajitong"></i> 
            </div>
            <div class="search-history-list">
                <div>稻香</div>
                <div>双节棍</div>
            </div>
        </div>
    </template>
    <template v-else-if="searchType === 2">
        <div class="search-result">
            <div class="search-result-item">
                <div class="search-result-word">
                    <div>少年</div>
                    <div>许巍 - 爱如少年</div>
                </div>
                <i class="iconfont iconbofang"></i>
            </div>
            <div class="search-result-item">
                <div class="search-result-word">
                    <div>少年</div>
                    <div>许巍 - 爱如少年</div>
                </div>
                <i class="iconfont iconbofang"></i>
            </div>
        </div>
    </template>
    <template v-else-if="searchType === 3">
        <div class="search-suggest">
            <div class="search-suggest-head">搜索“ {{ searchWord }} ”</div>
            <div
                class="search-suggest-item"
                v-for="item in suggestList"
                :key="item.id">
                <i class="iconfont iconsearch"></i>{{ item.name }}
            </div>
        </div>
    </template>
</template>

<script setup>
import { ref } from 'vue';
import '@/assets/searchIcon/iconfont.css';
import axios from 'axios';

function useSreach() {
    let searchWord = ref('');
    let searchType = ref(1);
    function handleToClose() {
        searchWord.value = '';
        searchType.value = 1;
    }
    return {
        searchType,
        searchWord,
        handleToClose
    };
}

function useSuggest() {
    let suggestList = ref([]);
    let handleToSuggest = () => {
        if (searchWord.value) {
            searchType.value = 3;
            axios.get(`/api/search/suggest?keywords=${searchWord.value}`)
                .then(res => {
                    let result = res.data.result;
                    if (!result.order) {
                        return;
                    }
                    let tmp = [];
                    for (let i = 0; i < result.order.length; i++) {
                        tmp.push(...result[result.order[i]]);
                    }
                    suggestList.value = tmp;
                })
        } else {
            searchType.value = 1;
        }
    };
    return {
        suggestList,
        handleToSuggest
    };
}

const { searchType, searchWord, handleToClose } = useSreach();
const { suggestList, handleToSuggest } = useSuggest();
</script>

<style scoped>
.search-input {
    display: flex;
    align-items: center;
    height: 35px;
    margin: 35px 15px 25px 15px;
    background: #f7f7f7;
    border-radius: 25px;
}
.search-input i {
    margin: 0 13px;
}
.search-input input {
    flex: 1;
    font-size: 14px;
    border: none;
    background: #f7f7f7;
    outline: none;
}
.search-history {
    margin: 0 15px 25px 15px;
    font-size: 14px;
}
.search-history-head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 18px;
}
.search-history-list {
    display: flex;
    flex-wrap: wrap;
}
.search-history-list div {
    padding: 8px 14px;
    border-radius: 20px;
    margin-right: 15px;
    margin-bottom: 15px;
    background: #f7f7f7;
}
.search-result {
    border-top: 1px #e4e4e4 solid;
    padding: 15px;
}
.search-result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 15px;
    margin-bottom: 15px;
    border-bottom: 1px #e4e4e4 solid;
}
.search-result-word div:nth-child(1) {
    font-size: 16px;
    color:#235790;
    margin-bottom: 6px;
}
.search-result-word div:nth-child(2) {
    font-size: 14px;
    color:#898989;
}
.search-result-item i {
    font-size: 30px;
    color: #878787;
}

.search-suggest {
    border-top: 1px #e4e4e4 solid;
    padding: 15px;
    font-size: 14px;
}
.search-suggest-head {
    color:#4574a5;
    margin-bottom: 37px;
}
.search-suggest-item {
    color:#5d5d5d;
    margin-bottom: 37px;
}
.search-suggest-item i {
    color:#bdbdbd;
    margin-right: 14px;
    position: relative;
    top: 1px;
}
</style>