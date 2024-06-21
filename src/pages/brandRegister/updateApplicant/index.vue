<template>
  <view class="update-applicant">
     <scroll-view class="scroll-view" scroll-y>
      <view class="part-title">基本信息</view>
      <nut-cell-group title="">
          <nut-cell title="书式类型" @click="selectBookType">
             <template #desc>
                <view class="form-value">{{formData.bookValue}}<nut-icon name="rect-right" custom-color="#999"></nut-icon></view>
              </template>
          </nut-cell>
          <nut-cell title="申请人类型">
            <template #desc>
                <nut-radio-group v-model="formData.applicantType" direction="horizontal">
                  <nut-radio :label="1">企业</nut-radio>
                  <nut-radio :label="0">自然人</nut-radio>
                </nut-radio-group>  
            </template>
          </nut-cell>
          <nut-cell title="材料是否英文"  v-if="formData.bookType==3||formData.bookType==4||formData.bookType==5">
             <template #desc>
                <nut-radio-group v-model="formData.subjectType" direction="horizontal">
                  <nut-radio :label="1">中文</nut-radio>
                  <nut-radio :label="0">英文</nut-radio>
                </nut-radio-group>  
              </template>
          </nut-cell>
          <nut-cell title="申请人名称">
             <template #desc>
                <nut-input v-model="formData.applicantName" input-align="right" :placeholder="formData.bookType==1?'请输入与营业执照一致的公司名称':'请输入申请人名称'" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
              </template>
          </nut-cell>
          <nut-cell title="申请人名称（英文）" v-if="formData.bookType==2||(formData.bookType!=1&&formData.subjectType!=1)">
             <template #desc>
                <nut-input v-model="formData.applicantEnglishName" input-align="right" placeholder="请输入申请人名称（英文）" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
              </template>
          </nut-cell>
          <nut-cell title="证件类型" is-link v-if="formData.applicantType==0" @click="selectDocType">
            <template #desc>
                <view class="form-value">{{formData.certificatesValue}}</view>
            </template>
          </nut-cell>
          <nut-cell title="证件号码" v-if="formData.applicantType==0"> 
            <template #desc>
                <nut-input v-model="formData.idCard" input-align="right" type="idcard" placeholder="请输入证件号码" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
              </template>
          </nut-cell>
          <!-- //  -->
          <nut-cell title="国家或地区" is-link v-if="formData.bookType==2" @click="selectCountryType">
            <template #desc>
                <view class="form-value">{{formData.country}}</view>
            </template>
          </nut-cell>
          <nut-cell :title="formData.bookType==1?(formData.applicantType==1?'统一社会信用代码':'身份证号'):'证件号码'" v-if="formData.bookType == 1 && formData.applicantType == 1">
             <template #desc>
                <nut-input v-model="formData.idCard" input-align="right" max-length="18" :placeholder="formData.bookType==1?(formData.applicantType==1?'请输入18位信用代码或15位注册号':'营业执照经营者对应的身份证号'):'请输入税号/身份证号'" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
              </template>
          </nut-cell>
          <!-- //  -->
          <nut-cell title="营业执照地址" v-if="formData.bookType==1"> 
            <template #desc>
              <picker mode="region" @change="bindRegionChange" :value="[provName,cityName,areaName]">
                  <view class="form-value">
                      <view class="input-placeholder" v-if="!areaName">省/市/区</view>
                      <view class="nut-input" v-if="areaName">{{provName+cityName+areaName}}</view>
                      <nut-icon name="rect-right" custom-color="#999"></nut-icon>
                  </view>
              </picker>
            </template>
          </nut-cell>
          <nut-cell title="详细地址"> 
            <template #desc>
                <nut-input v-model="formData.applicantAddress" input-align="right" :placeholder="formData.bookType==1?'请输入含有省市区的详细地址':'请输入详细地址'" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
              </template>
          </nut-cell>
          <nut-cell title="详细地址（英文）" v-if="formData.bookType==2||(formData.bookType!=1&&formData.subjectType!=1)"> 
            <template #desc>
              <nut-input v-model="formData.applicantEnglishAddress" input-align="right" placeholder="请输入详细地址（英文）" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
            </template>
          </nut-cell>
          <nut-cell title="邮政编码" v-if="formData.bookType==1"> 
            <template #desc>
              <nut-input v-model="formData.code" input-align="right" type="number" placeholder="请输入邮政编码" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
            </template>
          </nut-cell>
          <nut-cell title="申请人联系地址" v-if="formData.bookType==1"> 
            <template #desc>
              <nut-input v-model="formData.domesticReceiverAddress" input-align="right" placeholder="用于接收该商标后续商标业务的法律文件" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
            </template>
          </nut-cell>
          <nut-cell title="联系地址邮编" v-if="formData.bookType==1"> 
            <template #desc>
                <nut-input v-model="formData.domesticReceiverCode" input-align="right" type="number" placeholder="请输入邮政编码" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
             </template>
          </nut-cell>
          <nut-cell title="申请人邮箱" v-if="formData.bookType==1"> 
            <template #desc>
                <nut-input v-model="formData.domesticReceiverEmail" input-align="right" placeholder="请输入申请人邮箱" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
            </template>
          </nut-cell>
      </nut-cell-group>
      <view class="part-title">联系人信息</view>
      <nut-cell-group title="">
          <nut-cell title="联系人姓名">
             <template #desc>
                <nut-input v-model="formData.contactName" input-align="right" placeholder="请输入联系人姓名" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
              </template>
          </nut-cell>
          <nut-cell title="联系电话">
             <template #desc>
                <nut-input v-model="formData.contactTel" input-align="right" type="number" max-length="11" placeholder="请输入联系人电话" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
              </template>
          </nut-cell>
          <nut-cell title="电子邮箱">
             <template #desc>
                <nut-input v-model="formData.contactEmail" input-align="right" placeholder="请输入联系人邮箱" placeholder-class="input-placeholder" :border="false" input-class="nut-input"></nut-input>
              </template>
          </nut-cell>
      </nut-cell-group>
      <template v-if="landOrOutland==0">
        <view class="part-title">材料信息</view>
        <view class="part-box">
          <template v-if="formData.applicantType==0">
            <view class="sub-title">{{formData.bookType==1?'身份证复印件：':'身份证明中文：'}}<view class="show-file-template" @click="showIdFileTemplate">查看示例</view></view>
            <view class="file-box">
              <div class="file-item" @click="upload(2,6)">
                <image class="ivfileItemImageShow" v-if="formData.applicantIdCardImg" mode="widthFix" src="@/static/images/applicant/pdf.png"></image>
                <image class="ivfileItemImageUpload" v-else mode="heightFix" src="@/static/images/applicant/icon_upload_file.png"></image>
              </div>
            </view>
          </template>
          <template v-if="formData.applicantType==0 && (formData.bookType==2 || (formData.bookType!=1 && formData.subjectType==0))">
            <view class="sub-title">身份证明英文：<view class="show-file-template" @click="showIdFileTemplate">查看示例</view></view>
            <view class="file-box">
             <div class="file-item" @click="upload(3,6)">
                <image class="ivfileItemImageShow" v-if="formData.idCardEnglishPic" mode="widthFix" src="@/static/images/applicant/pdf.png"></image>
                <image class="ivfileItemImageUpload" v-else mode="heightFix" src="@/static/images/applicant/icon_upload_file.png"></image>
              </div>
            </view>
          </template>
          <template v-if="formData.applicantType==1||formData.bookType==1">
            <view class="sub-title">{{formData.bookType==1?'营业执照复印件：':'主体资格证明中文：'}}<view class="show-file-template" @click="showLicenseTemplate">查看示例</view></view>
            <view class="file-box">
              <div class="file-item" @click="upload(0,2)">
                <image class="ivfileItemImageShow" v-if="formData.applicantQualification" mode="widthFix" src="@/static/images/applicant/pdf.png"></image>
                <image class="ivfileItemImageUpload" v-else mode="heightFix" src="@/static/images/applicant/icon_upload_file.png"></image>
              </div>
            </view>
          </template>
          <template v-if="formData.applicantType==1 && (formData.bookType==2 || (formData.bookType!=1 && formData.subjectType==0))">
            <view class="sub-title">主体资格证明英文：<view class="show-file-template" @click="showLicenseTemplate">查看示例</view></view>
            <view class="file-box">
              <div class="file-item" @click="upload(1,2)">
                <image class="ivfileItemImageShow" v-if="formData.licenseEnglishPic" mode="widthFix" src="@/static/images/applicant/pdf.png"></image>
                <image class="ivfileItemImageUpload" v-else mode="heightFix" src="@/static/images/applicant/icon_upload_file.png"></image>
              </div>
            </view>
          </template>
          <view class="sub-title">委托书模板：</view>
          <view class="file-box">
              <div class="file-item" @click="upload(5,5)">
                <image class="ivfileItemImageShow" v-if="formData.applicantProxy" mode="widthFix" :src="formData.applicantProxyUrl"></image>
                <image class="ivfileItemImageUpload" v-else mode="heightFix" src="@/static/images/applicant/icon_upload_proxy.png"></image>
              </div>
              <div class="file-item" @click="upload(4,4)">
                <image class="ivfileItemImageShow" v-if="formData.applicantProxyStatement" mode="widthFix" src="@/static/images/applicant/pdf.png"></image>
                <image class="ivfileItemImageUpload" v-else mode="heightFix" src="@/static/images/applicant/icon_upload_statement.png"></image>
              </div>
          </view>
        </view>
      </template>
      <view style="height:50rpx"></view>
    </scroll-view>
    <view class="footer" @click="submit">
      保 存
    </view>
    <Modal @handleClick="modalClick" :config="config" />
  </view>
