import apiUrl from 'parm.js'
import util from 'util.js'

const getSession = (nologin) => {
  return new Promise((resolve, reject) => {
    const userSession = wx.getStorageSync('userSession');
    if (userSession) return resolve(userSession);
    if (!nologin) {
      util.getUserInfo().then(res => {
        resolve(res.token)
      })
    } else {
      return resolve(userSession);
    }
  })
}

const ajaxData = (url, type = 'GET') => {
  const defaultHeader = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  return ((params = {}, nologin = true, header = defaultHeader, method = 'POST') => {
    return new Promise((resolve, reject) => {
      getSession(nologin).then(_session => {
        const userData = {
          appId: apiUrl.appId,
          userSession: _session,
        }

        const newdata = Object.assign({}, userData, params);

        wx.request({
          url: url,
          data: newdata,
          header: header,
          method: method === 'POST' ? 'POST' : method,
          success(res) {
            if (res.data.code === 0 && res.statusCode === 200) {
              resolve(res.data)
              setTimeout(() => { wx.hideToast(); }, 300)
            } else {
              resolve(res.data)
              if (res.data.error == 2) {
                util.getUserInfo().then(res => {
                  resolve(res.userSession)
                })
              } else {
                reject(res.data)
                wx.hideLoading();
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  showCancel: false
                });
              }
            }
          },
          fail(res) {
          }
        });
      })
    });
  });
}
// WYZ
// 文章 
const pksubmit = ajaxData(apiUrl.pksubmit, 'post');
const pkcommentSave = ajaxData(apiUrl.pkcommentSave, 'post');
const pkcommentPraise = ajaxData(apiUrl.pkcommentPraise, 'post');
const pkdetail = ajaxData(apiUrl.pkdetail, 'post');
const pkindex = ajaxData(apiUrl.pkindex, 'post');
const pklists = ajaxData(apiUrl.pklists, 'post');
const answerDraftDetail = ajaxData(apiUrl.answerDraftDetail, 'post');
const answerDraftList = ajaxData(apiUrl.answerDraftList, 'post');
const replySave = ajaxData(apiUrl.replySave, 'post');
const commentDetail = ajaxData(apiUrl.commentDetail, 'post');
const launch = ajaxData(apiUrl.launch, 'post');
const browse = ajaxData(apiUrl.browse, 'post');
const sendCode = ajaxData(apiUrl.sendCode, 'post');
const bindPhone = ajaxData(apiUrl.bindPhone, 'post');
const getVideoData = ajaxData(apiUrl.getVideoData, 'post');
const apifavorite = ajaxData(apiUrl.apifavorite, 'post');
const usermyFavorite = ajaxData(apiUrl.usermyFavorite, 'post');
const programDetail = ajaxData(apiUrl.programDetail, 'post');

// 军武
const getIndex = ajaxData(apiUrl.getIndex, 'post');
const getSpecialIndex = ajaxData(apiUrl.getSpecialIndex, 'post');
const getSpecialDetail = ajaxData(apiUrl.getSpecialDetail, 'post');
const getArticleDetail = ajaxData(apiUrl.getArticleDetail, 'post');
const getPraise = ajaxData(apiUrl.getPraise, 'post');
const getMark = ajaxData(apiUrl.getMark, 'post');
const getMyMark = ajaxData(apiUrl.getMyMark, 'post');
const getSearch = ajaxData(apiUrl.getSearch, 'post');


//  抽奖
const lotteryList = ajaxData(apiUrl.lotteryList, 'post');
const lotteryData = ajaxData(apiUrl.lotteryData, 'post');
const lotteryPrize = ajaxData(apiUrl.lotteryPrize, 'post');

// 视频
const getVideoList = ajaxData(apiUrl.getVideoList, 'post');
const getVideoDetail = ajaxData(apiUrl.getVideoDetail, 'post');
const getVideoTopic = ajaxData(apiUrl.getVideoTopic, 'post');
const getVideoUpdate = ajaxData(apiUrl.getVideoUpdate, 'post');

