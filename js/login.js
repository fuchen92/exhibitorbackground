$(document).ready(function () {
    var account = $("#account"),
        passWord = $("#password"),
        loginBtn = $("#loginBtn");

    var autoLogin = $("#autologin"),
        isAutoLogin = false;
        tips = $("#tips");

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
        console.log("恭喜你登录成功");
        window.location.href = "http://192.168.1.48:88/product.html";
    })
});