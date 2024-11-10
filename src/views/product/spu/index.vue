<template>
  <div>
    <el-card>
      <el-form label-width="80px" :inline="true">
        <el-form-item label="一级分类">
          <el-select
            placeholder="请选择"
            v-model="levelSelect.level1Value"
            @change="handleLevel1Change"
            :disabled="flag !== 0"
          >
            <el-option
              :label="level1.name"
              :value="level1.id"
              v-for="(level1, index) in selectData.level1Data"
              :key="level1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            placeholder="请选择"
            v-model="levelSelect.level2Value"
            @change="handleLevel2Change"
            :disabled="flag !== 0"
          >
            <el-option
              :label="level2.name"
              :value="level2.id"
              v-for="(level2, index) in selectData.level2Data"
              :key="level2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            placeholder="请选择"
            v-model="levelSelect.level3Value"
            @change="handleLevel3Change"
            :disabled="flag !== 0"
          >
            <el-option
              :label="level3.name"
              :value="level3.id"
              v-for="(level3, index) in selectData.level3Data"
              :key="level3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-if="flag === 0">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!levelSelect.level3Value"
        @click="addSPU"
        >添加SPU</el-button
      >
      <el-table :data="tableData" style="width: 100%" border :key="1">
        <el-table-column label="序号" width="60" type="index" align="center">
        </el-table-column>
        <el-table-column label="spu名称" prop="spuName"></el-table-column>
        <el-table-column label="spu描述" prop="description"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <el-button
              type="success"
              icon="el-icon-plus"
              size="mini"
              title="添加SKU"
              @click="addSKU(row)"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              title="修改SPU"
              @click="editSPU(row)"
            ></el-button>
            <el-button
              type="info"
              icon="el-icon-info"
              size="mini"
              title="查看当前SPU的SKU列表"
              @click="openDialog(row)"
            ></el-button>
            <el-popconfirm
              :title="`你确定删除${row.spuName}吗?`"
              @onConfirm="deleteSPU(row)"
              style="margin-left: 10px"
            >
              <template v-slot:reference>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除SPU"
                ></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="paginationData.total"
        :page-sizes="[3, 5, 10]"
        :page-size="paginationData.pageSize"
        :current-page="paginationData.pageNo"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-card>
    <el-card v-else-if="flag === 1">
      <el-form label-width="80px">
        <el-form-item label="SPU名称">
          <el-input v-model="spuData.spuName" placeholder="SPU名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select
            placeholder="请选择品牌"
            v-model="spuData.spuTrademark.spuTrademarkValue"
          >
            <el-option
              :label="option.tmName"
              :value="option.id"
              v-for="(option, index) in spuData.spuTrademark
                .spuTrademarkOptions"
              :key="option.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
          <el-input
            type="textarea"
            placeholder="SPU描述"
            rows="4"
            v-model="spuData.spuDescription"
          ></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
          <el-upload
            action="/admin/product/fileUpload"
            list-type="picture-card"
            :file-list="spuData.spuImageList"
            :on-preview="handleOnPreview"
            :on-remove="handleOnRemove"
            :on-success="handleOnSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="spuData.dialogVisible">
            <img width="100%" :src="spuData.spuImgUrl" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="销售属性">
          <el-select
            :placeholder="remainPlaceholder"
            v-model="spuData.spuAttr.spuAttrName"
          >
            <el-option
              :label="option.name"
              :value="option.id"
              v-for="(option, index) in remainOptions"
              :key="option.id"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-plus"
            :disabled="!spuData.spuAttr.spuAttrName"
            @click="addSaleAttr"
            >添加销售属性</el-button
          >
          <el-table
            :data="spuData.spuAttr.spuSaleAttrList"
            style="width: 100%"
            border
            :key="2"
          >
            <el-table-column
              label="序号"
              type="index"
              width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="属性名"
              width="200"
              prop="saleAttrName"
            ></el-table-column>
            <el-table-column label="属性值名称列表">
              <template slot-scope="{ row, $index }">
                <el-tag
                  v-for="(spuSaleAttrValue, index) in row.spuSaleAttrValueList"
                  :key="spuSaleAttrValue.id"
                  :closable="true"
                  @close="handleCloseTag(row, index)"
                  >{{ spuSaleAttrValue.saleAttrValueName }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model.trim="row.inputValue"
                  :ref="row.baseSaleAttrId"
                  size="small"
                  @keyup.native.enter="$event.target.blur"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                  >添加</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="{ row, $index }">
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeSaleAttr($index)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveOrUpdateSpu">保存</el-button>
          <el-button @click="toShowMode">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-else>
      <el-form label-width="80px">
        <el-form-item label="SPU名称">
          <span>{{ skuData.spuName }}</span>
        </el-form-item>
        <el-form-item label="SKU名称">
          <el-input placeholder="SKU名称" v-model="skuData.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
          <el-input
            type="number"
            placeholder="价格(元)"
            v-model.number="skuData.skuPrice"
          ></el-input>
        </el-form-item>
        <el-form-item label="重量(千克)">
          <el-input
            placeholder="重量(千克)"
            v-model="skuData.skuWeight"
          ></el-input>
        </el-form-item>
        <el-form-item label="规格描述">
          <el-input
            placeholder="规格描述"
            type="textarea"
            rows="4"
            v-model="skuData.skuDescription"
          ></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
          <el-form label-width="100px" :inline="true">
            <el-form-item
              :label="attrInfo.attrName"
              v-for="(attrInfo, index) in attrInfoList"
              :key="attrInfo.id"
            >
              <el-select
                placeholder="请选择"
                v-model="attrInfo.attrValueAndName"
                style="margin-bottom: 10px"
              >
                <el-option
                  :label="attrValue.valueName"
                  :value="`${attrValue.valueName}:${attrValue.id}`"
                  v-for="(attrValue, index) in attrInfo.attrValueList"
                  :key="attrValue.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="销售属性">
          <el-form label-width="100px" :inline="true">
            <el-form-item
              :label="spuSaleAttr.saleAttrName"
              v-for="(spuSaleAttr, index) in spuSaleAttrList"
              :key="spuSaleAttr.id"
            >
              <el-select
                placeholder="请选择"
                v-model="spuSaleAttr.spuSaleAttrValue"
              >
                <el-option
                  :label="spuSaleAttrValue.saleAttrValueName"
                  :value="spuSaleAttrValue.id"
                  v-for="spuSaleAttrValue in spuSaleAttr.spuSaleAttrValueList"
                  :key="spuSaleAttrValue.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="图片列表">
          <el-table
            style="width: 100%"
            border
            :data="spuImageList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection"> </el-table-column>
            <el-table-column label="图片">
              <template slot-scope="{ row, $index }">
                <img :src="row.imgUrl" style="height: 100px" />
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="imgName"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row, $index }">
                <el-button
                  type="primary"
                  size="mini"
                  v-if="row.isDefault === '0'"
                  @click="changeIsDefault(row)"
                  >设为默认</el-button
                >
                <el-tag type="success" size="mini" v-else>默认</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveSKU">保存</el-button>
          <el-button @click="cancelAddSku">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog :title="`${row.spuName}的SKU列表`" :visible.sync="dialogVisible">
      <el-table style="width: 100%" :data="findList" v-loading="loading">
          <el-table-column label="名称" prop="skuName">
          </el-table-column>
          <el-table-column label="价格" prop="price">
          </el-table-column>
          <el-table-column label="重量" prop="weight">
          </el-table-column>
          <el-table-column label="默认图片">
            <template slot-scope="{row, $index}">
              <img :src="row.skuDefaultImg" style="height: 80px;">
            </template>
          </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Spu",
  data() {
    return {
      levelSelect: {
        level1Value: "",
        level2Value: "",
        level3Value: "",
      },
      selectData: {
        level1Data: [],
        level2Data: [],
        level3Data: [],
      },
      tableData: [],
      paginationData: {
        pageNo: 1,
        pageSize: 3,
        total: 0,
      },
      flag: 0,
      inputVisible: false,
      inputValue: "",
      spuData: {
        spuId: "",
        spuName: "",
        spuTrademark: {
          spuTrademarkValue: "",
          spuTrademarkOptions: [],
        },
        spuDescription: "",
        spuImgUrl: "",
        spuImageList: [],
        dialogVisible: false,
        spuAttr: {
          spuAttrName: "",
          spuAttrValue: [],
          spuSaleAttrList: [],
        },
      },
      skuData: {
        spuId: "",
        spuName: "",
        tmId: "",
        skuName: "",
        skuPrice: "",
        skuWeight: "",
        skuDescription: "",
        skuImageList: [],
        skuDefaultImg: "",
      },
      attrInfoList: [],
      spuSaleAttrList: [],
      spuImageList: [],
      defaultIndex: -1,
      dialogVisible: false,
      findList: [],
      row: {},
      loading: true
    };
  },
  mounted() {
    this.$API.attr
      .getCategory1()
      .then((result) => {
        if (result.code === 200) {
          this.selectData.level1Data = result.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  computed: {
    remainPlaceholder() {
      const remainNum = 3 - this.spuData.spuAttr.spuSaleAttrList.length;
      if (remainNum === 0) {
        return "没有啦！！！";
      } else {
        return `还有${remainNum}未选择`;
      }
    },
    remainOptions() {
      return this.spuData.spuAttr.spuAttrValue.filter((element) => {
        for (let i = 0; i < this.spuData.spuAttr.spuSaleAttrList.length; i++) {
          if (
            element.id ===
            this.spuData.spuAttr.spuSaleAttrList[i].baseSaleAttrId
          ) {
            return false;
          }
        }
        return true;
      });
    },
  },
  methods: {
    addSaleAttr() {
      let saleAttrName = "";
      for (let i = 0; i < this.remainOptions.length; i++) {
        if (this.remainOptions[i].id === this.spuData.spuAttr.spuAttrName) {
          saleAttrName = this.remainOptions[i].name;
          break;
        }
      }
      const newSaleAttr = {
        baseSaleAttrId: this.spuData.spuAttr.spuAttrName,
        inputVisible: false,
        inputValue: "",
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spuData.spuAttr.spuSaleAttrList.push(newSaleAttr);
      this.spuData.spuAttr.spuAttrName = "";
    },
    addSKU(row) {
      this.skuData.spuId = row.id;
      this.skuData.spuName = row.spuName;
      this.skuData.tmId = row.tmId;
      this.$API.attr
        .getAttrInfoList({
          category1Id: this.levelSelect.level1Value,
          category2Id: this.levelSelect.level2Value,
          category3Id: this.levelSelect.level3Value,
        })
        .then((result) => {
          this.attrInfoList = result.data;
          this.attrInfoList.forEach((value) => {
            this.$set(value, "attrValueAndName", "");
          });
        })
        .catch((error) => {
          console.log(error);
        });
      this.$API.spu
        .getSpuSaleAttrList(row.id)
        .then((result) => {
          this.spuSaleAttrList = result.data;
          this.spuSaleAttrList.forEach((value) => {
            this.$set(value, "spuSaleAttrValue", "");
          });
        })
        .catch((error) => {
          console.log(error);
        });
      this.$API.spu
        .getSpuImageList(row.id)
        .then((result) => {
          this.spuImageList = result.data;
          this.spuImageList.forEach((value) => {
            this.$set(value, "isDefault", "0");
          });
        })
        .catch((error) => {
          console.log(error);
        });
      this.flag = 2;
    },
    addSPU() {
      this.flag = 1;
      this.$API.spu
        .getTrademarkList()
        .then((result) => {
          if (result.code === 200) {
            this.spuData.spuTrademark.spuTrademarkOptions = result.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      this.$API.spu
        .getBaseSaleAttrList()
        .then((result) => {
          if (result.code === 200) {
            this.spuData.spuAttr.spuAttrValue = result.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cancelAddSku() {
      this.skuData = {
        spuId: "",
        spuName: "",
        tmId: "",
        skuName: "",
        skuPrice: "",
        skuWeight: "",
        skuDescription: "",
        skuImageList: [],
        skuDefaultImg: "",
      };
      this.flag = 0;
    },
    changeIsDefault(row) {
      this.spuImageList.forEach((value) => {
        value.isDefault = "0";
      });
      row.isDefault = "1";
      this.skuData.skuDefaultImg = row.imgUrl;
    },
    deleteSPU(row) {
      this.$API.spu
        .deleteSpu(row.id)
        .then((result) => {
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "删除SPU成功",
            });
            if (this.tableData.length <= 1 && this.paginationData.pageNo > 1) {
              this.paginationData.pageNo--;
            }
            this.getSpuTableData();
          } else {
            this.$message({
              type: "error",
              message: "删除SPU失败",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editSPU(row) {
      this.flag = 1;
      this.$API.spu
        .getSpuById(row.id)
        .then((result) => {
          // console.log(result);
          if (result.code === 200) {
            this.spuData.spuId = result.data.id;
            this.spuData.spuName = result.data.spuName;
            this.spuData.spuTrademark.spuTrademarkValue = result.data.tmId;
            this.spuData.spuDescription = result.data.description;
            this.spuData.spuAttr.spuSaleAttrList = result.data.spuSaleAttrList;
            this.spuData.spuAttr.spuSaleAttrList.forEach((value) => {
              this.$set(value, "inputVisible", false);
              this.$set(value, "inputValue", "");
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      this.$API.spu
        .getTrademarkList()
        .then((result) => {
          if (result.code === 200) {
            this.spuData.spuTrademark.spuTrademarkOptions = result.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      this.$API.spu
        .getSpuImageList(row.id)
        .then((result) => {
          if (result.code === 200) {
            this.spuData.spuImageList = result.data.map((element) => {
              return {
                name: element.imgName,
                url: element.imgUrl,
              };
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      this.$API.spu
        .getBaseSaleAttrList()
        .then((result) => {
          if (result.code === 200) {
            this.spuData.spuAttr.spuAttrValue = result.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSpuTableData() {
      this.$API.spu
        .getSpuTableData({
          page: this.paginationData.pageNo,
          limit: this.paginationData.pageSize,
          category3Id: this.levelSelect.level3Value,
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
    handleCloseTag(row, index) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    handleCurrentChange(pageNo) {
      this.paginationData.pageNo = pageNo;
      this.getSpuTableData();
    },
    handleInputConfirm(row) {
      if (!row.inputValue) {
        this.$message({
          type: "error",
          message: "属性值不能为空",
        });
      } else if (
        row.spuSaleAttrValueList.some((value) => {
          return value.saleAttrValueName === row.inputValue;
        })
      ) {
        this.$message({
          type: "error",
          message: "属性值不能重复",
        });
      } else {
        const newTag = {
          baseSaleAttrId: row.baseSaleAttrId,
          isChecked: null,
          saleAttrName: row.saleAttrName,
          saleAttrValueName: row.inputValue,
        };
        row.spuSaleAttrValueList.push(newTag);
        row.inputValue = "";
        row.inputVisible = false;
      }
    },
    handleLevel1Change() {
      this.levelSelect.level2Value = "";
      this.levelSelect.level3Value = "";
      this.selectData.level2Data = [];
      this.selectData.level3Data = [];
      this.$API.attr
        .getCategory2(this.levelSelect.level1Value)
        .then((result) => {
          if (result.code === 200) {
            this.selectData.level2Data = result.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleLevel2Change() {
      this.levelSelect.level3Value = "";
      this.selectData.level3Data = [];
      this.$API.attr
        .getCategory3(this.levelSelect.level2Value)
        .then((result) => {
          if (result.code === 200) {
            this.selectData.level3Data = result.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleLevel3Change() {
      this.getSpuTableData();
    },
    handleOnPreview(file) {
      this.spuData.spuImgUrl = file.url;
      this.spuData.dialogVisible = true;
    },
    handleOnRemove(_, fileList) {
      this.spuData.spuImageList = fileList;
    },
    handleOnSuccess(_, file, fileList) {
      console.log(_, file, fileList);
      const { name, status, uid } = file;
      this.spuData.spuImageList.push({
        name,
        status,
        uid,
        url: file.response.data,
      });
    },
    handleSelectionChange(selection) {
      console.log(selection);
      this.skuData.skuImageList = selection.map((value) => {
        return {
          imgName: value.imgName,
          imgUrl: value.imgUrl,
          spuImgId: value.id,
          isDefault: value.isDefault,
        };
      });
    },
    handleSizeChange(pageSize) {
      this.paginationData.pageSize = pageSize;
      this.getSpuTableData();
    },
    openDialog(row) {
      this.findList = []
      this.loading = true
      this.dialogVisible = true
      this.$API.spu.getFindBySpuId(row.id).then(result => {
        if(result.code === 200) {
          this.row = row
          this.findList = result.data
          this.loading = false
        }
        else {
          this.$message({
            type: 'error',
            message: '查看当前SPU的SKU列表失败'
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    removeSaleAttr(index) {
      this.spuData.spuAttr.spuSaleAttrList.splice(index, 1);
    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(() => {
        this.$refs[row.baseSaleAttrId].$refs.input.focus();
      });
    },
    toShowMode() {
      this.flag = 0;
      this.spuData = {
        spuId: "",
        spuName: "",
        spuTrademark: {
          spuTrademarkValue: "",
          spuTrademarkOptions: [],
        },
        spuDescription: "",
        spuImgUrl: "",
        spuImageList: [],
        dialogVisible: false,
        spuAttr: {
          spuAttrName: "",
          spuAttrValue: [],
          spuSaleAttrList: [],
        },
      };
    },
    saveOrUpdateSpu() {
      const category3Id = this.levelSelect.level3Value;
      const description = this.spuData.spuDescription;
      const id = this.spuData.spuId;
      const spuImageList = this.spuData.spuImageList.map((value) => {
        return {
          imgName: value.name,
          imgUrl: value.url,
        };
      });
      const spuName = this.spuData.spuName;
      const spuSaleAttrList = this.spuData.spuAttr.spuSaleAttrList.map(
        (value) => {
          return {
            baseSaleAttrId: value.baseSaleAttrId,
            saleAttrName: value.saleAttrName,
            spuSaleAttrValueList: value.spuSaleAttrValueList.map((element) => {
              return {
                baseSaleAttrId: element.baseSaleAttrId,
                isChecked: element.isChecked,
                saleAttrName: element.saleAttrName,
                saleAttrValueName: element.saleAttrValueName,
              };
            }),
          };
        }
      );
      const tmId = this.spuData.spuTrademark.spuTrademarkValue;
      const data = {
        category3Id,
        description,
        id,
        spuImageList,
        spuName,
        spuSaleAttrList,
        tmId,
      };
      this.$API.spu
        .postSaveOrUpdateSpuInfo(data)
        .then((result) => {
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: `${data.id ? "修改" : "新增"}SPU成功`,
            });
            this.spuData = {
              spuId: "",
              spuName: "",
              spuTrademark: {
                spuTrademarkValue: "",
                spuTrademarkOptions: [],
              },
              spuDescription: "",
              spuImgUrl: "",
              spuImageList: [],
              dialogVisible: false,
              spuAttr: {
                spuAttrName: "",
                spuAttrValue: [],
                spuSaleAttrList: [],
              },
            };
            this.flag = 0;
            if (!data.id) {
              this.paginationData.pageNo = 1;
            }
            this.getSpuTableData();
          } else {
            this.$message({
              type: "error",
              message: `${data.id ? "修改" : "新增"}SPU失败`,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    saveSKU() {
      const category3Id = this.levelSelect.level3Value;
      const price = this.skuData.skuPrice;
      const skuAttrValueList = this.attrInfoList
        .filter((value) => {
          return value.attrValueAndName;
        })
        .map((value) => {
          return {
            attrId: value.id,
            valueId: parseInt(value.attrValueAndName.split(":")[1]),
          };
        });
      const skuDesc = this.skuData.skuDescription;
      const skuName = this.skuData.skuName;
      const skuSaleAttrValueList = this.spuSaleAttrList
        .filter((value) => {
          return value.spuSaleAttrValue;
        })
        .map((value) => {
          return {
            saleAttrId: value.id,
            saleAttrValueId: value.spuSaleAttrValue,
            spuId: this.skuData.spuId,
          };
        });
      const spuId = this.skuData.spuId;
      const tmId = this.skuData.tmId;
      const weight = this.skuData.skuWeight;
      const skuImageList = this.skuData.skuImageList;
      const skuDefaultImg = this.skuData.skuDefaultImg;
      const data = {
        category3Id,
        price,
        skuAttrValueList,
        skuDesc,
        skuName,
        skuSaleAttrValueList,
        spuId,
        tmId,
        weight,
        skuImageList,
        skuDefaultImg,
      };
      this.$API.spu
        .postSaveSkuInfo(data)
        .then((result) => {
          if (result.code === 200) {
            this.$message({
              type: 'success',
              message: '添加SKU成功'
            })
            this.spuData = {
              spuId: "",
              spuName: "",
              spuTrademark: {
                spuTrademarkValue: "",
                spuTrademarkOptions: [],
              },
              spuDescription: "",
              spuImgUrl: "",
              spuImageList: [],
              dialogVisible: false,
              spuAttr: {
                spuAttrName: "",
                spuAttrValue: [],
                spuSaleAttrList: [],
              },
            };
            this.flag = 0;
          }
          else {
            this.$message({
              type: 'error',
              message: '添加SKU失败'
            })
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.el-card {
  margin-bottom: 20px;
}
.el-pagination {
  text-align: center;
}
.el-tag {
  margin-right: 10px;
}
</style>

<style>
.button-new-tag {
  /* margin-left: 10px; */
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  /* margin-left: 10px; */
  vertical-align: bottom;
}
</style>
