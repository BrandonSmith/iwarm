(function($, iwarm) {
    $(document).ready(function() {
        
        var OPTION = "<option></option>";
        
        var products = iwarm.Products;
        var conversions = iwarm.Conversion;
        var util = iwarm.Utils;
        
        var quantity_field = $("#quantity");
        var item_field = $("#item");
        var btus_field = $("#btus");
        var appliance_field = $("#appliance");
        var hours_field = $("#hours");
        
        // set up change handlers
        var change = function() {
            var quantity = quantity_field.val();
            var item = item_field.val();
            var appliance = appliance_field.val();
            
            if (/^\d+$/.test(quantity)) {
                quantity = parseInt(quantity);
                var btus = products.calculate_net_energy_savings(item, quantity);
                var hours = products.hours_available(item, quantity, appliance);
                btus_field.val(btus);
                hours_field.val(hours);
            } else {
                console.log('not a number');
            }
        };
        quantity_field.change(change);
        item_field.change(change);
        btus_field.change(change);
        appliance_field.change(change);
        hours_field.change(change);
        
        // set up selects
        var items = products.get_items();
        var appliances = products.get_appliances();
        
        $.each(items, function(k, v) {
            item_field.append($(OPTION).val(k).html(v.name));
        });
        
        $.each(appliances, function(k, v) {
            appliance_field.append($(OPTION).val(k).html(v.name));
        });
        
    });

})(jQuery, iwarm);