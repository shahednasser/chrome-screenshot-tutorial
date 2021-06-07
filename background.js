chrome.action.onClicked.addListener(function (tab) {
    chrome.desktopCapture.chooseDesktopMedia([
        "screen",
        "window",
        "tab"
    ], tab, (streamId) => {
        //check whether the user canceled the request or not
        if (streamId && streamId.length) {
            setTimeout(() => {
                chrome.tabs.sendMessage(tab.id, {name: "stream", streamId}, (response) => console.log(response))
            }, 200)
        }
    })
})

chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {
    if (message.name === 'download' && message.url) {
        chrome.downloads.download({
            filename: 'screenshot.png',
            url: message.url
        }, (downloadId) => {
            senderResponse({success: true})
        })

        return true;
    }
})