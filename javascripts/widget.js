$(document).bind("mobileinit", function() {
    $.mobile.page.prototype.options.keepNative = '#quantity';
});

$('#widget-home').live('pagecreate', function() { //$(function(){
    var headers = $('div[data-role=header] h1');
    headers.text('');
    
    $(".sentence").fitText(1, { minFontSize: '12px', maxFontSize: '36px' });
    $(".big-number").fitText(1, { minFontSize: '36px', maxFontSize: '120px' });
    
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
        appliance_quantity.text(hours.toFixed(2));
        appliance_name.text(app_name);
    };
    
    quantity.slider({change: calculate});
    
    var comparison_check = function() {
        if (recyclable.selected && appliance.selected) {
            //console.log(recyclable.selected + ' vs ' + appliance.selected);
            calculate();
            comparison_section.removeClass('hidden');
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
            title.hide();
            others.hide();
            li.addClass('selected ui-disabled').removeClass('ui-btn-hover-d');
            var del_section = $('<div class="delete-section"><a href="#" data-role="button" data-icon="delete" data-iconpos="notext">delete</a></div>');
            del_section.find('a').click(function() {
                recyclable = {};
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
            title.hide();
            others.hide();
            li.addClass('selected ui-disabled').removeClass('ui-btn-hover-d');
            var del_section = $('<div class="delete-section"><a href="#" data-role="button" data-icon="delete" data-iconpos="notext">delete</a></div>');
            del_section.find('a').click(function() {
                appliance = {};
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