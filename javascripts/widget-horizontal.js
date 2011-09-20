(function($) {
    
    var recyclable = {},
        appliance = {},
        products = iwarm.Products;
    
    var recyclable_section,
        appliance_section,
        comparison_section,
        share_section,
        selection_section,
        recyclable_quantity,
        recyclable_name,
        appliance_quantity,
        appliance_name,
        quantity,
        no_vowel,
        vowel,
        twitter,
        facebook;
        
    var share_template = "By recycling $quantity$ $rec_name$, I saved enough energy to power $app_name$ for $hours$ hours.";
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
    
    $('#widget-home').live('pagecreate', function() {
        var headers = $('div[data-role=header] h1');
        headers.text('');
        
        recyclable_section = $('#recyclables');
        appliance_section = $('#appliances');
        comparison_section = $('#comparison');
        share_section = $('#share-section');
        selection_section = $('#selection');
        recyclable_quantity = $('#recyclable-quantity');
        recyclable_name = $('#recyclable-name');
        appliance_quantity = $('#appliance-quantity');
        appliance_name = $('#appliance-name');
        quantity = $('#quantity');
        no_vowel = $('.no-vowel', comparison_section);
        vowel = $('.vowel', comparison_section);
        twitter = $('#twitter');
        facebook = $('#facebook');
        
        var choose_header = $('.choose.slide');
        var do_hide = true;
        
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
            twitter.attr('href', 'https://twitter.com/share?url=http://1.usa.gov/mS5mrg&text='+encodeURIComponent(get_share_text())+' Calculate here:')
            facebook.attr('href', 'https://www.facebook.com/dialog/feed?app_id=148678911893871&display=popup&link=http://16cards.com&picture=http://www.epa.gov/epafiles/images/logo_epaseal.gif&name=How Much Energy Can You Save by Recycling?&redirect_uri=http://epastaging.michaeldbaker.com/orcr/widget.html&description=We can have an additional text area here&caption='+encodeURIComponent(get_share_text()));
        };
        
        var hide_and_calculate = function() {
            calculate();
            if (do_hide) {
                do_hide = false;
                choose_header.fadeOut(500, function() {
                    choose_header.hide();
                });
            }
        }

        quantity.slider({change: hide_and_calculate});

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
                share_section.removeClass('hidden');
                selection_section.addClass('selected');
                //$(".sentence").fitText(1, { minFontSize: '12px' }); //, maxFontSize: '36px'
                //$(".big-number").fitText(0.5, { minFontSize: '32px' }); //, maxFontSize: '120px'
                
                var arrow = $('.arrow', choose_header);
                var slider_btn = $('.ui-slider-handle');
                var slider_btn_coords = slider_btn.offset();
                arrow.offset({
                    top: slider_btn_coords.top + slider_btn.height() + 5,
                    left: slider_btn_coords.left + (slider_btn.width() / 2)
                })
            } else {
                comparison_section.addClass('hidden');
                share_section.addClass('hidden');
                selection_section.removeClass('selected');
            }
        };

        // recyclables handling
        recyclable_section.find('a').click(function(e) {
            var li = $(this);
            if (!li.hasClass('selected')) {
                var others = li.siblings('a'),
                    title = recyclable_section.find('.choose'),
                    selected_recyclable = li.attr('data-type');
                recyclable.selected = selected_recyclable;
                title.hide();
                others.hide();
                li.data('left', li.hasClass('ui-corner-left'));
                li.data('right', li.hasClass('ui-corner-right'));
                li.addClass('selected ui-disabled ui-corner-left ui-corner-right').removeClass('ui-btn-hover-d');
                var del_section = $('<div class="delete-section"><a href="#" data-role="button" data-icon="delete" data-iconpos="notext">delete</a></div>');
                del_section.find('a').click(function() {
                    recyclable = {};
                    if (!li.data('left')) {
                        li.removeClass('ui-corner-left');
                    }
                    if (!li.data('right')) {
                        li.removeClass('ui-corner-right');
                    }
                    li.removeClass('selected ui-disabled');
                    title.show();
                    li.show().removeClass('ui-btn-hover-d').addClass('ui-btn-up-d');
                    others.show().removeClass('ui-btn-hover-d').addClass('ui-btn-up-d');
                    del_section.remove();
                    comparison_check();
                }).button();
                recyclable_section.append(del_section);
                comparison_check();
                appliance_section.find('.preview-list-section').hide();
                appliance_section.find('.list-section').show();
            }
        });

        // appliances handling
        appliance_section.find('a').click(function(e) {
            var li = $(this);
            if (!li.hasClass('selected')) {
                var others = li.siblings('a'),
                    title = appliance_section.find('.choose'),
                    selected_appliance = li.attr('data-type');
                appliance.selected = selected_appliance;
                title.hide();
                others.hide();
                li.data('left', li.hasClass('ui-corner-left'));
                li.data('right', li.hasClass('ui-corner-right'));
                li.addClass('selected ui-disabled ui-corner-left ui-corner-right').removeClass('ui-btn-hover-d');
                var del_section = $('<div class="delete-section"><a href="#" data-role="button" data-icon="delete" data-iconpos="notext">delete</a></div>');
                del_section.find('a').click(function() {
                    appliance = {};
                    if (!li.data('left')) {
                        li.removeClass('ui-corner-left');
                    }
                    if (!li.data('right')) {
                        li.removeClass('ui-corner-right');
                    }
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

window.fbAsyncInit = function() {
    FB.init({
      appId  : '148678911893871',
      status : false
    });
}