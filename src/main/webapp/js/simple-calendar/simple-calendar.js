'use strict';
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var LunarHelp = function () {
  function LunarHelp(year, month, day) {
    _classCallCheck(this, LunarHelp);
    this.lunarInfo = new Array(0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, 0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, 0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0);
    var date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    var i,leap = 0,temp = 0; //天数
    var baseDate = new Date(1900, 0, 31);
    var offset = (date - baseDate) / 86400000;
    //计算年数
    for (i = 1900; i < 2050 && offset - this.lYearDays(i) > 0; i++) {
      offset -= this.lYearDays(i);
    }
    this.year = i;
    leap = this.leapMonth(i); //闰哪个月
    this.isLeap = false;
    //计算月数
    for (i = 1; i < 13 && offset > 0; i++) {
      //闰月
      if (leap > 0 && i == leap + 1 && this.isLeap == false) {
        --i;
        this.isLeap = true; //加上这句
        temp = this.leapDays(this.year);
      } else {
        temp = this.monthDays(this.year, i);
      }
      //解除闰月
      if (this.isLeap == true && i == leap + 1) this.isLeap = false;
      offset -= temp;
    }
    //如果恰好减完了，不是闰月的话月数减1
    if (offset == 0 && leap > 0 && i == leap + 1) if (this.isLeap) {
      this.isLeap = false;
    } else {
      this.isLeap = true;
      --i;
    }
    if (offset < 0) {
      offset += temp;
      --i;
    }
    this.month = i;
    //最后剩余的就是日期
    this.day = offset + 1;
  }
  // 获取y年的总天数
  _createClass(LunarHelp, [{
    key: 'lYearDays',
    value: function lYearDays(year) {
      var i,
          sum = 0;
      for (i = 0x8000; i > 0x8; i >>= 1) {
        sum += this.lunarInfo[year - 1900] & i ? 30 : 29;
      }return sum + this.leapDays(year); //最后在加上可能有的闰年的闰月
    }
    //获取闰年闰月的天数 闰大月还是小月
  }, {
    key: 'leapDays',
    value: function leapDays(year) {
      if (this.leapMonth(year)) return this.lunarInfo[year - 1900] & 0x10000 ? 30 : 29;else return 0;
    }
    //获取闰年闰哪个月1-12 ,没闰传回 0
  }, {
    key: 'leapMonth',
    value: function leapMonth(year) {
      return this.lunarInfo[year - 1900] & 0xf;
    }
    //获取y年m月的总天数 正常月
  }, {
    key: 'monthDays',
    value: function monthDays(year, month) {
      return this.lunarInfo[year - 1900] & 0x10000 >> month ? 30 : 29;
    }
  }]);
  return LunarHelp;
}();

