var _popoverCallback = null;

$(function () {
    //bootstrap.popover-------------------------------------------------------------------------------------------
    $('.popoverTarget').popover({ trigger: 'hover', html: true });

    var tmp = $.fn.popover.Constructor.prototype.show;
    $.fn.popover.Constructor.prototype.show = function () {
        tmp.call(this);
        if (this.options.callback) {
            this.options.callback();
        }
    };
    $('.popTrigger').popover({
        html: true
        , content: function () {
            var popId = $(this).attr("data-popId");
            var obj = popId ? $('#' + popId) : $(this).next("span");
            var html = obj.html().replace('hasDatepicker', '');
            return html;
        }
        , callback: function () {
            if ($(".calendar").datepicker)
                $(".calendar").datepicker();
            if (_popoverCallback)
                _popoverCallback();
        }
    });
    //popTriggerのdata-trigger=clickのとき、popのエリア外クリックで閉じるようにする
    $(document).on("click", function(e) { 
        var isTrigger = $(e.target).hasClass("popTrigger");
        if(isTrigger) {
            $(".popTrigger[id!="+ $(e.target).attr("id") +"]").popover("hide");
        }
        var clickPopup = isTrigger || $(e.target).parents("div.popover").length > 0;
        if($(e.target).hasClass("closePop")) clickPopup = false;
        if(!clickPopup)
            $(".popTrigger").popover("hide");
    });

    function closePop() {
        $('.popTrigger').popover('hide');
    }
});