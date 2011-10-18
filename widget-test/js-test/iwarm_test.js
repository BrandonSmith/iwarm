module("Conversions Test");

test("assert constants", function() {
    var c = iwarm.Conversion;
    c.initialize();
    ok(c.pounds_per_ton === 2000);
    ok(c.metric_ton_per_short_ton === 0.90718474);
    ok(c.thousand_btu_per_mmbtu === 1000);
    ok(c.btu_to_moto === 0.000001);
    ok(c.joule_per_mj === 1000000);
    ok(c.transmission_and_distribution_losses === 0.08969210174029452);
    ok(c.assumption_1 === 3412);
    ok(c.btu_per_kwh_output === 10616.4323392084);
    ok(c.btu_per_joule === 0.0009478171226670134);
    ok(c.thousand_btu_per_btu === 0.001);
});

test("assert derivitives", function() {
    var c = iwarm.Conversion;
    c.initialize();
    
    ok(c.thousand_bum === 0.9478171226670133);
    ok(c.million_bum === 0.0009478171226670134);
    ok(c.bum === 947.8171226670133);
    ok(c.mmbtu_per_kwh === 0.003412);
    ok(c.upstream_electricity_equivalent === 0.3213885692464566);
    ok(c.delivered_electricity_equivalent_mmbtu_per_kwh === 0.011662463172630404);
    ok(c.delivered_electricity_equivalent_1000_btu_per_kwh === 11.662463172630405);
    ok(c.kwh_per_mj === 3.5998505601999997);
    ok(c.assumption_2 === 0.00029308323563892143);
});


module("Product Test");

test("assert product", function() {
    var p = iwarm.Products;
    ok(p);
    p.initialize();
    var size = 0, key;
    for (key in p.items) {
        if (p.items.hasOwnProperty(key)) size++;
    }
    ok(size === 6);
    ok(p.get_item("aluminum_can"));
    
    var net_energy_savings = p.calculate_net_energy_savings("aluminum_can",10);
    ok(net_energy_savings === -30.24694819111194);
    var electricity_equivalent = p.electricity_equivalent("aluminum_can",10);
    ok(electricity_equivalent === 2.5935300067738525);
    ok(p.hours_available("aluminum_can", 10, "home_air_conditioner") === 1.7290200045159017);
    ok(p.hours_available("aluminum_can", 10, "hair_dryer") === 1.6868487848935625);
    ok(p.hours_available("aluminum_can", 10, "60W_CFL_lightbulb") === 199.50230821337328);
    ok(p.hours_available("aluminum_can", 10, "laptop") === 51.87060013547705);
});
