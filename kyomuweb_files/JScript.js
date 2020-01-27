function changePressedStatus(id, value) {
    setTimeout(function () { document.getElementById(id).value = value; document.getElementById(id).disabled = true; }, 50);
    return true;
}

function showDialog(path, width, height, query, windowName) {
    //IEだと一部文字が含まれると引数エラーになる
    if(windowName)
        windowName = (windowName + '').replace('.','').replace('_','');
        
    var result;
    if(query)
        path = path + (path.indexOf('?') > 0 ? '&' : '?') + query;
    result = window.open(path + (path.indexOf('?') > 0 ? '&' : '?') + MakeCachePreventString(), windowName, 'width=' + width + ', height=' + height + ', menubar=yes, toolbar=no, scrollbars=yes, resizable=yes');
    return result != undefined ? result : false;
}

// -----------------------------------------------------------------------------
// ShowModalDialogで表示されるダイアログはキャッシュが効いてしまう
// (何度表示しても同じデータばかり表示される)場合があるため、
// 引数で渡すURLに下記のクエリ文字列を追加し、キャッシュを抑制する。
// -----------------------------------------------------------------------------
function MakeCachePreventString() {
    var date = new Date();
    var sRet = "cps=" + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
    return sRet;
}

function insert2(lstID, txtID, f) {
    var lst = document.getElementById(lstID);
    var str = lst.options[lst.selectedIndex].value;
    insert0(f(str), txtID);
}
function insert(lstID, txtID) {
    var lst = document.getElementById(lstID);
    var str = lst.options[lst.selectedIndex].value;
    insert0(str, txtID);
}
function insert0(str, txtID) {
    var textarea = document.getElementById(txtID);
    textarea.focus();
    if (document.selection) { // IE, Opera
        var range = document.selection.createRange();
        range.text = str;
    } else if (textarea.selectionStart != undefined) { // mozilla
        var start = textarea.selectionStart;
        var end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + str + textarea.value.substring(end);
        textarea.setSelectionRange(start + str.length, start + str.length);
    } else {
        textarea.value += str;
    }
}

function checkAll(cssClass) {
    $(cssClass).children(':checkbox:enabled').prop('checked', $(cssClass).children(':checked').length == 0);
}

function closeAndPostback(btnId, optionId, value) { 
    if(optionId && value) {
        window.opener.$('#' + optionId).val(value);
    }
    window.opener.__doPostBack(btnId, '');
    window.close(); return false;
}

function closeAndReload() {
    window.opener.location.reload();
    window.close(); return false;
}

