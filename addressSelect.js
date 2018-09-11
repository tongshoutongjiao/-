function getObjectAddressList(source) {
    var addressList = [];
    for (var i = 0; i < source.length; i++) {
        addressList.push( {id: i, name:source[i].name});
    }
    return addressList;
}

function getArrayAddressList(source) {
    var addressList = [];
    for (var i = 0; i < source.length; i++) {
        addressList.push( {id: i, name:source[i]});
    }
    return addressList;
}

var addressSelectHelp = {

    // 获取省列表
    getProvinceList: function(selectResult) {
        return getObjectAddressList(city);
    },

    // 获取市列表
    getCityList: function(selectResult) {
        if (selectResult.province == null || selectResult.province == -1) {
            return [];
        }
        return getObjectAddressList(city[selectResult.province].city);
    },

    // 获取县列表
    getCountyList: function(selectResult) {
        if (selectResult.city == null || selectResult.city == -1) {
            return [];
        }

        return getArrayAddressList(city[selectResult.province].city[selectResult.city].area);
    }
}

// 地址选择对象
var addressSelect = (function(addressSelectHelp) {
  console.log('测试测试测试');

    /*
     * 地址选择对象
     * @param root 选择器，生成地址选择对象的节点
     * @param result 初始化选择结果
     * @param rechangeCallbackult 选择改变后的callback
     *
     */
    function addressSelect(root, result, changeCallback) {
        this.$root = $(root);
        console.log('根元素');
        console.log(this);
        this.init(result, changeCallback);

    }

    // 地址选择初始化
    addressSelect.prototype.init = function (result, changeCallback) {
        var that = this;

        // 省
        this.$province = $("<select>");
        // 市
        this.$city = $("<select>");
        // 县
        this.$county = $("<select>");

        this.$root.append(this.$province);
        this.$root.append(this.$city);
        this.$root.append(this.$county);

        this.result = result || {province: null, city: null, county: null},

            // 省下拉框内容
            initOptions(this.$province, addressSelectHelp.getProvinceList(this.result), this.result.province);
        // 市下拉框内容
        initOptions(this.$city, addressSelectHelp.getCityList(this.result), this.result.city);
        // 县下拉框内容
        initOptions(this.$county, addressSelectHelp.getCountyList(this.result), this.result.county);

        this.$province.change(function() {
            that.result.province = that.$province.val()
            that.result.city = null;
            that.result.county = null;

            // 市下拉框内容
            initOptions(that.$city, addressSelectHelp.getCityList(that.result), that.result.city);
            // 县下拉框内容
            initOptions(that.$county, addressSelectHelp.getCountyList(that.result), that.result.county);

            changeCallback&&changeCallback(that.result);
        });
        this.$city.change(function() {
            that.result.city = that.$city.val();
            that.result.county = null;

            // 县下拉框内容
            initOptions(that.$county, addressSelectHelp.getCountyList(that.result), that.result.county);

            changeCallback&&changeCallback(that.result);
        });
        this.$county.change(function() {
            that.result.county = that.$county.val();

            changeCallback&&changeCallback(that.result);
        });
    }

    // 地址选择获取结果
    addressSelect.prototype.getResult = function() {
        return this.result;
    }

    // 构建下拉选择option
    var initOptions = function($select, addressList, selectedValue) {
        $select.empty();

        $select.append("<option value=\"-1\">请选择</option>");

        for (var i = 0; i < addressList.length; i++) {
            $select.append("<option value=\"" + addressList[i].id +  "\">" + addressList[i].name +"</option>");
        };

        $select.val(selectedValue || -1);
    }

    return addressSelect;
})(addressSelectHelp)
