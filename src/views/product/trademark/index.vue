<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0"
      >添加</el-button
    >
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="tmName" label="品牌名称" />
      <el-table-column prop="logo" label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" style="height: 100px;">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="warning" icon="el-icon-edit" size="mini">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="paginationData.pageNo"
      :page-sizes="[3, 5, 10]"
      :page-size="paginationData.pageSize"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="paginationData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    return {
      tableData: [],
      paginationData: {
        pageNo: 1,
        pageSize: 3,
        total: 0,
      },
    };
  },
  methods: {
    handleSizeChange(pageSize) {
      this.paginationData.pageSize = pageSize
      this.getBaseTrademark()
    },
    handleCurrentChange(pageNo) {
      this.paginationData.pageNo = pageNo
      this.getBaseTrademark()
    },
    async getBaseTrademark() {
      const result = await this.$API.trademark.getBaseTrademark({
        page: this.paginationData.pageNo,
        limit: this.paginationData.pageSize,
      })
      if(result.code === 200) {
        this.tableData = result.data.records
        this.paginationData.pageNo = result.data.current
        this.paginationData.total = result.data.total
        return Promise.resolve()
      }
      else {
        return Promise.reject(result.message)
      }
    },
  },
  created() {
    this.getBaseTrademark().then(() => {}).catch(error => console.log(error))
  },
};
</script>

<style scoped lang="less">
</style>
