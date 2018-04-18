$(document).ready(function () {
    var allotTable = $("#allotTable"),
        changeDialog = $("#changeDialog"),
        closeDialog = $("#closeDialog");

    var inputs = $("#changeForm :input"),
        submitChangeAllot = $("#submitChangeAllot");

    var changeTR = null,
        changeIndex = 0;            // 修改的是哪一个参会人信息的下标

    var changedInfo = [];           // 保存修改后的信息

    var allotTicket = $(".ticket-link"),                    // 分配相关门票
        allotDialog = $("#allotDialog"),                    // 分配浮窗对话框
        closeAllotDialog = $("#closeAllotDialog"),          // 关闭分配浮窗对话框
        allotTitle = $("#allotTitle"),                      // 分配浮窗标题
        saveAllot = $("#saveAllot"),                        // 保存分配的参会嘉宾
        addAnother = $("#addAnother"),                      // 添加下一个参会嘉宾按钮
        btnGroup = $("#btnGroup"),
        noAllotContainer = $("#noAllot"),
        ticketType = 0,                                     // 分配门票的类型（VIP票，普通票，直通票，展览票）
        ticketTypeText = "";
        // cloneAddAnother = addAnother.clone();
        
    var allotItem = null,
        canAddCount = 0,                                    // 能不能继续添加下一个的标识
        noAllotCount = 0;                                   // 还剩未分配的门票数量
        
    var alreadyAllot = $("#alreadyAllot");

    var ticketsPrivilege = $("#ticketsPrivilege"),
        privileges = $("#privileges"),
        closePrivileges = $("#closePrivileges"),
        cancelPrivileges = $("#cancelPrivileges");

    ticketsPrivilege.on("click", function () {
        privileges.css("display", "block");
    });
    closePrivileges.on("click", function () {
        privileges.removeAttr("style");
    });
    cancelPrivileges.on("click", function () {
        closePrivileges.trigger("click");
    });

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
                changeTR.children(".companyCN").text(),
                changeTR.attr("data-companyen"),
                changeTR.children(".jobCN").text(),
                changeTR.attr("data-joben"),
                changeTR.children(".mobile").text(),
                changeTR.attr("data-tel"),
                changeTR.children(".email").text(),
                changeTR.attr("data-industry"),
                changeTR.attr("data-function"),
                changeTR.attr("data-sex")
            ];

        inputs.each(function (index, item) {
            var currItem = $(item);
            if (index < 9) {
                currItem.val($.trim(originalInfo[index]))
            } else {
                return;
            }
        });
        $("#changeIndustry").val(originalInfo[9]);
        $("#changeFunction").val(originalInfo[10]);
        $("#changeSex").val(originalInfo[11]);
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
        changeTR.attr("data-companyen", changedInfo[3]);
        changeTR.attr("data-joben", changedInfo[5]);
        changeTR.attr("data-tel", changedInfo[7]);
        changeTR.attr("data-industry", changedInfo[9]);
        changeTR.attr("data-function", changedInfo[10]);
        changeTR.attr("data-sex", changedInfo[11]);

        changeTR.children(".nameCN").text(changedInfo[0]);
        changeTR.children(".sex").text( $("#changeSex option[value=" + changedInfo[11] + "]").text() == "先生" ? "男" : "女" );
        changeTR.children(".companyCN").text(changedInfo[2]);
        changeTR.children(".jobCN").text(changedInfo[4]);
        changeTR.children(".mobile").text(changedInfo[6]);
        changeTR.children(".email").text(changedInfo[8]);
        
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

    allotTicket.on("click", function () {
        allotItem = $(this).parent();
        
        ticketType = allotItem.attr("data-tickettype");
            // ticketCount = allotItem.attr("data-ticketcount");

        noAllotCount = allotItem.attr("data-ticketcount");
        canAddCount = noAllotCount;
        if (noAllotCount - 1 <= 0) {
            addAnother.remove();
        } else if (!$.contains(btnGroup[0], addAnother[0])) {
            btnGroup.append(addAnother);
        }

        switch (ticketType) {
            case "1":
                ticketTypeText = "VIP票";
                allotTitle.text("VIP票嘉宾分配");
                break;
            case "2":
                ticketTypeText = "直通票";
                allotTitle.text("直通票嘉宾分配");
                break;
            case "3":
                ticketTypeText = "普通票";
                allotTitle.text("普通票嘉宾分配");
                break;
            case "4":
                ticketTypeText = "展览票";
                allotTitle.text("展览票嘉宾分配");
                break;
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
    // 保存分配的门票参会人信息
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
                CompanyCn: $.trim(inputs.eq(2).val()),
                CompanyEn: $.trim(inputs.eq(3).val()),
                JobTitleCn: $.trim(inputs.eq(4).val()),
                JobTitleEn: $.trim(inputs.eq(5).val()),
                Mobile: $.trim(inputs.eq(6).val()),
                Tel: $.trim(inputs.eq(7).val()),
                Mail: $.trim(inputs.eq(8).val()),
                Industry: $.trim(inputs.eq(9).val()),
                JobFunction: $.trim(inputs.eq(10).val()),
                Sex: $.trim(inputs.eq(11).val()), 
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
            TicketType: ticketType,
            UserList: allotUsers
        }
        generateAlloted(allotUsers);
        alreadyAllot.attr("rowspan", parseInt(alreadyAllot.attr("rowspan")) + allotUsers.length);
        noAllotCount -= allotUsers.length;
        console.log(noAllotCount);
        allotItem.attr("data-ticketcount", noAllotCount).children(".ticket-count").text(noAllotCount);
        noAllotCount <= 0 && allotItem.remove();
        $(".allot-tips").children(".allottips-item").length == 0 && $(".allot-tips").remove();
        closeAllotDialog.trigger("click");
    });

    // 生成已分配信息
    function generateAlloted (objArr) {
        var str = "";
        for (var i = 0; i < objArr.length; i++) {
                str += "<tr class='hasborder alloted' data-nameen='" + objArr[i].NameEn + "'data-companyen='" + objArr[i].CompanyEn + "'data-joben='" + objArr[i].JobTitleEn + "'data-tel='" + objArr[i].Tel + "'data-industry='" + objArr[i].Industry + "'data-function='" + objArr[i].JobFunction + "'data-sex='" + objArr[i].Sex + "'>" + 
                            "<td class='allotId'>" + (parseInt(alreadyAllot.attr("rowspan")) + i) + "</td>" + 
                            "<td class='nameCN'>" + objArr[i].NameCn + "</td>" +
                            "<td class='sex'>" + (objArr[i].Sex == 1 ? "男" : "女") + "</td>" + 
                            "<td class='companyCN'>" + objArr[i].CompanyCn + "</td>" + 
                            "<td class='jobCN'>" + objArr[i].JobTitleCn + "</td>" + 
                            "<td class='mobile'>" + objArr[i].Mobile + "</td>" + 
                            "<td class='email'>" + objArr[i].Mail + "</td>" + 
                            "<td class='allotType'>" + "<span class='ticket-type'>" + ticketTypeText + "</span>" + "</td>" +
                            "<td class='allotManage' style='overflow: visible;'>" + "<button class='changeBtn'>修改</button>" + "</td>" + 
                       "</tr>"
        }
        allotTable.children("tbody").append(str);
    }
});