<style type="text/css">
  .applet-list-input {
    width: 190px;
  }

  .goods-info-dialog .el-dialog {
    width: 500px;
  }

  .goods-draggable-dialog .el-dialog {
    width: 800px;
  }

  .goods-info-dialog .el-dialog > .el-dialog__body {
    padding: 0px 20px;
  }

  .goods-file-dialog .el-dialog {
    width: 800px;
  }

  .goods-file-dialog .el-dialog > .el-dialog__body {
    padding: 0px 20px;
  }

  .goods-list-tabs .el-tabs__header {
    margin: auto;
  }

  .goods-specs-dialog .el-dialog {
    width: 1040px;
  }

  .goods-specs-dialog .el-dialog > .el-dialog__body {
    padding: 0px 20px;
  }

  .goods-spread-dialog .el-dialog {
    width: 1000px;
  }

  .no-drop:hover {
    cursor: no-drop;
  }

</style>
<template>
  <el-container>
    <el-main v-loading="loading" element-loading-text="加载中" style="background-color: #FFFFFF;padding-top: 20px;">
      <el-form id="goods-list-form" :inline="true" :model="goods" class="demo-form-inline">
        <el-form-item label="小程序">
          <el-select v-if="appletList.length > 0" v-model="appletId" class="applet-list-input" @change="loadInfo">
            <el-option v-for="(item, index) in appletList" :key="index" :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
          <el-select v-else v-model="appletId" class="applet-list-input">
            <el-option label="全部" value=''></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="goods.goodsName" placeholder="请输入商品名称" class="applet-list-input"></el-input>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-select v-model="goods.goodsStatus" class="applet-list-input">
            <el-option label="全部" value=''></el-option>
            <el-option label="未发布" value="0"></el-option>
            <el-option label="已发布" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动">
          <el-select v-model="goods.ifDiscount" class="applet-list-input">
            <el-option label="全部" value=''></el-option>
            <el-option label="不参与" value="0"></el-option>
            <el-option label="参与" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="selectList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="loadGoodsDraggable()">排序</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="loadGoodsInfo('0')">添加</el-button>
        </el-form-item>
        <div style="display: none;">
          <el-input v-model="goods.page" type="hidden"></el-input>
          <el-input v-model="goods.pageSize" type="hidden"></el-input>
        </div>
      </el-form>
      <el-tabs v-model="activeName" @tab-click="handleClick" class="goods-list-tabs">
        <el-tab-pane v-for="(item, index) in typeList" :key="index"
                     :label="item.typeName" :name="'name_' + item.id"></el-tab-pane>
      </el-tabs>
      <el-table :data="tableData" :height="tableHeight" stripe style="width: 100%">
        <el-table-column align="center" type="index" :index="indexMethod" label="序号" width="60"></el-table-column>
        <el-table-column align="center" prop="coverSrc" label="商品封面" width="120">
          <template slot-scope="scope">
            <el-image :src="scope.row.coverSrc + timestamp"
                      style="width: 80px; height: 80px;"></el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goodsName" label="商品名称" width="220"></el-table-column>
        <el-table-column align="center" prop="typeName" label="商品类型" width="80"></el-table-column>
        <el-table-column align="center" prop="discount" label="商品折扣(%)" width="100"></el-table-column>
        <el-table-column align="center" prop="minPrice" label="最低价格" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.minPrice|addZero}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="maxPrice" label="最高价格" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.maxPrice|addZero}}</span>
          </template>
        </el-table-column>
        <!--        <el-table-column align="center" prop="describeStr" label="描述" :show-overflow-tooltip="true" width="220"></el-table-column>-->
        <el-table-column align="center" prop="ifDiscount" label="优惠券" width="80">
          <template slot-scope="scope">
            <el-link :underline="false" type="danger" v-if="!scope.row.ifDiscount">不参与</el-link>
            <el-link :underline="false" type="success" v-if="scope.row.ifDiscount">参与</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="goodsIndex" label="排序" width="80">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="上移" placement="top">
              <i class="el-icon-caret-top sort-direction" @click="shiftSort(scope.row.id, 'top')"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="下移" placement="top">
              <i class="el-icon-caret-bottom sort-direction" @click="shiftSort(scope.row.id, 'bot')"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="updateTime" label="更新时间" width="140"></el-table-column>
        <el-table-column align="center" prop="goodsStatus" label="商品状态" width="80">
          <template slot-scope="scope">
            <el-link :underline="false" type="danger" v-if="scope.row.goodsStatus == 0">未发布</el-link>
            <el-link :underline="false" type="success" v-if="scope.row.goodsStatus == 1">已发布</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="id" label="操作" fixed="right" width="220">
          <template slot-scope="scope">
            <el-button type="info" plain @click="loadGoodsInfo(scope.row.id)">修改</el-button>
            <el-button type="info" plain
                       @click="updateStatus(scope.row.id, scope.row.goodsName, scope.row.goodsStatus)"
                       v-if="scope.row.goodsStatus">下架
            </el-button>
            <el-button type="success" plain
                       @click="updateStatus(scope.row.id, scope.row.goodsName, scope.row.goodsStatus)"
                       v-else>发布
            </el-button>
            <el-button type="info" plain @click="deleteGoodsInfo(scope.row.id)">删除</el-button>
            <div style="height: 10px;"></div>
            <el-button type="primary" plain @click="loadGoodsFile(scope.row.id, scope.row.goodsName)">文件</el-button>
            <el-button type="primary" plain @click="loadGoodsSpecs(scope.row.id, scope.row.goodsName)">规格</el-button>
            <el-button type="primary" plain @click="loadGoodsSpread(scope.row.id, scope.row.goodsName)">推广</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;height: 35px;padding-top: 10px;padding-right: 30px;">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="goods.page"
          :page-size="goods.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <el-dialog class="goods-info-dialog" :title="infoTitle" :visible.sync="infoShow"
                 :modal-append-to-body="false" :close-on-click-modal="false" :destroy-on-close="true">
        <goodsInfo ref="goodsInfo" v-on:refreshList="refreshList"></goodsInfo>
      </el-dialog>
      <el-dialog class="goods-draggable-dialog" :title="dgTitle" :visible.sync="dgShow"
                 :modal-append-to-body="false" :close-on-click-modal="false" :destroy-on-close="true">
        <goodsInfoDraggable ref="goodsInfoDraggable" v-on:refreshList="refreshList"></goodsInfoDraggable>
      </el-dialog>
      <el-dialog class="goods-file-dialog" :title="fileTitle" :visible.sync="fileShow"
                 :modal-append-to-body="false" :close-on-click-modal="false" :destroy-on-close="true">
        <goodsFileList ref="goodsFileList" v-on:loadGoodsFile="loadGoodsFile"></goodsFileList>
      </el-dialog>
      <el-dialog class="goods-specs-dialog" :title="specsTitle" :visible.sync="specsShow"
                 :modal-append-to-body="false" :close-on-click-modal="false" :destroy-on-close="true">
        <goodsSpecsList ref="goodsSpecsList" v-on:loadGoodsPage="loadGoodsPage"></goodsSpecsList>
      </el-dialog>
      <el-dialog class="goods-spread-dialog" :title="spreadTitle" :visible.sync="spreadShow"
                 :modal-append-to-body="false" :close-on-click-modal="false" :destroy-on-close="true">
        <spreadList ref="spreadList" v-on:loadSpreadList="loadSpreadList"></spreadList>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script type="text/javascript">
    /* eslint-disable no-trailing-spaces */

    import goodsInfo from '@/views/goods/goods-info.vue'
    import goodsInfoDraggable from '@/views/goods/goods-info-draggable.vue'
    import goodsFileList from '@/views/goods/file/goods-file-list.vue'
    import goodsSpecsList from '@/views/goods/specs/goods-specs-list.vue'
    import spreadList from '@/views/goods/spread/spread-list.vue'

    export default {
        name: 'goods-info-list',
        components: {
            'goodsInfo': goodsInfo,
            'goodsInfoDraggable': goodsInfoDraggable,
            'goodsFileList': goodsFileList,
            'goodsSpecsList': goodsSpecsList,
            'spreadList': spreadList
        },
        data () {
            return {
                loading: true,
                tableHeight: 50,
                appletId: '',
                appletList: [],
                currentPage: 1,
                total: 0,
                goods: {
                    goodsName: '',
                    typeId: '',
                    goodsStatus: '',
                    ifDiscount: '',
                    page: 1,
                    pageSize: 10
                },
                typeList: [],
                infoTitle: '',
                infoShow: false,
                dgTitle: '',
                dgShow: false,
                fileTitle: '',
                fileShow: false,
                specsTitle: '',
                specsShow: false,
                spreadTitle: '',
                spreadShow: false,
                timestamp: '',
                activeName: ''
            }
        },
        created () {
            this.$axios({
                url: '/api/user/applet/queryAppletToMap',
                method: 'post'
            }).then(res => {
                if (res.data.code === '1') {
                    this.appletList = res.data.data
                    this.appletId = this.appletList[0].id
                    this.loadInfo()
                }
                this.$global.exitLoad(this, null, res.data)
            }).catch(error => {
                console.info('错误信息', error)
                this.$global.exitLoad(this, null, '')
            })
        },
        mounted () {
        },
        methods: {
            loadInfo () {
                this.loading = true
                this.$axios({
                    url: '/api/user/goods/queryTypeList',
                    method: 'post',
                    data: {appletId: this.appletId}
                }).then(res => {
                    if (res.data.code === '1') {
                        this.typeList = res.data.data
                        this.activeName = 'name_' + res.data.data[0].id
                        this.goods.typeId = res.data.data[0].id
                    }
                    this.onSubmit()
                    this.$global.exitLoad(this, null, res.data)
                }).catch(error => {
                    console.info('错误信息', error)
                    this.$global.exitLoad(this, null, '')
                })
            },
            indexMethod (index) {
                let count = (parseInt(this.goods.page) - 1) * parseInt(this.goods.pageSize)
                return count + (parseInt(index) + 1)
            },
            onSubmit () {
                this.loading = true
                this.tableData = {}
                this.$axios({
                    url: '/api/user/goods/queryInfoPage',
                    method: 'post',
                    data: this.goods
                }).then(res => {
                    this.$global.setGoodsTableHeight(this, 'goods-list-form')
                    if (res.data.code === '1') {
                        this.tableData = res.data.data.dataSource
                        this.total = res.data.data.totalCount
                    } else if (res.data.code === '-1') {
                        this.$message.error(res.data.data)
                    }
                    this.timestamp = '?' + Date.parse(new Date())
                    this.$global.exitLoad(this, null, res.data)
                }).catch(error => {
                    console.info('错误信息', error)
                    this.$global.exitLoad(this, null, '')
                })
            },
            selectList () {
                this.goods.page = 1
                this.onSubmit()
            },
            handleClick (tab, event) {
                this.goods.typeId = tab.name.replace('name_', '')
                this.onSubmit()
            },
            handleCurrentChange (val) {
                this.goods.page = val
                this.onSubmit()
            },
            loadGoodsInfo (id) {
                try {
                    this.$refs.goodsInfo.loadGoodsInfo(id, this.goods.typeId)
                } catch (e) {
                    this.$cookies.set('goods_id', id)
                    this.$cookies.set('goods_type_id', this.goods.typeId)
                }
                this.infoShow = true
                if (id && id === '0') {
                    this.infoTitle = '添加商品信息'
                } else {
                    this.infoTitle = '修改商品信息'
                }
            },
            loadGoodsDraggable () {
                try {
                    this.$refs.goodsInfoDraggable.loadApplet(this.goods.typeId)
                } catch (e) {
                    this.$cookies.set('goods_type_id', this.goods.typeId)
                }
                this.dgShow = true
                this.dgTitle = '商品排序 - 列表'
            },
            loadGoodsFile (id, name) {
                try {
                    this.$refs.goodsFileList.loadGoodsFile(id)
                } catch (e) {
                    this.$cookies.set('goods_id', id)
                }
                this.fileShow = true
                this.fileTitle = name + ' - 文件列表'
            },
            loadGoodsSpecs (id, name) {
                this.$cookies.set('goods_name', name)
                try {
                    this.$refs.goodsSpecsList.loadGoodsPage(id)
                } catch (e) {
                    this.$cookies.set('goods_id', id)
                }
                this.specsShow = true
                this.specsTitle = name + ' - 规格列表'
            },
            loadGoodsSpread (id, name) {
                try {
                    this.$refs.spreadList.loadSpreadList(id)
                } catch (e) {
                    this.$cookies.set('goods_id', id)
                }
                this.spreadShow = true
                this.spreadTitle = name + ' - 推广图'
            },
            refreshList () {
                this.infoShow = false
                this.dgShow = false
                this.onSubmit()
            },
            shiftSort (id, sort) {
                this.loading = true
                this.$axios({
                    url: '/api/user/goods/updateGoodsIndex',
                    method: 'post',
                    data: {goodsId: id, typeId: this.goods.typeId, sort: sort}
                }).then(res => {
                    if (res.data.code === '1') {
                        this.onSubmit()
                    } else if (res.data.code === '-1') {
                        this.$message.error(res.data.data)
                        this.$global.exitLoad(this, null, res.data)
                    }
                }).catch(error => {
                    console.info('错误信息', error)
                    this.$global.exitLoad(this, null, '')
                })
            },
            updateStatus (id, name, status) {
                let text = ''
                if (status) {
                    text = '下架'
                } else {
                    text = '发布'
                }
                this.$confirm('确定' + text + '商品吗？', name, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loading = true
                    this.$axios({
                        url: '/api/user/goods/updateGoodsStatus',
                        method: 'post',
                        data: {goodsId: id}
                    }).then(res => {
                        console.info('后台返回的数据', res.data)
                        if (res.data.code === '1') {
                            let that = this
                            this.$message.success({
                                message: res.data.data,
                                duration: 1000,
                                onClose: function () {
                                    that.onSubmit()
                                }
                            })
                        } else {
                            this.$message.error(res.data.data)
                            this.$global.exitLoad(this, null, res.data)
                        }
                    })
                })
            },
            deleteGoodsInfo (id) {
                this.$confirm('确定删除商品吗？', name, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loading = true
                    this.$axios({
                        url: '/api/user/goods/deleteGoodsInfo',
                        method: 'post',
                        data: {goodsId: id}
                    }).then(res => {
                        console.info('后台返回的数据', res.data)
                        let that = this
                        this.$message.success({
                            message: res.data.data,
                            duration: 1000,
                            onClose: function () {
                                if (res.data.code === '1') {
                                    that.onSubmit()
                                } else {
                                    that.$message.error(res.data.data)
                                    that.$global.exitLoad(this, null, res.data)
                                }
                            }
                        })
                    })
                })
            }
        }
    }
</script>
