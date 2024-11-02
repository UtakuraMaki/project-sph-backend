<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="openDialog('添加品牌', {})"
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
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="openDialog('修改品牌', scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTrademark(scope.row.tmName, scope.row.id)"
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
      :title="dialogData.title"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form
        :model="formData"
        label-width="100px"
        label-position="left"
        :rules="rules"
        ref="form"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model.trim="formData.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/admin/product/fileUpload"
            :before-upload="handleBeforeUpload"
            :on-success="handleOnSuccess"
            :auto-upload="true"
            :show-file-list="false"
          >
            <img
              v-if="formData.logoUrl"
              :src="formData.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <template v-slot:tip>
              <div>只能上传jpg/png文件，且不超过500kb</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="handleConfirm" type="primary">确定</el-button>
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
      dialogVisible: false,
      formData: {
        tmName: "",
        logoUrl: "",
      },
      dialogData: {
        title: "",
      },
      id: "",
      rules: {
        tmName: [
          {
            required: true,
            message: "请输入品牌名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change",
          },
        ],
        logoUrl: [
          {
            required: true,
            message: "请选择品牌图片",
          },
        ],
      },
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
    handleBeforeUpload(file) {
      let isJPG = file.type === "image/jpg";
      let isPNG = file.type === "image/png";
      let isLt500K = file.size < 500 * 1024;
      if (!isJPG && !isPNG) {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
      }
      if (!isLt500K) {
        this.$message.error("上传图片大小不能超过 500KB!");
      }
      return (isJPG || isPNG) && isLt500K;
    },
    handleOnSuccess(res) {
      this.formData.logoUrl = res.data;
    },
    handleConfirm() {
      this.$refs.form.validate(async (isSuccess) => {
        if (isSuccess) {
          const result = await this.$API.trademark.saveOrUpdate({
            id: this.id,
            ...this.formData,
          });
          if (result.code === 200) {
            this.$message.success(this.id ? "修改品牌成功" : "添加品牌成功!");
            if(!this.id) {
              this.paginationData.pageNo = 1
            }
            this.getBaseTrademark();
          } else {
            this.$message.error(this.id ? "修改品牌失败" : "添加品牌失败!");
          }
          this.dialogVisible = false;
        } else {
          this.$message.error("表单验证失败");
        }
      });
    },
    openDialog(title, row) {
      this.formData.tmName = row.tmName || "";
      this.formData.logoUrl = row.logoUrl || "";
      this.dialogData.title = title;
      this.id = row.id || "";
      this.dialogVisible = true;
    },
    deleteTrademark(tmName, id) {
      this.$confirm(`你确定要删除${tmName}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const result = await this.$API.trademark.deleteRemove(id);
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "已成功删除",
            });
            if(this.tableData.length <= 1) {
              if(this.paginationData.pageNo <= 1) {
                this.paginationData.pageNo = 1
              }
              else {
                this.paginationData.pageNo--
              }
            }
            this.getBaseTrademark();
          } else {
            this.$message({
              type: "error",
              message: "删除失败",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  created() {
    this.getBaseTrademark()
      .then(() => {})
      .catch((error) => console.log(error));
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar {
  width: 178px;
  height: 178px;
}
.avatar-uploader-icon {
  width: 178px;
  height: 178px;
  line-height: 178px;
  font-size: 28px;
  color: #8c939d;
}
</style>