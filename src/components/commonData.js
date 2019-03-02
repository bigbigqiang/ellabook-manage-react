module.exports = {
    //TODO: 使用 import { commonData } from '../commonData.js'
    commonData: {
        uid: localStorage.uid,
        token: localStorage.token,
    },
  	dataString:'&uid='+localStorage.uid+'&token='+localStorage.token
   
}