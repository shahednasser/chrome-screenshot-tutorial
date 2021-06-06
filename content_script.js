chrome.runtime.onMessage.addListener((message, sender, senderResponse) => {
    if (message.name === 'stream' && message.streamId) {
        let track, canvas
        navigator.mediaDevices.getUserMedia({
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: message.streamId
                },
            }
        }).then((stream) => {
            track = stream.getVideoTracks()[0]
            const imageCapture = new ImageCapture(track)
            return imageCapture.grabFrame()
        }).then((bitmap) => {
            track.stop()
            canvas = document.createElement('canvas');
            canvas.width = bitmap.width; //if not set, the width will default to 200px
            canvas.height = bitmap.height;//if not set, the height will default to 200px
            let context = canvas.getContext('2d');
            context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height)
            return canvas.toDataURL();
        }).then((url) => {
            chrome.runtime.sendMessage({name: 'download', url}, (response) => {
                if (response.success) {
                    alert("Screenshot saved");
                } else {
                    alert("Could not save screenshot")
                }
                canvas.remove()
                senderResponse({success: true})
            })
        }).catch((err) => {
            alert("Could not take screenshot")
            senderResponse({success: false, message: err})
        })
        return true;
    }
})