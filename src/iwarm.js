window.iwarm = window.iwarm || {};

(function(w) {
    w.Products = {
        items:null,
        appliances:null,
        initialize: function() {
            this.items = {};
            this.add_item({short_name:"aluminum_can",name:"Aluminum can (12 fl. oz.)",weight:0.02923121894183,savings:-206.949619523587});
            this.add_item({short_name:"glass_bottle",name:"Glass bottle (12 fl. oz.)",weight:22/24,savings:-2.65280981969929});
            this.add_item({short_name:"plastic_bag",name:"Plastic Grocery Bag",weight:0.77/100,savings:-51.431427964035});
            this.add_item({short_name:"plastic_bottle",name:"Plastic Bottle (20 fl. oz.)",weight:0.055555555555556,savings:-53.3593464139873});
            this.add_item({short_name:"newspaper",name:"Daily Newspaper",weight:0.8125,savings:-16.9024813798736});
            this.add_item({short_name:"magazine",name:"Weekly Magazine",weight:3/10,savings:-1.08711086042437});
            
            this.appliances = {};
            this.add_appliance({short_name:"home_air_conditioner", kilowatt:1.5});
            this.add_appliance({short_name:"hair_dryer", kilowatt:1.5375});
            this.add_appliance({short_name:"60W_CFL_lightbulb", kilowatt:0.013});
            this.add_appliance({short_name:"laptop", kilowatt:0.05});
        },
        add_appliance: function(appliance) {
            if (!this.appliances)
                this.appliances = {};
            this.appliances[appliance.short_name] = appliance;
        },
        get_appliance: function(appliance_name) {
            return this.appliances[appliance_name];
        },
        add_item: function(item) {
            if (!this.items)
                this.items = {};
            this.items[item.short_name] = item;
        },
        get_item: function(item_name) {
            return this.items[item_name];
        },
        calculate_net_energy_savings: function(item_name, num_units) {
            var w = iwarm.Conversion;
            var item = this.get_item(item_name);
            var total_weight = (item.weight * num_units) / w.pounds_per_ton;
            var million_btu = item.savings * total_weight;
            var thousand_btu = million_btu * 1000;
            return thousand_btu;
        },
        electricity_equivalent: function(item_name, num_units) {
            var w = iwarm.Conversion;
            var net_energy_savings = this.calculate_net_energy_savings(item_name, num_units);
            var calc_electricity_equivalent = Math.abs(net_energy_savings / w.delivered_electricity_equivalent_1000_btu_per_kwh);
            return calc_electricity_equivalent;
        },
        hours_available: function(item_name, num_units, appliance_name) {
            var w = iwarm.Conversion;
            var electricity_equivalent = this.electricity_equivalent(item_name, num_units);
            var appliance = this.get_appliance(appliance_name);
            var hours_available = electricity_equivalent / appliance.kilowatt;
            return hours_available;
        }
    };
    
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
})(window.iwarm);