$(document).ready(function() {
    //tooltip。cssのtooltipDivとセットで使用する
    var a_ele = $("a.tooltipx");
    a_ele.mouseover(function(e) {
        var name = e.target.name;
        var div_ele = $("div#" + name);
        div_ele.css({ "opacity": 0, "display": "block" });
        div_ele.fadeTo("fast", 1.0);
    });
    a_ele.mousemove(function(e) {
        var name = e.target.name;
        var div_ele = $("div#" + name);
        var x = e.pageX + 20;
        var y = e.pageY + 20;
        var yy = y + div_ele.height() - $(window).height() - $(window).scrollTop();
        if (yy > 0)
            y = y - yy - 35;
        div_ele.css("left", x);
        div_ele.css("top", y);
    });
    a_ele.mouseout(function(e) {
        var name = e.target.name;
        var div_ele = $("div#" + name);
        div_ele.css({ "display": "none" });
    });
    
    
    var _opened = null;
    var a_ele2 = $("a.tooltipx2");
    a_ele2.mouseover(function(e) {
        if(_opened) {
            _opened = null;
            return;
        }
        
        var name = e.target.name;
        var div_ele = $("div#" + name);
        div_ele.css({ "opacity": 0, "display": "block" });
        div_ele.fadeTo("fast", 1.0);
    });
    a_ele2.click(function(e) { 
        var close = function() {
            if(_opened && _opened.target) {
                var name = _opened.target.name;
                var div_ele = $("div#" + name);
                div_ele.css({ "display": "none" });
            }
            _opened = null;
        };
    
        if(_opened) {
            close();
            return;
        }
        
        _opened = e;
        $("div#" + _opened.target.name).click(function(ee) {
            if(ee.target.type || ee.target.toString().indexOf('HTMLLabelElement') > 0) return;
            
            close();
        });
    });
    a_ele2.mouseout(function(e) { 
        if(_opened && (_opened.target.name == e.target.name))return;
        
        var name = e.target.name;
        var div_ele = $("div#" + name);
        div_ele.css({ "display": "none" });
    });


    $(".stripe tr:even").addClass("even");
    $(".stripe tr:odd").addClass("odd");
    $(".jchange").click(function() {
        $(".etext").hide();
        $(".jtext").show();
        $(".echange").show();
        $(".jchange").hide();
    });
    $(".echange").click(function() {
        $(".etext").show();
        $(".jtext").hide();
        $(".echange").hide();
        $(".jchange").show();
    });


    $("select.drpShozoku").change(function () {
        var source = $(this).get(0);
        $("select.drpShozoku").each(function () {
            if ($(this).get(0) != source)
                $(this).val("");
        });
    });


    $(".checkTbl td").on("click", function (e) {
        var t = $(e.target);
        if (t.is(":checkbox") || t.is(":radio") || t.is("label") || t.is("input")) return;

        var chk = $(this).find(":checkbox:enabled");
        if (chk.length != 1) {
            chk = $(this).find(":radio:enabled");
        }
        if (chk.length != 1) return;

        chk.eq(0).prop("checked", !chk.eq(0).prop("checked"));
        chk.trigger("change");
    }).each(function () {
        var td = $(this);
        var chk = td.find(":checkbox:enabled");
        if (chk.length != 1) {
            chk = $(this).find(":radio:enabled");
        }
        if (chk.length != 1) return;

        td.css("cursor", "default");
        td.hover(function () {
            //$(this).css("background-color", "#def");
            $(this).addClass("checkTblHover");
        }, function () {
            //$(this).css("background-color", "");
            $(this).removeClass("checkTblHover");
        });
    });
    
    try
    {
        $('.modal').on('show.bs.modal', function () {
            centerModals();
        });

        Sys.Browser.WebKit = {};
	    if (navigator.userAgent.indexOf('WebKit/') > -1) {
	        Sys.Browser.agent = Sys.Browser.WebKit;
	        Sys.Browser.version = parseFloat(navigator.userAgent.match(/WebKit\/(\d+(\.\d+)?)/)[1]);
	        Sys.Browser.name = 'WebKit';
	    }
    }
    catch (e) { }

    $('[data-toggle="tooltip"]').popover({ trigger: 'hover', html: true });

    var suppressChange = false;
    $('.calendar').on('change', function () {
        if (suppressChange) return true;

        var val = $(this).val();
        var org = val;

        if (val && !val.match(/^[0-9]{4}\/[0-9]{1,2}\/[0-9]{1,2}$/)) {
            alert("日付はyyyy/mm/ddの形式で入力してください");
            $(this).focus();
            return false;
        }

        if (val && val.match(/^[0-9]{4}\/[0-9]{1}\/[0-9]{1,2}$/)) {
            val = insertStr(val, 5, '0');
        }
        if (val && val.match(/^[0-9]{4}\/[0-9]{2}\/[0-9]{1}$/)) {
            val = insertStr(val, 8, '0');
        }

        if (!isDate(val)) {
            alert("日付が無効です");
            $(this).focus();
            return false;
        }
        
        if (val == org) return true;

        suppressChange = true;
        try {
            $(this).val(val);
        } finally {
            suppressChange = false;
        }
    });
});

function isDate(strDate) {
    if (strDate == "") {
        return true;
    }
    if (!strDate.match(/^\d{4}\/\d{1,2}\/\d{1,2}$/)) {
        return false;
    }

    var date = new Date(strDate);
    if (date.getFullYear() != strDate.split("/")[0]
        || date.getMonth() != strDate.split("/")[1] - 1
        || date.getDate() != strDate.split("/")[2]
    ) {
        return false;
    }

    return true;
}

function insertStr(str, index, insert) {
    return str.slice(0, index) + insert + str.slice(index, str.length);
}

function centerModals() {
    return $('div.modalCenter').each(function () {
        var content = $(this).find('.modal-content');
        var top = Math.floor(($(window).height() - content.height()) / 2) * 0.5;
        content.css('margin-top', top);
    });
};

//http://www.west-wind.com/weblog/posts/42319.aspx
//違うContainerで同じIDのものが複数ある場合は問題かも
function $$(id, context) {
    var el = $("#" + id, context);
    if (el.length < 1)
        el = $("[id$=_" + id + "]", context);
    return el;
}



function setupUserAutocomplete(url) {
    $.each(["txtLogin", "acUser", "acUserName", "acStudent", "acStudentName", "acTeacher", "acTeacherName", "acSinkokuNo", "acSinkokuNoName", "acSuisho", "acSuishoName", "acLesson", "acLessonName", "acKMC", "acKamokuCode", "acArea"], function (i, cls) {
        var sub = cls.length - "Name".length;
        autoFocus = !((sub >= 0) && (cls.lastIndexOf("Name") === sub));

        var type = cls.replace(/^txt/, "").replace(/^ac/, "").toLowerCase().replace(/name$/, "&valuetype=name");
        $(":input." + cls).each(function() {
            $(this).autocomplete({
                source: url + "?type=" + type + "&" + $(this).attr("acoption"),
                autoFocus: autoFocus,
                minLength: 2,
                delay: 100,
                select: function () {
                    if ($(this).attr("onchange"))
                        eval($(this).attr("onchange"));
                }
            })});
    });
}