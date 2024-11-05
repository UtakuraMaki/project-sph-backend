<template>
  <!-- 三级联动静态组件 -->
  <el-form :model="formData" label-width="80px" :inline="true">
    <el-form-item label="一级分类" prop="category1Value">
      <el-select
        v-model="formData.category1Value"
        placeholder="请选择"
        @change="getCategory2"
      >
        <el-option
          v-for="item in category1"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类" prop="category2Value">
      <el-select
        v-model="formData.category2Value"
        placeholder="请选择"
        @change="getCategory3"
      >
        <el-option
          v-for="item in category2"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类" prop="category3Value">
      <el-select v-model="formData.category3Value" placeholder="请选择" @change="getAttrInfoList">
        <el-option
          v-for="item in category3"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "CategorySelect",
  data() {
    return {
      category1: [],
      category2: [],
      category3: [],
      formData: {
        category1Value: "",
        category2Value: "",
        category3Value: "",
      },
    };
  },
  mounted() {
    this.getCategory1();
  },
  methods: {
    getCategory1() {
      this.$API.attr
        .getCategory1()
        .then((result) => {
          this.category1 = result.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getCategory2(category1Id) {
      this.formData.category2Value = ''
      this.formData.category3Value = ''
      this.category3 = []
      this.$emit('getAttrInfoList', [])
      this.$API.attr
        .getCategory2(category1Id)
        .then((result) => {
          this.category2 = result.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getCategory3(category2Id) {
      this.formData.category3Value = ''
      this.$emit('getAttrInfoList', [])
      this.$API.attr
        .getCategory3(category2Id)
        .then((result) => {
          this.category3 = result.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getAttrInfoList(category3Id) {
      this.$API.attr.getAttrInfoList({
        category1Id: this.formData.category1Value,
        category2Id: this.formData.category2Value,
        category3Id
      }).then(result => {
        this.$emit('getAttrInfoList', result.data, category3Id)
      }).catch(error => {
        console.log(error)
      })
    }
  },
};
</script>

<style>
</style>