</template>

<script setup>
import Modal from './components/modal'
import { getRegions, editApplicant, createApplicant, updateOrderUserOwner, brandSearch, queryBlackListApi } from '@/server/applicant'
import { fileUrl, uploadFile, imgUrl } from '@/utils/index'
import { ref } from 'vue'
const edit = ref(null)
const config = ref({})
const provName = ref('')
const cityName = ref('')
const areaName = ref('')
const applicantContacts = ref([1, 2, 3])
const landOrOutland = ref(0)
const checkPhone = /^1[3-9]\d{9}$/
const checkEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const formData = ref({
  bookValue: '中国大陆',
  bookType: 1,
  applicantType: 1,
  applicantName: '',
  applicantEnglishName: '',
  certificatesType: 1,
  certificatesValue: '身份证',
  idCard: '',
  country: '中国',
  applicantAddress: '',
  applicantEnglishAddress: '',
  contactName: '',
  contactTel: '',
  contactEmail: '',
  code: '',
  applicantQualification: '',
  licenseEnglishPic: '',
  applicantIdCardImg: '',
  idCardEnglishPic: '',
  applicantProxy: '',
  applicantProxyOrder: '',
  applicantProxyStatement: '',
  subjectType: 1,
  area: 0, //区域id
  city: 0, //城市id
  prov: 0, //省会id
})

