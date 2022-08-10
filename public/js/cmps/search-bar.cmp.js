// import { Search } from '@element-plus/icons-vue'

export default {
	template: `
    <div>
        <el-input @input="onSearch" v-model="query" placeholder="Please input">
            <template #prepend>
                <el-button>
                    <!-- <el-icon class="el-icon">
                        <Search />
                    </el-icon> -->
                </el-button>
            </template>
        </el-input>
    </div>
    `,
	data() {
		return {
			query: null
		}
	},
	methods: {
		onSearch() {
			console.log(this.query)
		}
	},
	components: {
		// Search
	}
}