var SimpleCalendar = function () {
  //构造函数
  function SimpleCalendar(query, options) {
    _classCallCheck(this, SimpleCalendar);
    //默认配置
    this._defaultOptions = {
      width: '500px',
      height: '500px',
      language: 'CH', //语言
      showLunarCalendar: true, //阴历
      showHoliday: true, //休假
      showFestival: true, //节日
      showLunarFestival: true, //农历节日
      showSolarTerm: true, //节气
      showMark: true, //标记
      timeRange: {
        startYear: 1900,
        endYear: 2050
      },
      timeZone: "", //时区
      mark: {

      },
      theme: {
        changeAble: false,
        weeks: {
          backgroundColor: '#FBEC9C',
          fontColor: '#4A4A4A',
          fontSize: '20px'
        },
        days: {
          backgroundColor: '#ffffff',
          fontColor: '#565555',
          fontSize: '14px'
        },
        todaycolor: 'orange',
        activeSelectColor: 'orange',
        invalidDays: '#C1C0C0'
      }
    };
    //容器
    this.container = document.querySelector(query);
    this._defaultOptions.width = this.container.style.offsetWidth;
    this._defaultOptions.height = this.container.style.offsetHeight;
    //得到最终配置
    this._options = this.optionAssign(this._defaultOptions, options);
    this.create();
  }
  //用B更新A的属性 并返回结果
  _createClass(SimpleCalendar, [{
    key: 'optionAssign',
    value: function optionAssign(optionsA, optionsB) {
      for (var key in optionsB) {
        if (_typeof(optionsA[key]) !== 'object') optionsA[key] = optionsB[key];else {
          optionsA[key] = this.optionAssign(optionsA[key], optionsB[key]);
        }
      }
      return optionsA;
    }
    //生成日历样式
  }, {
    key: 'create',
    value: function create() {
      var root = this.container;
      root.innerHTML = '<div class="sc-header"> </div> <div class="sc-body"> </div>';
      root.style.width = this._options.width;
      root.style.height = this._options.height;
      root.className = 'sc-calendar';
      var header = root.querySelector('.sc-header');
      var scbody = root.querySelector('.sc-body');
      //actions
      header.innerHTML = header.innerHTML + '<div class="sc-actions">' + '      <div class="sc-yleft">' + '        &lsaquo;</div>' + '      <select class="sc-select-year" name="">' + '      </select>' + '      <div class="sc-yright">&rsaquo;</div>' + '  </div>';
      header.innerHTML = header.innerHTML + '<div class="sc-actions">' + '    <div class="sc-mleft">' + '      &lsaquo;</div>' + '    <select class="sc-select-month" name="">' + '    </select>' + '    <div class="sc-mright">&rsaquo;</div>' + '</div>';
      header.innerHTML = header.innerHTML + '<div class="sc-actions"><span class="sc-return-today ">返回今天</span></div>';
      header.innerHTML = header.innerHTML + '<div class="sc-actions"><span class="sc-time"></span></div>';
      scbody.innerHTML = ' <div class="sc-week"> </div> <div class="sc-days"> </div>';
      var week = scbody.querySelector('.sc-week');
      var days = scbody.querySelector('.sc-days');
      for (var i = 0; i < 7; i++) {
        week.innerHTML = week.innerHTML + ' <div class="sc-week-item"></div>';
      }
      for (var i = 0; i < 42; i++) {
        days.innerHTML = days.innerHTML + '<div class="sc-item"><div class="day"></div><div class="lunar-day"></div></div>';
      }
      //添加下拉框数据
      this.updateSelect(this.tyear, this.tmonth);
      //刷新日历
      this.update();
      //时间刷新
      self.setInterval('SimpleCalendar.timeupdate()', 200);
    }
    //刷新日历
  }, {
    key: 'update',
    value: function update() {
      var month = arguments.length <= 0 || arguments[0] === undefined ? this.tmonth : arguments[0];
      var year = arguments.length <= 1 || arguments[1] === undefined ? this.tyear : arguments[1];
      this.updateSize();
      this.updateWeek();
      this.addData(year, month);
      this.updateMark(year, month);
      this.updateEvent();
    }
    //调整大小
  }, {
    key: 'updateSize',
    value: function updateSize() {
      var width = arguments.length <= 0 || arguments[0] === undefined ? this._options.width : arguments[0];
      var height = arguments.length <= 1 || arguments[1] === undefined ? this._options.height : arguments[1];

      //将大小赋值给option
      this._options.width = width;
      this._options.height = height;

      this.container.style.width = width;
      this.container.style.height = height;

      //根据长度和宽度大小调整适合的样式
      if (parseInt(width) < 500) {
        var actions = this.arrayfrom(this.container.querySelectorAll('.sc-actions'));
        actions.forEach(function (v, i) {
          v.classList.add('sc-actions-big');
        });
      } else {
        var actions = this.arrayfrom(this.container.querySelectorAll('.sc-actions'));
        actions.forEach(function (v, i) {
          v.classList.remove('sc-actions-big');
        });
      }
      if (parseInt(height) < 400) {
        var items = this.arrayfrom(this.container.querySelectorAll('.sc-item'));
        var weeks = this.arrayfrom(this.container.querySelectorAll('.sc-week-item'));
        items.forEach(function (v, i) {
          v.querySelector('.day').classList.add('sc-item-small');
        });
        weeks.forEach(function (v, i) {
          v.classList.add('sc-item-small');
        });
      } else {
        var items = this.arrayfrom(this.container.querySelectorAll('.sc-item'));
        var weeks = this.arrayfrom(this.container.querySelectorAll('.sc-week-item'));
        items.forEach(function (v, i) {
          v.querySelector('.day').classList.remove('sc-item-small');
        });
        weeks.forEach(function (v, i) {
          v.classList.remove('sc-item-small');
        });
      }
    }
    //刷新下拉框 只有在初始化和设置语言后才会更新
  }, {
    key: 'updateSelect',
    value: function updateSelect(year, month) {
      //下拉框
      var selectYear = this.container.querySelector('.sc-select-year');
      var selectMonth = this.container.querySelector('.sc-select-month');
      selectYear.innerHTML = '';
      for (var i = this._options.timeRange.startYear; i < this._options.timeRange.endYear + 1; i++) {
        selectYear.innerHTML += '<option value="' + i + '">' + i + '</option>';
      }
      selectMonth.innerHTML = '';
      for (var i = 0; i < 12; i++) {
        var data = this.languageData['months_' + this._options.language];
        selectMonth.innerHTML += '<option value="' + (i + 1) + '">' + data[i] + '</option>';
      }
      selectYear.value = year;
      selectMonth.value = month;
    }
    //刷新星期
  }, {
    key: 'updateWeek',
    value: function updateWeek() {
      var weeks = this.arrayfrom(this.container.querySelectorAll('.sc-week-item'));
      var data = this.languageData['days_' + this._options.language];
      if (!data) {
        console.error('language error!');
      }
      weeks.forEach(function (v, i) {
        v.innerHTML = data[i];
      });
    }
    //添加阳历阴历数据
  }, {
    key: 'addData',
    value: function addData(year, month) {
      var daysElement = this.arrayfrom(this.container.querySelectorAll('.sc-item'));
      var day = new Date(year, month - 1, 1);
      var week = day.getDay();
      if (week == 0) week = 7;

      //计算得到第一个格子的日期
      var thispageStart = new Date(Date.parse(day) - (week - 1) * 24 * 3600 * 1000);

      //对每一个格子遍历
      for (var i = 0; i < 42; i++) {
        daysElement[i].className = 'sc-item';
        var theday = new Date(Date.parse(thispageStart) + i * 24 * 3600 * 1000);
        var writeyear = theday.getFullYear();
        var writeday = theday.getDate();
        var writemonth = theday.getMonth() + 1;
        if (writemonth != month) {
          daysElement[i].classList.add('sc-othermenth');
        }
        daysElement[i].querySelector('.day').innerHTML = writeday;
        daysElement[i].querySelector('.lunar-day').innerHTML = '';
        daysElement[i].classList.add('item-nolunar');
        //添加today样式
        if (this.tyear == writeyear && this.tday == writeday && this.tmonth == writemonth) {
          this.selectDay = daysElement[i];
          daysElement[i].classList.add("sc-today");
        }
      }
    }
    //刷新标记日期
  }, {
    key: 'clearMark',
    value: function clearMark() {
      this._options.mark = {}
    }
  },{
    key: 'updateMark',
    value: function updateMark(year, month) {
      var options = this._options;
      if (options.showMark) {
        var daysElement = this.arrayfrom(this.container.querySelectorAll('.sc-item'));
        var currentmonth = month - 1;
        //取得节日数据
        var data = options.mark;
        if (data) {
          daysElement.forEach(function (v, i) {
            var day = +v.querySelector('.day').innerHTML;
            if (day == 1) currentmonth++;

            if (data[year + '-' + currentmonth + '-' + day]) {
              v.classList.add('sc-mark');
              v.title = data[year + '-' + currentmonth + '-' + day];
            } else {
              v.classList.remove('sc-mark');
              v.title = '';
            }
          });
        }
      }
    }
  }, {
    key: 'updateEvent',
    value: function updateEvent() {
      var daysElement = this.arrayfrom(this.container.querySelectorAll('.sc-item'));
      var container = this.container;
      var calendar = this;
      daysElement.forEach(function (v, i) {
        v.onmouseover = function (e) {
          this.classList.add('sc-active-day');
        };
        v.onmouseout = function (e) {
          this.classList.remove('sc-active-day');
        };
        v.onclick = function () {
          calendar.selectDay = v;
          var pre = container.querySelector('.sc-selected');
          if (pre) pre.classList.remove('sc-selected');
          this.classList.add('sc-selected');
        };
      });

      var selectYear = container.querySelector('.sc-select-year');
      var selectMonth = container.querySelector('.sc-select-month');
      selectYear.onchange = function () {
        var m = selectMonth.value;
        var y = this.value;
        calendar.update(m, y);
      };

      selectMonth.onchange = function () {
        var y = selectYear.value;
        var m = this.value;
        calendar.update(m, y);
      };

      var yearadd = container.querySelector('.sc-yright');
      var yearsub = container.querySelector('.sc-yleft');
      var monthadd = container.querySelector('.sc-mright');
      var monthsub = container.querySelector('.sc-mleft');

      yearadd.onclick = function () {
        var currentyear = selectYear.value;
        if (currentyear < 2099) currentyear++;
        selectYear.value = currentyear;
        calendar.update(this.tmonth, currentyear);
      };
      yearsub.onclick = function () {
        var currentyear = selectYear.value;
        if (currentyear > 1900) currentyear--;
        selectYear.value = currentyear;
        calendar.update(this.tmonth, currentyear);
      };
      monthadd.onclick = function () {
        var currentmonth = selectMonth.value;
        var currentyear = selectYear.value;
        if (currentmonth < 12) currentmonth++;else {
          currentmonth = 1;
          selectYear.value = ++currentyear;
        };
        selectMonth.value = currentmonth;
        calendar.update(currentmonth, currentyear);
      };
      monthsub.onclick = function () {
        var currentmonth = selectMonth.value;
        var currentyear = selectYear.value;
        if (currentmonth > 1) currentmonth--;else {
          currentmonth = 12;
          selectYear.value = --currentyear;
        }
        selectMonth.value = currentmonth;
        calendar.update(currentmonth, currentyear);
      };

      var returntoday = container.querySelector('.sc-return-today');
      returntoday.onclick = function () {
        selectYear.value = calendar.tyear;
        selectMonth.value = calendar.tmonth;
        calendar.update();
      };
    }
    //添加标记
  }, {
    key: 'addMark',
    value: function addMark(day, info) {
      this._options.mark[day] = info;
      this.update();
    }
    //获取用户点击的日期
  }, {
    key: 'getSelectedDay',
    value: function getSelectedDay() {
      var selectYear = this.container.querySelector('.sc-select-year').value;
      var selectMonth = this.container.querySelector('.sc-select-month').value;
      var selectDay = this.selectDay.querySelector('.day').innerHTML;
      return new Date(selectYear, selectMonth - 1, selectDay);
    }
  }, {
    key: 'arrayfrom',
    value: function arrayfrom(nidelist) {
      var array = [];
      [].forEach.call(nidelist, function (v) {
        array.push(v);
      });
      return array;
    }
  }]);
  return SimpleCalendar;
}();

//时间刷新函数
SimpleCalendar.timeupdate = function () {
  var timespan = document.querySelectorAll('.sc-time');
  var now = new Date();
  var nh = now.getHours();
  var nm = now.getMinutes();
  var ns = now.getSeconds();
  if (nh < 10) nh = '0' + nh;
  if (nm < 10) nm = '0' + nm;
  if (ns < 10) ns = '0' + ns;
  [].forEach.call(timespan, function (v) {
    v.innerHTML = '时间：' + nh + ":" + nm + ':' + ns;
  });
};
//国际化，和一些节日数据，标记数据
SimpleCalendar.prototype.languageData = {
  feativals_CH: {},
  feativals_EN: {},
  lunarFeatival_CH: {},
  solarTerm: {},
  days_EN: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  days_CH: ["一", "二", "三", "四", "五", "六", "日"],
  months_EN: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  months_CH: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
  vocation: {}
};

SimpleCalendar.prototype.tyear = new Date().getFullYear();
SimpleCalendar.prototype.tmonth = new Date().getMonth() + 1;
SimpleCalendar.prototype.tday = new Date().getDate();
