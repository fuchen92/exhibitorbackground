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

    var maxTag = 5,
        tagArr = [],
        productTag = $("#productTag"),						// 产品标签容器
        productTagShow = $("#productTagShow"),				// 产品标签展示容器
        productTagSelect = $("#productTagSelect"),			// 模拟产品下拉框
        productTagCategory = $("#productTagCategory")		// 产品标签分类容器

    productTagShow.children().each(function() {
        tagArr.push($(this).attr("data-tag"));
    });
    productTagSelect.on("click", function(event) {
        var e = event || window.event;
        e.stopPropagation();
        e.cancelBubble = true;
        $(".product-tag-tip").removeAttr("style");
        productTag.toggleClass("active");
    });
    productTagCategory.on("click", ".product-tag", function() {
        var currTag = $(this),
            dataTag = currTag.attr("data-tag"),
            dataName = $.trim(currTag.text()),
            dataParent = currTag.closest(".tag-group").children("h3").attr("data-id"),
            tem = currTag.clone().attr("data-name", dataName).attr("data-parent", dataParent).removeClass("product-tag").addClass("show-tag").append("<b class='tag-delete'>×</b>");
        if(tagArr.indexOf(dataTag) == -1 && tagArr.length < maxTag) {
            tagArr.push(dataTag);
            productTagShow.append(tem);
        }
    });
    productTagShow.on("click", ".tag-delete", function(e) {
        var event = e || window.event;
        event.stopPropagation();
        event.cancelBubble = true;
        $(this).parent().remove();
        var currTag = $(this).parent(),
            dataTag = currTag.attr("data-tag");

        tagArr.splice(tagArr.indexOf(dataTag), 1);
        currTag.remove();
    });

    currProductNum >= 4 ? $(".addProductBtn").hide() : $(".addProductBtn").removeAttr("style");

    submitProduct.on("click", function() {
        if(isEdit) {    // 编辑状态
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
            var productservice = new Array();
            productTagShow.children(".show-tag").each(function() {
                productservice.push({ Id: $(this).attr("data-tag"), Name: $(this).attr("data-name"), Value: $(this).attr("data-parent")});
            });
            var netProduct = {
                Id: currProduct.attr("data-id"),
                Logo: logoImg[0].src,
                Order: currProduct.find(".productId"),
                Name: $.trim(formInputs.eq(0).val()),
                NameEn: $.trim(formInputs.eq(1).val()),
                Summary: $.trim(formInputs.eq(2).val()),
                SummaryEn: $.trim(formInputs.eq(3).val()),
                ProductService: productservice
            }
            // $.ajax({
            //     url: "/Company/NetProductSave",
            //     type: "POST",
            //     dataType: "json",
            //     contentType: "application/json; charset=utf-8",
            //     data: JSON.stringify({ "netProduct": netProduct }),
            //     cache: false,
            //     success: function (js) {
            //         if (js.Code == 0) {
            //             console.log(js)
                        currProduct.find(".productName").text($.trim(formInputs.eq(0).val()));
                        currProduct.find(".productNameEn").text($.trim(formInputs.eq(1).val()));
                        currProduct.find(".product-desc").text($.trim(formInputs.eq(2).val()));
                        currProduct.find(".product-descEn").text($.trim(formInputs.eq(3).val()));
                        currProduct.find(".product-logo")[0].src = logoImg[0].src;
                        var tags = "";
                        for (var i = 0; i < productservice.length; i++) {
                            tags += "<span class='show-tag lt' data-tag='" + productservice[i].Id + "' data-name='" + productservice[i].Name + "' data-parent='" + productservice[i].Value + "'>" +
                                        productservice[i].Name + 
                                        "<b class='tag-delete'>×</b>" +
                                    "</span>"
                        }
                        currProduct.find(".hide-column").empty().append(tags);
                        productDialog.removeAttr("style");
            //         } else {
            //             alert("提交失败，请稍后再试")
            //         }
            //     },
            //     error: function (error) {
            //         console.log(error)
            //     }
            // });         
        } else {        // 添加状态
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
            var productservice = new Array();
            productTagShow.children(".show-tag").each(function() {
                productservice.push({ Id: $(this).attr("data-tag"), Name: $(this).attr("data-name"), Value: $(this).attr("data-parent")});
            });
            var netProduct = {
                Id: 0,
                Logo: logoImg[0].src,
                Order: ($(".productId").length + 1),
                Name: $.trim(formInputs.eq(0).val()),
                NameEn: $.trim(formInputs.eq(1).val()),
                Summary: $.trim(formInputs.eq(2).val()),
                SummaryEn: $.trim(formInputs.eq(3).val()),
                ProductService: productservice
            }
            // $.ajax({
            //     url: "/Company/NetProductSave",
            //     type: "POST",
            //     dataType: "json",
            //     contentType: "application/json; charset=utf-8",
            //     data: JSON.stringify({ "netProduct": netProduct }),
            //     cache: false,
            //     success: function (js) {
            //         if (js.Code == 0) {
                        console.log(js)
                        emptyRow.hide();
                        generateProduct($(".productId").length, js.Data, productservice);
                        currProductNum++;
                        if(currProductNum >= maxProduct) {
                            attention.hide();
                        }
                        productDialog.removeAttr("style");
            //         } else {
            //             alert("提交失败，请稍后再试")
            //         }
            //     },
            //     error: function (error) {
            //         console.log(error)
            //     }
            // });
        }
        // productDialog.removeAttr("style");
        // formInputs.val("");
        // logoImg.removeAttr("style");
        // logoImg[0].src = "";
        // logoTip.removeAttr("style");
        // uploadInput.val("");       
    });
    productForm.on("click keyup", ":input", function () {
        formTips.removeAttr("style");
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
            if(productTagShow.children().length == 0) {
                if(!hasTip) {
                    formTips.html("请选择产品/服务标签").show();
                    hasTip = true;
                }
                return false;
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
                aspectRatio: 168/74,
                dragmode: 'move',//移动画布
                minCropBoxWidth: 100,//裁剪框的最小宽度
                crop: function(e) {
                    preview.html(largeLogo.cropper("getCroppedCanvas", {
                        width: 168,
                        height: 74
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
        var tags = "";
        for(var i = 0; i < tagArr.length; i++) {
            tags += "<span class='show-tag lt' data-tag='" + tagArr[i].Id + "' data-name='" + tagArr[i].Name + "' data-parent='" + tagArr[i].Value + "'>" +
                        "<b class='tag-delete'>×</b>" +
                    "</span>"
        }
        var str = "<div class='product-row' data-producten='" + $.trim(formInputs.eq(1).val()) + "' data-productintroen='" + $.trim(formInputs.eq(3).val()) + "'>" +
                        "<div class='product-column column-1 lt'>" +
                            "<span class='productId'>" + (index + 1) + "</span>" +
                        "</div>" +
                        "<div class='product-column column-2 lt'>" + 
                            "<img class='product-logo' src='" + logoImg[0].src + "'/>" +
                        "</div>" +
                        "<div class='product-column column-3 lt'>" +
                            "<span class='productName'>" + $.trim(formInputs.eq(0).val()) + "</span>" +
                            "<span class='productNameEn'>" + $.trim(formInputs.eq(1).val()) + "</span>" +
                        "</div>" +
                        "<div class='product-column column-4 lt'>" +
                            "<p class='product-desc'>" + $.trim(formInputs.eq(2).val()) + "</p>" +
                            "<p class='product-descEn'>" + $.trim(formInputs.eq(3).val()) + "</p>" +
                        "</div>" +
                        "<div class='product-column column-5 lt'>" +
                            "<span class='edit'>编辑</span>" +
                            "<span class='del'>删除</span>" +
                            "<span class='moveup'></span>" +
                            "<span class='movedown'></span>" +
                        "</div>" +
                        "<div class='hide-column'>" + tags + "</div>"
                  "</div>"
        productList.append(str);
    }

    // 编辑，删除，上移，下移
    productList.on("click", ".column-5 span", function() {
        productDialog.removeAttr("style");
        formInputs.val("");
        productTagShow.empty();
        productTag.removeClass("active");
        tagArr.length = 0;
        logoImg.removeAttr("style");
        logoImg[0].src = "";
        logoTip.removeAttr("style");
        uploadInput.val("");

        currBtn = $(this);
        currProduct = currBtn.closest(".product-row");
        editIndex = currProduct.index(".product-row");
        console.log(editIndex);
        operation(currBtn, editIndex, currProduct);
    });
    function operation(currBtn, editIndex, currProduct) {
        var currClass = currBtn.attr("class");
        switch(currClass) {
            case "edit":
                currProduct.find(".hide-column").children().each(function() {
                    tagArr.push($(this).attr("data-tag"));
                });
                editRow();
                break;
            case "del":
                delRow();
                break;
            case "moveup":
                moveupRow();
                break;
            case "movedown":
                movedownRow();
                break;
        }
    }
    function editRow() {    // 编辑产品
        isEdit = true;
        $(".product-title").text("编辑产品信息");
        formInputs.eq(0).val($.trim(currProduct.find(".productName").text()));
        formInputs.eq(1).val($.trim(currProduct.find(".productNameEn").text()));
        formInputs.eq(2).val($.trim(currProduct.find(".product-desc").text()));
        formInputs.eq(3).val($.trim(currProduct.find(".product-descEn").text()));
        logoImg[0].src = currProduct.find(".product-logo")[0].src;
        productTagShow.append(currProduct.find(".hide-column").children().clone());
        logoImg.show();
        logoTip.hide();
        productDialog.show();
    }
    function delRow() {     // 删除行
        var prev = $(".product-row:lt(" + editIndex + ")"),
            next = $(".product-row:gt(" + editIndex + ")");
        currProduct.remove();
        next.each(function() {
            var productId = $(this).find(".productId");
            productId.text(productId.text() - 1);
        });
        currProductNum =  $(".productId").length;   // 重新获取当前有多少个产品
        if(currProductNum >= maxProduct) {
            attention.hide();
        } else {
            attention.removeAttr("style");
        }
    }
    function moveupRow() {
        var prev = currProduct.prev(".product-row");
        if(prev.length != 0) {
            var prevId = prev.find(".productId"),
                currId = currProduct.find(".productId"),
                tem = prevId.text(),
                b = currId.text();

            prevId.text(b);
            currId.text(tem);
            prev.before(currProduct);
        }
        
    }
    function movedownRow() {
        var next = currProduct.next(".product-row");
        if(next.length != 0) {
            var nextId = next.find(".productId"),
                currId = currProduct.find(".productId"),
                tem = nextId.text(),
                b = currId.text();
            
            nextId.text(b);
            currId.text(tem);
            next.after(currProduct);
        }
    }
});