onLoad((options) => {
  if (options.edit) {
    edit.value = options.edit
    if (options.landOrOutland) {
      landOrOutland.value = options.landOrOutland
    }
    let formData = uni.getStorageSync('formData')
    switch (parseInt(formData.bookType)) {
      case 1:
        formData.bookValue = '中国大陆'
        break
      case 2:
        formData.bookValue = '海外'
        break
      case 3:
        formData.bookValue = '中国台湾'
        break
      case 4:
        formData.bookValue = '中国香港'
        break
      case 5:
        formData.bookValue = '中国澳门'
        break
    }
    switch (parseInt(formData.certificatesType)) {
      case 1:
        formData.certificatesValue = '身份证'
        break
      case 2:
        formData.certificatesValue = '护照'
        break
      case 3:
        formData.certificatesValue = '其他'
        break
    }
    formData.value = formData
    provName.value = formData.provStr
    cityName.value = formData.cityStr
    if (!provName.value && uni.getStorageSync('provinceList')) {
      getProCityAreaName()
    }
  }
  if (!uni.getStorageSync('provinceList')) {
    getProCityAreaId()
  }
})

const selectBookType = () => {
  if (formData.value.landOrOutland == 2) {
    let tmpArr = ['海外', '中国台湾', '中国香港', '中国澳门']
    uni.showActionSheet({
      itemList: tmpArr,
      success(res) {
        formData.value.bookType = parseInt(res.tapIndex) + 2;
        formData.value.bookValue = tmpArr[res.tapIndex]
      }
    })
  } else if (formData.value.landOrOutland == 1) {
    let tmpArr = ['大陆']
    uni.showActionSheet({
      itemList: tmpArr,
      success(res) {
        formData.value.bookType = parseInt(res.tapIndex) + 1;
        formData.value.bookValue = tmpArr[res.tapIndex]
      }
    })
  } else {
    let tmpArr = ['中国大陆', '海外', '中国台湾', '中国香港', '中国澳门']
    uni.showActionSheet({
      itemList: tmpArr,
      success(res) {
        formData.value.bookType = parseInt(res.tapIndex) + 1;
        formData.value.bookValue = tmpArr[res.tapIndex]
      }
    })
  }
}
const selectDocType = () => {
  let tmpArr = ['身份证', '护照', '其它']
  uni.showActionSheet({
    itemList: tmpArr,
    success: function (res) {
      formData.value.certificatesType = parseInt(res.tapIndex) + 1
      formData.value.certificatesValue = tmpArr[res.tapIndex]
    },
  });
}
const selectCountryType = () => {
  uni.navigateTo({
    url: '/pages/brandRegister/selectCountry/index',
    events: {
      setCountry(name) {
        formData.value.country = name
      }
    }
  })
}

