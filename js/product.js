$(function() {
    var productList = $("#productList"),
        productDialog = $("#productDialog");

    $(".addProduct, .addProductBtn").on("click", function() {
        isEdit = false;
        $(".product-title").text("添加产品/服务信息");
        logoLarge.empty();
        preview.empty();
        uploadInput.val("");
        $(".upload").removeAttr("style");
        productDialog.show();
    });
    $(".product-close").on("click", function() {
        productDialog.removeAttr("style");
    });

    var productForm = $("#productForm"),
        formInputs = productForm.find(".form-input"),
        formTips = $(".form-tips"),
        submitProduct = $("#submitProduct");

    var catchErr = false,
        hasTip = false;

    var logoArea = $("#logoArea"),                          // logo展示区域
        logoImg = $("#logoImg"),                            // 展示logo标签
        logoTip = $("#logoTip"),                            // logo说明（145*80）
        upload = $("#upload"),                              // logo上传对话框

        logoLarge = $("#logoLarge"),
        uploadLabel = $("#uploadLabel"),
        uploadInput = $("#uploadInput"),                    // 图片上传隐藏表单
        preview = $("#preview"),
        uploadConfirm = $("#uploadConfirm");                // 确认按钮
    
    var isUpload = false;

    var maxProduct = 4,
        currProductNum = $(".productId").length,    // 当前已经登记多少个产品
        attention = $("#attention");

    var isEdit = false,
        products = productList.children(".product-row:gt(0)"),
        currBtn = null,             // 编辑按钮
        currProduct = null,         // 修改的是哪一个产品
        editIndex = 0;              // 修改的是哪个产品的下标

    submitProduct.on("click", function() {
        if(isEdit) {    // 如果是在编辑状态
            catchErr = false;
            formInputs.each(function() {
                var currInput = $(this);
                if(!validate(currInput)) {
                    catchErr = true;
                    currInput.focus();
                    return false;
                }
            });
            if(catchErr) return false;
            currProduct.find(".productName").text($.trim(formInputs.eq(0).val()));
            currProduct.find(".product-desc").text($.trim(formInputs.eq(2).val()));
            currProduct.find(".product-logo")[0].src = logoImg[0].src;
            currProduct.attr("data-producten", $.trim(formInputs.eq(1).val()));
            currProduct.attr("data-productintroen", $.trim(formInputs.eq(3).val()));            
        } else {        // 否则就是添加状态
            catchErr = false;
            formInputs.each(function() {
                var currInput = $(this);
                if(!validate(currInput)) {
                    catchErr = true;
                    currInput.focus();
                    return false;
                }
            });
            if(catchErr) return false;
            if(logoImg.attr("src") == "") {
                catchErr = true;
                alert("请上传产品logo");
                return false;
            }
            var order = {
                productCN: $.trim(formInputs.eq(0).val()),
                productEN: $.trim(formInputs.eq(1).val()),
                productIntroCN: $.trim(formInputs.eq(2).val()),
                productIntroEN: $.trim(formInputs.eq(3).val())
            }
            console.log(order);
            generateProduct($(".productId").length);
            currProductNum++;
            if(currProductNum >= maxProduct) {
                attention.remove();
            }
        }
        productDialog.removeAttr("style");
        formInputs.val("");
        logoImg.removeAttr("style");
        logoImg[0].src = "";
        logoTip.removeAttr("style");
        uploadInput.val("");       
    });
    productForm.on("click keyup", ":input", function () {
        formTips.removeAttr("style");
    });

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

    logoArea.hover(function() {
        logoTip.removeAttr("style");
    }, function() {
        isUpload = (logoImg.attr("src") == "" ? false : true);
        if(isUpload) {
            logoTip.hide();
        }
    });

    logoTip.on("click", function() {
        logoLarge.empty();
        preview.empty();
        uploadInput.val("");
        upload.css("display", "block");
    });

    uploadInput.on("change", function() {
        uploadImg(this);
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
            logoLarge.html('<img id="largeLogo" src="' + e.target.result + '">');
            var largeLogo = $("#largeLogo");
            largeLogo.cropper({
                aspectRatio: 145/80,
                dragmode: 'move',//移动画布
                minCropBoxWidth: 100,//裁剪框的最小宽度
                crop: function(e) {
                    preview.html(largeLogo.cropper("getCroppedCanvas", {
                        width: 145,
                        height: 80
                    }))
                }
            })
        };
    }

    uploadConfirm.on("click", function() {
        var ctx = preview.children()[0];
        var dataUrl = ctx.toDataURL("image/jpg");
        logoImg[0].src = dataUrl;
        logoImg.show();
        logoTip.hide();
        // var Pic = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        // $.ajax({
        //     url: "http://img.traveldaily.cn/Uploader/UserPhotoBase64",
        //     type: "POST",
        //     dataType: "json",
        //     data: { "userid": @(Session["UserId"]), "timestamp": '@(ViewData["timestamp"])', "checksum": '@(ViewData["checksum"])', "imagedata": Pic },
        //     success: function (js) {
        //         if (js.Code == 0) {
        //             $(".profile-photo-img").attr("src", dataURL);
        //             $.ajax({
        //                 url: "/Api/PhotoSession",
        //                 type: "POST",
        //                 dataType: "json",
        //                 data: { "photo": js.Message },
        //                 success: function (js) {
        //                 }
        //             });
        //         } else {
        //             layer.alert("上传失败：" +
        //                 js.Message);
        //         }
        //     }
        // });
        upload.removeAttr("style");
    });

    $("#closeUpload, .upload-cancel").click(function(){
        logoLarge.empty();
        preview.empty();
        uploadInput.val("");
        $(".upload").removeAttr("style");
        isUpload = (logoImg.attr("src") == "" ? false : true);
        if(!isUpload) {
            logoTip.hide();
        }
    });

    function generateProduct(index) {
        var str = "<div class='product-row' data-producten='" + $.trim(formInputs.eq(1).val()) + "' data-productintroen='" + $.trim(formInputs.eq(3).val()) + "'>" +
                        "<div class='product-column column-1 lt'>" +
                            "<span class='productId'>" + (index + 1) + "</span>" +
                        "</div>" +
                        "<div class='product-column column-2 lt'>" + 
                            "<img class='product-logo' src='" + logoImg[0].src + "'/>" +
                        "</div>" +
                        "<div class='product-column column-3 lt'>" +
                            "<span class='productName'>" + $.trim(formInputs.eq(0).val()) + "</span>" +
                        "</div>" +
                        "<div class='product-column column-4 lt'>" +
                            "<p class='product-desc'>" + $.trim(formInputs.eq(2).val()) + "</p>" +
                        "</div>" +
                        "<div class='product-column column-5 lt'>" +
                            "<span class='edit'>编辑</span>" +
                            "<span class='del'>删除</span>" +
                            "<span class='moveup'></span>" +
                            "<span class='movedown'></span>" +
                        "</div>" +
                  "</div>"
        productList.append(str);
    }

    // 编辑，删除，上移，下移
    productList.on("click", ".column-5 span", function() {
        currBtn = $(this);
        currProduct = currBtn.closest(".product-row");
        editIndex = currProduct.index(".product-row:gt(0)");

        operation(currBtn, editIndex, currProduct);
    });
    function operation(currBtn, editIndex, currProduct) {
        var currClass = currBtn.attr("class");
        switch(currClass) {
            case "edit":
                isEdit = true;
                $(".product-title").text("编辑产品信息");
                formInputs.eq(0).val($.trim(currProduct.find(".productName").text()));
                formInputs.eq(1).val($.trim(currProduct.attr("data-producten")));
                formInputs.eq(2).val($.trim(currProduct.find(".product-desc").text()));
                formInputs.eq(3).val($.trim(currProduct.attr("data-productintroen")));
                logoImg[0].src = currProduct.find(".product-logo")[0].src;
                logoImg.show();
                logoTip.hide();
                productDialog.show();
                break;
            case "del":
                break;
            case "moveup":
                break;
            case "movedown":
                break;
        }
    }
});