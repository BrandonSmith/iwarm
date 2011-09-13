(function($) {
    
    var recyclable = {},
        appliance = {},
        products = iwarm.Products;
    
    var recyclable_section,
        appliance_section,
        comparison_section,
        recyclable_quantity,
        recyclable_name,
        appliance_quantity,
        appliance_name,
        quantity,
        no_vowel,
        vowel;
        
    var share_template = "By recycling $quantity$ $rec_name$, I saved enough energy to power $app_name$ for $hours$ hours. Calculate here: ";
    var empty_template = "Calculate your energy savings here: ";
    
    var get_share_text = function() {
        var share_text;
        if (recyclable.selected && appliance.selected) {
            var q = quantity.val(),
                rec = products.get_item(recyclable.selected),
                rec_name = rec.friendly_name,
                app = products.get_appliance(appliance.selected),
                app_name = app.friendly_name,
                hours = products.hours_available(recyclable.selected, q, appliance.selected);
            share_text = share_template;
            share_text = share_text.replace('$quantity$', q);
            share_text = share_text.replace('$rec_name$', rec_name);
            share_text = share_text.replace('$app_name$', 'a' + (appliance.selected === 'home_air_conditioner' ? 'n' : '') + ' ' + app_name);
            share_text = share_text.replace('$hours$', hours.toFixed(1));
        } else {
            share_text = empty_template;
        }
        
        return share_text;
    };
    
    $(document).bind('mobileinit', function() {
        $.mobile.page.prototype.options.keepNative = '#quantity';
        $.mobile.fixedToolbars.setTouchToggleEnabled(false);
    });
    
    $(document).bind('keydown', function(event) {
        if ($.mobile.activePage.attr('id') === 'widget-home'
                && recyclable.selected && appliance.selected) {
            var quantity = $('#quantity').val();
            var slider = $('#quantity').data('slider');
            switch ( event.keyCode ) {
                case $.mobile.keyCode.HOME:
                case $.mobile.keyCode.END:
                case $.mobile.keyCode.PAGE_UP:
                case $.mobile.keyCode.PAGE_DOWN:
                case $.mobile.keyCode.UP:
                case $.mobile.keyCode.RIGHT:
                case $.mobile.keyCode.DOWN:
                case $.mobile.keyCode.LEFT:
                    event.preventDefault();
                break;
            }
            
            switch ( event.keyCode ) {
                case $.mobile.keyCode.HOME:
                    slider.refresh( 1 );
                break;
                case $.mobile.keyCode.END:
                    slider.refresh( 50 );
                break;
                case $.mobile.keyCode.PAGE_UP:
                case $.mobile.keyCode.UP:
                case $.mobile.keyCode.RIGHT:
                    slider.refresh( ~~quantity + 1 );
                break;
                case $.mobile.keyCode.PAGE_DOWN:
                case $.mobile.keyCode.DOWN:
                case $.mobile.keyCode.LEFT:
                    slider.refresh( ~~quantity - 1 );
                break;
            }
        }
    });
    
    $('#share').live('pagebeforeshow', function() {
        // https://www.facebook.com/dialog/feed?app_id=238733602839086& link=http://16cards.com&picture=&name=What You Can Do& caption=&description=&message=I+just+saved+36.7+hours&redirect_uri=http://16cards.com
        var twitter = $('#twitter'),
            facebook = $('#facebook');
        
        twitter.attr('href', 'https://twitter.com/share?url=http://1.usa.gov/mS5mrg&text='+encodeURIComponent(get_share_text()))
        
        facebook.click(function() {
            console.log(get_share_text());
        });
    });
    
    $('#widget-home').live('pagecreate', function() {
        var headers = $('div[data-role=header] h1');
        headers.text('');
        
        recyclable_section = $('#recyclables');
        appliance_section = $('#appliances');
        comparison_section = $('#comparison');
        recyclable_quantity = $('#recyclable-quantity');
        recyclable_name = $('#recyclable-name');
        appliance_quantity = $('#appliance-quantity');
        appliance_name = $('#appliance-name');
        quantity = $('#quantity');
        no_vowel = $('.no-vowel', comparison_section);
        vowel = $('.vowel', comparison_section);
        
        var calculate = function() {
            var q = quantity.val(),
                rec = products.get_item(recyclable.selected),
                rec_name = rec.friendly_name,
                app = products.get_appliance(appliance.selected),
                app_name = app.friendly_name,
                hours = products.hours_available(recyclable.selected, q, appliance.selected);
                
            recyclable_quantity.text(q);
            recyclable_name.text(rec_name);
            appliance_quantity.text(hours.toFixed(1));
            appliance_name.text(app_name);
        };

        quantity.slider({change: calculate});

        var comparison_check = function() {
            if (recyclable.selected && appliance.selected) {
                if (appliance.selected === 'home_air_conditioner') {
                    vowel.removeClass('hidden');
                    no_vowel.addClass('hidden');
                } else {
                    vowel.addClass('hidden');
                    no_vowel.removeClass('hidden');
                }
                calculate();
                comparison_section.removeClass('hidden');
                $(".sentence").fitText(1, { minFontSize: '12px' }); //, maxFontSize: '36px'
                $(".big-number").fitText(0.5, { minFontSize: '32px' }); //, maxFontSize: '120px'
            } else {
                //console.log('blank');
                comparison_section.addClass('hidden');
            }
        };

        // recyclables handling
        recyclable_section.find('a').click(function(e) {
            var li = $(this).parents('li');
            if (!li.hasClass('selected')) {
                var others = li.siblings(),
                    title = recyclable_section.find('h6'),
                    selected_recyclable = $(e.target).attr('data-type');
                //console.log(selected_recyclable);
                recyclable.selected = selected_recyclable;
                recyclable_section.addClass('top-spacer');
                title.hide();
                others.hide();
                li.addClass('selected ui-disabled').removeClass('ui-btn-hover-d');
                var del_section = $('<div class="delete-section"><a href="#" data-role="button" data-icon="delete" data-iconpos="notext">delete</a></div>');
                del_section.find('a').click(function() {
                    recyclable = {};
                    recyclable_section.removeClass('top-spacer');
                    li.removeClass('selected ui-disabled');
                    title.show();
                    li.show().removeClass('ui-btn-hover-d').addClass('ui-btn-up-d');
                    others.show().removeClass('ui-btn-hover-d').addClass('ui-btn-up-d');
                    del_section.remove();
                    comparison_check();
                }).button();
                recyclable_section.append(del_section);
                comparison_check();
            }
        });

        // appliances handling
        appliance_section.find('a').click(function(e) {
            var li = $(this).parents('li');
            if (!li.hasClass('selected')) {
                var others = li.siblings(),
                    title = appliance_section.find('h6'),
                    selected_appliance = $(e.target).attr('data-type');
                //console.log(selected_appliance);
                appliance.selected = selected_appliance;
                appliance_section.addClass('top-spacer');
                title.hide();
                others.hide();
                li.addClass('selected ui-disabled').removeClass('ui-btn-hover-d');
                var del_section = $('<div class="delete-section"><a href="#" data-role="button" data-icon="delete" data-iconpos="notext">delete</a></div>');
                del_section.find('a').click(function() {
                    appliance = {};
                    appliance_section.removeClass('top-spacer');
                    li.removeClass('selected ui-disabled');
                    title.show();
                    li.show().removeClass('ui-btn-hover-d').addClass('ui-btn-up-d');
                    others.show().removeClass('ui-btn-hover-d').addClass('ui-btn-up-d');
                    del_section.remove();
                    comparison_check();
                }).button();
                appliance_section.append(del_section);
                comparison_check();
            }
        });
    });
})(jQuery);
