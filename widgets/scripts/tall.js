;(function($, w) {
    // holds users recyclable item and appliance selection
    var recyclable = {},
        appliance = {},
        products = w.Products;

    // these hold references to jQuery DOM elements
    // initialized below
    var recyclable_section,
        appliance_section,
        comparison_section,
        recyclable_quantity,
        recyclable_name,
        appliance_quantity,
        appliance_name,
        quantity,
        no_vowel,
        vowel,
        widget_home,
        embed,
        share,
        share_back,
        share_link,
        embed_back,
        embed_link;

    // sharing text templates
    var share_template = "By recycling $quantity$ $rec_name$, I saved enough energy to power $app_name$ for $hours$ hours."
    var empty_template = "Make your own calculations with our iWARM widget!"
    // returns dynamic sharing based on whether the user has selected or not
    // selected
    var get_share_text = function() {
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
        } else {
            // user has NOT selected, return basic template
            share_text = empty_template;
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

    // before the sharing page is shown, alter the twitter and facebook links
    $('#share').live('pagebeforeshow', function() {
        var twitter = $('#twitter'),
            facebook = $('#facebook');

        twitter.attr('href', 'https://twitter.com/share?url=http://1.usa.gov/mS5mrg&text='+encodeURIComponent(get_share_text()));
        facebook.attr('href', 'https://www.facebook.com/dialog/feed?app_id=148678911893871&display=popup&link=http://16cards.com&picture=http://epastaging.michaeldbaker.com/orcr/images/epa_seal.gif&name=How Much Energy Can You Save by Recycling?&redirect_uri=http://epastaging.michaeldbaker.com/orcr/widget.html&description=&caption='+encodeURIComponent(get_share_text()));
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
        recyclable_quantity = $('#recyclable-quantity');
        recyclable_name = $('#recyclable-name');
        appliance_quantity = $('#appliance-quantity');
        appliance_name = $('#appliance-name');
        quantity = $('#quantity');
        no_vowel = $('.no-vowel', comparison_section);
        vowel = $('.vowel', comparison_section);
        widget_home = $('#widget-home');
        embed = $('#embed');
        share = $('#share');
        share_back = $('#share-back');
        share_link = $('.share-link');
        embed_back = $('#embed-back');
        embed_link = $('.embed-link');

        // next few functions solve issues with IE 7 & 8 with navigating using
        // the URL hash... didn't work. so these functions and bindings
        // override the jQuery Mobile defaults and do it manually

        // re-usable function to get back to the home page
        var go_home = function() {
            $.mobile.changePage(widget_home, {
                changeHash: false,
                reverse: true
            });
        };

        // bind the go_home function to the back buttons on the share and embed
        // pages
        share_back.click(go_home);
        embed_back.click(go_home);

        // manually switch to share page... don't trust jQuery Mobile
        share_link.click(function() {
            $.mobile.changePage(share, {
                changeHash: false
            });
        });

        // manually switch to embed page... don't trust jQuery Mobile
        embed_link.click(function() {
            $.mobile.changePage(embed, {
                changeHash: false
            });
        });

        // END jQuery Mobile navigation default overrides

        var choose_header = $('.choose.slide');
        var do_hide = true;


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
                // run calculatioin logic
                calculate();
                // show compare UI
                comparison_section.removeClass('hidden');
                // dynamically resize text
                $(".sentence").fitText(1, { minFontSize: '12px' }); //, maxFontSize: '36px'
                $(".big-number").fitText(0.5, { minFontSize: '32px' }); //, maxFontSize: '120px'
                // position slider help arrows
                var arrow = $('.arrow', choose_header);
                var slider_btn = $('.ui-slider-handle');
                var slider_btn_coords = slider_btn.offset();
                arrow.offset({
                    top: slider_btn_coords.top + slider_btn.height() + 5,
                    left: slider_btn_coords.left + (slider_btn.width() / 2)
                });
            } else {
                // if user has not selected both, ensure compare UI is hidden
                comparison_section.addClass('hidden');
            }
        };

        // recyclables handling
        recyclable_section.find('a').click(function(e) {
            var li = $(this).parents('li');
            if (!li.hasClass('selected')) {
                var others = li.siblings(),
                    title = recyclable_section.find('.choose'),
                    selected_recyclable = $(e.target).attr('data-type');
                // UI elements setup to hide list and show selected recyclable
                recyclable.selected = selected_recyclable;
                recyclable_section.addClass('top-spacer');
                title.hide();
                others.hide();
                li.addClass('selected ui-disabled').removeClass('ui-btn-hover-d');

                // following click handler removes a recyclable selection and
                // resets the recyclable column UI
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
            var li = $(this).parents('li');
            if (!li.hasClass('selected')) {
                var others = li.siblings(),
                    title = appliance_section.find('.choose'),
                    selected_appliance = $(e.target).attr('data-type');
                // UI elements setup to hide list and show selected appliance
                appliance.selected = selected_appliance;
                appliance_section.addClass('top-spacer');
                title.hide();
                others.hide();
                li.addClass('selected ui-disabled').removeClass('ui-btn-hover-d');

                // following click handler removes a appliance selection and
                // resets the appliance column UI
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
                }).button(); // sets up the X button

                // swap UI show/hide
                appliance_section.append(del_section);
                comparison_check();
            }
        });
        // change the embed code dynamically
        $('#copy-code').val(w.ShareTemplate.replace('%%TYPE%%', 'tall'));
    });
}(jQuery, wycd));

// Facebook setup
window.fbAsyncInit = function() {
    FB.init({
      appId  : '148678911893871',
      status : false
    });
};
