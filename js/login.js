$(document).ready(function () {
    var loginBox = $("#loginBox"),
        account = $("#account"),
        passWord = $("#password"),
        loginBtn = $("#loginBtn");

    var autoLogin = $("#autologin"),
        isAutoLogin = false;
        tips = $("#tips");

    var activity = $("#activity");

    autoLogin.on("click", function () {
        isAutoLogin = $(this).prop("checked") ? true : false;
    });

    $("#account, #password").on("input", function () {
        tips.removeAttr("style");
    });
    
    loginBtn.on("click", function () {
        if (account.val() == "" || passWord.val() == "") {
            account.val() == "" ? account.focus() : passWord.focus();
            tips.css("display", "block");
            return false;
        }

        // $.ajax({
        //     type: "POST",
        //     url: "/NetWorking/ApiLogin",
        //     data: { account: account.val(), password: passWord.val() },
        //     dataType: "json",
        //     success: function (data) {
        //         if (data.Code == 0) {
        //             alert("登陆成功");
        //         } else {
        //             alert(data.Message);
        //         }
        //     }
        // });
        // generateActivity(res.Data);
        loginBox.hide();						
        activity.show();
        console.log("恭喜你登录成功");
        window.location.href = "http://192.168.1.22:88/";
    })

//     function generateActivity(arr) {
//     	var str = "";
//     	for(var i = 0; i < arr.length; i++) {
//     		str += "<div class='activity-item' data-no='" + arr[i].EventNo + "'>" +
//     					"<img class='activity-logo lt' src='" + arr[i].Logo + "'>" +
//     					"<p class='activity-title lt'>" + arr[i].Name + "</p>" +
// //  					(arr[i].IsExhibition == true ? ("<a class='activity-link rt' href='/company?no=" + arr[i].EventNo + "'>进入</a>") : ("<span class='no-link rt'>您未参展/赞助</span>")) +
// 						"<a class='activity-link rt' href='/company?no=" + arr[i].EventNo + "'>进入</a>" +
//     				"</div>"
//     	}
//     	activity.append(str);
//     }
});