const bindRegionChange = (e) => {
  provName.value = e.detail.value[0]
  cityName.value = e.detail.value[1]
  areaName.value = e.detail.value[2]
  formData.value.code = e.detail.postcode
  getActAreaid(e.detail.value[0], e.detail.value[1], e.detail.value[2])
}
/**动态获取省市区id */
const getActAreaid = (provName, cityName, areaName) => {
  var tmpProvId
  var tmpCityId
  var tmpAreaId = 0
  var provList = uni.getStorageSync('provinceList')
  var cityList = uni.getStorageSync('cityList')
  var areaList = uni.getStorageSync('areaList')
  for (var i = 0; i < provList.length; i++) {
    if (provList[i].name == provName) {
      tmpProvId = provList[i].id
      break
    }
  }
  if (tmpProvId == 1 || tmpProvId == 2 || tmpProvId == 9 || tmpProvId == 22 || tmpProvId == 33 || tmpProvId == 34) {
    for (var i = 0; i < cityList.length; i++) {
      if (cityList[i].name == areaName) {
        tmpCityId = cityList[i].id
        break
      }
    }
  } else {
    for (var i = 0; i < cityList.length; i++) {
      if (cityList[i].name == cityName) {
        tmpCityId = cityList[i].id
        break
      }
    }
    for (var i = 0; i < areaList.length; i++) {
      if (areaList[i].name == areaName && areaList[i].parent == tmpCityId) {
        tmpAreaId = areaList[i].id
        break
      }
    }
    if (!tmpCityId || tmpCityId < 0) {
      for (var i = 0; i < cityList.length; i++) {
        if (cityList[i].name == areaName && cityList[i].parent == tmpProvId) {
          tmpCityId = cityList[i].id
          tmpAreaId = 0
          break
        }
      }
    }
  }
  formData.value.prov = tmpProvId
  formData.value.city = tmpCityId
  formData.value.area = tmpAreaId
}
/**存储省市区id */
const getProCityAreaId = () => {
  uni.showLoading({
    title: '加载中',
  })
  getRegions({}).then(res => {
    uni.hideLoading()
    var list = res
    var province = []
    var city = []
    var area = []
    for (var i = 0; i < list.length; i++) {
      var item = list[i]
      if (item.level == 1) {
        province.push(item)
      }
      if (item.level == 2) {
        city.push(item)
      }
      if (item.level == 3) {
        area.push(item)
      }
    }
    uni.setStorageSync("provinceList", province)
    uni.setStorageSync("cityList", city)
    uni.setStorageSync("areaList", area)
    if (formData.value.prov != 0 && !formData.value.provName) {
      getProCityAreaName()
    }
  })
}
const getProCityAreaName = () => {
  var provList = uni.getStorageSync('provinceList')
  var cityList = uni.getStorageSync('cityList')
  var areaList = uni.getStorageSync('areaList')
  for (var i = 0; i < provList.length; i++) {
    if (provList[i].id == formData.value.prov) {
      provName.value = provList[i].name
      break
    }
  }
  for (var i = 0; i < cityList.length; i++) {
    if (cityList[i].id == formData.value.city) {
      cityName.value = cityList[i].name
      break
    }
  }
  for (var i = 0; i < areaList.length; i++) {
    if (areaList[i].id == formData.value.area) {
      areaName.value = areaList[i].name
      break
    }
  }
}

