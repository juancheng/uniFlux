<template>
	<view class="content">
		<view>
			<text class="title">{{articlePages && articlePages.endRow}}</text>
			<button :disabled="articlePages && articlePages.loading || false" 
				@click="asynBtn" 
				type="primary" 
				:loading="articlePages && articlePages.loading || false"
				>测试异步</button>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { loadArticlePages } from '../../states/constants.js'
	import { asyncReq } from '../../utils/utils.js'
	
	export default {
		data() {
			return {
				title: 'uniFlux'
			}
		},
		computed: mapState({
			articlePages: state => state[loadArticlePages.key]
		}),
		onLoad() {

		},
		methods: {
			asynBtn() {
				asyncReq(this, {
					stateKey: loadArticlePages.key,
					params: {
						page: 0,
						pageSize: 2
					}
				}).then(({props, preProp, prop}) => {
					console.warn('preProp:', preProp)
					console.warn('props,:', props,)
					console.warn('prop,:', prop,)
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
