(function($) {
    var global = null;
    $.fn.fSelect = function(options) {
        // 默认属性
        var defaultOptions = {
            placeholder: '---请选择---',
            numDisplayed: 5,
            overflowText: '已选中 {n}项',
            searchText: '搜索',
            showSearch: true,
            callback: function(){

            }
        }
        if (typeof options == 'string' ) {
            var settings = options;
        }
        else {
            var settings = $.extend(true, {}, defaultOptions, options);
        }

        /**
         * Constructor
         */
        function fSelect(select, settings) {
            this.$select = $(select);
            this.settings = settings;
            this.create();
        }


        /**
         * Prototype class
         */
        fSelect.prototype = {
            create: function() {
                var multiple = this.$select.is('[multiple]') ? ' multiple' : '';
                this.$select.wrap('<div class="fs-wrap' + multiple + '"></div>');
                this.$select.before('<div class="fs-label-wrap"><div class="fs-label">' + this.settings.placeholder + '</div><span class="fs-arrow"></span></div>');
                this.$select.before('<div class="fs-dropdown hidden"><div class="fs-options"></div></div>');
                this.$select.addClass('hidden');
                this.$wrap = this.$select.closest('.fs-wrap');
                this.reload();
            },

            reload: function() {
                if (this.settings.showSearch) {
                    var multiple = this.$select.is('[multiple]') ? ' multiple' : '';
                    if(multiple !== ''){
                        var search = '<div class="fs-search"><input type="search" placeholder="' + this.settings.searchText + '" /><span class="fs-selectAll">全选</span><span class="clear">清空</span></div>';
                    }else{
                        var search = '<div class="fs-search"><input type="search" placeholder="' + this.settings.searchText + '" />';
                    }
                    this.$wrap.find('.fs-dropdown').prepend(search);
                }
                var choices = this.buildOptions(this.$select);
                this.$wrap.find('.fs-options').html(choices);
                this.reloadDropdownLabel();
            },

            destroy: function() {
                this.$wrap.find('.fs-label-wrap').remove();
                this.$wrap.find('.fs-dropdown').remove();
                this.$select.unwrap().removeClass('hidden');
            },

            buildOptions: function($element) {
                var $this = this;

                var choices = '';
                if($element.children().length > 0){
                    $element.children().each(function(i, el) {
                        var $el = $(el);

                        if ('optgroup' == $el.prop('nodeName').toLowerCase()) {
                            choices += '<div class="fs-optgroup">';
                            choices += '<div class="fs-optgroup-label">' + $el.prop('label') + '</div>';
                            choices += $this.buildOptions($el);
                            choices += '</div>';
                        }
                        else {
                            var selected = $el.is('[selected]') ? ' selected' : '';
                            choices += '<div class="fs-option' + selected + '" data-value="' + $el.prop('value') + '"><span class="fs-checkbox"><i></i></span><div class="fs-option-label">' + $el.html() + '</div></div>';
                        }
                    });
                } else {
                    choices =  "<p class='empty'>暂无数据</p>"
                }
                return choices;
            },

            reloadDropdownLabel: function() {
                var settings = this.settings;
                var labelText = [];

                this.$wrap.find('.fs-option.selected').each(function(i, el) {
                    labelText.push($(el).find('.fs-option-label').text());
                });

                if (labelText.length < 1) {
                    labelText = settings.placeholder;
                }
                else if (labelText.length > settings.numDisplayed) {
                    labelText = settings.overflowText.replace('{n}', labelText.length);
                }
                else {
                    labelText = labelText.join(', ');
                }

                this.$wrap.find('.fs-label').html(labelText);
                this.$select.change();
            },
            setwrap: function () { return "123"; },
        }


        /**
         * Loop through each matching element
         */
        return this.each(function() {
            var data = $(this).data('fSelect');

            if (!data) {
                data = new fSelect(this, settings);
                $(this).data('fSelect', data);
            }

            if (typeof settings == 'string') {
                data[settings]();
            }
            global = data
        });
    }

    // 是否按住shift键位
    var isShift = false;
    // 默认标记第一个为默认标记项（按住shift键可选中区间范围）
    var flag = 0;
    /**
     * Events
     */
    window.fSelect = {
        'active': null,
        'idx': -1
    };

    function setIndexes($wrap) {
        $wrap.find('.fs-option:not(.hidden)').each(function(i, el) {
            $(el).attr('data-index', i);
            $wrap.find('.fs-option').removeClass('hl');
        });
        $wrap.find('.fs-search input').focus();
        window.fSelect.idx = -1;
    }

    function setScroll($wrap) {
        var $container = $wrap.find('.fs-options');
        var $selected = $wrap.find('.fs-option.hl');

        var itemMin = $selected.offset().top + $container.scrollTop();
        var itemMax = itemMin + $selected.outerHeight();
        var containerMin = $container.offset().top + $container.scrollTop();
        var containerMax = containerMin + $container.outerHeight();

        if (itemMax > containerMax) { // scroll down
            var to = $container.scrollTop() + itemMax - containerMax;
            $container.scrollTop(to);
        }
        else if (itemMin < containerMin) { // scroll up
            var to = $container.scrollTop() - containerMin - itemMin;
            $container.scrollTop(to);
        }
    }

    function isAllSelected() {
        var selected = [];
        var noHidden = [];
        var allOption = $('.fs-options').find(".fs-option")
        allOption.each(function(){
            if(!$(this).hasClass('hidden')){
                noHidden.push($(this))
                if($(this).hasClass('selected')){
                    selected.push($(this).attr('data-value'));
                }
            }
        })
        if(selected.length === noHidden.length){
            $('.fs-selectAll').addClass('selected')
        }else{
            $('.fs-selectAll').removeClass('selected')
        }
        $('.fs-wrap').find('select').fSelect('reloadDropdownLabel');
    }
    $(document).on('click', '.fs-selectAll', function () {
        var curOption = $(this).parent().next().find('.fs-option')
        for (var index = 0; index < curOption.length; index++) {
            var element = curOption[index];
            if(!$(element).hasClass('hidden')){
                $(element).addClass('selected')
            }
        }
        $(this).addClass('selected');
        $(this).closest('.fs-wrap').find('select').fSelect('reloadDropdownLabel');
        // 执行回调
        cb()
    });
    $(document).on('click', '.fs-selectAll.selected', function () {
        var curOption = $(this).parent().next().find('.fs-option')
        for (var index = 0; index < curOption.length; index++) {
            var element = curOption[index];
            if(!$(element).hasClass('hidden')){
                $(element).removeClass('selected');
            }
        }
        $(this).removeClass('selected');
        $(this).closest('.fs-wrap').find('select').fSelect('reloadDropdownLabel');
        // 执行回调
        cb()
    });

    $(document).on('click', '.fs-option', function() {
        var $wrap = $(this).closest('.fs-wrap');

        if ($wrap.hasClass('multiple')) {
            if(isShift){
                var min = flag <= $(this).index() ? flag : $(this).index()
                var max = flag <= $(this).index() ? $(this).index() : flag
                for(var i = min + 1; i < max; i++){
                    var isHidden = $wrap.find('.fs-option').eq(i).hasClass('hidden')
                    if(!isHidden){
                        $wrap.find('.fs-option').eq(i).toggleClass('selected');
                    }
                }
            }
            flag = $(this).index()
            var selected = [];

            $(this).toggleClass('selected');
            $wrap.find('.fs-option.selected').each(function(i, el) {
                selected.push($(el).attr('data-value'));
            });
            // 判断是否是全部选中
            isAllSelected()
        }
        else {
            var selected = $(this).attr('data-value');
            $wrap.find('.fs-option').removeClass('selected');
            $(this).addClass('selected');
            $wrap.find('.fs-dropdown').addClass('hidden');
            // $wrap.find('.fs-dropdown').hide();
        }

        $wrap.find('select').val(selected);
        $wrap.find('select').fSelect('reloadDropdownLabel');
        // $wrap.find('select').fSelect('setwrap');
        // 执行回调
        cb()
    });

    $(document).on('keyup', '.fs-search input', function(e) {
        if (40 == e.which) {
            $(this).blur();
            return;
        }

        var $wrap = $(this).closest('.fs-wrap');
        var keywords = $(this).val();

        $wrap.find('.fs-option, .fs-optgroup-label').removeClass('hidden');

        if ('' != keywords) {
            $wrap.find('.fs-option').each(function() {
                var regex = new RegExp(keywords, 'gi');
                if (null === $(this).find('.fs-option-label').text().match(regex)) {
                    $(this).addClass('hidden');
                }
            });

            $wrap.find('.fs-optgroup-label').each(function() {
                var num_visible = $(this).closest('.fs-optgroup').find('.fs-option:not(.hidden)').length;
                if (num_visible < 1) {
                    $(this).addClass('hidden');
                }
            });
        }

        setIndexes($wrap);
        // 判断是否是全部选中
        isAllSelected()
    });

    $(document).on('click', '.clear', function(){
        var $wrap = $(this).closest('.fs-wrap');
        var element = $wrap.find('.fs-options').find('.fs-option.selected')
        if(element){
            $(element).removeClass('selected');
        }
        $('.fs-wrap').find('.fs-label').text('---请选择---')
        $wrap.find('.fs-search').find("input[type='text']").val('')
        $('.fs-wrap').find('.fs-selectAll').removeClass('selected')
        // 执行回调
        cb()
    })

    $(document).on('click', function(e) {
        var $el = $(e.target);
        var $wrap = $el.closest('.fs-wrap');

        if (0 < $wrap.length) {
            if ($el.hasClass('fs-label')|| $el.hasClass('fs-arrow')) {
                window.fSelect.active = $wrap;
                var is_hidden = $wrap.find('.fs-dropdown').hasClass('hidden');
                $('.fs-dropdown').addClass('hidden');

                if (is_hidden) {
                    $wrap.find('.fs-dropdown').removeClass('hidden');
                }
                else {
                    $wrap.find('.fs-dropdown').addClass('hidden');
                }

                setIndexes($wrap);
            }
        }
        else {
            $('.fs-dropdown').addClass('hidden');
            window.fSelect.active = null;
        }
    });

    $(document).on('keydown', function(e) {
        var e = window.event || e;
        if( e.keyCode == 16 ){
            isShift = true;
        }
        var $wrap = window.fSelect.active;

        if (null === $wrap) {
            return;
        }
        else if (38 == e.which) { // up
            e.preventDefault();

            $wrap.find('.fs-option').removeClass('hl');

            if (window.fSelect.idx > 0) {
                window.fSelect.idx--;
                $wrap.find('.fs-option[data-index=' + window.fSelect.idx + ']').addClass('hl');
                setScroll($wrap);
            }
            else {
                window.fSelect.idx = -1;
                $wrap.find('.fs-search input').focus();
            }
        }
        else if (40 == e.which) { // down
            e.preventDefault();

            var last_index = $wrap.find('.fs-option:last').attr('data-index');
            if (window.fSelect.idx < parseInt(last_index)) {
                window.fSelect.idx++;
                $wrap.find('.fs-option').removeClass('hl');
                $wrap.find('.fs-option[data-index=' + window.fSelect.idx + ']').addClass('hl');
                setScroll($wrap);
            }
        }
        else if (32 == e.which || 13 == e.which) { // space, enter
            $wrap.find('.fs-option.hl').click();
        }
        else if (27 == e.which) { // esc
            $('.fs-dropdown').addClass('hidden');
            window.fSelect.active = null;
        }
    });

    $(document).on('keyup', function(e){
        var e = window.event || e
        if( e.keyCode == 16 ){
            isShift = false;
        }
    })
    $.fn.reload = function(){
        var $element = $('.fs-wrap').find('select')
        $('.fs-wrap').find('.fs-label').text('请选择')
        var $this = this;
        var choices = '';
        if($element.children().length > 0){
            $element.children().each(function (i, el) {
                var $el = $(el);
                if ('optgroup' == $el.prop('nodeName').toLowerCase()) {
                    choices += '<div class="fs-optgroup">';
                    choices += '<div class="fs-optgroup-label">' + $el.prop('label') + '</div>';
                    choices += $this.buildOptions($el);
                    choices += '</div>';
                } else {
                    var selected = $el.is('[selected]') ? ' selected' : '';
                    choices += '<div class="fs-option' + selected + '" data-value="' + $el.prop('value') + '"><span class="fs-checkbox"><i></i></span><div class="fs-option-label">' + $el.html() + '</div></div>';
                }
            });
        }else{
            choices =  "<p class='empty'>暂无数据</p>"
        }
        $element.empty()
        $('.fs-wrap').find('.fs-options').html(choices);
        $('.fs-wrap').find('.fs-selectAll').removeClass('selected')
        $('.fs-wrap').find('.fs-search').find("input[type='text']").val('')
        // 执行回调
        cb()
    }
    function cb() {
        var result = [];
        var a = global.$wrap.find(".fs-option")
        for (var i = 0; i < a.length; i++) {
            if($(a[i]).hasClass('selected')){
                result.push($(a[i]).attr('data-value'));
            }
        }
        global.settings.callback(result)
    }
    $.fn.fSelectedValues = function () {
        var result = [];
        var $selects = this.parent().find('.fs-dropdown').find('.fs-options').find(".fs-option");
        for (var i = 0; i < $selects.length; i++) {
            if($($selects[i]).hasClass('selected')){
                result.push($($selects[i]).attr('data-value'));
            }
        }
        return result;
    }
    $.fn.fSelectedTexts = function (splitString) {
        var result = "";
        var $selects = this.find("option:selected");
        for (var i = 0; i < $selects.length; i++) {
            result += $selects[i].text + ((i == $selects.length - 1) ? "" : splitString);
        }
        return result;
    }

})(jQuery);