const myJoin = ajaxData(apiUrl.myJoin, 'post');
const myLottery = ajaxData(apiUrl.myLottery, 'post');
const myAddAddress = ajaxData(apiUrl.myAddAddress, 'post');
const userUpdateLogStatus = ajaxData(apiUrl.userUpdateLogStatus, 'post');

const userLogin = ajaxData(apiUrl.userLogin, 'post');
const userQrcodeLoginCheck = ajaxData(apiUrl.userQrcodeLoginCheck, 'post');
const userQrcodeLoginConfirm = ajaxData(apiUrl.userQrcodeLoginConfirm, 'post');

//问答
const getWDList = ajaxData(apiUrl.getWDList, 'post');
const getWDInfo = ajaxData(apiUrl.getWDInfo, 'post');
const getOneWDInfo = ajaxData(apiUrl.getOneWDInfo, 'post');
const saveWD = ajaxData(apiUrl.saveWD, 'post');
const saveWDPing = ajaxData(apiUrl.saveWDPing, 'post');
const answerPraise = ajaxData(apiUrl.answerPraise, 'post');
const questionFavorite = ajaxData(apiUrl.questionFavorite, 'post');
const myFavorite = ajaxData(apiUrl.myFavorite, 'post');
const myMessage = ajaxData(apiUrl.myMessage, 'post');
const unreadToast = ajaxData(apiUrl.unreadToast, 'post');
const submitQuestion = ajaxData(apiUrl.submitQuestion, 'post');
const faqList = ajaxData(apiUrl.faqList, 'post');
const shareUpdate = ajaxData(apiUrl.shareUpdate, 'post');
const userEdit = ajaxData(apiUrl.userEdit, 'post');

const getIndexNav = ajaxData(apiUrl.getIndexNav, 'post');
const submitComment = ajaxData(apiUrl.submitComment, 'post');
const allComment = ajaxData(apiUrl.allComment, 'post');
const commentPraise = ajaxData(apiUrl.commentPraise, 'post');
const getIndexNavbar = ajaxData(apiUrl.getIndexNavbar, 'post');

const programList = ajaxData(apiUrl.programList, 'post');
const programData = ajaxData(apiUrl.programData, 'post');
const programSubscribe = ajaxData(apiUrl.programSubscribe, 'post');
const programMySubscribe = ajaxData(apiUrl.programMySubscribe, 'post');

export default {
  // WYZ
  pksubmit,
  pkcommentSave,
  pkcommentPraise,
  pkdetail,
  pkindex,
  pklists,
  apifavorite,
  usermyFavorite,
  programDetail,
  getVideoData,
  sendCode,
  bindPhone,
  browse,
  launch,
  commentDetail,

  sendCode,
  bindPhone,
  browse,
  launch,
  commentDetail,
  answerDraftList,
  answerDraftDetail,

  // 军武
  replySave,
  getIndex,
  getSpecialIndex,
  getSpecialDetail,
  getArticleDetail,
  getPraise,
  getMark,
  getMyMark,
  getSearch,

  lotteryList,
  lotteryData,
  lotteryPrize,

  getVideoList,
  getVideoDetail,
  getVideoTopic,
  getVideoUpdate,

  myJoin,
  myLottery,
  myAddAddress,
  userUpdateLogStatus,

  userLogin,
  userQrcodeLoginCheck,
  userQrcodeLoginConfirm,

  getWDList,
  getWDInfo,
  getOneWDInfo,
  saveWD,
  saveWDPing,
  answerPraise,
  questionFavorite,
  myFavorite,
  myMessage,
  unreadToast,
  submitQuestion,
  faqList,
  shareUpdate,
  userEdit,
  getIndexNav,
  submitComment,
  allComment,
  commentPraise,
  getIndexNavbar,
  programList,
  programData,
  programSubscribe,
  programMySubscribe
}
