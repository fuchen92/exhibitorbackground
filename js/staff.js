$(document).ready(function () {
    var allotTable = $("#allotTable"),
        changeDialog = $("#changeDialog"),
        closeDialog = $("#closeDialog");

    var inputs = $("#changeForm :input"),
        submitChangeAllot = $("#submitChangeAllot");

    var changeTR = null,
        changeIndex = 0;            // 修改的是哪一个工作人员信息的下标

    var changedInfo = [];           // 保存修改后的信息

    var checkInBtn = $("#checkInBtn"),                      // 登记工作人员按钮
        allotDialog = $("#allotDialog"),                    // 分配浮窗对话框
        closeAllotDialog = $("#closeAllotDialog"),          // 关闭分配浮窗对话框
        saveAllot = $("#saveAllot"),                        // 保存分配的工作人员按钮
        addAnother = $("#addAnother"),                      // 添加下一个工作人员按钮
        btnGroup = $("#btnGroup"),
        noAllotContainer = $("#noAllot");
        
    var canAddCount = 0,                                    // 能不能继续添加下一个的标识
        noAllotCount = Number($(".checkIn-count").text());      // 还剩未分配的工作人员数量
        
    var alreadyCheck = $("#alreadyCheck");

    $("#changeForm, #allotDialog").on("click keyup",":input",function() {
        var _this = $(this);
        $(".form-tips").html("").removeAttr("style");
        if (_this.nextAll(".form-desc")) {
            _this.nextAll(".form-desc").css("display", "block");
        }
    });
    $("#changeForm, #allotDialog").on("blur",":input",function() {
        var _this = $(this);
        if (_this.nextAll(".form-desc")) {
            _this.nextAll(".form-desc").removeAttr("style");
        }
    });

    var hasTip = false;
    // 验证函数
    function validate (ele) {
        hasTip = false;
        var attr = ele.attr("data-role");
        var formTips = ele.next(".form-tips");
        if (attr) {
            var role = eval(attr);
            var currVal = ele.val();
            if (role && role.length > 0) {
                if (!currVal || currVal.length == 0 || currVal == "0") {
                    if (!hasTip) {
                        formTips.html( (ele.is("select") ? "请选择" : "请输入") + role[0].name ).show();
                        hasTip = true;
                    }
                    return false;
                }
                if (role[0].reg && !eval(role[0].reg).test(currVal)) {
                    if (!hasTip) {
                        formTips.html(role[0].name + "格式不正确，请检查").show();
                        hasTip = true;
                    }
                    return false;
                }
            }
        }
        return true;
    }

    // 修改参会人员信息
    allotTable.on("click", ".changeBtn", function () {
        changeTR = $(this).closest("tr");
        changeIndex = changeTR.index(".alloted");
        var originalInfo = [
                changeTR.children(".nameCN").text(),
                changeTR.attr("data-nameen"),
                changeTR.children(".jobCN").text(),
                changeTR.attr("data-joben"),
                changeTR.children(".mobile").text(),
                changeTR.children(".email").text(),
                changeTR.attr("data-function"),
                changeTR.attr("data-sex")
            ];

        inputs.each(function (index, item) {
            var currItem = $(item);
            currItem.val($.trim(originalInfo[index]));
        });
        changeDialog.css("display", "block");
    });

    // 关闭对话框
    closeDialog.on("click", function () {
        changeDialog.find(":input:not(select)").val("");
        changeDialog.find("select").val(0);
        changeDialog.find(".form-tips").removeAttr("style");
        changeDialog.removeAttr("style");
    });

    changeDialog.on("click keyup",":input",function() {
        $(".form-tips").html("").removeAttr("style");
    });

    var catchErr = false;
    // 保存修改的参会人信息
    submitChangeAllot.on("click", function () {
        var mobileArr = [],
            emailArr = [];

        var allotedsTR = allotTable.find(".alloted");

        changedInfo = [];
        catchErr = false;

        inputs.each(function () {
            var currInput = $(this);
            if (!validate(currInput)) {
                catchErr = true;
                currInput.focus();
                return false;
            } else {
                changedInfo.push(currInput.val())
            }
        });
        if (catchErr) {
            return false;
        }
        
        allotedsTR.each(function (index, item) {
            var currItem = $(item);
            if (index != changeIndex) {
                mobileArr.push( $.trim( currItem.find(".mobile").text() ) );
                emailArr.push( $.trim( currItem.find(".email").text() ) )
            }
        });
        mobileArr.push( $.trim( $("#changeMobile").val() ) );
        emailArr.push( $.trim( $("#changeEmail").val() ) );

        valiRepeat(mobileArr, $("#changeMobile"), "手机号码");
        if (catchErr) {
            return false;
        }
        valiRepeat(emailArr, $("#changeEmail"), "邮箱地址");
        if (catchErr) {
            return false;
        }

        changeTR.attr("data-nameen", changedInfo[1]);
        changeTR.attr("data-joben", changedInfo[3]);
        changeTR.attr("data-function", changedInfo[6]);
        changeTR.attr("data-sex", changedInfo[7]);

        changeTR.children(".nameCN").text(changedInfo[0]);
        changeTR.children(".sex").text( $("#changeSex option[value=" + changedInfo[7] + "]").text() == "先生" ? "男" : "女" );
        changeTR.children(".jobCN").text(changedInfo[2]);
        changeTR.children(".mobile").text(changedInfo[4]);
        changeTR.children(".email").text(changedInfo[5]);
        
        console.log("修改成功啦")
        closeDialog.trigger("click");

        // $.ajax({
        //     url: "OrderCreate",
        //     type: "POST",
        //     dataType: "json",
        //     contentType: "application/json; charset=utf-8",
        //     data: JSON.stringify({ "order": order }),
        //     cache: false,
        //     success: function (js) {
        //         if (js.Code == 0) {
        //             alert("提交成功")
        //         } else {
        //             alert("提交失败，请稍后再试")
        //         }
        //     },
        //     error: function (error) {
        //         console.log(error)
        //     }
        // });
    });

    // 验证手机和邮箱重复的函数
    function valiRepeat (objArr, elem, type) {
        for (var i = 0; i < objArr.length; i++) {
            var objValue = objArr[i];
            for (var j = 0; j < objArr.length; j++) {
                if (objArr[j] == objValue && j != i) {
                    if (elem[0].id == "changeMobile" || elem[0].id == "changeEmail") {
                        $(elem[0]).focus();
                        $(elem[0]).next(".form-tips").text(type + "重复，请检查").show();
                    } else {
                        elem.eq(j).focus();
                        elem.eq(j).next().text(type + "重复，请检查").show();
                    }
                    
                    catchErr = true;
                    return false;
                }
            }
            if (catchErr) {
                return false;
            }
        }
    }

    checkInBtn.on("click", function () {

        canAddCount = noAllotCount;
        if (noAllotCount - 1 <= 0) {
            addAnother.remove();
        } else if (!$.contains(btnGroup[0], addAnother[0])) {
            btnGroup.append(addAnother);
        }
        allotDialog.css("display", "block");
    });
    closeAllotDialog.on("click", function () {
        allotDialog.find(".addallot-form:gt(0)").remove();
        noAllotContainer.find("input[type=text]").val("");
        noAllotContainer.find("select").val(0);
        noAllotContainer.find(".form-tips").removeAttr("style");
        allotDialog.removeAttr("style");
    });
    // 添加下一个
    allotDialog.on("click", "#addAnother", function () {
        canAddCount--;
        var tem = allotDialog.find(".addallot-form").eq(0).clone();
        tem.find(":input[type=text]").val("");
        tem.find("select").val(0);
        tem.find(".form-tips").removeAttr("style");
        btnGroup.before(tem);
        if (canAddCount - 1 <= 0) {
            addAnother.remove();
        }
    });
    // 保存登记的工作人员信息
    saveAllot.on("click", function () {
        var allotUsers = [],
            allotForms = noAllotContainer.children(".addallot-form"),
            mobileArr = [],
            emailArr = [];

        catchErr = false;

        allotForms.each(function () {
            var inputs = $(this).find(":input");
            inputs.each(function () {
                var currInput = $(this);
                if (!validate(currInput)) {
                    catchErr = true;
                    currInput.focus();
                    return false;
                }
            })
            if (catchErr) {
                return false;
            }
            allotUsers.push({
                NameCn: $.trim(inputs.eq(0).val()),
                NameEn: $.trim(inputs.eq(1).val()),
                JobTitleCn: $.trim(inputs.eq(2).val()),
                JobTitleEn: $.trim(inputs.eq(3).val()),
                Mobile: $.trim(inputs.eq(4).val()),
                Mail: $.trim(inputs.eq(5).val()),
                JobFunction: $.trim(inputs.eq(6).val()),
                Sex: $.trim(inputs.eq(7).val()), 
            })
        });
        if (catchErr) {
            return false;
        }
        
        $(".mobile").each(function () {
            var currVal = $(this).is("input") ? $.trim($(this).val()) : $(this).text()
            mobileArr.push(currVal)
        })
        $(".email").each(function () {
            var currVal = $(this).is("input") ? $.trim($(this).val()) : $(this).text()
            emailArr.push(currVal)
        })
        valiRepeat(mobileArr, $(".mobile"), "手机号码");
        if (catchErr) {
            return false;
        }
        valiRepeat(emailArr, $(".email"), "邮箱地址");
        if (catchErr) {
            return false;
        }

        var order = {
            UserList: allotUsers
        }
        generateAlloted(allotUsers);
        alreadyCheck.attr("rowspan", parseInt(alreadyCheck.attr("rowspan")) + allotUsers.length);
        noAllotCount -= allotUsers.length;
        console.log(noAllotCount);
        noAllotCount <= 0 && checkInBtn.remove();
        $(".checkIn-count").text(noAllotCount);
        $(".allot-tips").children(".allottips-item").length == 0 && $(".allot-tips").remove();
        closeAllotDialog.trigger("click");
    });

    // 生成已登记的工作人员信息
    function generateAlloted (objArr) {
        var str = "";
        for (var i = 0; i < objArr.length; i++) {
                str += "<tr class='hasborder alloted' data-nameen='" + objArr[i].NameEn + "'data-joben='" + objArr[i].JobTitleEn + "'data-function='" + objArr[i].JobFunction + "'data-sex='" + objArr[i].Sex + "'>" + 
                            "<td class='allotId'>" + (parseInt(alreadyCheck.attr("rowspan")) + i) + "</td>" + 
                            "<td class='nameCN'>" + objArr[i].NameCn + "</td>" +
                            "<td class='sex'>" + (objArr[i].Sex == 1 ? "男" : "女") + "</td>" + 
                            "<td class='jobCN'>" + objArr[i].JobTitleCn + "</td>" + 
                            "<td class='mobile'>" + objArr[i].Mobile + "</td>" + 
                            "<td class='email'>" + objArr[i].Mail + "</td>" + 
                            "<td class='allotManage' style='overflow: visible;'>" + "<button class='changeBtn'>修改</button>" + "</td>" + 
                       "</tr>"
        }
        allotTable.children("tbody").append(str);
    }
});