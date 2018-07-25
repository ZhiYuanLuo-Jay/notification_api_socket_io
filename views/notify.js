        // Notification.requestPermission().then(function(result) {
        //     if (result === 'denied') {
        //         console.log('Permission wasn\'t granted. Allow a retry.');
        //         return;
        //     }
        //     if (result === 'default') {
        //         console.log('The permission request was dismissed.');
        //         return;
        //     }
        //     if (result === 'granted') {
        //         console.log('Permission is granted.');
        //         var notify = new Notification('My first notification message.', {
        //             body: 'How are you today? Its really a lovely day.'
        //         })
        //         return;
        //     }
        // });
        
        // // Notification ---
        // Notification.requestPermission(function(p){
        //     console.log(p);
        // });
        // var notify = new Notification('My first notification message.', {
        //     body: 'How are you today? Its really a lovely day.'
        // })


        // Test every minute cron
        // cron.schedule('* * * * *', function() {
        //     socket.emit('receive', "Every minute, socket.io push notification");
        // }, false).start()