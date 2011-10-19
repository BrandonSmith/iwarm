// ensure a wycd object
window.wycd = window.wycd || {};

(function(w) {
    // default options
    var options = {
        protocol: 'http:',
        host: 'localhost',
        path: '/iwarm/widget'
    };

    // copy options into own namespace
    for (var key in w) {
        options[key] = w[key];
        //delete w[key];
    }
    w.options = options;

    // create the widget object
    w.Widget = function() {};
    w.Widget.prototype = {
        // IE has rendering quirks between various versions; use BrowserDetect
        // anduse these dimensions
        tall: {
            path: 'tall.html',
            defaultdefault: {width:'270px',height:'369px'},
            MSIE7: {width:'270px',height:'405px'},
            MSIE8: {width:'270px',height:'400px'},
            MSIE9: {width:'270px',height:'373px'}
        },
        // wide widget is actually pretty reasonable for IE
        wide: {
            path: 'wide.html',
            defaultdefault: {width:'800px',height:'130px'},
            MSIE7: {width:'800px',height:'130px'},
            MSIE8: {width:'800px',height:'130px'},
            MSIE9: {width:'800px',height:'130px'}
        },
        init: function(type) {
            var widgetType = type || 'tall',
                url = w.options.protocol + w.options.host + w.options.path + this[widgetType].path + serializeOptions(),
                browser = BrowserDetect.browser+BrowserDetect.version,
                dimensions = this[widgetType][browser],
                iframe = '<div style="line-height:0"><iframe src="'+url+'" width="'+dimensions.width+'" height="'+dimensions.height+'" scrolling="no" seamless="seamless" frameBorder="0" style="border: 1px solid #000;"></iframe></div>';
            document.write(iframe);
        }
    };

    // encodes options to pass to embedded widget
    var serializeOptions = function() {
        var key,
            str = [],
            obj = w.options;
        // loop over each option and URL encode
        for (key in obj) {
            str.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }
        // concat to query string
        return (str.length > 0) ? '?'+str.join('&') : '';
    };

    // browser detection logic
    var BrowserDetect = {
        // extract browser and version
        init: function () {
            this.browser = this.searchString(this.dataBrowser) || 'default';
            this.version = this.searchVersion(navigator.userAgent)
                || this.searchVersion(navigator.appVersion)
                || 'default';
        },
        searchString: function (data) {
            for (var i=0;i<data.length;i++) {
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
        // we are only interested in IE, add more if different dimensions per
        // browser/version are necessary
        dataBrowser: [
            {
                string: navigator.userAgent,
                subString: "MSIE",
                identity: "MSIE",
                versionSearch: "MSIE"
            }
        ]
    };
    // set up
    BrowserDetect.init();

}(window.wycd));
