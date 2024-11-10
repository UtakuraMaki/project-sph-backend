<template>
  <el-card>
    <el-table style="width: 100%" border :data="tableData">
      <el-table-column label="序号" width="80px" align="center" type="index">
      </el-table-column>
      <el-table-column label="名称" prop="skuName"></el-table-column>
      <el-table-column label="描述" prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片" width="180px" align="center">
        <template slot-scope="{ row, $index }">
          <img :src="row.skuDefaultImg" style="height: 100px; width: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="重量(KG)" prop="weight"></el-table-column>
      <el-table-column
        label="价格(元)"
        width="80px"
        prop="price"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row, $index }">
          <el-button
            type="success"
            icon="el-icon-bottom"
            size="mini"
            title="下架"
            v-if="row.isSale !== 0"
            @click="cancelSale(row)"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-top"
            size="mini"
            title="上架"
            v-else
            @click="onSale(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editSku"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="openDrawer(row)"
          ></el-button>
          <el-popconfirm
            :title="`确定删除${row.skuName}吗？`"
            style="margin-left: 10px"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              slot="reference"
            ></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="paginationData.total"
      :page-sizes="[3, 5, 10]"
      :current-page="paginationData.pageNo"
      :page-size="paginationData.pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <el-drawer
      :visible.sync="drawerVisible"
      :show-close="false"
      :withHeader="false"
      size="50%"
    >
      <!-- <el-form label-width="80px">
        <el-form-item label="名称">{{ sku.skuName }}</el-form-item>
        <el-form-item label="描述">{{ sku.skuDesc }}</el-form-item>
        <el-form-item label="价格">{{ sku.price }}元</el-form-item>
        <el-form-item label="平台属性">
          <el-tag
            style="margin-right: 10px"
            type="success"
            v-for="skuAttrValue in sku.skuAttrValueList"
            :key="skuAttrValue.id"
            >{{ skuAttrValue.valueName }}</el-tag
          >
        </el-form-item>
        <el-form-item label="商品图片">
          <el-carousel>
            <el-carousel-item
              v-for="skuImage in sku.skuImageList"
              :key="skuImage.id"
            >
              <img :src="skuImage.imgUrl" />
            </el-carousel-item>
          </el-carousel>
        </el-form-item>
      </el-form> -->
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ sku.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ sku.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ sku.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            style="margin-right: 10px"
            type="success"
            v-for="skuAttrValue in sku.skuAttrValueList"
            :key="skuAttrValue.id"
            >{{ skuAttrValue.attrId }}-{{ skuAttrValue.valueId }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel>
            <el-carousel-item
              v-for="skuImage in sku.skuImageList"
              :key="skuImage.id"
            >
              <img :src="skuImage.imgUrl" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </el-card>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      paginationData: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      drawerVisible: false,
      sku: {},
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    cancelSale(row) {
      this.$API.sku
        .cancelSale(row.id)
        .then((result) => {
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "下架成功",
            });
            this.getTableData();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editSku() {
      this.$message({
        type: "info",
        message: "正在开发中...",
      });
    },
    getTableData() {
      this.$API.sku
        .getTableData({
          page: this.paginationData.pageNo,
          limit: this.paginationData.pageSize,
        })
        .then((result) => {
          if (result.code === 200) {
            this.paginationData.total = result.data.total;
            this.tableData = result.data.records;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleCurrentChange(pageNo) {
      this.paginationData.pageNo = pageNo;
      this.getTableData();
    },
    handleSizeChange(pageSize) {
      this.paginationData.pageSize = pageSize;
      this.getTableData();
    },
    onSale(row) {
      this.$API.sku
        .onSale(row.id)
        .then((result) => {
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "上架成功",
            });
            this.getTableData();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    openDrawer(row) {
      this.$API.sku
        .getSkuById(row.id)
        .then((result) => {
          if (result.code === 200) {
            this.sku = result.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      this.drawerVisible = true;
    },
  },
};
</script>

<style scoped>
.el-pagination {
  text-align: center;
}
.el-row .el-col-5 {
  text-align: right;
  font-size: 18px;
  font-weight: 700;
}
.el-row .el-col {
  margin: 10px;
}
>>>.el-carousel__button {
  width: 40px;
  height: 40px;
  background-color: pink;
  border-radius: 50%;
}
</style>