console.log('Content loaded')
chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    if (request.sendTime) {
        if (window.sendMsgTask){
            window.clearInterval(window.sendMsgTask)
        }
        window.sendMsgTask = window.setInterval(function(){
            if (new Date() >= new Date(request.sendTime)) {
                document.querySelector('.btn_send').click()
                window.clearInterval(window.sendMsgTask)
                console.log('已发送')
            }else{
                console.log('准备发送' + request.sendTime)
            }
        }, 500)
        callback({result: true})
    }
});
