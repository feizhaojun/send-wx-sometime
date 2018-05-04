function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  }

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0]
    var url = tab.url
    var id = tab.id
    callback(url, id)
  })
}

function getNotice(noticeEl) {
  var url = 'https://feizhaojun.com/web/huazhi/notice/?_=' + Math.random()
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.responseType = 'json'
  xhr.onload = function() {
    noticeEl.innerHTML += ('<div>' + xhr.response.msg + '</div>')
  }
  xhr.onerror = function() {}
  xhr.send()
}

document.addEventListener('DOMContentLoaded', function() {
  var settingEl = document.getElementById('setting')
  var noticeEl = document.getElementById('notice')
  var inputEl = document.getElementById('send-time')

  var bg = chrome.extension.getBackgroundPage()
  if (bg.sendTime) {
    noticeEl.innerHTML = '<span class="error">你已经设置了一个时间，设置新的时间将会替换掉旧的！</span>'
    inputEl.value = bg.sendTime
  }
  bg.methodForPopup()

  getNotice(noticeEl)

  getCurrentTabUrl(function (url, id) {
    if (/wx\d*\.qq\.com/.test(url)) {
      document.getElementById('set-time').addEventListener('click', function () {
        window.sendTime = inputEl.value
        if (/\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:*\d*/.test(sendTime)) {
          if (new Date(sendTime) < new Date()) {
            noticeEl.innerHTML = '<span class="error">你需要设置一个以后的时间！</span>'
          } else {
            noticeEl.innerHTML = ''
            chrome.tabs.sendMessage(id, {sendTime: sendTime}, function(res) {
              if (res.result) {
                bg.sendTime = sendTime
                settingEl.style.display = 'none'
                noticeEl.innerHTML = '<span class="success">设置成功！</span>'
              } else {
                noticeEl.innerHTML = '<span class="error">设置失败，请刷新页面重试或联系费师傅！</span>'
              }
            })
          }
        } else {
          noticeEl.innerHTML = '<span class="error">时间格式不正确！</span>'
        }
      })
    } else {
      settingEl.style.display = 'none'
      noticeEl.innerHTML = '<span class="error">请在微信网页版页面下点击图标设置！</span>'
    }
  })

  chrome.tabs.executeScript({
    code: 'console.log("Run script from popup to content")'
  })
})
