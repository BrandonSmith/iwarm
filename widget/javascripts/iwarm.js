// ensure a wycd object
window.wycd = window.wycd || {};

;(function(w) {
    // Products object
    w.Products = {
        items:null,
        appliances:null,
        initialize: function() {
            // add all the items
            //      short_name: key used behind the scenes for correlation
            //      friendly_name: used for display purposes in the compare
            //      name: not actually used
            //      weight: is per unit precalculated from iWARM spreadsheet
            //      savings: is per unit btus precalculated from iWARM spreadsheet
            this.items = {};
            this.add_item({short_name:"aluminum_can",friendly_name:'aluminum cans',name:"Aluminum can (12 fl. oz.)",weight:0.02923121894183,savings:-206.949619523587});
            this.add_item({short_name:"glass_bottle",friendly_name:'glass bottles',name:"Glass bottle (12 fl. oz.)",weight:22/24,savings:-2.65280981969929});
            this.add_item({short_name:"plastic_bag",friendly_name:'plastic bags',name:"Plastic Grocery Bag",weight:0.77/100,savings:-51.431427964035});
            this.add_item({short_name:"plastic_bottle",friendly_name:'plastic bottles',name:"Plastic Bottle (20 fl. oz.)",weight:0.055555555555556,savings:-53.3593464139873});
            this.add_item({short_name:"newspaper",friendly_name:'newspapers',name:"Daily Newspaper",weight:0.8125,savings:-16.9024813798736});
            this.add_item({short_name:"magazine",friendly_name:'magazines',name:"Weekly Magazine",weight:3/10,savings:-1.08711086042437});
            
            // add all the appliances
            //      short_name: key used behind the scenes for correlation
            //      friendly_name: used for display purposes in the compare
            //      name: not actually used
            //      kilowatt: is per hour usage precalculated from iWARM
            this.appliances = {};
            this.add_appliance({short_name:"home_air_conditioner",friendly_name:'air conditioner', name:"Home air conditioner", kilowatt:1.5});
            this.add_appliance({short_name:"hair_dryer",friendly_name:'hair dryer', name:"Hair dryer", kilowatt:1.5375});
            this.add_appliance({short_name:"60W_CFL_lightbulb",friendly_name:'60W CFL lightbulb', name:"60 watt lightbulb", kilowatt:0.013});
            this.add_appliance({short_name:"laptop",friendly_name:'laptop', name:"Laptop", kilowatt:0.05});
        },
        // returns all appliances
        get_appliances: function() {
            return this.appliances;
        },
        // returns all items
        get_items: function() {
            return this.items;
        },
        // adds one appliance, keyed by short_name
        add_appliance: function(appliance) {
            if (!this.appliances)
                this.appliances = {};
            this.appliances[appliance.short_name] = appliance;
        },
        // return an appliance by short_name
        get_appliance: function(appliance_name) {
            return this.appliances[appliance_name];
        },
        // adds one item, keyed by short_name
        add_item: function(item) {
            if (!this.items)
                this.items = {};
            this.items[item.short_name] = item;
        },
        // return an item by short_name
        get_item: function(item_name) {
            return this.items[item_name];
        },
        // calculates energy savings in btu units
        calculate_net_energy_savings: function(item_name, num_units) {
            var c = w.Conversion;
            var item = this.get_item(item_name);
            var total_weight = (item.weight * num_units) / c.pounds_per_ton;
            var million_btu = item.savings * total_weight;
            var thousand_btu = million_btu * 1000;
            return Math.abs(thousand_btu);
        },
        // gets the electricity equivalent of a number os items
        electricity_equivalent: function(item_name, num_units) {
            var c = w.Conversion;
            var net_energy_savings = this.calculate_net_energy_savings(item_name, num_units);
            var calc_electricity_equivalent = net_energy_savings / c.delivered_electricity_equivalent_1000_btu_per_kwh;
            return calc_electricity_equivalent;
        },
        // calculates the number hours an appliance be powered of a number of
        // items
        hours_available: function(item_name, num_units, appliance_name) {
            var electricity_equivalent = this.electricity_equivalent(item_name, num_units);
            var appliance = this.get_appliance(appliance_name);
            var hours_available = electricity_equivalent / appliance.kilowatt;
            return hours_available;
        }
    };

    // Conversion object holds all of the, well, conversions from iWARM
    // spreadsheet
    w.Conversion = {
        pounds_per_ton:null,
        metric_ton_per_short_ton:null,
        thousand_btu_per_mmbtu:null,
        btu_to_moto:null,
        joule_per_mj:null,
        btu_per_joule:null,
        thousand_btu_per_btu:null,
        thousand_bum:null,
        million_bum:null,
        bum:null,
        assumption_1:null,
        mmbtu_per_kwh:null,
        kwh_per_mj:null,
        assumption_2:null,
        btu_per_kwh_output:null,
        upstream_electricity_equivalent:null,
        delivered_electricity_equivalent_mmbtu_per_kwh:null,
        delivered_electricity_equivalent_1000_btu_per_kwh:null,
        transmission_and_distribution_losses:null,
        initialize: function() {
            this.pounds_per_ton = 2000;
            this.metric_ton_per_short_ton = 0.90718474;
            this.thousand_btu_per_mmbtu = Math.pow(10,3);
            this.btu_to_moto = 1/1000000.0;
            this.joule_per_mj = Math.pow(10,6);
            this.transmission_and_distribution_losses = 1.34 / 14.94;
            this.assumption_1 = 3412;
            this.btu_per_joule = 1 / 1055.05585;
            this.thousand_btu_per_btu = 1 / 1000;
            this.btu_per_kwh_output = 10616.4323392084;
            this.thousand_bum = this.joule_per_mj * this.btu_per_joule * this.thousand_btu_per_btu;
            this.million_bum = this.thousand_bum / this.thousand_btu_per_mmbtu;
            this.bum = this.thousand_btu_per_mmbtu * this.thousand_bum;
            this.mmbtu_per_kwh = this.assumption_1 / this.joule_per_mj;
            this.kwh_per_mj = this.assumption_1 / this.bum;
            this.assumption_2 = 1 / this.assumption_1;
            this.upstream_electricity_equivalent = this.assumption_1 / this.btu_per_kwh_output;
            this.delivered_electricity_equivalent_mmbtu_per_kwh = (this.mmbtu_per_kwh / this.upstream_electricity_equivalent) / (1 - this.transmission_and_distribution_losses);
            this.delivered_electricity_equivalent_1000_btu_per_kwh = this.delivered_electricity_equivalent_mmbtu_per_kwh * 1000;
        }
    };

    // some utilities
    w.Utils = {
        keys: function(obj) {
            var a = [];
            $.each(obj, function(k) {
                a.push(k);
            });
            return a;
        }
    };

    // set it all up
    w.Products.initialize();
    w.Conversion.initialize();
}(window.wycd));


;(function($){
    // jQuery plugin to dynamically resize text according to the width of the
    // page
    $.fn.fitText = function( kompressor, options ) {
        var settings = {
            'minFontSize' : Number.NEGATIVE_INFINITY,
            'maxFontSize' : Number.POSITIVE_INFINITY
        };
        return this.each(function(){
            var $this = $(this);              // store the object
            var compressor = kompressor || 1; // set the compressor
            var is_set = $this.data('fitText');
            if (!is_set) {
                if ( options ) { 
                  $.extend( settings, options );
                }
                // Resizer() resizes items based on the object width divided by the compressor * 10
                var resizer = function () {
                    $this.css('font-size', Math.max(Math.min($this.width() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
                };
                // Call once to set.
                resizer();
                // Call on resize. Opera debounces their resize by default. 
                $(window).resize(resizer);
                $this.data('fitText', true);
            }
        });
    };
}(jQuery));
