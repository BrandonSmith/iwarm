$(document).bind("mobileinit", function() {
    $.mobile.page.prototype.options.keepNative = '#quantity';
    $.mobile.fixedToolbars.setTouchToggleEnabled(false);
});

$('#widget-home').live('pagecreate', function() { //$(function(){
    var headers = $('div[data-role=header] h1');
    headers.text('');
    
    var recyclable = {},
        recyclable_section = $('#recyclables'),
        appliance = {},
        appliance_section = $('#appliances'),
        comparison_section = $('#comparison'),
        recyclable_quantity = $('#recyclable-quantity'),
        recyclable_name = $('#recyclable-name'),
        appliance_quantity = $('#appliance-quantity'),
        appliance_name = $('#appliance-name'),
        quantity = $('#quantity'),
        no_vowel = $('.no-vowel', comparison_section),
        vowel = $('.vowel', comparison_section),
        products = iwarm.Products;
    
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