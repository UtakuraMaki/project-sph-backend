<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="dialogVisible = true"
      >添加</el-button
    >
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="80" align="center" />
      <el-table-column prop="tmName" label="品牌名称" />
      <el-table-column prop="logo" label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" style="height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="warning" icon="el-icon-edit" size="mini"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
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
    <el-dialog
      :visible.sync="dialogVisible"
      title="添加品牌"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form :model="formData" label-width="100px" label-position="left">
        <el-form-item :prop="formData.tmName" label="品牌名称" :required="true">
          <el-input v-model="formData.tmName"></el-input>
        </el-form-item>
        <el-form-item :prop="formData.logoUrl" label="品牌LOGO" :required="true">
          <el-upload action="https://jsonplaceholder.typicode.com/posts/">
            <template v-slot:tip>
              <div>只能上传jpg/png文件，且不超过500kb</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="dialogVisible = false" type="primary">确定</el-button>
      </template>
    </el-dialog>
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
      dialogVisible: true,
      formData: {
        tmName: '',
        logoUrl: ''
      }
    };
  },
  methods: {
    handleSizeChange(pageSize) {
      this.paginationData.pageSize = pageSize;
      this.getBaseTrademark();
    },
    handleCurrentChange(pageNo) {
      this.paginationData.pageNo = pageNo;
      this.getBaseTrademark();
    },
    async getBaseTrademark() {
      const result = await this.$API.trademark.getBaseTrademark({
        page: this.paginationData.pageNo,
        limit: this.paginationData.pageSize,
      });
      if (result.code === 200) {
        this.tableData = result.data.records;
        this.paginationData.pageNo = result.data.current;
        this.paginationData.total = result.data.total;
        return Promise.resolve();
      } else {
        return Promise.reject(result.message);
      }
    },
  },
  created() {
    this.getBaseTrademark()
      .then(() => {})
      .catch((error) => console.log(error));
  },
};
</script>

<style scoped lang="less">
</style>
