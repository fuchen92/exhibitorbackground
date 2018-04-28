$(function() {
    var companyForm = $("#companyForm"),
        formInputs = companyForm.find(".form-input"),
        industry = $("#industry"),                          // 行业容器
        industrySelect = $("#industrySelect"),              // 模拟行业下拉框
        industryShow = $("#industryShow"),                  // 行业标签展示容器
        industryCategory = $("#industryCategory"),          // 行业分类下拉显示容器
        formTips = $(".form-tips"),
        submitCompany = $("#submitCompany"),
        successDialog = $("#successDialog");

    var uploadLabel = $("#uploadLabel"),
        uploadInput = $("#uploadInput"),                    // 图片上传隐藏表单
        imgPreview = $("#imgPreview");

    uploadInput.on("change", function() {
        uploadImg($(this)[0]);
        console.log($(this)[0].files)
    });
    function uploadImg(fileDom) {
        //判断是否支持FileReader
        if(window.FileReader) {
            var reader = new FileReader();
        } else {
            alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
        }
        //获取文件
        var file = fileDom.files[0];
        var imageType = /^image\//;
        //是否是图片
        if(!imageType.test(file.type)) {
            alert("请选择图片！");
            return;
        }
        reader.readAsDataURL(file);
        //读取完成
        reader.onload = function(e) {
            //获取图片dom
            // var img = document.getElementById("preview");
            //图片路径设置为读取的图片
            imgPreview[0].src = e.target.result;
            // imgPreview[0].src = window.URL.createObjectURL(fileDom.files.item(0));
            imgPreview.show();
        };
        uploadLabel.hide();
    }

    var maxTag = 5,
        tagArr = [];

    industrySelect.on("click", function(event) {
        var e = event || window.event;
        e.stopPropagation();
        e.cancelBubble = true;
        industry.toggleClass("active");     
    });
    industryCategory.on("click", ".industry-tag", function() {
        var currTag = $(this),
            dataIndustry = currTag.attr("data-industry"),
            tem = currTag.clone().removeClass("industry-tag").addClass("show-tag").append("<b class='tag-delete'>×</b>");
        if(tagArr.indexOf(dataIndustry) == -1 && tagArr.length < maxTag) {
            tagArr.push(dataIndustry);
            industryShow.append(tem);
        }
    });
    industryShow.on("click", ".tag-delete", function(e) {
        var event = e || window.event;
        event.stopPropagation();
        event.cancelBubble = true;
        $(this).parent().remove();
        var currTag = $(this).parent(),
            dataIndustry = currTag.attr("data-industry");

        tagArr.splice(tagArr.indexOf(dataIndustry), 1);
        currTag.remove();
    });
    // $("body").on("click", function() {
    //     industry.removeClass("active");
    // });

    var catchErr = false,
        hasTip = false;

    submitCompany.on("click", function() {
        catchErr = false;
        formInputs.each(function(index) {
            var currInput = $(this);
            if(index == 2) {
                return;
            }
            if(!validate(currInput)) {
                catchErr = true;
                currInput.focus();
                return false;
            }
        });
        if(catchErr) return false;
        var order = {
            CompanyCN: $.trim(formInputs.eq(0).val()),
            CompanyEN: $.trim(formInputs.eq(1).val()),
            Tel: $.trim(formInputs.eq(2).val() + "-" + formInputs.eq(3).val()),
            Industry: [
                industryShow.children().eq(0).attr("data-industry"),
                industryShow.children().eq(1).attr("data-industry"),
                industryShow.children().eq(2).attr("data-industry"),
                industryShow.children().eq(3).attr("data-industry"),
                industryShow.children().eq(4).attr("data-industry"),
            ],
            IntroCN: $.trim(formInputs.eq(5).val()),
            IntroEN: $.trim(formInputs.eq(6).val())
        }
        console.log(order);
        submitCompany.prop("disabled", true);
        successDialog.css("display", "block");
    });
    companyForm.on("click keyup", ":input, .industry-select", function () {
        formTips.removeAttr("style");
    });
    successDialog.on("click", "#closeSuccessDialog, #cancelSuccessDialog", function () {
        successDialog.removeAttr("style");
        submitCompany.prop("disabled", false);
    });
    
    // 验证函数
    function validate (ele) {
        hasTip = false;
        var attr = ele.attr("data-role");
        var formTips = ele.next(".form-tips");
        if (attr && !ele.is("div")) {
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
        } else {
            if(industryShow.children().length == 0) {
                if(!hasTip) {
                    formTips.html("请选择所属行业").show();
                    hasTip = true;
                }
                return false;
            }
        }
        return true;
    }
});