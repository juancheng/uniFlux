<template>
	<view class="content">
		<view>
			<text class="title">{{articlePages && articlePages.endRow}}</text>
			<button :disabled="articlePages && articlePages.loading || false" @click="asynBtn" type="primary" :loading="articlePages && articlePages.loading || false">测试异步</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		asyncReq
	} from '../../utils/utils.js'
	
	import { apiKey } from '../../utils/constants.js'

	const { loadPublishArticlePages } = apiKey;


	export default {
		data() {
			return {
				title: 'uniFlux'
			}
		},
		computed: mapState({
			articlePages: state => state[loadPublishArticlePages],
		}),
		onLoad() {},
		methods: {
			asynBtn() {
				asyncReq({
					apiKey: loadPublishArticlePages,
					params: {
						page: 0,
						pageSize: 2
					}
				}).then(({
					props,
					preProp,
					prop
				}) => {
					console.warn('preProp:', preProp)
					console.warn('props,:', props, )
					console.warn('prop,:', prop, )
					console.warn('33:', this.articlePages)
				})
			},
		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
