<template>
  <!-- 平台属性管理静态组件 -->
  <div>
    <!-- 三级联动静态组件 -->
    <el-card>
      <CategorySelect @getAttrInfoList="getAttrInfoList"></CategorySelect>
    </el-card>
    <!-- 属性列表静态组件 -->
    <el-card v-if="flag">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="toAddOrEditAttr(undefined)"
        :disabled="!category3Id"
        >添加属性</el-button
      >
      <el-table :data="attrInfoList" style="width: 100%" border key="1">
        <el-table-column label="序号" width="80" align="center" type="index">
        </el-table-column>
        <el-table-column
          label="属性名称"
          width="160"
          prop="attrName"
        ></el-table-column>
        <el-table-column label="属性值列表">
          <template slot-scope="scope">
            <el-tag
              type="success"
              v-for="attrValue in scope.row.attrValueList"
              :key="attrValue.id"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="toAddOrEditAttr(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card v-else>
      <el-form label-width="60px">
        <el-form-item label="属性名">
          <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 20px">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrInfo.attrName"
          @click="addAttr"
          >添加属性值</el-button
        >
        <el-button @click="toShowAttr">取消</el-button>
      </div>
      <el-table style="width: 100%" border :data="attrInfo.attrValueList" key="2">
        <el-table-column label="序号" type="index" align="center" width="80">
        </el-table-column>
        <el-table-column label="属性值名称">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.valueName" :ref="scope.$index" placeholder="请输入属性值名称" size="mini" v-if="scope.row.flag" @blur="toSpan(scope.row)" @keyup.native.enter="toSpan(scope.row)"></el-input>
            <span v-else @click="toInput(scope.row, scope.$index)">{{ scope.row.valueName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-popconfirm :title="`你确定要删除${scope.row.valueName}吗?`" trigger="click" @onConfirm="deleteAttrValue(scope.$index)">
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
      <div style="margin-top: 20px">
        <el-button type="primary">保存</el-button>
        <el-button @click="toShowAttr">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
const cloneDeep = require('lodash/cloneDeep')
export default {
  name: "Attr",
  data() {
    return {
      category3Id: '',
      attrInfoList: [],
      flag: false,
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: "",
        categoryLevel: 3,
      },
    };
  },
  methods: {
    getAttrInfoList(attrInfoList, category3Id) {
      this.attrInfoList = attrInfoList;
      this.category3Id = category3Id
      this.attrInfo.categoryId = category3Id
    },
    toAddOrEditAttr(row) {
      if(row) {
        this.attrInfo = cloneDeep(row)
        this.attrInfo.attrValueList.forEach(element => {
          this.$set(element, 'flag', false)
        })
      }
      this.flag = false;
    },
    toShowAttr() {
      this.flag = true;
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: "",
        categoryLevel: 3,
      }
    },
    addAttr() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        flag: true
      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    toSpan(row) {
      if(!row.valueName) {
        this.$message({
          type: 'error',
          message: '属性值不能为空'
        })
        return
      }
      if(this.attrInfo.attrValueList.find((element, index) => {
        return element.valueName === row.valueName && element !== row
      })) {
        this.$message({
          type: 'error',
          message: '属性值不能相同'
        })
        return
      }
      row.flag = false
    },
    toInput(row, index) {
      row.flag = true
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    }
  },
};
</script>

<style scoped>
.el-card {
  margin-bottom: 20px;
}
.el-tag {
  margin: 10px;
}
</style>