const showIdFileTemplate = () => {
  uni.previewImage({
    current: 'https://www.quandashi.com/qdshome/ex-pdf-jpg/gr-sfz.jpg',
    urls: ['https://www.quandashi.com/qdshome/ex-pdf-jpg/gr-sfz.jpg']
  })
}
const showLicenseTemplate = () => {
  uni.previewImage({
    current: 'https://www.quandashi.com/qdshome/ex-pdf-jpg/gr-yyzz.jpg',
    urls: ['https://www.quandashi.com/qdshome/ex-pdf-jpg/gr-yyzz.jpg']
  })
}

const upload = (type, fileType) => {
  uni.showActionSheet({
    itemList: ['拍照', '相册'],
    success(res) {
      if (res.tapIndex == 0) {
        uni.chooseImage({
          count: 1,
          sourceType: ['camera'],
          success: function (res) {
            upload_file(res)
          }
        })
      } else {
        uni.chooseImage({
          count: 1,
          sourceType: ['album'],
          success: function (res) {
            upload_file(res)
          }
        })
      }
    }
  })
  function upload_file(file) {
    const data = {
      filePath: file.tempFiles[0].path,
      fileSize: file.tempFiles[0].size,
      type: fileType
    }
    uploadFile(data).then(res => {
      switch (parseInt(type)) {
        case 0:
          formData.value.applicantQualification = res
          break
        case 1:
          formData.value.licenseEnglishPic = res
          break
        case 2:
          formData.value.applicantIdCardImg = res
          break
        case 3:
          formData.value.idCardEnglishPic = res
          break
        case 4:
          formData.value.applicantProxyStatement = res
          break
        case 5:
          formData.value.applicantProxy = res
          if (res.indexOf('http') > -1) {
            formData.value.applicantProxyUrl = res
          } else {
            formData.value.applicantProxyUrl = imgUrl + res
          }

          break
      }
    })
  }
}

