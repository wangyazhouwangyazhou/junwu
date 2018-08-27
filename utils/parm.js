const extConfig = wx.getExtConfigSync ? wx.getExtConfigSync(): {}
// //测试配置
// const apiUrl = 'https://debug.oa.feeyan.com/yingxiao/api';
// const wxappId = extConfig.wxappId || 'wx58947149d78d6f6b';
// const appId = extConfig.appId || '59a666ab7W11';



//上线配置 (老的小程序)
//const apiUrl =  'https://wxapp.feeyan.com/app/fyyingxiao/api';
//const appId = extConfig.appId || '59a7c135h42';
// const wxappId = extConfig.wxappId || 'wx58947149d78d6f6b';




//上线配置 (新的小程序)
// 新的小程序域名
const apiUrl = 'https://jw.feeyan.com/app/fyyingxiao/api';
const appId = extConfig.appId || '59a7c135h42';
const wxappId = extConfig.wxappId || 'wx8a50e2a7fd942838';


export default {
  appId: appId,
  wxappId: wxappId,

  // WYZ
  // 问答收藏或取消
  replySave : apiUrl + '/article/replySave',
  getVideoData: apiUrl + '/program/getVideoData',
  apiquestionFavorite : apiUrl + '/api/user/questionFavorite',
  programDetail: apiUrl + '/special/programDetail',
  commentDetail : apiUrl + '/article/commentDetail',
  answerDraftList: apiUrl + '/question/answerDraftList',
  answerDraftDetail: apiUrl + '/question/answerDraftDetail',
  pklists : apiUrl + '/pk/lists',
  pkindex : apiUrl + '/pk/index',
  pkdetail: apiUrl + '/pk/detail',
  pksubmit: apiUrl + '/pk/submit',
  pkcommentSave: apiUrl + '/pk/commentSave',
  pkcommentPraise: apiUrl + '/pk/commentPraise',
  launch: apiUrl + '/visit/launch',

  sendCode: apiUrl + '/sms/sendCode',

  bindPhone: apiUrl + '/user/bindPhone',

  // 广告点击 + 1
  browse: apiUrl + '/adbanner/browse',


  // 视频/文章收藏或取消
  apifavorite : apiUrl + '/user/favorite',


  usermyFavorite: apiUrl + '/user/myFavorite',




  // 军武
  getSpecialIndex: apiUrl + '/special/index', //indexV2
  getSpecialDetail: apiUrl + '/special/detail', //detailV2
  getArticleDetail: apiUrl + '/article/detail',
  getPraise: apiUrl + '/user/praise',
  getMark: apiUrl + '/user/favorite',
  getMyMark: apiUrl + '/user/myFavorite',
  getSearch: apiUrl + '/file/search',

  faqList: apiUrl + '/user/faq',

  getIndexNav: apiUrl + '/index/nav', //navV2



  // 提审接口
  getIndexNavbar: apiUrl + '/index/navbar',
  getIndex: apiUrl + '/index/junwu',

  // getIndexNavbar: apiUrl + '/index/navbarV2',
  // getIndex: apiUrl + '/index/junwuV2',


  apiUrl: apiUrl + '/share/getwxacode',
  upload: apiUrl + '/file/upload',

  getVideoList: apiUrl + '/video/index',
  getVideoDetail: apiUrl + '/video/detail',
  getVideoTopic: apiUrl + '/video/topic',
  getVideoUpdate: apiUrl + '/video/updateVideo',

  myJoin: apiUrl + '/user/my',
  myAddAddress: apiUrl + '/user/addAddress' ,
  myLottery: apiUrl + '/lottery/my',
  userUpdateLogStatus: apiUrl + '/lottery/updateUserLogStatus',

  userLogin: apiUrl + '/user/login' ,
  userQrcodeLoginCheck: apiUrl + '/qrcode/check',
  userQrcodeLoginConfirm: apiUrl + '/qrcode/confirm',
  userCheck: 'https://wxapi.feeyan.com/user/current',
  userEdit: apiUrl + '/user/editInfo', //消息未读红点提示

  //问答
  getWDList: apiUrl + '/question/getList', //问答列表
  getWDInfo: apiUrl + '/question/detail', //问答详情
  submitQuestion: apiUrl + '/question/save',

  submitComment: apiUrl + '/article/commentSave',
  allComment: apiUrl + '/article/moreComment',
  commentPraise: apiUrl + '/user/commentPraise',

  //节目接口
  programList: apiUrl + '/program/index',
  programData: apiUrl + '/program/getData',
  programSubscribe: apiUrl + '/program/subscribe',
  programMySubscribe: apiUrl + '/program/mySubscribe',

  //从我的里点进去的（消息标记为已读时调用接口）加参数 from (赞  message-praise   评论 message-comment)
  getOneWDInfo: apiUrl + '/question/answerDetail', //单个回答详情
  saveWD: apiUrl + '/question/answerSave', //提交回答
  saveWDPing: apiUrl + '/question/commentSave', //提交评论/回复评论
  answerPraise: apiUrl + '/user/answerPraise', //点赞
  questionFavorite: apiUrl + '/user/questionFavorite', //问题收藏
  myFavorite: apiUrl + '/user/myFavorite', //我的问答收藏列表
  myMessage: apiUrl + '/message/index', //消息中心列表接口
  unreadToast: apiUrl + '/message/unreadToast', //消息未读红点提示

  shareUpdate: apiUrl + '/share/updateCount', //消息未读红点提示

}

/*
//问答
问题更多列表   question/getList   参数 appId、userSession、page
单个问题详情   question/detail  参数 appId、userSession、page、questionId

单个回答详情   question/answerDetail  参数 appId, userSession, answerId, page
提交回答       question/answerSave  参数 appId, userSession, questionId, description
提交评论       question/commentSave 参数 appId, userSession, answerId, description
回复评论       question/commentSave 参数 appId, userSession, answerId, description, parentId(回复评论)

回答点赞接口   user/answerPraise    参数 appId, answerId, userSession, action (add或者del)
问题收藏接口    user/questionFavorite 参数 appId, questionId, userSession, action(add或者del)
我的问答收藏列表   user/myFavorite   参数 appId, page, userSession, type(问答=1 视频默认=0)

消息中心列表接口    message/index  参数appId, page, userSession, type(赞=1  评论=2)
消息未读红点提示    message/unreadToast   参数appId，userSession, 
*/
