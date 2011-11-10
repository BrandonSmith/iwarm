;(function($, w) {
    // holds users recyclable item and appliance selection
    var recyclable = {},
        appliance = {},
        products = w.Products

    // these hold references to jQuery DOM elements
    // initialized below
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
        facebook,
        embed,
        embed_action,
        back;

    // sharing text templates
    var share_template = "By recycling $quantity$ $rec_name$, I saved enough energy to power $app_name$ for $hours$ hours. ";
    var empty_template = "Make your own calculations with our iWARM widget!";
    var f_suffix = empty_template;
    var t_suffix = "Calculate here: ";
    var twitter_prefix = "How much energy can you save by recycling? ";
    // returns dynamic sharing based on whether the user has selected or not
    // selected
    var get_share_text = function(t) {
        var share_text;
        if (recyclable.selected && appliance.selected) {
            // user has selected, populate the template
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
            share_text += (t ? t_suffix : f_suffix);
        } else {
            // user has NOT selected, return basic template
            share_text = (t ? twitter_prefix : '') + empty_template;
        }
        return share_text;
    };

    $(document).bind('mobileinit', function() {
        // prevent jQuery Mobile from optimizing quantity page
        $.mobile.page.prototype.options.keepNative = '#quantity';
        // prevent jQuery Mobile from disappearing fixed footers
        $.mobile.fixedToolbars.setTouchToggleEnabled(false);
    });

    // global page bindings for arrow keys
    $(document).bind('keydown', function(event) {
        if ($.mobile.activePage.attr('id') === 'widget-home'
                && recyclable.selected && appliance.selected) {
            // only run logic when the compare page is display
            var quantity = $('#quantity').val();
            var slider = $('#quantity').data('slider');
            // prevent default action for the following events
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
                // go to the beginning of the slider
                case $.mobile.keyCode.HOME:
                    slider.refresh( 1 );
                break;
                // go to the end of the slider
                case $.mobile.keyCode.END:
                    slider.refresh( 50 );
                break;
                // step forward 1
                case $.mobile.keyCode.PAGE_UP:
                case $.mobile.keyCode.UP:
                case $.mobile.keyCode.RIGHT:
                    slider.refresh( ~~quantity + 1 );
                break;
                // step backward 1
                case $.mobile.keyCode.PAGE_DOWN:
                case $.mobile.keyCode.DOWN:
                case $.mobile.keyCode.LEFT:
                    slider.refresh( ~~quantity - 1 );
                break;
            }
        }
    });

    // home page setup
    $('#widget-home').live('pagecreate', function() {
        // remove all page header text... doesn't look nice and we are using
        // images on the home page anyways
        var headers = $('div[data-role=header] h1');
        headers.text('');

        // get all necessary jQuery references
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
        facebook = $('#facebook'),
        embed = $('#embed'),
        embed_action = $('#embed_action'),
        back = $('#back');

        // embed and back actions... display and hide views
        embed_action.click(function() {
            var mode = embed.data('mode');
            if (!mode) {
                var is_select = comparison_section.hasClass('hidden');
                comparison_section.addClass('hidden');
                selection_section.addClass('hidden');
                embed.removeClass('hidden').data('mode', is_select ? 'selection' : 'comparison');
            }

        });
        back.click(function() {
            var mode = embed.data('mode');
            embed.addClass('hidden').removeData('mode');
            selection_section.removeClass('hidden');
            if (mode === 'comparison') {
                comparison_section.removeClass('hidden');
            }
        });

        var choose_header = $('.choose.slide');
        var do_hide = true;

        // help and arrow references
        var recyclable_help_title = $('.help.title', recyclable_section);
        var recyclable_help_arrow = $('.help.arrow', recyclable_section);
        var appliance_help_title = $('.help.title', appliance_section);
        var appliance_help_arrow = $('.help.arrow', appliance_section);

        // sharing template setup function
        var do_share_links = function() {
            twitter.attr('href', 'https://twitter.com/share?url=http://www.epa.gov/iwarm&text='+encodeURIComponent(get_share_text(true)));
            facebook.attr('href', 'https://www.facebook.com/dialog/feed?app_id=148678911893871&display=page&link=https://www.epa.gov/wastes/conserve/tools/iwarm/widgets/&picture=http://epa.gov/wastes/conserve/tools/iwarm/widgets/images/epa-for-facebook.png&name=How Much Energy Can You Save by Recycling?&redirect_uri=http://epa.gov/wastes/conserve/tools/iwarm/widgets/&description=%20&caption='+encodeURIComponent(get_share_text(false)));
        };
        do_share_links(); // call initially to ensure some content... will change after selection made

        // here is the grand calculate function... this is bound to various
        // events and user interactions... for instance, the slider changing
        // quantity values
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
            do_share_links();
        };
        // hide the fancy slider help text after first change
        var hide_and_calculate = function() {
            calculate();
            if (do_hide) {
                do_hide = false;
                choose_header.fadeOut(500, function() {
                    choose_header.hide();
                });
            }
        }
        // bind hind and calculate functionality slider changes
        quantity.slider({change: hide_and_calculate});

        // empty function
        var go_default = function() {};

        // checks if both recyclable and appliance are selected...
        // if so, compare UI is displayed
        var comparison_check = function() {
            if (recyclable.selected && appliance.selected) {
                // 'a' vs. 'an' logic in sentence
                if (appliance.selected === 'home_air_conditioner') {
                    vowel.removeClass('hidden');
                    no_vowel.addClass('hidden');
                } else {
                    vowel.addClass('hidden');
                    no_vowel.removeClass('hidden');
                }
                // run calculation logic
                calculate();
                // show compare UI
                comparison_section.removeClass('hidden');
                selection_section.addClass('selected');
                var arrow = $('.arrow', choose_header);
                var slider_btn = $('.ui-slider-handle');
                var slider_btn_coords = slider_btn.offset();
                arrow.offset({
                    top: slider_btn_coords.top + slider_btn.height() + 5,
                    left: slider_btn_coords.left + (slider_btn.width() / 2)
                })
            } else {
                // if user has not selected both, ensure compare UI is hidden
                comparison_section.addClass('hidden');
                selection_section.removeClass('selected');
            }
        };

        // recyclables handling
        recyclable_section.find('a').click(function(e) {
            var li = $(this);
            if (!li.hasClass('selected')) {
                var others = li.siblings('a'),
                    title = $('.help'),
                    selected_recyclable = li.attr('data-type'),
                    list_section = recyclable_section.find('.list-section');
                // UI elements setup to hide list and show selected recyclable
                recyclable.selected = selected_recyclable;
                title.hide();
                others.hide();
                li.data('left', li.hasClass('ui-corner-left'));
                li.data('right', li.hasClass('ui-corner-right'));
                li.addClass('selected ui-disabled ui-corner-left ui-corner-right').removeClass('ui-btn-hover-d');
                list_section.addClass('selected');

                // following click handler removes a recyclable selection and
                // resets the recyclable column UI
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
                    li.show().removeClass('ui-btn-hover-d').addClass('ui-btn-up-d');
                    others.show().removeClass('ui-btn-hover-d').addClass('ui-btn-up-d');
                    list_section.removeClass('selected');
                    del_section.remove();
                    comparison_check();
                }).button(); // sets up the X button
                recyclable_section.append(del_section);

                // swap UI show/hide
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
                    title = appliance_section.find('.help'),
                    selected_appliance = li.attr('data-type'),
                    list_section = appliance_section.find('.list-section');
                // UI elements setup to hide list and show selected appliance
                appliance.selected = selected_appliance;
                title.hide();
                recyclable_help_title.hide();
                recyclable_help_arrow.hide();
                others.hide();
                li.data('left', li.hasClass('ui-corner-left'));
                li.data('right', li.hasClass('ui-corner-right'));
                li.addClass('selected ui-disabled ui-corner-left ui-corner-right').removeClass('ui-btn-hover-d');
                list_section.addClass('selected');

                // following click handler removes a appliance selection and
                // resets the appliance column UI
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
                    li.show().removeClass('ui-btn-hover-d').addClass('ui-btn-up-d');
                    others.show().removeClass('ui-btn-hover-d').addClass('ui-btn-up-d');
                    list_section.removeClass('selected');
                    del_section.remove();
                    comparison_check();
                }).button(); // sets up the X button

                // swap UI show/hide
                appliance_section.append(del_section);
                comparison_check();
            }
        });

        // change the embed code dynamically
        $('#copy-code').val(w.ShareTemplate.replace('%%TYPE%%', 'wide'));
    });
}(jQuery, wycd));

// Facebook setup
window.fbAsyncInit = function() {
    FB.init({
      appId  : '148678911893871',
      status : false
    });
};