const checkApplicantInfo = () => {
  /**个人+大陆 */
  if (formData.value.applicantType == 0 && formData.value.bookType == 1) {
    if (!formData.value.applicantName) {
      uni.showToast({
        title: '请输入申请人名称',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.idCard) {
      uni.showToast({
        title: '请输入身份证号',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.prov) {
      uni.showToast({
        title: '请选择营业执照地址',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.code) {
      uni.showToast({
        title: '请输入邮政编码',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.applicantAddress) {
      uni.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
      return false
    }
    if (!util.checkMill(formData.value.applicantAddress)) {
      uni.showToast({
        title: '详细地址需包含省市信息',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.domesticReceiverAddress) {
      uni.showToast({
        title: '请输入申请人联系地址',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.domesticReceiverCode) {
      uni.showToast({
        title: '请输入联系地址邮编',
        icon: 'none'
      })
      return false
    }
    if (formData.value.domesticReceiverCode.length != 6) {
      uni.showToast({
        title: '联系地址邮编应为6位',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.domesticReceiverEmail) {
      uni.showToast({
        title: '请输入申请人邮箱',
        icon: 'none'
      })
      return false
    }
    if (!util.isEmail(formData.value.domesticReceiverEmail)) {
      uni.showToast({
        title: '申请人邮箱格式不正确',
        icon: 'none'
      })
      return false
    }
  }

  /**企业+大陆 */
  if (formData.value.applicantType == 1 && formData.value.bookType == 1) {
    if (!formData.value.applicantName) {
      uni.showToast({
        title: '请输入申请人名称',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.idCard) {
      uni.showToast({
        title: '请输入统一信用代码',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.prov) {
      uni.showToast({
        title: '请选择营业执照地址',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.code) {
      uni.showToast({
        title: '请输入邮政编码',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.applicantAddress) {
      uni.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
      return false
    }
    if (!util.checkMill(formData.value.applicantAddress)) {
      uni.showToast({
        title: '详细地址需包含省市信息',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.domesticReceiverAddress) {
      uni.showToast({
        title: '请输入申请人联系地址',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.domesticReceiverCode) {
      uni.showToast({
        title: '请输入联系地址邮编',
        icon: 'none'
      })
      return false
    }
    if (formData.value.domesticReceiverCode.length != 6) {
      uni.showToast({
        title: '联系地址邮编应为6位',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.domesticReceiverEmail) {
      uni.showToast({
        title: '请输入申请人邮箱',
        icon: 'none'
      })
      return false
    }
    if (!util.isEmail(formData.value.domesticReceiverEmail)) {
      uni.showToast({
        title: '申请人邮箱格式不正确',
        icon: 'none'
      })
      return false
    }
  }

  /**个人+海外 */
  if (formData.value.applicantType == 0 && formData.value.bookType == 2) {
    if (!formData.value.applicantName) {
      uni.showToast({
        title: '请输入申请人姓名',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.applicantEnglishName) {
      uni.showToast({
        title: '请输入申请人英文姓名',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.idCard) {
      uni.showToast({
        title: '请输入证件号码',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.country || formData.value.country == '请选择国家') {
      uni.showToast({
        title: '请选择国家',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.applicantAddress) {
      uni.showToast({
        title: '请输入申请人地址',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.applicantEnglishAddress) {
      uni.showToast({
        title: '请输入申请人英文地址',
        icon: 'none'
      })
      return false
    }
  }

  /**企业+海外 */
  if (formData.value.applicantType == 1 && formData.value.bookType == 2) {
    if (!formData.value.applicantName) {
      uni.showToast({
        title: '请输入申请人姓名',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.applicantEnglishName) {
      uni.showToast({
        title: '请输入申请人英文姓名',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.country || formData.value.country == '请选择国家') {
      uni.showToast({
        title: '请选择国家',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.applicantAddress) {
      uni.showToast({
        title: '请输入申请人地址',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.applicantEnglishAddress) {
      uni.showToast({
        title: '请输入申请人英文地址',
        icon: 'none'
      })
      return false
    }
  }

  /**港澳台 */
  if (formData.value.bookType >= 3) {
    if (!formData.value.applicantName) {
      uni.showToast({
        title: '请输入申请人姓名',
        icon: 'none'
      })
      return false
    }
    if (!formData.value.applicantAddress) {
      uni.showToast({
        title: '请输入申请人地址',
        icon: 'none'
      })
      return false
    }
    if (formData.value.subjectType != 1) {
      if (!formData.value.applicantEnglishName) {
        uni.showToast({
          title: '请输入申请人英文姓名',
          icon: 'none'
        })
        return false
      }
      if (!formData.value.applicantEnglishAddress) {
        uni.showToast({
          title: '请输入申请人英文地址',
          icon: 'none'
        })
        return false
      }
    }
  }

  /**个人+港澳台 */
  if (formData.value.applicantType == 0 && formData.value.bookType >= 3) {
    if (!formData.value.idCard) {
      uni.showToast({
        title: '请输入证件号码',
        icon: 'none'
      })
      return false
    }
  }

  if (!formData.value.contactName) {
    uni.showToast({
      title: '请输入联系人姓名',
      icon: 'none'
    })
    return false
  }
  if (!formData.value.contactTel || formData.value.contactTel.length != 11 || !formData.value.contactTel.startsWith('1')) {
    uni.showToast({
      title: '请输入正确的联系人电话',
      icon: 'none'
    })
    return false
  }
  var myreg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (!myreg.test(formData.value.contactEmail)) {
    uni.showToast({
      title: '请输入正确的联系人邮箱',
      icon: 'none'
    })
    return false
  }

  return true
}

const submit = () => {
  if (!checkApplicantInfo()) {
    return
  }
  uni.showLoading({
    title: '保存中',
    mask: true
  })
  if (edit.value) {
    if (landOrOutland.value == 0) {
      let data = {
        ...formData.value,
        userId: uni.getStorageSync('userIde'),
        roleType: 0
      }
      editApplicant(data).then(res => {
        uni.hideLoading()
        uni.showToast({
          title: '更新成功',
        })
        if (edit.value == 2) {
          uni.setStorageSync('formData.value', formData.value)
        }
        setTimeout(() => {
          uni.navigateBack({
            delta: 1,
          })
        }, 1000)
      })
    } else {
      editApplicantFn()
    }
  } else {
    let data = {
      ...formData.value,
      userId: uni.getStorageSync('userIde'),
      roleType: 0
    }
    createApplicant(data).then(res => {
      uni.hideLoading()
      uni.showToast({
        title: '成功添加\r\n常用申请人',
      })
      setTimeout(() => {
        uni.navigateBack({
          delta: 1,
        })
      }, 1000)
    })
  }
}
/**点击修改 */
const editApplicantFn = () => {
  if (!checkApplicantInfo()) {
    return
  }
  var data = {}
  data.userIde = uni.getStorageSync('userIde')
  data.applicantId = formData.value.applicantId
  data.userName = uni.getStorageSync('userName')
  data.version = formData.value.version
  data.diplomatNoe = formData.value.diplomatNoe
  data.orderNoe = formData.value.diplomatNoe
  data.isNew = 0
  data.editType = 0
  data.module = 'order'
  // data.type = type.value  // ?
  data.ownerType = formData.value.applicantType
  data.bookType = formData.value.bookType
  data.subjectType = formData.value.subjectType
  data.domesticReceiverAddress = formData.value.domesticReceiverAddress
  data.domesticReceiverCode = formData.value.domesticReceiverCode
  data.domesticReceiverEmail = formData.value.domesticReceiverEmail

  data.contactName = formData.value.contactName
  data.contactTel = formData.value.contactTel
  data.contactEmail = formData.value.contactEmail
  data.code = formData.value.code
  data.certificatesType = formData.value.certificatesType
  data.unifiedSocialCreditCode = formData.value.applicantType == 1 ? formData.value.idCard : ""
  data.applicantName = formData.value.applicantName
  data.applicantEnglishName = formData.value.applicantEnglishName
  data.applicantAddress = formData.value.applicantAddress
  data.applicantEnglishAddress = formData.value.applicantEnglishAddress
  // data.licensePic = licensePic
  // data.licenseEnglishPic = licenseEnglishPic
  // data.idCardPic = idCardPic
  // data.idCardEnglishPic = idCardEnglishPic
  data.idCard = formData.value.applicantType == 0 ? formData.value.idCard : ""
  data.country = formData.value.country
  data.contactFixedTel = formData.value.contactFixedTel
  data.prov = formData.value.prov
  data.city = formData.value.city
  data.area = formData.value.area
  data.street = formData.value.applicantAddress
  const data1 = {
    ownerType: data.ownerType,
    applicantName: data.applicantName,
    identityNo: formData.value.idCard,
    applicantAddress: formData.value.applicantAddress,
    bookType: data.bookType,
  }
  queryBlackListApi(data1).then(res => {
    if (res > 0) {
      uni.hideLoading()
      config.value = {
        ifShowModal: true,
        modalTit: '疑似囤标申请人提示',
        modalTitColor: '#FF4422',
        modalTip: '抱歉您所输入的申请人曾属违反商标法第四条、第十五条或第三十二条规定情形，根据商标法及相关规定，权大师拒绝接受该申请人的商标业务委托。如有疑问请联系400-8000-211，感谢理解和支持。',
        modalTipLeft: true,
        ifShowBigBtn: true
      }
    } else {
      const data2 = {
        executor: data.userIde,
        userId: data.userIde,
        q: data.applicantName,
        applicant: data.applicantName,
        field: 'applicant',
        page: 0,
        pageSize: 10
      }
      brandSearch(data2).then(res2 => {
        uni.hideLoading()
        if (res2.totalResults > 150) {
          config.value = {
            ifShowModal: true,
            modalTit: '疑似囤标申请人提示',
            modalTitColor: '#FF9900',
            modalTip: '该申请人名下有大量疑似不以使用为目的的商标注册申请，根据商标法第四条规定，很有可能会被认定为“不以使用为目的的恶意商标注册申请”进而予以驳回。请确认是否继续申请？',
            modalTipLeft: true,
            cancelBtnText: '继续申请',
            sureBtnText: '更换申请人'
          }
        } else {
          uni.showLoading({
            title: '加载中',
          })
          updateOrderUserOwner(data).then(res => {
            uni.hideLoading()
            uni.showToast({
              title: '保存成功',
              duration: 2000
            })
            uni.setStorageSync('editOrderSuccess', 1)
            uni.navigateBack({
              delta: 1,
            })
          })
        }
      })
    }
  })
}
/**黑名单更换申请人回调 */
const modalClick = (e) => {
  if (e.type == 1) {
    formData.value.idCard = ""
    formData.value.applicantAddress = ""
    config.value.ifShowModal = false
  } else {
    var data = {}
    data.userIde = uni.getStorageSync('userIde')
    data.applicantId = formData.value.applicantId
    data.userName = uni.getStorageSync('userName')
    data.version = formData.value.version
    data.diplomatNoe = formData.value.diplomatNoe
    data.orderNoe = formData.value.diplomatNoe
    data.isNew = 0
    data.editType = 0
    data.module = 'order'
    // data.type = type.value // ?
    data.ownerType = formData.value.applicantType
    data.bookType = formData.value.bookType
    data.subjectType = formData.value.subjectType
    data.domesticReceiverAddress = formData.value.domesticReceiverAddress
    data.domesticReceiverCode = formData.value.domesticReceiverCode
    data.domesticReceiverEmail = formData.value.domesticReceiverEmail

    data.contactName = formData.value.contactName
    data.contactTel = formData.value.contactTel
    data.contactEmail = formData.value.contactEmail
    data.code = formData.value.code
    data.certificatesType = formData.value.certificatesType
    data.unifiedSocialCreditCode = formData.value.applicantType == 1 ? formData.value.idCard : ""
    data.applicantName = formData.value.applicantName
    data.applicantEnglishName = formData.value.applicantEnglishName
    data.applicantAddress = formData.value.applicantAddress
    data.applicantEnglishAddress = formData.value.applicantEnglishAddress
    // data.licensePic = this.data.licensePic
    // data.licenseEnglishPic = this.data.licenseEnglishPic
    // data.idCardPic = this.data.idCardPic
    // data.idCardEnglishPic = this.data.idCardEnglishPic
    data.idCard = formData.value.applicantType == 0 ? formData.value.idCard : ""
    data.country = formData.value.country
    data.contactFixedTel = formData.value.contactFixedTel
    data.prov = formData.value.prov
    data.city = formData.value.city
    data.area = formData.value.area
    data.street = formData.value.applicantAddress
    config.value.ifShowModal = false
    uni.showLoading({
      title: '加载中',
    })
    updateOrderUserOwner(data).then(res => {
      uni.hideLoading()
      uni.showToast({
        title: '保存成功',
        duration: 2000
      })
      uni.setStorageSync('editOrderSuccess', 1)
      uni.navigateBack({
        delta: 1,
      })
    })
  }
}
</script>

<style lang="scss" scoped>
view {
  box-sizing: border-box;
}
:deep(.nut-input) {
  display: unset;
  color: #333 !important;
  padding: 0 !important;
  text-align: right !important;
}
:deep(.input-placeholder::placeholder) {
  color: #999 !important;
}
:deep(.nut-cell__title) {
  width: 240rpx !important;
  flex: revert !important;
}
.update-applicant {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .scroll-view {
    flex: 1 1 1px;
    overflow-y: auto;
    .part-title {
      font-size: 28rpx;
      font-weight: bold;
      padding: 0 32rpx;
      line-height: 40rpx;
      margin-top: 40rpx;
    }
    .form-value {
      color: #333;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .part-box {
      padding: 0 32rpx;
      .sub-title {
        display: flex;
        align-items: center;
        font-size: 26rpx;
        color: #666;
        margin: 24rpx 0 26rpx;
        .show-file-template {
          color: #ff7200;
          text-decoration: underline;
        }
      }
      .file-box {
        display: grid;
        grid-template-columns: repeat(auto-fill, 128rpx);
        grid-gap: 30rpx;
        .file-item {
          width: 128rpx;
          height: 180rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4rpx;
          background: #f7f7f7;
          overflow: hidden;
          .ivfileItemImageShow {
            width: 100rpx;
          }
          .ivfileItemImageUpload {
            height: 80rpx;
          }
        }
      }
    }
  }
  .footer {
    width: 100%;
    height: 90rpx;
    background: #ff9900;
    border-top: 1px solid #e4e4e4;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    color: #fff;
  }
}
</style>
