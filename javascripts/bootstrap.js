var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || 'default';
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| 'default';
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "MSIE",
			versionSearch: "MSIE"
		}
	]
};
BrowserDetect.init();

window.iwarm = window.iwarm || {};

(function(w) {
    var baseUrl = '',
        widget_count = 0;

    w.Widget = function() {};

    w.Widget.prototype = {
        tall: {
            url: 'layout_2.html',
            defaultdefault: {width:'270px',height:'373px'},
            MSIE7: {width:'270px',height:'413px'},
            MSIE8: {width:'270px',height:'400px'},
            MSIE9: {width:'270px',height:'373px'}
        },
        wide: {
            url: 'layout_1.html',
            defaultdefault: {width:'800px',height:'130px'},
            MSIE7: {width:'800px',height:'130px'},
            MSIE8: {width:'800px',height:'130px'},
            MSIE9: {width:'800px',height:'130px'}
        },
        init: function(type) {
            var _this = this,
                widgetType = type || 'tall',
                url = baseUrl + this[widgetType].url,
                browser = BrowserDetect.browser+BrowserDetect.version,
                dimensions = this[widgetType][browser],
                iframe = '<div style="line-height:0"><iframe src="'+url+'" width="'+dimensions.width+'" height="'+dimensions.height+'" scrolling="no" seamless="seamless" frameBorder="0" style="border: 1px solid #000;"></iframe></div>';
            document.write(iframe);
        }
    };
}(window.iwarm));
